const express = require('express');
const router = express.Router();

const {protect} = require('../middleware/authmiddleware')
const {
  login,
  SignUp,
  allUsers,
  updateUser,
  deleteUser,
  getUserbyTechStack
} = require("../controllers/userController");

router.route('/').post(SignUp);
router.route('/login').post(login)
router.route(`/users/:id?`).get(allUsers);
router.route("/updateUser/:id").put(protect, updateUser);
router.route("/deleteUser/:id").put(protect, deleteUser);
router.get('/users/:techStack', getUserbyTechStack);
module.exports = router;