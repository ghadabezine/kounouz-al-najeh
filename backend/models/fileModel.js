const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema(
  {
    filename: String,
    length: Number, // File size
    uploadDate: { type: Date, default: Date.now },
    metadata: {
      permission: { type: String, default: "View Only" },
    },
  },
  { collection: "quizes.files" } // GridFS collection
);

module.exports = mongoose.model("File", FileSchema);
