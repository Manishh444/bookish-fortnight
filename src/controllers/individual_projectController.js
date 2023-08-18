const pool = require("../config/dbConfig");

// Create a new project
const createProject = async (req, res) => {
  try {
    const { project_title, description, links, technical_stacks, user_id } =
      req.body;
    const query = `INSERT INTO individual_projects (project_title, description, links, technical_stacks, user_id)
                   VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const values = [
      project_title,
      description,
      links,
      technical_stacks,
      user_id,
    ]; 
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the project." });
  }
};

// Update a project
const updateProject = async (req, res) => {
  try {
    const { project_title, description, links, technical_stacks, user_id } =
      req.body;
    const { project_id } = req.params;
    console.log(project_id);
    const query = `UPDATE individual_projects
                   SET project_title = $1, description = $2, links = $3, technical_stacks = $4, user_id = $5
                   WHERE project_id = $6 RETURNING *`;
    const values = [
      project_title,
      description,
      links,
      technical_stacks,
      user_id,
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
      "DELETE FROM individual_projects WHERE project_id = $1 RETURNING *";
    const values = [project_id];
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the project." });
  }
};

// View all projects
const getAllProjects = async (req, res) => {
  try {
    const query = "SELECT * FROM individual_projects";
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching projects." });
  }
};

// View a specific project
const getProjectById = async (req, res) => {
  try {
    const { project_id } = req.params;
    const query = "SELECT * FROM individual_projects WHERE project_id = $1";
    const values = [project_id];
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Project not found." });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the project." });
  }
};

module.exports = {
  createProject,
  updateProject,
  deleteProject,
  getAllProjects,
  getProjectById,
};
