const generateToken = require('../config/generateToken');
const bcrypt = require('bcryptjs')

//----------------------Login------------------------------------
const login = async (req, res) => {
  const { email, password } = req.body;
  // need to write sql function to find email in user tabel and get it
  const user = await User_table.find({ email });
  //need to write matchpassword function and encrypt password functionality
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id),
    });
        console.log("login successful");

  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
};

// --------------------------SignUp----------------------------------
const SignUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Please complete the form");
    }

    const existingUserQuery = "SELECT * FROM users WHERE email = $1";
    const existingUserResult = await pool.query(existingUserQuery, [email]);

    if (existingUserResult.rows.length > 0) {
      res.status(400);
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createUserQuery =
      "INSERT INTO users (name, email, password, pic) VALUES ($1, $2, $3, $4) RETURNING id, name, email, pic";

    const createdUserResult = await pool.query(createUserQuery, [
      name,
      email,
      hashedPassword,
      pic,
    ]);

    const createdUser = createdUserResult.rows[0];

    const token = generateToken(createdUser.id);

    res.status(201).json({
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      pic: createdUser.pic,
      token,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
//--------------------------single user only----------
app.get('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const getUserQuery = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(getUserQuery, [userId]);
    
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
    } else {
      const user = result.rows[0];
      res.json(user);
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

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
app.get("/users/:id?", async (req, res) => {
  try {
    const userId = req.params.id;
    let getUserQuery = "SELECT * FROM users";

    if (userId) {
      getUserQuery += `WHERE id = ${userId}`;
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
});
// --------------------update user----------
app.put("/updateUser/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, bio, city, state, country, password } = req.body;

    const updateUserQuery = `
      UPDATE users
      SET name = $1, email = $2, bio = $3, city = $4, state = $5, country = $6, password = $7
      WHERE id = $8
      RETURNING *;
    `;

    const result = await pool.query(updateUserQuery, [
      name,
      email,
      bio,
      city,
      state,
      country,
      password,
      userId,
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
});
//-----------------------delete user----------
app.delete("/deleteUser/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const deleteUserQuery = `
      DELETE FROM users
      WHERE id = $1
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
});
module.exports = {login, allUser, SignUp}