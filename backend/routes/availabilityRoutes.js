const express = require("express");
const router = express.Router();
const availabilityController = require("../controllers/availabilityController");
const { verifyToken } = require("../middleware/authMiddleware");

// Add availability (photographer only)
router.post("/", verifyToken, availabilityController.addAvailability);

// Get availability by photographer
router.get("/:photographer_id", availabilityController.getAvailabilityByPhotographer);

module.exports = router;