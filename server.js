const express = require("express");
const cors =  require("cors")
const dotenv = require("dotenv")
dotenv.config();
// const pool = require("./src/config/dbConfig")
// const projectRoutes = require("./src/routes/projectRoutes"); // Path to your projectRoutes.js file
const userRoutes = require("./src/routes/userRoutes"); // Path to your projectRoutes.js file
// const userModel_Routes = require("./src/models/userModel_Routes");
// const projectModel_Routes = require("./src/models/projectModel_Routes");
// const userProjectModel_Routes = require("./src/models/userProjectModel_Routes");
// const individual_projectsRoutes = require('./src/routes/groupProjectRoutes')


//const pool = require('./src/config/dbConfig')//
const app = express();
const port = process.env.PORT;


app.use(cors());
app.use(express.json());

// app.use('/api/userModel', userModel_Routes)
// app.use("/api/userProjectModel", userProjectModel_Routes);
// app.use("/api/projectModel", projectModel_Routes);
// app.use('/api/projects', projectRoutes); // Mount the router under the '/projects' path
app.use('/api/user', userRoutes); // Mount the router under the '/projects' path
// app.use("/api/individualProject", individual_projectsRoutes); // Mount the router under the '/projects' path


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
