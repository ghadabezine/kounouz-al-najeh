const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Register User
router.post("/register", async (req, res) => {
    console.log("🚀 Incoming request body:", req.body);

    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // ✅ Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword, // Save hashed password
        });

        await user.save();
        res.status(201).json({ message: "✅ Registration successful" });
    } catch (error) {
        console.error("❌ Registration error:", error);
        res.status(400).json({ error: error.message, message: "❌ Registration failed" });
    }
});

// ✅ Login User
router.post("/login", async (req, res) => {
    console.log("🔑 Login request body:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || "defaultsecret", {
            expiresIn: "2h",
        });

        res.json({
            message: "✅ Login successful",
            token,
            user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email },
        });
    } catch (error) {
        console.error("❌ Login error:", error);
        res.status(500).json({ message: "❌ Login failed", error: error.message });
    }
});

router.get("/profile", protect, async (req, res) => {
    try {
        console.log("📢 Fetching profile for user:", req.user);

        if (!req.user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            id: req.user._id,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
        });
    } catch (error) {
        console.error("❌ Profile Fetch Error:", error);
        res.status(500).json({ message: "❌ Server error" });
    }
});
/** ✅ Update Profile (Protected) */
router.patch("/updateProfile", protect, async (req, res) => {
    try {
        const { firstName, lastName, email } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ error: "User not found" });

        // ✅ Update user fields
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.email = email || user.email;

        await user.save();
        res.json({ message: "✅ Profile updated successfully!", user });
    } catch (error) {
        console.error("❌ Update Profile Error:", error);
        res.status(500).json({ message: "❌ Server error" });
    }
});
module.exports = router;
