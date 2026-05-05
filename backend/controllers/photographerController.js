const {Photographer,User,Service, Category,Booking,PortfolioAlbum,Photo,} = require("../models");
const sequelize = require("../config/db");

// ============================
// CREATE PHOTOGRAPHER PROFILE
// ============================
exports.createPhotographer = async (req, res) => {
  try {
    const { bio, experience_years, specialization, profile_image } = req.body;

    // Only users with role "photographer"
    if (req.user.role !== "photographer") {
      return res.status(403).json({
        message: "Only users with photographer role can create profile."
      });
    }

    // Check if profile already exists
    const existingProfile = await Photographer.findOne({
      where: { user_id: req.user.user_id }
    });

    if (existingProfile) {
      return res.status(400).json({
        message: "Photographer profile already exists."
      });
    }

    const newProfile = await Photographer.create({
      user_id: req.user.user_id,
      bio,
      experience_years,
      specialization,
      profile_image
    });

    res.status(201).json({
      message: "Photographer profile created successfully",
      profile: newProfile
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============================
// GET ALL PHOTOGRAPHERS
// ============================
exports.getAllPhotographers = async (req, res) => {
  try {
    const photographers = await Photographer.findAll({
      include: {
        model: User,
        attributes: ["full_name", "email"]
      }
    });

    res.json(photographers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============================
// GET PHOTOGRAPHERS FOR EXPLORE (Dynamic - Client Dashboard)
// ============================
// ============================
// GET PHOTOGRAPHERS FOR EXPLORE / HOME PAGE
// ============================
exports.getPhotographersForExplore = async (req, res) => {
  try {
    const photographers = await Photographer.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["user_id", "full_name", "email", "phone"],
        },
        {
          model: Service,
          as: "services",
          attributes: ["service_id", "name", "description", "price", "category_id"],
          include: [
            {
              model: Category,
              as: "category",
              attributes: ["category_id", "category_name"],
            },
          ],
        },
        {
          model: PortfolioAlbum,
          as: "albums",
          attributes: [
            "album_id",
            "album_title",
            "category_id",
            "client_name",
            "album_description",
            "shoot_date",
          ],
          include: [
            {
              model: Category,
              as: "category",
              attributes: ["category_id", "category_name"],
            },
            {
              model: Photo,
              as: "photos",
              attributes: ["image_id", "image_url", "caption", "title", "category_id"],
            },
          ],
        },
      ],
      raw: false,
      subQuery: false,
    });

    const result = photographers.map((photographer) => {
      const services = photographer.services || [];
      const albums = photographer.albums || [];

      const servicePrices = services
        .map((s) => parseFloat(s.price || 0))
        .filter((price) => price > 0);

      const minPrice =
        servicePrices.length > 0 ? Math.min(...servicePrices) : 0;

      return {
        photographer_id: photographer.photographer_id,
        user_id: photographer.user_id,
        name: photographer.user?.full_name || "Photographer",
        email: photographer.user?.email,
        phone: photographer.user?.phone,
        bio: photographer.bio,
        experience_years: photographer.experience_years,
        specialization: photographer.specialization || "General",
        location: photographer.location || "NJ",
        rating_avg: parseFloat(photographer.rating_avg || 0),
        total_reviews: photographer.total_reviews || 0,
        starting_price: parseFloat(photographer.starting_price || minPrice),
        profile_image: photographer.profile_image,
        min_price: minPrice,

        services: services.map((s) => ({
          service_id: s.service_id,
          name: s.name,
          description: s.description,
          price: parseFloat(s.price || 0),
          category_id: s.category_id,
          category: s.category?.category_name || "General",
        })),

        albums: albums.map((album) => ({
          album_id: album.album_id,
          album_title: album.album_title,
          category_id: album.category_id,
          category: album.category?.category_name || "General",
          client_name: album.client_name,
          shoot_date: album.shoot_date,
          photos: (album.photos || []).map((photo) => ({
            image_id: photo.image_id,
            image_url: photo.image_url,
            caption: photo.caption,
            title: photo.title,
            category_id: photo.category_id,
          })),
        })),
      };
    });

    res.json(result);
  } catch (error) {
    console.error("Explore photographers error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ============================
// GET PHOTOGRAPHER BY ID
// ============================
exports.getPhotographerById = async (req, res) => {
  try {
    const { id } = req.params;
    const photographer = await Photographer.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["full_name", "email", "phone"]
        },
        {
          model: Service,
          as: "services",
          attributes: ["service_id", "name", "description", "price", "category_id"],
          include: [
            {
              model: Category,
              as: "category",
              attributes: ["category_name"]
            }
          ]
        }
      ]
    });

    if (!photographer) {
      return res.status(404).json({ message: "Photographer not found." });
    }

    res.json({
      photographer_id: photographer.photographer_id,
      user_id: photographer.user_id,
      name: photographer.user?.full_name || "Photographer",
      email: photographer.user?.email,
      bio: photographer.bio,
      experience_years: photographer.experience_years,
      specialization: photographer.specialization,
      location: photographer.location,
      rating_avg: parseFloat(photographer.rating_avg || 0),
      total_reviews: photographer.total_reviews || 0,
      profile_image: photographer.profile_image,
      starting_price: parseFloat(photographer.starting_price || 0),
      services: (photographer.services || []).map(s => ({
        service_id: s.service_id,
        name: s.name,
        description: s.description,
        price: parseFloat(s.price),
        category: s.category?.category_name || "General",
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============================
// GET MY PROFILE
// ============================
exports.getMyProfile = async (req, res) => {
  try {
    if (req.user.role !== "photographer") {
      return res.status(403).json({ message: "Only photographers can access this endpoint." });
    }

    const profile = await Photographer.findOne({
      where: { user_id: req.user.user_id }
    });

    if (!profile) {
      return res.status(404).json({ message: "Photographer profile not found." });
    }

    res.json({ profile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateMyLocation = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { location } = req.body;

    if (!location || location.trim() === "") {
      return res.status(400).json({
        message: "Location is required.",
      });
    }

    const photographer = await Photographer.findOne({
      where: { user_id: userId },
    });

    if (!photographer) {
      return res.status(404).json({
        message: "Photographer profile not found.",
      });
    }

    await photographer.update({
      location: location.trim(),
    });

    res.json({
      message: "Location updated successfully.",
      profile: photographer,
    });
  } catch (error) {
    console.error("Update location error:", error);
    res.status(500).json({
      message: "Failed to update location.",
      error: error.message,
    });
  }
};