const Quiz = require("../models/quizModel");
const Subject = require("../models/Subject");
const generate_quiz = require("../utils/t5Generator");



const generateQuiz = async (req, res) => {
  try {
    const { subjectId } = req.body;
    const subject = await Subject.findById(subjectId).populate("resources");

    if (!subject || !subject.resources || !subject.resources.length) {
      return res.status(404).json({ message: "No resources found for this subject" });
    }

    const allText = subject.resources.map(file => file.content).join("\n");
    console.log("📚 Combined content for quiz generation.");

    const quiz = await generate_quiz(allText);

    res.status(200).json({ success: true, quiz });
  } catch (error) {
    console.error("❌ Error generating quiz:", error);
    res.status(500).json({ error: "Quiz generation failed" });
  }
};

module.exports = { generateQuiz };

