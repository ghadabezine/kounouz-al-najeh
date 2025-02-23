const express = require("express");
const User = require("../models/User");
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // ✅ Validate fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = new User({ firstName, lastName, email, password });
    await user.save();

    res.status(201).json({ message: "✅ Registration successful" });
  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(400).json({ error: error.message, message: "❌ Registration failed" });
  }
});

module.exports = router;
