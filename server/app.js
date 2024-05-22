const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const PORT = 5005;

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
//...

const mongoose = require("mongoose");
const Cohort = require("./models/Cohorts.model");
const Student = require("./models/Students.model");

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/cohort-tools-api")
  .then((x) =>
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  )
  .catch((err) => console.error("Error connecting to mongo", err));

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// Use the CORS middleware with options to allow requests
// from specific IP addresses and domains.
app.use(
  cors({
    // Add the URLs of allowed origins to this array
    origin: ["http://localhost:5173"],
  })
);

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...

//documentation route
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

//STUDENTS ROUTES

//creating a new student
//post student
app.post("/api/students", (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    linkedinUrl,
    languages,
    program,
    background,
    image,
    cohort,
  } = req.body;

  Student.create({
    firstName,
    lastName,
    email,
    phone,
    linkedinUrl,
    languages,
    program,
    background,
    image,
    cohort,
  })

    .then((student) => {
      console.log("Student created:", student);
      res.status(201).json(student);
    })
    .catch((err) => {
      console.error("Error creating student", err);
      res.status(500).json({ error: "Failed to create student" });
    });
});

//Retrieves all of the students in the database collection
app.get("/api/students", (req, res) => {
  Student.find({})
    .populate("cohort")
    .then((students) => {
      console.log("Retrived cohorts: ", students);
      res.json(students);
    })
    .catch((err) => {
      console.error("Error retrieving students: ", err);
      res.status(500).json({ error: "Failed to retrieve students" });
    });
});

//Retrieves all of the students for a given cohort
app.get("/api/students/cohort/:id", (req, res) => {
  const { id } = req.params;

  Student.find({ cohort: id })
    .populate("cohort")
    .then((students) => {
      console.log(`"Retrived students fror cohort ${id}"`);
      res.json(students);
    })
    .catch((err) => {
      console.error("Error getting students of cohort", err);
      res.status(500).json({ error: "Failed to retrive students of cohort" });
    });
});

//Retrieves a specific student by id
app.get("/api/students/:id", (req, res) => {
  const { id } = req.params;

  Student.findById(id)
    .populate("cohort")
    .then((student) => {
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      res.status(200).json(student);
    })
    .catch((err) => {
      console.error("Error getting student by Id", err);
      res.status(500).json({ error: "Failed to get student by Id" });
    });
});

//Updates a specific student by id
app.put("/api/students/:id", (req, res) => {
  const { id } = req.params;
  const {
    firstName,
    lastName,
    email,
    phone,
    linkedinURL,
    languages,
    program,
    background,
    image,
    cohort,
  } = req.body;

  Student.findByIdAndUpdate(
    id,
    {
      firstName,
      lastName,
      email,
      phone,
      linkedinURL,
      languages,
      program,
      background,
      image,
      cohort,
    },
    { new: true }
  )
    .then((student) => {
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
      res.json(student);
    })
    .catch((err) => {
      console.error("Error updating student by Id", err);
      res.status(500).json({ error: "Fail to update student by Id" });
    });
});

//Deletes a specific student by id
app.delete("/api/students/:id", (req, res) => {
  const { id } = req.params;

  Student.findByIdAndDelete(id)
    .then((student) => {
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
      res.json(student);
    })
    .catch((err) => {
      console.error("Error deleting student by Id", err);
      res.status(500).json({ error: "Fail to delete student by Id" });
    });
});

//Cohorts Routes

//Creates a new cohort
//post cohort
app.post("/api/cohorts", (req, res) => {
  const {
    cohortSlug,
    cohortName,
    program,
    format,
    campus,
    startDate,
    enDate,
    inProgress,
    programManager,
    leadTeacher,
    totalHours,
  } = req.body;

  Cohort.create({
    cohortSlug,
    cohortName,
    program,
    format,
    campus,
    startDate,
    enDate,
    inProgress,
    programManager,
    leadTeacher,
    totalHours,
  })
    .then((cohort) => {
      console.log("Cohort created:", cohort);
      res.status(201).json(cohort);
    })
    .catch((err) => {
      console.error("Error creating cohort:", err);
      res.status(500).json({ error: "Failed to create cohort" });
    });
});

//Retrieves all of the cohorts in the database collection
//get cohorts
app.get("/api/cohorts", (req, res) => {
  Cohort.find({})
    .then((cohorts) => {
      console.log("Retrived cohorts ->", cohorts);
      res.json(cohorts);
    })
    .catch((error) => {
      console.error("Error while retrieving cohorts ->", error);
      res.status(500).json({ error: "Failed to retrieve cohorts" });
    });
});

//Retrieves a specific cohort by id
//get cohort by id
app.get("/api/cohorts/:id", (req, res) => {
  const { id } = req.params;

  Cohort.findById(id)
    .then((cohort) => {
      if (!cohort) {
        return res.status(404).json({ error: "Cohort not found" });
      }

      res.status(200).json(cohort);
    })
    .catch((error) => {
      console.error("Error getting cohort by Id", error);
      res.status(500).json({ error: "Failed to get cohort by Id" });
    });
});

//Updates a specific cohort by id
app.put("/api/cohorts/:id", (req, res) => {
  const { id } = req.params;
  const {
    cohortSlug,
    cohortName,
    program,
    format,
    campus,
    startDate,
    enDate,
    inProgress,
    programManager,
    leadTeacher,
    totalHours,
  } = req.body;

  Cohort.findByIdAndUpdate(
    id,
    {
      cohortSlug,
      cohortName,
      program,
      format,
      campus,
      startDate,
      enDate,
      inProgress,
      programManager,
      leadTeacher,
      totalHours,
    },
    { new: true }
  )
    .then((cohort) => {
      if (!cohort) {
        return res.status(404).json({ error: "Cohort not found" });
      }
      res.json(cohort);
    })
    .catch((error) => {
      console.error("Error updating cohort by Id", error);
      res.status(500).json({ error: "Fail to update cohort by Id" });
    });
});

//Deletes a specific cohort by id
app.delete("/api/cohorts/:id", (req, res) => {
  const { id } = req.params;

  Cohort.findByIdAndDelete(id)
    .then((cohort) => {
      if (!cohort) {
        return res.status(404).json({ error: "Cohort not found" });
      }
      res.json(cohort);
    })
    .catch((error) => {
      console.log(error("Error deleting Cohort by Id", error));
      res.status(500).json({ error: "Fail to delete cohort by Id" });
    });
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
