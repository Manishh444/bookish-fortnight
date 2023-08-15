const generateToken = require("../config/generateToken");
const bcrypt = require("bcryptjs");
const pool = require("../config/dbConfig");

//----------------------Login------------------------------------
const login = async (req, res) => {
  try {
    const { Email, Password } = req.body;

    if (!Email || !Password) {
      res.status(400);
      throw new Error("Please provide both email and password");
    }

    const getUserQuery = "SELECT * FROM users WHERE email = $1";
    const userResult = await pool.query(getUserQuery, [Email]);

    if (userResult.rows.length === 0) {
      res.status(401);
      throw new Error("Invalid credentials");
    }

    const user = userResult.rows[0];

    const isPasswordValid = await bcrypt.compare(Password, user.password);
    if (!isPasswordValid) {
      res.status(401);
      throw new Error("Invalid credentials");
    }

    const token = generateToken(user.userid);

    res.json({
      id: user.user_id,
      name: user.full_name,
      email: user.email,
      bio: user.bio,
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
};

// --------------------------SignUp----------------------------------
const SignUp = async (req, res) => {
  console.log(req.body);
  try {
    const { Full_Name, Email, Password, Bio, City, State, Country } = req.body;

    if (
      !Full_Name ||
      !Email ||
      !Password ||
      !Bio ||
      !City ||
      !State ||
      !Country
    ) {
      res.status(400);
      throw new Error("Please complete the form");
    }

    const existingUserQuery = "SELECT * FROM users WHERE email = $1";
    const existingUserResult = await pool.query(existingUserQuery, [Email]);

    if (existingUserResult.rows.length > 0) {
      res.status(400);
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    const createUserQuery =
      "INSERT INTO users (Full_name, Email, Password, Bio, City, State, Country) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING user_id, Full_Name, Email, Bio, City, State, Country";

    const createdUserResult = await pool.query(createUserQuery, [
      Full_Name,
      Email,
      hashedPassword,
      Bio,
      City,
      State,
      Country,
    ]);
    console.log("line 58 usercontroller signup function", createdUserResult);
    const createdUser = createdUserResult.rows[0];
    console.log("line 62 user controller", createdUser);
    const Token = generateToken(createdUser.user_id);

    res.status(201).json({
      user_Id: createdUser.user_id,
      userName: createdUser.full_Name,
      Email: createdUser.email,
      Bio: createdUser.bio,
      City: createdUser.city,
      State: createdUser.state,
      Country: createdUser.country,
      Token,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//==============combines single user and all user===================
const allUsers = async (req, res) => {
  try {
    const user_Id = req.params.id;
    console.log(user_Id);
    let getUserQuery = "SELECT * FROM users";
    let result;
    if (user_Id) {
      getUserQuery = `SELECT * FROM users WHERE user_id = $1`;
      result = await pool.query( getUserQuery, [user_Id]);
    }else{result = await pool.query(getUserQuery, []);}

    if (result.rows.length === 0) {
      res
        .status(404)
        .json({ error: user_Id ? "User not found" : "No users found" });
    } else {
      const users = result.rows;
      res.json(users);
    }
  } catch (error) {
    console.error("Error fetching user(s):", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// --------------------update user----------
const updateUser = async (req, res) => {
  try {
    const user_Id = req.params.id;
    console.log("line 172 usercontroller", user_Id);
    const { full_name, email, bio, city, state, country } = req.body;

    const updateUserQuery = `
      UPDATE users
      SET full_name = $1, email = $2, bio = $3, city = $4, state = $5, country = $6
      WHERE user_id = $7
      RETURNING *;
       
     
    `;

    const result = await pool.query(updateUserQuery, [
      full_name,
      email,
      bio,
      city,
      state,
      country,
      user_Id,
    ]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: "User not found" });
    } else {
      const updatedUser = result.rows[0];
      res.json(updatedUser);
    }
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
//-----------------------delete user----------
const deleteUser = async (req, res) => {
  try {
    const user_Id = req.params.id;

    const deleteUserQuery = `
      DELETE FROM users
      WHERE user_id = $1
      RETURNING *;
    `;

    const result = await pool.query(deleteUserQuery, [user_Id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: "User not found" });
    } else {
      const deletedUser = result.rows[0];
      res.json(deletedUser);
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = { login, allUsers, SignUp, updateUser, deleteUser };
