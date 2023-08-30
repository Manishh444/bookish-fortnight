const dotenv = require("dotenv");
const { Pool } = require("pg");

dotenv.config();
const pool = new Pool({
  connectionString : process.env.connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

// const pool = new Pool({
//   user: "postgres",
//   password: "password",
//   host: "localhost",
//   database: "postgres",
//   port: 5432, // Default is usually 5432
// });
module.exports = pool;
