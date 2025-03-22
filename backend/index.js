require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const { GridFSBucket } = require("mongodb");
const { Readable } = require("stream");

const app = express();
app.use(cors());
app.use(express.json());

const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error("❌ ERROR: MONGO_URI is not defined. Check your .env file.");
  process.exit(1);
}

// ✅ Connect to MongoDB Properly
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const conn = mongoose.connection;

let gridFSBucket;
conn.once("open", () => {
  gridFSBucket = new GridFSBucket(conn.db, { bucketName: "quizes" });
  console.log("✅ MongoDB GridFS is ready.");
});

// ✅ Use `multer` to Store Files in Memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ File Upload Without `multer-gridfs-storage`
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // ✅ Convert Buffer to Readable Stream
    const readableStream = new Readable();
    readableStream.push(req.file.buffer);
    readableStream.push(null);

    // ✅ Upload File to GridFS
    const uploadStream = gridFSBucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
    });

    readableStream.pipe(uploadStream);

    uploadStream.on("finish", () => {
      console.log(`✅ File uploaded successfully: ${req.file.originalname}`);
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
});

// ✅ File Retrieval (Download)
app.get("/file/:filename", async (req, res) => {
  try {
    const file = await conn.db.collection("quizes.files").findOne({ filename: req.params.filename });

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    res.set("Content-Type", file.contentType);
    gridFSBucket.openDownloadStreamByName(req.params.filename).pipe(res);
  } catch (error) {
    console.error("❌ File Retrieval Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ File Deletion
app.delete("/file/:filename", async (req, res) => {
  try {
    const file = await conn.db.collection("quizes.files").findOne({ filename: req.params.filename });

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    await gridFSBucket.delete(file._id);
    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("❌ File Deletion Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
