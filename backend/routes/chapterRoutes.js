const express = require('express');
const router = express.Router();
const chapterController = require('../controllers/ChapterController');

// Get all chapters for a subject
router.get('/subject/:subjectId', chapterController.getChaptersBySubject);

// Get a single chapter by ID
router.get('/:id', chapterController.getChapterById);

// Create a new chapter
router.post('/', chapterController.createChapter);

// Update a chapter
router.put('/:id', chapterController.updateChapter);

// Delete a chapter
router.delete('/:id', chapterController.deleteChapter);

module.exports = router;
