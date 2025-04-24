const express = require("express");
const {
  createQuiz,
  getQuizzesByChapter,
  updateQuiz,
  deleteQuiz,
  editQuestion,
  deleteQuestion
} = require("../controllers/QuizController");

const router = express.Router();

// Create a new quiz for a chapter
router.post("/:chapterId/quizzes", createQuiz);

// Get quizzes by chapter
router.get("/:chapterId/quizzes", getQuizzesByChapter);

// Update a quiz
router.put("/quizzes/:quizId", updateQuiz);

// Delete a quiz
router.delete("/quizzes/:quizId", deleteQuiz);

// Edit a question in a quiz
router.put("/quizzes/:quizId/questions/:questionIndex", editQuestion);

// Delete a question from a quiz
router.delete("/quizzes/:quizId/questions/:questionIndex", deleteQuestion);

module.exports = router;
