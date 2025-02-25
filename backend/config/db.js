require("dotenv").config();
const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ Connected to MongoDB: ${conn.connection.host}`);
    console.log(`✅ Using Database: ${conn.connection.name}`);

    const db = mongoose.connection.db;
    const gridFSBucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: "resources",
    });

    return { db, gridFSBucket };
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
