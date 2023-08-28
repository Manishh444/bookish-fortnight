const express = require('express');
const router = express.Router();

const {protect} = require('../middleware/authmiddleware')
const {
  login,
  SignUp,
  allUsers,
  updateUser,
  deleteUser,
  getUserbyTechStack,
} = require("../controllers/userController");

router.route('/').post(SignUp);
router.route('/login').post(login)
router.route(`/viewusers/:user_id?`).get(allUsers);
router.route("/updateUser/:user_id").put(protect, updateUser);
router.route("/deleteUser/:user_id").put(protect, deleteUser);
router.get("/getUserbyTechStack/:techStack", getUserbyTechStack);
module.exports = router;