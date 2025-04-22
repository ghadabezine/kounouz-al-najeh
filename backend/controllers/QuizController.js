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

    // Validate title
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({ error: "Invalid quiz title" });
    }

    // Validate questions array
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: "Quiz must have at least one question" });
    }

    // Validate each question's structure
    const isValidQuestions = questions.every(q => 
      q.questionText && 
      Array.isArray(q.options) && 
      q.options.length >= 2 && 
      q.correctAnswer && 
      q.options.includes(q.correctAnswer)
    );

    if (!isValidQuestions) {
      return res.status(400).json({ 
        error: "Invalid question format. Each question must have questionText, at least 2 options, and a valid correctAnswer" 
      });
    }

    // Find the quiz first to preserve the chapter reference
    const existingQuiz = await Quiz.findById(quizId);
    if (!existingQuiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    // Update while preserving the chapter reference
    const quiz = await Quiz.findByIdAndUpdate(
      quizId,
      { 
        title,
        questions,
        chapter: existingQuiz.chapter // Preserve the chapter reference
      },
      { 
        new: true, 
        runValidators: true 
      }
    );

    res.json(quiz);
  } catch (err) {
    console.error("Quiz update error:", err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: "Validation failed", details: err.message });
    }
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
