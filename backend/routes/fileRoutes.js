const express = require("express");
const multer = require("multer");
const { uploadFile, getFiles, getFile, deleteFile, updateFilename,getFilesBySubject } = require("../controllers/FileController"); // ✅ Check this path

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Route definitions
router.post("/upload", upload.single("file"), uploadFile); // ✅ Works if uploadFile is defined
router.get("/", getFiles);                                // 🚩 The error points here
router.get("/:filename", getFile);                         // ✅ Make sure getFile is defined
router.delete("/:filename", deleteFile);                   // ✅ deleteFile should be defined
router.patch("/:filename", updateFilename);                // ✅ updateFilename should be defined
router.get("/subject/:subjectId", getFilesBySubject);
module.exports = router;
