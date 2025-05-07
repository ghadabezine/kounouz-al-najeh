const User = require("../models/User");
const moment = require("moment");

// ✅ Create User
const createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Get All Users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update User
const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Delete User
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get Profile
const getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Update Profile
const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ error: "User not found" });

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;

    await user.save();
    res.json({ message: "Profile updated successfully!", user });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Update User's Quiz Streak
const updateStreak = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ error: "User not found" });

    const today = moment().startOf("day");
    const lastAttempt = user.lastAttemptDate
      ? moment(user.lastAttemptDate).startOf("day")
      : null;

    if (!lastAttempt || !lastAttempt.isSame(today)) {
      user.streak =
        lastAttempt && lastAttempt.isSame(today.clone().subtract(1, "day"))
          ? user.streak + 1
          : 1;

      user.lastAttemptDate = new Date();
      await user.save();
    }

    res.json({ streak: user.streak });
  } catch (err) {
    console.error("Error updating streak:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Get User's Current Streak
const getStreak = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("streak lastAttemptDate");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      streak: user.streak,
      lastAttemptDate: user.lastAttemptDate,
    });
  } catch (err) {
    console.error("Error getting streak:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Export everything correctly
module.exports = {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  getProfile,
  updateProfile,
  updateStreak,
  getStreak,
};
