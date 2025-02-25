const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  resources: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
    },
  ],
  quizzes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz", // Reference to the quizzes collection
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model("Subject", SubjectSchema);
