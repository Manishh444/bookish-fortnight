const express = require("express");
const cors =  require("cors")
const dotenv = require("dotenv")



dotenv.config()
const pool = require('./dbConfig')
const app = express();
const port = process.env.PORT;


app.use(cors());
app.use(express.json());

// API route to create the users table
app.post("/create-users-table", async (req, res) => {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS project (
        id SERIAL PRIMARY KEY,
        projectname VARCHAR(255) NOT NULL,
        project_desc VARCHAR(255) NOT NULL
      )
    `;

    await pool.query(createTableQuery);
    res.status(200).json({ message: "project table created successfully" });
  } catch (error) {
    console.error("Error creating users table:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the users table" });
  }
});

// API route to insert a user into the users table
app.post('/insert-user', async (req, res) => {
  try {
    const { username, email } = req.body;
    const insertUserQuery = 'INSERT INTO users (username, email) VALUES ($1, $2)';
    await pool.query(insertUserQuery, [username, email]);
    res.status(201).json({ message: 'User inserted successfully' });
  } catch (error) {
    console.error('Error inserting user:', error);
    res.status(500).json({ error: 'An error occurred while inserting the user' });
  }
});
// API route to get all users from the users table
app.get('/get-all-users', async (req, res) => {
  try {
    const getUsersQuery = 'SELECT * FROM users';
    const result = await pool.query(getUsersQuery);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ error: 'An error occurred while getting users' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
