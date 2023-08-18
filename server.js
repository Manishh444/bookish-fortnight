const express = require("express");
const cors =  require("cors")
const dotenv = require("dotenv")
dotenv.config();

const userRoutes = require("./src/routes/userRoutes"); // Path to your projectRoutes.js file
const individual_projectsRoutes = require("./src/routes/individualRoutes");
const groupProjectRoutes = require("./src/routes/groupRoutes");

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use('/api/user', userRoutes); // Mount the router under the '/projects' path
app.use("/api/individual_Project", individual_projectsRoutes);
app.use("/api/group_Project", groupProjectRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
