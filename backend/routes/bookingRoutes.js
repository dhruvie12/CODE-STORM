const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/", verifyToken, bookingController.createBooking);
router.get("/photographer", verifyToken, bookingController.getPhotographerBookings);
router.get("/client", verifyToken, bookingController.getClientBookings);
router.patch("/:id/status", verifyToken, bookingController.updateBookingStatus);
router.patch("/:id/cancel", verifyToken, bookingController.cancelBooking);

module.exports = router;