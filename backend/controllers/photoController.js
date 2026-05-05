const { Photo, Photographer } = require("../models");

// ============================
// UPLOAD PHOTO (Photographer only)
// ============================
exports.addPhoto = async (req, res) => {
  try {
    const { image_url, caption, category_id } = req.body;

    if (req.user.role !== "photographer") {
      return res.status(403).json({
        message: "Only photographers can upload photos."
      });
    }

    const photographer = await Photographer.findOne({
      where: { user_id: req.user.user_id }
    });

    if (!photographer) {
      return res.status(400).json({
        message: "Create photographer profile first."
      });
    }

    const newPhoto = await Photo.create({
      photographer_id: photographer.photographer_id,
      category_id,
      image_url,
      caption
    });

    res.status(201).json({
      message: "Photo uploaded successfully",
      photo: newPhoto
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============================
// GET ALL PHOTOS
// ============================
exports.getAllPhotos = async (req, res) => {
  try {
    const photos = await Photo.findAll();
    res.json(photos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============================
// GET PHOTOS BY PHOTOGRAPHER
// ============================
exports.getPhotosByPhotographer = async (req, res) => {
  try {
    const { photographer_id } = req.params;

    const photos = await Photo.findAll({
      where: { photographer_id }
    });

    res.json(photos);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};