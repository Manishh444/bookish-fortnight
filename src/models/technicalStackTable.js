const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = 3000; // Change this to your desired port

// PostgreSQL configuration
const pool = new Pool({
  user: "your_username",
  host: "localhost",
  database: "your_database",
  password: "your_password",
  port: 5432, // Change this if your PostgreSQL server runs on a different port
});

// Create the TechnicalStacks table
async function createTechnicalStacksTable() {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS TechnicalStacks (
        StackID SERIAL PRIMARY KEY,
        StackName VARCHAR(255) NOT NULL
      );
    `;

    await pool.query(createTableQuery);
    console.log("TechnicalStacks table created successfully.");
  } catch (error) {
    console.error("Error creating TechnicalStacks table:", error);
  }
}

// Call the function to create the table when the server starts
createTechnicalStacksTable();

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
