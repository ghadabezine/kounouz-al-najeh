const express = require("express");
const User = require("../models/User"); // Ensure path is correct
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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
            return res.status(400).json({ message: "Invalid credentialsf cgvhbj" });
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

module.exports = router;
