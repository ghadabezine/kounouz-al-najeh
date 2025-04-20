const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  length: { type: Number },
  uploadDate: { type: Date, default: Date.now },
  metadata: { permission: { type: String, default: "View Only" } },
  chapter: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chapter",
    required: true 
  },
  content: { type: String }
}, { collection: "resources.files" });

module.exports = mongoose.model("File", FileSchema);
