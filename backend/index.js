require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const Quiz = require("./models/quizModel");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const fileRoutes = require("./routes/fileRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const quizRoutes = require("./routes/quizRoutes");
const chapterRoutes = require("./routes/chapterRoutes");
// ✅ Add this under your other routes

const app = express();

app.use(cors());
app.post("/quiz", async (req, res) => {
  const quiz = new Quiz(req.body);
  await quiz.save();
  res.status(201).send(quiz);
});

// Fetch Quiz
app.get("/quiz/:id", async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  res.send(quiz);
});

app.use(express.json()); // Parses JSON requests
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded requests

// Connect to MongoDB
connectDB();
const noteRoutes = require("./routes/noteRoutes");
app.use("/api/notes", noteRoutes);
// Routes
app.use("/api/auth", authRoutes); // Auth endpoints
app.use("/api/users", userRoutes); // User endpoints
app.use("/api/files", fileRoutes); // File endpoints
app.use("/api/subjects", subjectRoutes);
app.use("/api/quizzes", quizRoutes);
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
