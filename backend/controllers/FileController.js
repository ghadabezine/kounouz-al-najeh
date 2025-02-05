const { Readable } = require("stream");
const mongoose = require("mongoose");
const connectDB = require("../config/db");

let db, gridFSBucket;

const initDB = async () => {
  const dbConnection = await connectDB();
  db = dbConnection.db;
  gridFSBucket = dbConnection.gridFSBucket;
};

// Initialize DB
initDB().catch((err) => console.error("Failed to initialize DB:", err));

// ✅ File Upload
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Convert buffer to readable stream
    const readableStream = new Readable();
    readableStream.push(req.file.buffer);
    readableStream.push(null);

    const uploadStream = gridFSBucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
    });

    readableStream.pipe(uploadStream);

    uploadStream.on("finish", () => {
      console.log(`✅ File uploaded: ${req.file.originalname}`);
      res.json({ file: { filename: req.file.originalname, _id: uploadStream.id } });
    });

    uploadStream.on("error", (err) => {
      console.error("❌ Upload Error:", err);
      res.status(500).json({ error: "Upload failed" });
    });
  } catch (error) {
    console.error("❌ Unexpected Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Get All Files
exports.getFiles = async (req, res) => {
  try {
    const files = await db.collection("quizes.files").find().toArray();
    if (!files || files.length === 0) {
      return res.status(404).json({ message: "No files found" });
    }
    res.json(files);
  } catch (error) {
    console.error("❌ Fetching Files Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ File Download
exports.getFile = async (req, res) => {
  try {
    const file = await db.collection("quizes.files").findOne({ filename: req.params.filename });

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    res.set("Content-Type", file.contentType);
    gridFSBucket.openDownloadStreamByName(req.params.filename).pipe(res);
  } catch (error) {
    console.error("❌ File Retrieval Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ File Deletion
exports.deleteFile = async (req, res) => {
  try {
    const file = await db.collection("quizes.files").findOne({ filename: req.params.filename });

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    await gridFSBucket.delete(file._id);
    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("❌ File Deletion Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
