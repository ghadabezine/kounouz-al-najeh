const express = require("express");
const { createSubject, getSubjects, deleteSubject, updateSubject } = require("../controllers/SubjectController");

const router = express.Router();

// ✅ Create a subject
router.post("/", createSubject);

// ✅ Get all subjects
router.get("/", getSubjects);

// ✅ Delete a subject by ID
router.delete("/:id", deleteSubject);

// ✅ Update a subject by ID
router.put("/:id", updateSubject);

module.exports = router;