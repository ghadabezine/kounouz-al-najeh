const express = require("express");
const { createSubject, getSubjects } = require("../controllers/SubjectController");

const router = express.Router();

// ✅ Create a subject
router.post("/", createSubject);

// ✅ Get all subjects
router.get("/", getSubjects);

module.exports = router;
