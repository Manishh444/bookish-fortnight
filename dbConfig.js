const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});
module.exports = pool;
