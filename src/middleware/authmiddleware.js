const pool = require("../config/dbConfig"); // Assuming you've named the PostgreSQL connection file as 'db.js'
const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const getUserQuery = "SELECT id, name, email FROM users WHERE id = $1";
      const result = await pool.query(getUserQuery, [decoded.id]);

      if (result.rows.length === 0) {
        res.status(401);
        throw new Error("Not authorized, user not found");
      }

      req.user = result.rows[0];
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
};

module.exports = { protect };
