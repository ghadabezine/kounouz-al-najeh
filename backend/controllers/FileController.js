const { Readable } = require("stream");
const connectDB = require("../config/db");
const Subject = require("../models/Subject");  // ✅ Add this line
const File = require("../models/fileModel");
const pdfParse = require("pdf-parse"); // ✅ Add this

let db, gridFSBucket;

// ✅ Initialize the database and GridFS bucket
const initDB = async () => {
  const { db: database, gridFSBucket: bucket } = await connectDB();
  db = database;
  gridFSBucket = bucket;
};

initDB().catch((err) => console.error("❌ DB initialization failed:", err));

// ✅ Define uploadFile function (this was missing)

const uploadFile = async (req, res) => {
  try {
    const { subjectId } = req.body;
    if (!req.file) return res.status(400).json({ error: "No file uploaded." });

    const subject = await Subject.findById(subjectId);
    if (!subject) return res.status(404).json({ error: "Subject not found." });

    // ✅ Create readable stream from buffer
    const readableStream = new Readable();
    readableStream.push(req.file.buffer);
    readableStream.push(null);

    const uploadStream = gridFSBucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
      metadata: { permission: "View Only", subject: subjectId },
    });

    // ✅ Pipe to GridFS
    readableStream.pipe(uploadStream);

    uploadStream.on("finish", async () => {
      try {
        // ✅ Read uploaded file back from GridFS
        const chunks = [];
        const downloadStream = gridFSBucket.openDownloadStream(uploadStream.id);

        downloadStream.on("data", (chunk) => chunks.push(chunk));
        downloadStream.on("end", async () => {
          const buffer = Buffer.concat(chunks);
          const parsed = await pdfParse(buffer); // ✅ Extract text
          const extractedText = parsed.text;

          // ✅ Save File doc
          const fileDoc = new File({
            filename: req.file.originalname,
            length: uploadStream.length,
            uploadDate: new Date(),
            metadata: { permission: "View Only" },
            subject: subjectId,
            content: extractedText,
          });

          await fileDoc.save();

          // ✅ Attach to subject
          subject.resources.push(fileDoc._id);
          await subject.save();

          res.status(201).json({
            message: "✅ File uploaded and parsed successfully!",
            file: { id: fileDoc._id, filename: fileDoc.filename },
          });
        });

        downloadStream.on("error", (err) => {
          console.error("❌ GridFS read error:", err);
          res.status(500).json({ error: "Failed to read uploaded file." });
        });
      } catch (err) {
        console.error("❌ Parsing error:", err);
        res.status(500).json({ error: "Failed to extract PDF text." });
      }
    });

    uploadStream.on("error", (err) => {
      console.error("❌ Upload error:", err);
      res.status(500).json({ error: "Upload failed." });
    });

  } catch (err) {
    console.error("❌ Internal error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};
// ✅ Define other functions (examples)
const getFiles = async (req, res) => {
  try {
    const files = await gridFSBucket.find().toArray();
    res.json(files);
  } catch (error) {
    console.error("❌ Error fetching files:", error);
    res.status(500).json({ error: "Failed to fetch files" });
  }
};
const getFilesBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;

    if (!subjectId) return res.status(400).json({ error: "Subject ID is required." });

    const files = await File.find({ subject: subjectId });
    res.json(files);
  } catch (error) {
    console.error("❌ Error fetching files:", error);
    res.status(500).json({ error: "Failed to fetch files." });
  }
};

const getFile = async (req, res) => {
  try {
    const file = await gridFSBucket.find({ filename: req.params.filename }).toArray();
    if (!file.length) return res.status(404).json({ error: "File not found" });
    res.json(file[0]);
  } catch (error) {
    console.error("❌ Error fetching file:", error);
    res.status(500).json({ error: "Failed to fetch file" });
  }
};

const deleteFile = async (req, res) => {
  try {
    const file = await gridFSBucket.find({ filename: req.params.filename }).toArray();
    if (!file.length) return res.status(404).json({ error: "File not found" });

    await gridFSBucket.delete(file[0]._id);
    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting file:", error);
    res.status(500).json({ error: "Failed to delete file" });
  }
};

const updateFilename = async (req, res) => {
  return res.status(501).json({ error: "Update filename not implemented" });
};

// ✅ Export all defined functions
module.exports = { uploadFile, getFiles, getFile, deleteFile, updateFilename, getFilesBySubject };
