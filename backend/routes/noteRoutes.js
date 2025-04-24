const express = require("express");
const router = express.Router();
const noteController = require("../controllers/noteController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.post("/", noteController.createNote);
router.get("/", noteController.getUserNotes);
router.put("/:id", noteController.updateNote);
router.delete("/:id", noteController.deleteNote);

module.exports = router;
