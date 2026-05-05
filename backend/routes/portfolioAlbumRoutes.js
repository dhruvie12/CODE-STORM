const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { Op } = require("sequelize");

const router = express.Router();

const portfolioAlbumController = require("../controllers/portfolioAlbumController");
const { verifyToken } = require("../middleware/authMiddleware");

const uploadDir = path.join(__dirname, "../uploads/portfolio");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype && file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed."), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
});

// ============================
// ALBUM ROUTES
// ============================

// Create album from photographer dashboard
router.post("/", verifyToken, portfolioAlbumController.createAlbum);

// Get logged-in photographer albums for dashboard
router.get("/me", verifyToken, portfolioAlbumController.getMyAlbums);

// Public albums by photographer id
// This is used by /photographer/:id page and client side
router.get(
  "/photographer/:photographer_id",
  portfolioAlbumController.getAlbumsByPhotographerId
);

// Upload photos into an album
router.post(
  "/:album_id/photos",
  verifyToken,
  upload.array("photos", 20),
  portfolioAlbumController.uploadPhotosToAlbum
);

// Update single photo
router.put(
  "/photos/:image_id",
  verifyToken,
  upload.single("photo"),
  portfolioAlbumController.updatePhoto
);

// Delete single photo
router.delete(
  "/photos/:image_id",
  verifyToken,
  portfolioAlbumController.deletePhoto
);

// Update album
router.put("/:album_id", verifyToken, portfolioAlbumController.updateAlbum);

// Delete album
router.delete("/:album_id", verifyToken, portfolioAlbumController.deleteAlbum);

module.exports = router;