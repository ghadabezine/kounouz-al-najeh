const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  uploadFile,
  getFilesByChapter,
  deleteFile,
} = require("../controllers/FileController");
const mongoose = require("mongoose");
const { connectDB } = require("../config/db");

// Existing File Routes
router.post("/:chapterId/files", upload.single("file"), uploadFile);
router.get("/:chapterId/files", getFilesByChapter);
router.delete("/files/:fileId", deleteFile);

// ✅ Add this route at the bottom of this file:
router.get("/view/:fileId", async (req, res) => {
  try {
    const { gridFSBucket } = await connectDB(); // Make sure this returns the bucket
    const fileId = new mongoose.Types.ObjectId(req.params.fileId);
    const downloadStream = gridFSBucket.openDownloadStream(fileId);

    res.set("Content-Type", "application/pdf");
    downloadStream.pipe(res);
  } catch (error) {
    console.error("Error streaming file:", error);
    res.status(500).json({ error: "Failed to stream file" });
  }
});

module.exports = router;
