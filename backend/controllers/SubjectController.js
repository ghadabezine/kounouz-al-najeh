const Subject = require("../models/Subject");

// ✅ Create a new subject
exports.createSubject = async (req, res) => {
    try {
        const { name } = req.body;
        const newSubject = new Subject({ name });
        await newSubject.save();
        res.status(201).json(newSubject);
    } catch (error) {
        res.status(500).json({ error: "Error creating subject" });
    }
};

// ✅ Get all subjects
exports.getSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find();
        res.status(200).json(subjects);
    } catch (error) {
        res.status(500).json({ error: "Error fetching subjects" });
    }
};

// ✅ Delete a subject by ID
exports.deleteSubject = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedSubject = await Subject.findByIdAndDelete(id);
        if (!deletedSubject) {
            return res.status(404).json({ error: "Subject not found" });
        }
        res.status(200).json({ message: "Subject deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting subject" });
    }
};
// ✅ Update a subject by ID
exports.updateSubject = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const updatedSubject = await Subject.findByIdAndUpdate(
            id,
            { name },
            { new: true } // Return the updated document
        );

        if (!updatedSubject) {
            return res.status(404).json({ error: "Subject not found" });
        }

        res.status(200).json(updatedSubject);
    } catch (error) {
        res.status(500).json({ error: "Error updating subject" });
    }
};