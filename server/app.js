// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ℹ️ Gets access to environment variables/settings
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const express = require("express");

const isAuthenticated = require("./middleware/jwt.middleware");

const app = express();

// MIDDLEWARE
// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...

//documentation route
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

//STUDENTS ROUTES
const studentRoutes = require("./routes/students.routes");
app.use("/api", studentRoutes);

//Cohorts Routes
const cohortRoutes = require("./routes/cohorts.routes");
app.use("/api", cohortRoutes);

//AUTH ROUTES
const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

//PROTECTED ROUTES
const protectedRoutes = require("./routes/protected.routes");
app.use("/auth", isAuthenticated, protectedRoutes);

//USER ROUTE
const userRoutes = require("./routes/user.routes");
app.use("/api", isAuthenticated, userRoutes);

//error handling
require("./error-handling")(app);

module.exports = app;
