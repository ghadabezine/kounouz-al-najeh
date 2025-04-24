const express = require("express");
const router = express.Router();
// routes/fileRoutes.js

const upload = require("../middleware/upload"); // ✅ Import
const {
  uploadFile,
  getFilesByChapter,
  deleteFile,
  updateFileName
} = require("../controllers/FileController");

// File routes
router.post("/:chapterId/files", upload.single("file"), uploadFile); 
router.get("/:chapterId/files", getFilesByChapter);
router.delete("/files/:fileId", deleteFile);
router.patch("/files/:fileId", updateFileName); // Add this route

module.exports = router;

const {
  createQuiz,
  getQuizzesByChapter,
  deleteQuiz
} = require('../controllers/QuizController');

// Quiz routes
router.post("/:chapterId/quizzes", createQuiz);
router.get("/:chapterId/quizzes", getQuizzesByChapter);
router.delete("/quizzes/:quizId", deleteQuiz);


module.exports = router;
