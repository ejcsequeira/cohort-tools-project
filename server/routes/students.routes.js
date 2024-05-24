const router = require("express").Router();

const Student = require("../models/Students.model");

//creating a new student
//post student
router.post("/students", (req, res) => {
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
router.get("/students", (req, res) => {
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
router.get("/students/cohort/:id", (req, res) => {
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
router.get("/students/:id", (req, res) => {
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
router.put("/students/:id", (req, res) => {
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
router.delete("/students/:id", (req, res) => {
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

module.exports = router;
