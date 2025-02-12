const { Readable } = require("stream");
const mongoose = require("mongoose");
const connectDB = require("../config/db");

let db, gridFSBucket;

// ✅ Initialize Database Connection
const initDB = async () => {
  const dbConnection = await connectDB();
  db = dbConnection.db;
  gridFSBucket = dbConnection.gridFSBucket;
};

// Run initDB when module is loaded
initDB().catch((err) => console.error("❌ Failed to initialize DB:", err));

// ✅ File Upload
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const readableStream = new Readable();
    readableStream.push(req.file.buffer);
    readableStream.push(null);

    const uploadStream = gridFSBucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
    });

    readableStream.pipe(uploadStream);

    uploadStream.on("finish", () => {
      res.json({ file: { filename: req.file.originalname, _id: uploadStream.id } });
    });

    uploadStream.on("error", (err) => {
      res.status(500).json({ error: "Upload failed" });
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Get All Files
const getFiles = async (req, res) => {
  try {
    const files = await db.collection("quizes.files").find().toArray();
    if (!files || files.length === 0) {
      return res.status(404).json({ message: "No files found" });
    }
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ File Download
const getFile = async (req, res) => {
  try {
    const file = await db.collection("quizes.files").findOne({ filename: req.params.filename });

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    res.set("Content-Type", file.contentType);
    gridFSBucket.openDownloadStreamByName(req.params.filename).pipe(res);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ File Deletion
const deleteFile = async (req, res) => {
  try {
    const file = await db.collection("quizes.files").findOne({ filename: req.params.filename });

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    await gridFSBucket.delete(file._id);
    res.json({ message: "File deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ File Rename (Fixing 404 Issue)
const updateFilename = async (req, res) => {
  try {
    const { newFilename } = req.body;
    const { filename } = req.params;

    if (!newFilename.trim()) {
      return res.status(400).json({ error: "New filename cannot be empty" });
    }

    const file = await db.collection("quizes.files").findOne({ filename });

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // Rename file in GridFS
    await db.collection("quizes.files").updateOne(
      { filename },
      { $set: { filename: newFilename } }
    );

    res.json({ message: "Filename updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Export all functions
module.exports = {
  uploadFile,
  getFiles,
  getFile,
  deleteFile,
  updateFilename,
};
