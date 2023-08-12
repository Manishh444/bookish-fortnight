const generateToken = require('../config/generateToken');
const bcrypt = require('bcryptjs')
const pool = require('../config/dbConfig')

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
      id: user.userid,
      name: user.fullname,
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
  console.log(req.body)
  try {

    const { FullName, Email, Password, Bio, City, State, Country } = req.body;

    if ((!FullName || !Email || !Password || !Bio || !City || !State|| !Country)) {
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
      "INSERT INTO users (Fullname, Email, Password, Bio, City, State, Country) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING userid, FullName, Email, Bio, City, State, Country";

    const createdUserResult = await pool.query(createUserQuery, [
      FullName,
      Email,
      hashedPassword,
      Bio,
      City,
      State,
      Country
    ]);
    console.log("line 58 usercontroller signup function", createdUserResult)
    const createdUser = createdUserResult.rows[0];
    console.log("line 62 user controller",createdUser)
    const Token = generateToken(createdUser.userid);

    res.status(201).json({
      user_Id: createdUser.userid,
      userName: createdUser.fullName,
      Email: createdUser.email,
      Bio: createdUser.bio,
      City: createdUser.city,
      State: createdUser.state,
      Country:createdUser.country,
      Token,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
//--------------------------single user only----------
// app.get('/users/:id', async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const getUserQuery = 'SELECT * FROM users WHERE id = $1';
//     const result = await pool.query(getUserQuery, [userId]);
    
//     if (result.rows.length === 0) {
//       res.status(404).json({ error: 'User not found' });
//     } else {
//       const user = result.rows[0];
//       res.json(user);
//     }
//   } catch (error) {
//     console.error('Error fetching user:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

//---------------------------ViewAllUser-----------------------------
const allUser = async (req, res) => {
  try {
    const searchQuery = req.query.search;
    const userId = req.query.userId;

    let query = `
      SELECT * FROM users
      WHERE
        (LOWER(name) LIKE '%' || LOWER($1) || '%' OR LOWER(email) LIKE '%' || LOWER($1) || '%')
        AND _id != $2;
    `;

    const { rows } = await pool.query(query, [searchQuery, userId]);

    res.json(rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
//==============combines single user and all user===================
const allUsers= async (req, res) => {
  try {
    const userId = req.params.id;
    let getUserQuery = "SELECT * FROM users";

    if (userId) {
      getUserQuery += `WHERE userid = ${userId}`;
    }

    const result = await pool.query(getUserQuery, userId ? [userId] : []);

    if (result.rows.length === 0) {
      res
        .status(404)
        .json({ error: userId ? "User not found" : "No users found" });
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
const updateUser= async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("line 172 usercontroller",userId)
    const { fullname, email,  bio, city, state, country } = req.body;

    const updateUserQuery = `
      UPDATE users
      SET fullname = $1, email = $2, bio = $3, city = $4, state = $5, country = $6
      WHERE userid = $7
      RETURNING *;
       
     
    `;


    const result = await pool.query(updateUserQuery, [
      fullname,
      email,
      bio,
      city,
      state,
      country,
      userId
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
const deleteUser =  async (req, res) => {
  try {
    const userId = req.params.id;

    const deleteUserQuery = `
      DELETE FROM users
      WHERE userid = $1
      RETURNING *;
    `;

    const result = await pool.query(deleteUserQuery, [userId]);

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