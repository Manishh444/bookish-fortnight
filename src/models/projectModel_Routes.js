const pool = require("../config/dbConfig");

// ----------------------------Create the Projects table-----------------------------
async function createProjectsTable(req, res) {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS Projects (
      ProjectID SERIAL PRIMARY KEY,
      Title VARCHAR(255) NOT NULL,
      Description TEXT,
      Links TEXT,
      TechStack VARCHAR(255)
    );
  `;

  try {
    const client = await pool.connect();
    await client.query(createTableQuery);
    client.release();
    res.send("Projects table created. ..");
  } catch (error) {
    console.error("Error creating Projects table:", error);
  }
}



// --------------------------get all table infor from schema -------------------------------
async function getAllTablesAndColumns() {
  const getTablesAndColumnsQuery = `
    SELECT table_name, column_name
    FROM information_schema.columns
    WHERE table_schema = 'public';
  `;

  try {
    const result = await pool.query(getTablesAndColumnsQuery);

    // Organize the data into an object with tables as keys and column arrays as values
    const tablesColumns = {};
    result.rows.forEach((row) => {
      if (!tablesColumns[row.table_name]) {
        tablesColumns[row.table_name] = [];
      }
      tablesColumns[row.table_name].push(row.column_name);
    });

    return tablesColumns;
  } catch (error) {
    console.error("Error retrieving tables and columns:", error);
    return {};
  }
}
const getAllTablesColumns = async (req, res) => {
  try {
    const tablesColumns = await getAllTablesAndColumns();
    res.json(tablesColumns);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while retrieving data." });
  }
};

//--------------------------------- Express route to create the table--------------------------
const express = require("express");
const router = express.Router();

router.route("/").post(createProjectsTable).get(getAllTablesColumns);

module.exports = router;
