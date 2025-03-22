const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config(); // For using environment variables

// Import Quiz routes
const quizRoutes = require("./routes/quizRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Parse JSON bodies

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((error) => console.log("❌ MongoDB Connection Error:", error));

// Routes
app.use("/api/quizzes", quizRoutes); // Use quiz routes

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
