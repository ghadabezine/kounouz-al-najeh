require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const fileRoutes = require("./routes/fileRoutes");

const app = express();
app.use(cors());

app.use(express.json()); // Parses JSON requests
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded requests

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes); // Auth endpoints
app.use("/api/users", userRoutes); // User endpoints
app.use("/api/files", fileRoutes); // File endpoints

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
