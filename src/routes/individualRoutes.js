const express = require("express");
const router = express.Router();
const {
  createProject,
  updateProject,
  deleteProject,
  getAllProjects,
  getProjectById,
} = require("../controllers/individual_projectController");

router.route("/").post(createProject).get(getAllProjects);
router.get("/getProjectById/:project_id", getProjectById);
router.put("/updateProject/:project_id", updateProject);
router.delete("/deleteProject/:project_id", deleteProject);

module.exports = router;
