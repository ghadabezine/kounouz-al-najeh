const express = require("express");
const { createQuiz, getQuizzesBySubject, deleteQuiz, deleteQuestion, editQuestion, updateQuiz } = require("../controllers/QuizController");

const router = express.Router();

// Create a new quiz
router.post("/", createQuiz);

// Get quizzes by subject
router.get("/", getQuizzesBySubject);

// Delete a quiz
router.delete("/:quizId", deleteQuiz);

// Delete a question from a quiz
router.delete("/:quizId/questions/:questionIndex", deleteQuestion);

// Edit a question in a quiz
router.put("/:quizId/questions/:questionIndex", editQuestion);

// Update a quiz (add or modify questions)
router.put("/:quizId", updateQuiz);

module.exports = router;