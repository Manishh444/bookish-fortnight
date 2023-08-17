// Create Users table
const pool = require("../config/dbConfig");

const createusertable = async (req, res) => {
  try {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS Users (
      UserID SERIAL PRIMARY KEY,
      FullName VARCHAR(255) NOT NULL, 
      Email VARCHAR(255) UNIQUE NOT NULL,
      Password TEXT NOT NULL,
      Bio TEXT,
      City VARCHAR(100) NOT NULL,
      State VARCHAR(100) NOT NULL,
      Country VARCHAR(100) NOT NULL
    );
  `;
    
    // const dropTable = `DROP table users`
const getdata = `SELECT * FROM users`
  //  let result = await pool.query(createTableQuery);
   let result = await pool.query(getdata);
    // res.status(200).json({ message: "Users TABLE Created successfully" });
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error creating users table:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the users table" });
  }
};

//-----------------------------------------------
// Get list of all tables
async function getAllTables(req, res) {
  const getTablesQuery = `
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public';
  `;

  try {
    const result = await pool.query(getTablesQuery);

    const tablereturn = await result.rows.map((row) => row.table_name);
    res.status(200).json(tablereturn);
  } catch (error) {
    console.error("Error retrieving table list:", error);
    return [];
  }
}
// ----------------------------------------
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

const getAllTablesColumns= async (req, res) => {
  try {
    const tablesColumns = await getAllTablesAndColumns();
    res.json(tablesColumns);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while retrieving data." });
  }
};
// -----------------------------------------
const express = require("express");
const router = express.Router();

router.route("/").get(createusertable).post(createusertable);

module.exports = router;
