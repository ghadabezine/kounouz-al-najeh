const Quiz = require("../models/quizModel");
const Subject = require("../models/Subject");

// Create a new quiz
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

// Get quizzes by subject
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

// Delete a quiz
const deleteQuiz = async (req, res) => {
    try {
        const { quizId } = req.params;
        const quiz = await Quiz.findByIdAndDelete(quizId);
        if (!quiz) {
            return res.status(404).json({ error: "Quiz not found." });
        }

        // Remove the quiz reference from the subject
        await Subject.updateOne(
            { _id: quiz.subject },
            { $pull: { quizzes: quizId } }
        );

        res.status(200).json({ message: "Quiz deleted successfully." });
    } catch (err) {
        console.error("❌ Error deleting quiz:", err);
        res.status(500).json({ error: "Failed to delete quiz." });
    }
};

// Delete a question from a quiz
const deleteQuestion = async (req, res) => {
    try {
        const { quizId, questionIndex } = req.params;
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ error: "Quiz not found." });
        }

        // Remove the question at the specified index
        if (questionIndex < 0 || questionIndex >= quiz.questions.length) {
            return res.status(400).json({ error: "Invalid question index." });
        }

        quiz.questions.splice(questionIndex, 1);
        await quiz.save();

        res.status(200).json({ message: "Question deleted successfully." });
    } catch (err) {
        console.error("❌ Error deleting question:", err);
        res.status(500).json({ error: "Failed to delete question." });
    }
};

// Edit a question in a quiz
const editQuestion = async (req, res) => {
    try {
        const { quizId, questionIndex } = req.params;
        const { questionText, options, correctAnswer } = req.body;

        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ error: "Quiz not found." });
        }

        // Validate question index
        if (questionIndex < 0 || questionIndex >= quiz.questions.length) {
            return res.status(400).json({ error: "Invalid question index." });
        }

        // Update the question at the specified index
        quiz.questions[questionIndex] = { questionText, options, correctAnswer };
        await quiz.save();

        res.status(200).json({ message: "Question updated successfully." });
    } catch (err) {
        console.error("❌ Error editing question:", err);
        res.status(500).json({ error: "Failed to edit question." });
    }
};

module.exports = { createQuiz, getQuizzesBySubject, deleteQuiz, deleteQuestion, editQuestion };