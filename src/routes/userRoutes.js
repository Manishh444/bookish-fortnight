const express = require('express');
const protect = require('../middleware/authmiddleware')
const {
  login,
  allUser,
  SignUp,
  allUsers,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const router = express.Router()

router.route('/').get().post(SignUp);
router.route('/login').post(login)
router.route(`/users/:id?`).get(allUsers);
router.route("/updateUser/:id").put(updateUser);
router.route("/deleteUser/:id").put(deleteUser);

module.exports = router;