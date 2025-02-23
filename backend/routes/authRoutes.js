const express = require("express");
const User = require("../models/User"); // Ensure path is correct
const router = express.Router();

router.post("/register", async (req, res) => {
  console.log("🚀 Incoming request body:", req.body); // Debug incoming data

  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = new User({ firstName, lastName, email, password });
    await user.save();
    res.status(201).json({ message: "✅ Registration successful" });
  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(400).json({ error: error.message, message: "❌ Registration failed" });
  }
});

module.exports = router;
