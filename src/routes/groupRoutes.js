const express = require("express");
const router = express.Router();
// const {createGroup} = require("./cre");
const {
  createGroup,
  updateProject,
  deleteProject,
  getAllProjects,
  getProjectsByPartialName
} = require("../controllers/groupProjectController");
const { protect } = require("../middleware/authmiddleware");

router.route("/").post(createGroup).get(getAllProjects);;
router.get("/getProjectbyName", getProjectsByPartialName);
router.put("/updateProject/:project_id", protect, updateProject);
router.delete("/deleteProject/:project_id", protect, deleteProject);

module.exports = router;
