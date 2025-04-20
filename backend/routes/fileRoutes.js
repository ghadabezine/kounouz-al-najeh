const express = require("express");
const router = express.Router();
const {
  createQuiz,
  getQuizzesByChapter,
  deleteQuiz
} = require('../controllers/QuizController');
const {
  uploadFile,
  getFilesByChapter,
  deleteFile
} = require('../controllers/FileController');

// Quiz routes
router.post("/:chapterId/quizzes", createQuiz);
router.get("/:chapterId/quizzes", getQuizzesByChapter);
router.delete("/quizzes/:quizId", deleteQuiz);

// File routes
router.post("/:chapterId/files", uploadFile);
router.get("/:chapterId/files", getFilesByChapter);
router.delete("/files/:fileId", deleteFile);

module.exports = router;
