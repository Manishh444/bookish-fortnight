
// // Create a new project

// app.post("/projects", async (req, res) => {
//   try {
//     const { title, description, links, techStacks } = req.body;

//     const createProjectQuery = `
//       INSERT INTO projects (title, description, links, tech_stacks)
//       VALUES ($1, $2, $3, $4)
//       RETURNING *;
//     `;

//     const result = await pool.query(createProjectQuery, [
//       title,
//       description,
//       links,
//       techStacks,
//     ]);

//     const createdProject = result.rows[0];
//     res.status(201).json(createdProject);
//   } catch (error) {
//     console.error("Error creating project:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // Get all projects
// app.get("/projects", async (req, res) => {
//   try {
//     const getProjectsQuery = "SELECT * FROM projects";
//     const result = await pool.query(getProjectsQuery);
//     const projects = result.rows;
//     res.json(projects);
//   } catch (error) {
//     console.error("Error fetching projects:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // Get a single project by ID
// app.get("/projects/:id", async (req, res) => {
//   try {
//     const projectId = req.params.id;
//     const getProjectQuery = "SELECT * FROM projects WHERE id = $1";
//     const result = await pool.query(getProjectQuery, [projectId]);

//     if (result.rows.length === 0) {
//       res.status(404).json({ error: "Project not found" });
//     } else {
//       const project = result.rows[0];
//       res.json(project);
//     }
//   } catch (error) {
//     console.error("Error fetching project:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // Update a project by ID
// app.put("/projects/:id", async (req, res) => {
//   try {
//     const projectId = req.params.id;
//     const { title, description, links, techStacks } = req.body;

//     const updateProjectQuery = `
//       UPDATE projects
//       SET title = $1, description = $2, links = $3, tech_stacks = $4
//       WHERE id = $5
//       RETURNING *;
//     `;

//     const result = await pool.query(updateProjectQuery, [
//       title,
//       description,
//       links,
//       techStacks,
//       projectId,
//     ]);

//     if (result.rows.length === 0) {
//       res.status(404).json({ error: "Project not found" });
//     } else {
//       const updatedProject = result.rows[0];
//       res.json(updatedProject);
//     }
//   } catch (error) {
//     console.error("Error updating project:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // Delete a project by ID
// app.delete("/projects/:id", async (req, res) => {
//   try {
//     const projectId = req.params.id;

//     const deleteProjectQuery =
//       "DELETE FROM projects WHERE id = $1 RETURNING *;";
//     const result = await pool.query(deleteProjectQuery, [projectId]);

//     if (result.rows.length === 0) {
//       res.status(404).json({ error: "Project not found" });
//     } else {
//       const deletedProject = result.rows[0];
//       res.json(deletedProject);
//     }
//   } catch (error) {
//     console.error("Error deleting project:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });
