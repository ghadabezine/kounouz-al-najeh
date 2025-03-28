const express = require("express");
const multer = require("multer");
const User = require("../models/User"); // Import User model
const router = express.Router();

// Multer configuration (stores images in 'uploads/' folder)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // ✅ Ensure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ✅ Route to upload a profile image
router.post(
  "/upload-profile",
  upload.single("profileImage"),
  async (req, res) => {
    try {
      const userId = req.body.userId;
      const imageUrl = `http://your-server.com/uploads/${req.file.filename}`; // ✅ Adjust with your server URL

      const user = await User.findByIdAndUpdate(
        userId,
        { profileImage: imageUrl },
        { new: true }
      );

      res.json({ message: "Profile image updated!", user });
    } catch (error) {
      res.status(500).json({ error: "Failed to upload image" });
    }
  }
);

module.exports = router;
