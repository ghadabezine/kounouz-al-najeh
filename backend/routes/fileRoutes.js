const express = require("express");
const multer = require("multer");
const {
  uploadFile,
  getFiles,
  getFile,
  deleteFile,
  updateFilename
} = require("../controllers/FileController");

const router = express.Router();

// ✅ Setup Multer Storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Define Routes
router.post("/files/upload", upload.single("file"), uploadFile);
router.get("/files", getFiles);
router.get("/files/:filename", getFile);
router.delete("/files/:filename", deleteFile);
router.patch("/files/:filename", updateFilename);

module.exports = router;
