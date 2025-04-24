const { Readable } = require("stream");
const connectDB = require("../config/db");
const Chapter = require("../models/Chapter");
const File = require("../models/fileModel");
const pdfParse = require("pdf-parse");

let db, gridFSBucket;

// Initialize database connection
const initDB = async () => {
  const { db: database, gridFSBucket: bucket } = await connectDB();
  db = database;
  gridFSBucket = bucket;
};
initDB().catch(console.error);

const uploadFile = async (req, res) => {
  try {
    const { chapterId } = req.params;
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const chapter = await Chapter.findById(chapterId);
    if (!chapter) return res.status(404).json({ error: "Chapter not found" });

    // Create readable stream from buffer
    const readableStream = new Readable();
    readableStream.push(req.file.buffer);
    readableStream.push(null);

    const uploadStream = gridFSBucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
      metadata: { 
        permission: "View Only", 
        chapter: chapterId 
      },
    });

    readableStream.pipe(uploadStream);

    uploadStream.on("finish", async () => {
      try {
        const chunks = [];
        const downloadStream = gridFSBucket.openDownloadStream(uploadStream.id);

        downloadStream.on("data", (chunk) => chunks.push(chunk));
        downloadStream.on("end", async () => {
          const buffer = Buffer.concat(chunks);
          const parsed = await pdfParse(buffer);
          
          const fileDoc = new File({
            filename: req.file.originalname,
            length: uploadStream.length,
            uploadDate: new Date(),
            metadata: { permission: "View Only" },
            chapter: chapterId,
            content: parsed.text,
            fileId: uploadStream.id // <-- Store actual GridFS file ID
          });
          

          await fileDoc.save();
          chapter.resources.push(fileDoc._id); // Keep this as is, but make sure `fileDoc._id` is a valid Mongoose ObjectId, not `uploadStream.id`

          await chapter.save();

          res.status(201).json({
            message: "File uploaded to chapter successfully",
            file: fileDoc
          });
        });
      } catch (err) {
        console.error("PDF processing error:", err);
        res.status(500).json({ error: "Failed to process PDF content" });
      }
    });

  } catch (err) {
    console.error("File upload error:", err);
    res.status(500).json({ error: "File upload failed" });
  }
};

const getFilesByChapter = async (req, res) => {
  try {
    const { chapterId } = req.params;
    const files = await File.find({ chapter: chapterId })
      .populate('chapter', 'name');
    res.json(files);
  } catch (error) {
    console.error("Error fetching chapter files:", error);
    res.status(500).json({ error: "Failed to fetch chapter files" });
  }
};
const deleteFile = async (req, res) => {
  try {
    const { fileId } = req.params;

    const file = await File.findById(fileId);
    if (!file) return res.status(404).json({ error: "File not found" });

    await gridFSBucket.delete(file.fileId); // Delete from GridFS
    await File.findByIdAndDelete(fileId);   // Delete metadata from collection

    await Chapter.updateMany(
      { resources: fileId },
      { $pull: { resources: fileId } }
    );

    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("File deletion error:", error);
    res.status(500).json({ error: "Failed to delete file" });
  }
};
const updateFileName = async (req, res) => {
  try {
    const { fileId } = req.params;
    const { newFilename } = req.body;

    if (!newFilename || !newFilename.trim()) {
      return res.status(400).json({ error: "New filename is required" });
    }

    const file = await File.findById(fileId);
    if (!file) return res.status(404).json({ error: "File not found" });

    file.filename = newFilename.trim();
    await file.save();

    res.json({ message: "File name updated successfully", file });
  } catch (error) {
    console.error("Error updating file name:", error);
    res.status(500).json({ error: "Failed to update file name" });
  }
};

module.exports = {
  uploadFile,
  getFilesByChapter,
  deleteFile,
  updateFileName, // Export the new method
};