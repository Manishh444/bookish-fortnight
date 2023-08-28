const pool = require("../config/dbConfig");

// Create a new project
async function userParticipatingInGroupProject(userId) {
  //   const checkUserQuery = "SELECT * FROM user_group_project WHERE user_id = $1";
  const checkUserQuery = `SELECT users.*, user_group_project.group_project_id
    FROM users
    RIGHT JOIN user_group_project ON users.user_id = user_group_project.user_id 
    WHERE users.user_id = $1;`;
  const result = await pool.query(checkUserQuery, [userId]);
  // return result.rows[0];
  return result.rows.length > 0 ? result.rows[0] : null;
}
const createProject = async (req, res) => {
  try {
    const { project_title, description, links, technical_stacks, user_id } =
      req.body;

    // Check if the individual_projects table exists
    const tableCheckQuery = `
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_name = 'individual_projects'
      ) as table_exists;
    `;

    const tableCheckResult = await pool.query(tableCheckQuery);
    const tableExists = tableCheckResult.rows[0].table_exists;

    // If the table doesn't exist, create it
    if (!tableExists) {
      const createTableQuery = `
        CREATE TABLE individual_projects (
          project_id SERIAL PRIMARY KEY,
          project_title VARCHAR(255) NOT null unique,
          description TEXT,
          links JSONB, -- Store links as JSON data
          technical_stacks TEXT[],
          user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
          project_type VARCHAR(20) NOT NULL DEFAULT 'individual'
        );
      `;
      await pool.query(createTableQuery);
    }

    // Check if the user is already registered in a group project (your existing check)
    const userExists = await userParticipatingInGroupProject(user_id);
    if (userExists) {
      res.json({
        message: "User is already registered in a group project",
        userExists: userExists,
      });
    } else {
      // Proceed with the insert operation
      const insertQuery = `
        INSERT INTO individual_projects (project_title, description, links, technical_stacks, user_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `;
      const values = [
        project_title,
        description,
        links,
        technical_stacks,
        user_id,
      ];

      const result = await pool.query(insertQuery, values);
      res.json(result.rows[0]);
    }
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
