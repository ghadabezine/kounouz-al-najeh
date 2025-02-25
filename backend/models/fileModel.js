const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    length: { type: Number }, // File size
    uploadDate: { type: Date, default: Date.now },
    metadata: {
      permission: { type: String, default: "View Only" },
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject", // ✅ Reference to the Subject model
      required: true,
    },
  },
  { collection: "resources.files" } // GridFS collection
);

module.exports = mongoose.model("File", FileSchema);
