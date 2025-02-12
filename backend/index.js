// backend/index.js (update this file)
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const fileRoutes = require("./routes/fileRoutes");
const connectDB = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());


// ✅ Connect to MongoDB
connectDB();

// ✅ Routes
app.use("/api", fileRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
