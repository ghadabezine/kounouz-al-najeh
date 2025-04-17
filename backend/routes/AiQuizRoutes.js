const express = require("express");
const { createQuiz, getQuizzesBySubject, deleteQuiz, deleteQuestion, editQuestion, updateQuiz, generateQuiz } = require("../controllers/AiQuizController");
const router = express.Router();

router.post("/generate-quiz", generateQuiz);

module.exports = router;
