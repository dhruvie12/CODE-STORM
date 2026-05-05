const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyToken, requireAdmin } = require("../middleware/authMiddleware");

// Admin-only: list all users
router.get("/", verifyToken, requireAdmin, userController.getAllUsers);

// Switch active role (any authenticated user)
router.put("/switch-role", verifyToken, userController.switchRole);

module.exports = router;