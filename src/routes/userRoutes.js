const express = require('express');
const router = express.Router();

// const protect = require('../middleware/authmiddleware')
const {
  login,
  SignUp,
  allUsers,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

router.route('/').get().post(SignUp);
router.route('/login').post(login)
router.route(`/users/:id?`).get(allUsers);
router.route("/updateUser/:id").put(updateUser);
router.route("/deleteUser/:id").put(deleteUser);

module.exports = router;