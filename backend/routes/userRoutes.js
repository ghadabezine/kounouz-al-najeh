const express = require("express");
const {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  getProfile,
  updateProfile
} = require("../controllers/UserController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Create a new user
router.post("/", createUser);

// ✅ Get all users
router.get("/", getUsers);

// ✅ Update a user
router.put("/:id", updateUser);

// ✅ Delete a user
router.delete("/:id", deleteUser);


module.exports = router;
