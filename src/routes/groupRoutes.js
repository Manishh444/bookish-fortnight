const express = require("express");
const router = express.Router();
// const {createGroup} = require("./cre");
const {
  createGroup,
  updateProject,
  deleteProject,
  getAllProjects,
  getProjectsByPartialName,
  getProjectbyTeckStack
} = require("../controllers/groupProjectController");
const { protect } = require("../middleware/authmiddleware");

router.route("/").post(protect, createGroup).get(getAllProjects);;
router.get("/viewprojectbyName", getProjectsByPartialName); 
router.put("/updateProject/:project_id", protect, updateProject);
router.delete("/deleteProject/:project_id", protect, deleteProject);
router.get("/viewProjectbytechstack/:techStack", getProjectbyTeckStack);

module.exports = router;
