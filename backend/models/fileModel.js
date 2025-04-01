const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    length: { type: Number },
    uploadDate: { type: Date, default: Date.now },
    metadata: {
      permission: { type: String, default: "View Only" },
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    content: { type: String }, // ✅ Extracted text content from the PDF
  },
  { collection: "resources.files" }
);

module.exports = mongoose.model("File", FileSchema);
