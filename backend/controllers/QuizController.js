const Quiz = require("../models/quizModel");
const Chapter = require("../models/Chapter");

// Create a new quiz for a chapter
const createQuiz = async (req, res) => {
  try {
    const { chapterId } = req.params;
    const { title, questions } = req.body;

    const chapter = await Chapter.findById(chapterId);
    if (!chapter) return res.status(404).json({ error: "Chapter not found" });

    const quiz = new Quiz({
      title,
      chapter: chapterId,
      questions: questions.map(q => ({
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.correctAnswer
      }))
    });

    await quiz.save();
    chapter.quizzes.push(quiz._id);
    await chapter.save();

    res.status(201).json(quiz);
  } catch (err) {
    console.error("Quiz creation error:", err);
    res.status(500).json({ error: "Failed to create quiz" });
  }
};

// Get quizzes by chapter
const getQuizzesByChapter = async (req, res) => {
  try {
    const { chapterId } = req.params;
    const quizzes = await Quiz.find({ chapter: chapterId })
      .populate('chapter', 'name')
      .sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (err) {
    console.error("Quiz fetch error:", err);
    res.status(500).json({ error: "Failed to fetch quizzes" });
  }
};

// Update a quiz
const updateQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { title, questions } = req.body;

    const quiz = await Quiz.findByIdAndUpdate(
      quizId,
      { title, questions },
      { new: true, runValidators: true }
    );

    if (!quiz) return res.status(404).json({ error: "Quiz not found" });
    res.json(quiz);
  } catch (err) {
    console.error("Quiz update error:", err);
    res.status(500).json({ error: "Failed to update quiz" });
  }
};

// Delete a quiz
const deleteQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const quiz = await Quiz.findByIdAndDelete(quizId);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    await Chapter.findByIdAndUpdate(
      quiz.chapter,
      { $pull: { quizzes: quizId } }
    );

    res.json({ message: "Quiz deleted successfully" });
  } catch (err) {
    console.error("Quiz deletion error:", err);
    res.status(500).json({ error: "Failed to delete quiz" });
  }
};

module.exports = {
  createQuiz,
  getQuizzesByChapter,
  updateQuiz,
  deleteQuiz
};
