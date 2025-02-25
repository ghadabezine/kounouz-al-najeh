const express = require("express");
const { createQuiz } = require("../controllers/QuizController");

const router = express.Router();

router.post("/", createQuiz); // ✅ Create quiz with subject association

module.exports = router;
