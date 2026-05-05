const express = require("express");
const router = express.Router();
const photographerController = require("../controllers/photographerController");
const { verifyToken } = require("../middleware/authMiddleware");

// Create photographer profile (protected)
router.post("/", verifyToken, photographerController.createPhotographer);

// Get current photographer profile
router.get("/me", verifyToken, photographerController.getMyProfile);

router.put("/me/location", verifyToken, photographerController.updateMyLocation);

// Get photographers for client explore (dynamic - public)
router.get("/explore/dynamic", photographerController.getPhotographersForExplore);

// Get all photographers (public)
router.get("/", photographerController.getAllPhotographers);

// Get single photographer by ID (public) — must be after /me and /explore/dynamic
router.get("/:id", photographerController.getPhotographerById);

module.exports = router;