const Subject = require("../models/Subject");
const Course = require("../models/fileModel");
const Quiz = require("../models/quizModel");

// ✅ Create a new subject
const createSubject = async (req, res) => {
    try {
        const { name, resources, quizzes } = req.body;

        // Check if course exists
        const courseExists = await Course.findById(resources);
        if (!courseExists) {
            return res.status(404).json({ error: "Course not found" });
        }

        // Validate quizzes
        const quizExists = await Quiz.find({ _id: { $in: quizzes } });
        if (quizExists.length !== quizzes.length) {
            return res.status(404).json({ error: "One or more quizzes not found" });
        }

        // Create subject
        const subject = new Subject({ name, resources, quizzes });
        await subject.save();

        res.status(201).json(subject);
    } catch (error) {
        console.error("❌ Error creating subject:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// ✅ Get all subjects with populated course and quizzes
const getSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find()
            .populate("resources", "name") // Populates resources with course name
            .populate("quizzes", "title"); // Populates quizzes with quiz title

        res.json(subjects);
    } catch (error) {
        console.error("❌ Error fetching subjects:", error);
        res.status(500).json({ error: "Failed to fetch subjects" });
    }
};

module.exports = { createSubject, getSubjects };
