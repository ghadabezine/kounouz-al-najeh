  const mongoose = require("mongoose");

  const ChapterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
    resources: [{ type: mongoose.Schema.Types.ObjectId, ref: "File" }],
    quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }],
    createdAt: { type: Date, default: Date.now }
  });

  module.exports = mongoose.model("Chapter", ChapterSchema);
