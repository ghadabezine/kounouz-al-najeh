
require("dotenv").config();
const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB Connected");

    const db = conn.connection.db;
    const gridFSBucket = new GridFSBucket(db, { bucketName: "quizes" });

    return { conn, db, gridFSBucket };
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);

    process.exit(1);
  }
};


module.exports = connectDB;

