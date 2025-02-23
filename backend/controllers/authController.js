const User = require("../models/User");

// Register
exports.registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const newUser = new User({ email, password });
    await newUser.save();
    res.status(201).json({ message: "✅ Registration successful!" });
  } catch (err) {
    res.status(400).json({ message: "❌ Registration failed", error: err.message });
  }
};

// Login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "❌ Invalid credentials" });
    }

    res.json({ message: "✅ Login successful!", token: "mock-token" });
  } catch (err) {
    res.status(500).json({ message: "❌ Login error", error: err.message });
  }
};
