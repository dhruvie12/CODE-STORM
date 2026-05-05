const fs = require("fs");
const path = require("path");
const { Op } = require("sequelize");
const {
  PortfolioAlbum,
  Photo,
  Photographer,
  Category,
} = require("../models");

const getLoggedInPhotographer = async (userId) => {
  return Photographer.findOne({
    where: { user_id: userId },
  });
};

const getSafeImagePath = (imageUrl) => {
  if (!imageUrl) return null;

  const cleanedPath = imageUrl.replace(/^\/+/, "");
  return path.join(__dirname, "..", cleanedPath);
};

// ============================
// CREATE ALBUM
// ============================
exports.createAlbum = async (req, res) => {
  try {
    const {
      album_title,
      category_id,
      client_name,
      album_description,
      shoot_date,
    } = req.body;

    if (req.user.role !== "photographer") {
      return res.status(403).json({
        message: "Only photographers can create albums.",
      });
    }

    if (!album_title || !category_id) {
      return res.status(400).json({
        message: "Album title and category are required.",
      });
    }

    const photographer = await getLoggedInPhotographer(req.user.user_id);

    if (!photographer) {
      return res.status(404).json({
        message: "Photographer profile not found.",
      });
    }

    const album = await PortfolioAlbum.create({
      photographer_id: photographer.photographer_id,
      category_id,
      album_title,
      client_name: client_name || "",
      album_description: album_description || "",
      shoot_date: shoot_date || null,
    });

    res.status(201).json({
      message: "Album created successfully.",
      album,
    });
  } catch (error) {
    console.error("Create album error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ============================
// GET MY ALBUMS WITH PHOTOS
// Photographer dashboard
// ============================
exports.getMyAlbums = async (req, res) => {
  try {
    if (req.user.role !== "photographer") {
      return res.status(403).json({
        message: "Only photographers can view their albums.",
      });
    }

    const photographer = await getLoggedInPhotographer(req.user.user_id);

    if (!photographer) {
      return res.status(404).json({
        message: "Photographer profile not found.",
      });
    }

    const albums = await PortfolioAlbum.findAll({
      where: {
        photographer_id: photographer.photographer_id,
      },
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["category_id", "category_name"],
        },
        {
          model: Photo,
          as: "photos",
          attributes: [
            "image_id",
            "album_id",
            "photographer_id",
            "category_id",
            "title",
            "image_url",
            "caption",
            "is_featured",
            "sort_order",
            "uploaded_at",
          ],
        },
      ],
      order: [["album_id", "DESC"]],
    });

    res.json({ albums });
  } catch (error) {
    console.error("Get my albums error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ============================
// GET PUBLIC ALBUMS BY PHOTOGRAPHER ID
// For /photographer/:id page and client side
// ============================
// ============================
// GET PUBLIC ALBUMS BY PHOTOGRAPHER ID OR USER ID
// Used by public /photographer/:id page
// ============================
exports.getAlbumsByPhotographerId = async (req, res) => {
  try {
    const { photographer_id } = req.params;

    // The URL id can sometimes be photographer_id and sometimes user_id.
    // This finds the real photographer profile safely.
    const photographer = await Photographer.findOne({
      where: {
        [Op.or]: [
          { photographer_id: photographer_id },
          { user_id: photographer_id },
        ],
      },
    });

    if (!photographer) {
      return res.status(404).json({
        message: "Photographer profile not found.",
        albums: [],
      });
    }

    const albums = await PortfolioAlbum.findAll({
      where: {
        photographer_id: photographer.photographer_id,
      },
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["category_id", "category_name"],
        },
        {
          model: Photo,
          as: "photos",
          attributes: [
            "image_id",
            "album_id",
            "photographer_id",
            "category_id",
            "title",
            "image_url",
            "caption",
            "uploaded_at",
          ],
        },
      ],
      order: [["album_id", "DESC"]],
    });

    res.json({ albums });
  } catch (error) {
    console.error("Get public albums error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ============================
// UPDATE ALBUM
// ============================
exports.updateAlbum = async (req, res) => {
  try {
    const { album_id } = req.params;
    const {
      album_title,
      category_id,
      client_name,
      album_description,
      shoot_date,
    } = req.body;

    const photographer = await getLoggedInPhotographer(req.user.user_id);

    if (!photographer) {
      return res.status(404).json({
        message: "Photographer profile not found.",
      });
    }

    const album = await PortfolioAlbum.findOne({
      where: {
        album_id,
        photographer_id: photographer.photographer_id,
      },
    });

    if (!album) {
      return res.status(404).json({
        message: "Album not found.",
      });
    }

    await album.update({
      album_title: album_title || album.album_title,
      category_id: category_id || album.category_id,
      client_name: client_name ?? album.client_name,
      album_description: album_description ?? album.album_description,
      shoot_date: shoot_date || album.shoot_date,
    });

    res.json({
      message: "Album updated successfully.",
      album,
    });
  } catch (error) {
    console.error("Update album error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ============================
// DELETE ALBUM AND ITS PHOTOS
// ============================
exports.deleteAlbum = async (req, res) => {
  try {
    const { album_id } = req.params;

    const photographer = await getLoggedInPhotographer(req.user.user_id);

    if (!photographer) {
      return res.status(404).json({
        message: "Photographer profile not found.",
      });
    }

    const album = await PortfolioAlbum.findOne({
      where: {
        album_id,
        photographer_id: photographer.photographer_id,
      },
      include: [
        {
          model: Photo,
          as: "photos",
        },
      ],
    });

    if (!album) {
      return res.status(404).json({
        message: "Album not found.",
      });
    }

    for (const photo of album.photos || []) {
      const imagePath = getSafeImagePath(photo.image_url);

      if (imagePath && fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await album.destroy();

    res.json({
      message: "Album and its photos deleted successfully.",
    });
  } catch (error) {
    console.error("Delete album error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ============================
// UPLOAD PHOTOS INTO ALBUM
// ============================
exports.uploadPhotosToAlbum = async (req, res) => {
  try {
    const { album_id } = req.params;
    const { caption } = req.body;

    const photographer = await getLoggedInPhotographer(req.user.user_id);

    if (!photographer) {
      return res.status(404).json({
        message: "Photographer profile not found.",
      });
    }

    const album = await PortfolioAlbum.findOne({
      where: {
        album_id,
        photographer_id: photographer.photographer_id,
      },
    });

    if (!album) {
      return res.status(404).json({
        message: "Album not found.",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "Please select at least one photo.",
      });
    }

    const savedPhotos = await Promise.all(
      req.files.map((file, index) =>
        Photo.create({
          album_id: album.album_id,
          photographer_id: photographer.photographer_id,
          category_id: album.category_id,
          title: caption || album.album_title,
          image_url: `/uploads/portfolio/${file.filename}`,
          caption: caption || "",
          is_featured: false,
          sort_order: index,
        })
      )
    );

    res.status(201).json({
      message: "Photos uploaded to album successfully.",
      photos: savedPhotos,
    });
  } catch (error) {
    console.error("Upload photos to album error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ============================
// UPDATE SINGLE PHOTO
// ============================
exports.updatePhoto = async (req, res) => {
  try {
    const { image_id } = req.params;
    const { title, caption, category_id } = req.body;

    const photographer = await getLoggedInPhotographer(req.user.user_id);

    if (!photographer) {
      return res.status(404).json({
        message: "Photographer profile not found.",
      });
    }

    const photo = await Photo.findOne({
      where: {
        image_id,
        photographer_id: photographer.photographer_id,
      },
    });

    if (!photo) {
      return res.status(404).json({
        message: "Photo not found.",
      });
    }

    let newImageUrl = photo.image_url;

    if (req.file) {
      const oldImagePath = getSafeImagePath(photo.image_url);

      if (oldImagePath && fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }

      newImageUrl = `/uploads/portfolio/${req.file.filename}`;
    }

    await photo.update({
      title: title ?? photo.title,
      caption: caption ?? photo.caption,
      category_id: category_id || photo.category_id,
      image_url: newImageUrl,
    });

    res.json({
      message: "Photo updated successfully.",
      photo,
    });
  } catch (error) {
    console.error("Update photo error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ============================
// DELETE SINGLE PHOTO
// ============================
exports.deletePhoto = async (req, res) => {
  try {
    const { image_id } = req.params;

    const photographer = await getLoggedInPhotographer(req.user.user_id);

    if (!photographer) {
      return res.status(404).json({
        message: "Photographer profile not found.",
      });
    }

    const photo = await Photo.findOne({
      where: {
        image_id,
        photographer_id: photographer.photographer_id,
      },
    });

    if (!photo) {
      return res.status(404).json({
        message: "Photo not found.",
      });
    }

    const imagePath = getSafeImagePath(photo.image_url);

    await photo.destroy();

    if (imagePath && fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    res.json({
      message: "Photo deleted successfully.",
    });
  } catch (error) {
    console.error("Delete photo error:", error);
    res.status(500).json({ error: error.message });
  }
};