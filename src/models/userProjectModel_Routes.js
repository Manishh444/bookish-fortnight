const express = require("express");
const pool = require("../config/dbConfig");

// Create the UserProjects table
async function createUserProjectsTable(req, res) {
  try {
    const createTableQuery = `
CREATE TABLE UserProjects_new (
    user_id INT,
    project_id INT,
    PRIMARY KEY (user_id, project_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES Projects(project_id) ON DELETE CASCADE
);
    `;

    await pool.query(createTableQuery);
    res.json("UserProjects table created successfully.");
  } catch (error) {
    console.error("Error creating UserProjects table:", error);
  }
}

// Call the function to create the table when the server starts
//---------------------------------------

// ------------------------------------------

const router = express.Router();

router.route("/").post(createUserProjectsTable);

module.exports = router;
