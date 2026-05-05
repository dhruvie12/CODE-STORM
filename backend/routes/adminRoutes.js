const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { verifyToken, requireAdmin } = require("../middleware/authMiddleware");

router.get("/stats", verifyToken, requireAdmin, adminController.getStats);
router.get("/users", verifyToken, requireAdmin, adminController.getAllUsers);
router.get("/bookings", verifyToken, requireAdmin, adminController.getAllBookings);
router.get("/photographers", verifyToken, requireAdmin, adminController.getAllPhotographers);
router.patch("/users/:id/toggle-status", verifyToken, requireAdmin, adminController.toggleUserStatus);

module.exports = router;
