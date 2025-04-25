const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  uploadFile,
  getFilesByChapter,
  deleteFile,
  updateFileName
} = require("../controllers/FileController");

router.post("/:chapterId/files", upload.single("file"), uploadFile);
router.get("/:chapterId/files", getFilesByChapter);
router.patch("/:fileId", updateFileName); // ✅ already good
router.delete("/:fileId", deleteFile);     // ✅ already good

module.exports = router;
