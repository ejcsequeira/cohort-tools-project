const router = require("express").Router();

const Cohort = require("../models/Cohorts.model");

//Post
router.post("/cohorts", (req, res) => {
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
router.get("/cohorts", (req, res) => {
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
router.get("/cohorts/:id", (req, res) => {
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
router.put("/cohorts/:id", (req, res) => {
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
router.delete("/cohorts/:id", (req, res) => {
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

module.exports = router;
