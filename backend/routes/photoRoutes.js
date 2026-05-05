const express = require("express");
const router = express.Router();
const photoController = require("../controllers/photoController");
const { verifyToken } = require("../middleware/authMiddleware");

// Upload photo (protected)
router.post("/", verifyToken, photoController.addPhoto);

// Get all photos (public)
router.get("/", photoController.getAllPhotos);

// Get photos by photographer
router.get("/photographer/:photographer_id", photoController.getPhotosByPhotographer);

module.exports = router;