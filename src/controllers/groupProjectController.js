const pool = require("../config/dbConfig");


// ------------------view project by techstack--------------------------------


const getProjectbyTeckStack = async (req, res) => {
  const techStack = req.params.techStack;

  try {
    const query = `
      SELECT project_id, project_title, description, links, technical_stacks, project_type
      FROM individual_projects
      WHERE $1 = ANY (technical_stacks)

      UNION

      SELECT group_project_id AS project_id, project_title, description, links, technical_stacks, project_type
      FROM group_projects
      WHERE $1 = ANY (technical_stacks);
    `;

    const { rows } = await pool.query(query, [techStack]);

    res.json(rows);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching projects." });
  }
};


//======================create new group project================================
async function userExistsInIndividualProjects(userId) {
  try {
     const checkUserQuery =
       "SELECT * FROM individual_projects WHERE user_id = $1";
     const result = await pool.query(checkUserQuery, [userId]);
     return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    
  }
 
}

async function userExistsInGroupProjects(userId) {
  try {
    const checkUserQuery = `SELECT users.*, user_group_project.group_project_id
    FROM users
    RIGHT JOIN user_group_project ON users.user_id = user_group_project.user_id
    WHERE users.user_id = $1;`;
    const result = await pool.query(checkUserQuery, [userId]);
    console.log("line105", result.rows[0]);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {}
}

async function createGroup(req, res) {
  try {
    const { project_title, description, links, technical_stacks, users } =
      req.body;

    // Check if the group_project table exists
    const tableCheckQuery = `
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_name = 'group_projects' 
      ) as table_exists;
    `;

    const tableCheckResult = await pool.query(tableCheckQuery);
    const tableExists = tableCheckResult.rows[0].table_exists;

    // If the table doesn't exist, create it
    if (!tableExists) {
      const createTableQuery = `
      BEGIN;
       CREATE TABLE group_projects (
          group_project_id SERIAL PRIMARY KEY,
          project_title VARCHAR(255) NOT null unique,
          description TEXT,
          links JSONB,
          technical_stacks TEXT[],
          project_type VARCHAR(20) NOT NULL DEFAULT 'group'
        );
        CREATE TABLE user_group_project (
          user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
          group_project_id INT REFERENCES group_projects(group_project_id),
          PRIMARY KEY (user_id, group_project_id)
        );
        COMMIT;
      `;
      await pool.query(createTableQuery);
    }

    // Insert into group_projects table
    const createGroupProjectQuery =
      "INSERT INTO group_projects (project_title, description, links, technical_stacks) VALUES ($1, $2, $3, $4) RETURNING *";
    const groupProjectValues = [
      project_title,
      description,
      links,
      technical_stacks,
    ];

    const usersInIndividualProjects = [];
    const usersInGrouprojects = [];
    const addUsertoGroup = [];

    for (const userId of users) {
      const userExists = await userExistsInIndividualProjects(userId);
      if (userExists) {
        usersInIndividualProjects.push(userExists);
      } else {
        const isParticipating = await userExistsInGroupProjects(userId);
        console.log('line168 grp con', isParticipating)
        if (isParticipating) {
          usersInGrouprojects.push(isParticipating);
        } else {
          addUsertoGroup.push(userId)
          console.log('line174',addUsertoGroup)
        }
      }
    }

    if (usersInIndividualProjects.length > 0) {
      // Return details of users found in individual_projects
      res.status(200).json({
        message: "Users found in individual projects",
        usersInIndividualProjects: usersInIndividualProjects,
      });
    }
    if (usersInGrouprojects.length > 0) {
      res.status(200).json({
        message: "Users found in group projects",
        usersInGroupProjects: usersInGrouprojects,
      });
    } else {
      // Insert users into group if they do not exist in individual_projects
      const groupProjectResult = await pool.query(
        createGroupProjectQuery,
        groupProjectValues
      );
      const groupProjectId = groupProjectResult.rows[0].group_project_id;
      console.log("line198 grp con", groupProjectId);
      console.log("line199 grp con", usersInGrouprojects);
      const participantsQuery =
        "INSERT INTO user_group_project (group_project_id, user_id) VALUES ($1, $2)";
      try {
        await Promise.all(
          addUsertoGroup.map((values) => {
            const result = pool.query(participantsQuery, [
              groupProjectId,
              values,
            ]);
            // console.log("line192 result", result.rows[0]);
          })
        ).then(() => {
          res.status(201).json({
            message: "Group project created and users add",
            groupProjectId: groupProjectId,
          });
        });
      } catch (error) {
        console.log(error);
      }

      // res.status(201).json({
      //   message: "Group project created and users added",
      //   groupProjectId: groupProjectId,
      // });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
}


//-----------------------------------------------

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
  getProjectsByPartialName,
  getProjectbyTeckStack
};
