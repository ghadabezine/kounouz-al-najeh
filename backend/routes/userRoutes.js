// routes/userRoutes.js
const {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  getProfile,
  updateProfile,
  updateStreak,
  getStreak
} = require("../controllers/UserController");

const { protect } = require("../middleware/authMiddleware");
const router = require("express").Router();

router.post("/", createUser);
router.get("/", getUsers);
router.get("/profile", protect, getProfile);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.put("/profile", protect, updateProfile);
router.patch("/update-streak", protect, updateStreak);
router.get("/get-streak", protect, getStreak);

module.exports = router;
