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

module.exports = { createGroup };
