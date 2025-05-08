const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const noteController = require("../controllers/noteController");

// Routes for notes
router.use(protect); // Protect all routes below this

router.post("/", noteController.createNote); // Create a note
router.get("/", noteController.getUserNotes); // Get all notes for logged-in user
router.put("/:id", noteController.updateNote); // Update a note
router.delete("/:id", noteController.deleteNote); // Delete a note

module.exports = router;
