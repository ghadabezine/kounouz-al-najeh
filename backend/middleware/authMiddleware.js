const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        try {
            token = req.headers.authorization.split(" ")[1];

            console.log("📢 Received Token:", token); // ✅ Debugging token

            const decoded = jwt.verify(token, process.env.JWT_SECRET || "defaultsecret");
            console.log("✅ Decoded Token:", decoded); // ✅ Check what the token contains

            req.user = await User.findById(decoded.userId).select("-password");

            if (!req.user) {
                return res.status(401).json({ message: "User not found" });
            }

            next();
        } catch (error) {
            console.error("❌ Token Verification Failed:", error);
            return res.status(401).json({ message: "❌ Not authorized, invalid token" });
        }
    } else {
        console.error("❌ No token found in request");
        res.status(401).json({ message: "No token, authorization denied" });
    }
};

module.exports = { protect };
