require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db"); // Ensure this path is correct

// Import Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const fileRoutes = require("./routes/fileRoutes");
const quizRoutes = require("./routes/quizRoutes"); // Ensure this path is correct

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes); // Auth endpoints
app.use("/api/users", userRoutes); // User endpoints
app.use("/api/files", fileRoutes); // File endpoints
app.use("/api/quizzes", quizRoutes); // Quiz endpoints

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
