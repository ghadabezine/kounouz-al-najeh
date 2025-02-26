// controllers/QuizController.js
const Quiz = require("../models/quizModel");
const Subject = require("../models/Subject");

const createQuiz = async (req, res) => {
    try {
        const { title, questions, subject } = req.body;

        const subjectDoc = await Subject.findById(subject);
        if (!subjectDoc) {
            return res.status(404).json({ error: "Subject not found." });
        }

        const quiz = new Quiz({ title, subject, questions });
        await quiz.save();

        subjectDoc.quizzes.push(quiz._id);
        await subjectDoc.save();

        res.status(201).json(quiz);
    } catch (err) {
        console.error("❌ Error creating quiz:", err);
        res.status(500).json({ error: "Failed to create quiz." });
    }
};

const getQuizzesBySubject = async (req, res) => {
    try {
        const { subject } = req.query;
        const quizzes = await Quiz.find({ subject });
        res.status(200).json(quizzes);
    } catch (err) {
        console.error("❌ Error fetching quizzes:", err);
        res.status(500).json({ error: "Failed to fetch quizzes." });
    }
};

module.exports = { createQuiz, getQuizzesBySubject };