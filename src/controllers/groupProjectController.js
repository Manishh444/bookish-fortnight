const pool = require("../config/dbConfig");

// Create a new group project and add users to it
async function createGroup(req, res) {
  try {
    // const { project_name, project_description } = req.body;
    const { project_title, description, links, technical_stacks, users } =
      req.body;

    // Insert into group_projects table
    const createGroupprojectQuery =
      "INSERT INTO group_projects (project_title, description, links, technical_stacks) VALUES ($1, $2, $3, $4) RETURNING *";
    const GroupprojectValues = [
      project_title,
      description,
      links,
      technical_stacks,
    ];

    const GroupprojectResult = await pool.query(
      createGroupprojectQuery,
      GroupprojectValues
    );
    const GroupprojectId = GroupprojectResult.rows[0].group_project_id;

    // Insert into project_participants table for each user
    const participantsQuery =
      "INSERT INTO user_group_project (group_project_id, user_id) VALUES ($1, $2)";

    const GroupparticipantsValues = users.map((userId) => [
      GroupprojectId,
      userId,
    ]);
    console.log("line 48 groupController", GroupparticipantsValues);
    await Promise.all(
      GroupparticipantsValues.map((values) =>
        pool.query(participantsQuery, values)
      )
    );

    res.status(201).json({
      message: "Group project created and users added",
      GroupprojectId: GroupprojectId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
}
// --------------------------------------------------

// Update a project
const updateProject = async (req, res) => {
  try {
    const { project_title, description, links, technical_stacks} =
      req.body;
    const { project_id } = req.params;
    console.log(project_id);
    const query = `UPDATE group_projects
                   SET project_title = $1, description = $2, links = $3, technical_stacks = $4
                   WHERE group_project_id = $5 RETURNING *`;
    const values = [
      project_title,
      description,
      links,
      technical_stacks,
      project_id,
    ];
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the project." });
  }
};

// Delete a project
const deleteProject = async (req, res) => {
  try {
    const { project_id } = req.params;
    const query =
      "DELETE FROM group_projects WHERE group_project_id = $1 RETURNING *";
    const values = [project_id];
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: `This Group project is have active members working on it, kindly first remove all the members` });
  }
};

// View all projects
const getAllProjects = async (req, res) => {
  try {
    const query = "SELECT * FROM group_projects";
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching projects." });
  }
};

// View projects by matching project name (including single character matches)
const getProjectsByPartialName = async (req, res) => {
  try {
    const { project_name } = req.query;
    const query = "SELECT * FROM group_projects WHERE project_title ILIKE ($1)";
    const values = [`%${project_name}%`];
    console.log('line 116 creategroup controller',values)
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      res.status(404).json({ error: "No projects found." });
    } else {
      res.json(result.rows);
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the projects." });
  }
};
module.exports = {
  createGroup,
  updateProject,
  deleteProject,
  getAllProjects,
  getProjectsByPartialName
};
