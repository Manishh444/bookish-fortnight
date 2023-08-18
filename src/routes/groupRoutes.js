const express = require("express");
const router = express.Router();
// const {createGroup} = require("./cre");
const { createGroup } = require("../controllers/groupProjectController");

router.route("/").post(createGroup);
// router.put("/projects/:project_id", projectController.updateProject);
// router.delete("/projects/:project_id", projectController.deleteProject);
// router.get("/projects", projectController.getAllProjects);
// router.get("/projects/:project_id", projectController.getProjectById);

// router.route("/").post(createProject).get(getAllProjects);
// router.get("/getProjectById/:project_id", getProjectById);
// router.put("/updateProject/:project_id", updateProject);
// router.delete("/deleteProject/:project_id", deleteProject);

module.exports = router;
