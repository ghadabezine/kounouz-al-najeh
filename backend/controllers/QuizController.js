// controllers/QuizController.js
const Quiz = require("../models/quizModel");
const Subject = require("../models/Subject");

// ✅ Controller to create a quiz and link it to a subject
const createQuiz = async (req, res) => {
  try {
    const { title, questions, subject } = req.body;

    // ✅ Check if subject exists
    const subjectDoc = await Subject.findById(subject);
    if (!subjectDoc) {
      return res.status(404).json({ error: "Subject not found." });
    }

    // ✅ Create and save the quiz
    const quiz = new Quiz({ title, subject, questions });
    await quiz.save();

    // ✅ Update subject with the quiz reference
    subjectDoc.quizzes.push(quiz._id);
    await subjectDoc.save();

    res.status(201).json(quiz);
  } catch (err) {
    console.error("❌ Error creating quiz:", err);
    res.status(500).json({ error: "Failed to create quiz." });
  }
};

module.exports = { createQuiz };
