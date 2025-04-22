const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  chapters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter",
      default: [],
    },
  ],
  resources: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
    },
  ],
  quizzes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model("Subject", SubjectSchema);
