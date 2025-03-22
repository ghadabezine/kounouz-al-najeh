const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  title: String,
  questions: [
    {
      question: String,
      options: [String],
      correctAnswer: String, // Stores the correct answer
    },
  ],
});

module.exports = mongoose.model("Quiz", quizSchema);
