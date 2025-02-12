// controllers/upload.js
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const mongoose = require("mongoose");

// Create storage engine for GridFS
const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const filename = file.originalname;
      const fileInfo = {
        filename: filename,
        bucketName: "quizes", // The name of your GridFS collection
      };
      resolve(fileInfo);
    });
  },
});

const upload = multer({ storage });

module.exports = upload;