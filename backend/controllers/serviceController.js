const { Service, Photographer, Category, User, PortfolioAlbum,Photo, } = require("../models");

// ============================
// CREATE SERVICE (Photographer only)
// ============================
exports.createService = async (req, res) => {
  try {
    const { name, description, price, category_id } = req.body;
    console.log("CREATE SERVICE REQUEST:", { name, description, price, category_id, user_id: req.user?.user_id });

    // Only photographer role
    if (req.user.role !== "photographer") {
      return res.status(403).json({
        message: "Only photographers can create services."
      });
    }

    // Find photographer profile linked to logged-in user
    const photographer = await Photographer.findOne({
      where: { user_id: req.user.user_id }
    });
    console.log("PHOTOGRAPHER FOUND:", photographer?.photographer_id);

    if (!photographer) {
      return res.status(400).json({
        message: "Create photographer profile first."
      });
    }

    // Check category exists
    const category = await Category.findByPk(category_id);
    console.log("CATEGORY FOUND:", category?.category_name, "for ID:", category_id);
    
    if (!category) {
      // List all available categories
      const allCategories = await Category.findAll();
      console.log("AVAILABLE CATEGORIES:", allCategories.map(c => ({ id: c.category_id, name: c.category_name })));
      return res.status(400).json({
        message: "Invalid category.",
        availableCategories: allCategories
      });
    }

    const newService = await Service.create({
      name,
      description,
      price,
      photographer_id: photographer.photographer_id,
      category_id
    });
    console.log("SERVICE CREATED:", newService.service_id);

    res.status(201).json({
      message: "Service created successfully",
      service: newService
    });

  } catch (error) {
    console.error("CREATE SERVICE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// ============================
// GET ALL SERVICES
// ============================
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.findAll({
      include: [
        {
          model: Photographer,
          as: "photographer",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["user_id", "full_name", "email"],
            },
          ],
        },
        {
          model: Category,
          as: "category",
          attributes: ["category_id", "category_name"],
        },
      ],
      order: [["service_id", "DESC"]],
    });

    const servicesWithImages = await Promise.all(
      services.map(async (service) => {
        let randomImage = null;

        try {
          const albums = await PortfolioAlbum.findAll({
            where: {
              photographer_id: service.photographer_id,
              category_id: service.category_id,
            },
            include: [
              {
                model: Photo,
                as: "photos",
                attributes: ["image_id", "image_url", "title", "caption"],
              },
            ],
          });

          const allPhotos = albums.flatMap((album) => album.photos || []);

          if (allPhotos.length > 0) {
            const randomIndex = Math.floor(Math.random() * allPhotos.length);
            randomImage = allPhotos[randomIndex].image_url;
          }
        } catch (imgError) {
          console.error("Error getting random album image:", imgError);
        }

        return {
          service_id: service.service_id,
          name: service.name,
          description: service.description,
          price: service.price,
          duration: service.duration,
          category_id: service.category_id,
          category_name: service.category?.category_name || "",
          photographer_id: service.photographer_id,
          photographer_name:
            service.photographer?.user?.full_name || "Photographer",
          photographer_location: service.photographer?.location || "",
          specialization: service.photographer?.specialization || "",
          cover_image: randomImage,
        };
      })
    );

    res.json(servicesWithImages);
  } catch (error) {
    console.error("Get all services error:", error);
    res.status(500).json({ message: "Failed to fetch services." });
  }
};

// ============================
// GET MY SERVICES (Photographer only)
// ============================
exports.getMyServices = async (req, res) => {
  try {
    if (req.user.role !== "photographer") {
      return res.status(403).json({ message: "Only photographers can view their services." });
    }

    const photographer = await Photographer.findOne({
      where: { user_id: req.user.user_id }
    });

    if (!photographer) {
      return res.status(400).json({ message: "Create photographer profile first." });
    }

    const services = await Service.findAll({
      where: { photographer_id: photographer.photographer_id }
    });

    const categoryIds = [...new Set(services.map((service) => service.category_id))];
    const categories = await Category.findAll({
      where: { category_id: categoryIds }
    });

    const categoryMap = categories.reduce((acc, category) => {
      acc[category.category_id] = category.category_name;
      return acc;
    }, {});

    const servicesWithCategory = services.map((service) => ({
      ...service.toJSON(),
      category: categoryMap[service.category_id] || "General"
    }));

    res.json({ services: servicesWithCategory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};