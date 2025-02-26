// routes/quizRoutes.js
const express = require("express");
const { createQuiz, getQuizzesBySubject } = require("../controllers/QuizController");

const router = express.Router();

router.post("/", createQuiz);
router.get("/", getQuizzesBySubject); // New route to fetch quizzes by subject

module.exports = router;