const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  role: { type: String, default: "user" },
  profileImage: { type: String, default: "" }, // ✅ Add this field
});

module.exports = mongoose.model("User", UserSchema);
