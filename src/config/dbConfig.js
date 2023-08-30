const dotenv = require("dotenv");
const { Pool } = require("pg");

dotenv.config();
// use this code to connect with cloud hosted postgreSQL databse.
const pool = new Pool({
  connectionString : process.env.connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

// use this code to connect with local postgreSQL databse.

// Modify the below code to configure your local PostgreSQL database credentials and JWT secret key:
// const pool = new Pool({
//   user: "postgres",
//   password: "YOUR_Password",
//   host: "localhost",
//   database: "YOUR_database",
//   port: 5432, // Default is usually 5432
// });

module.exports = pool;
