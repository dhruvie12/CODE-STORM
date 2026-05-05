const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");
const { verifyToken } = require("../middleware/authMiddleware");
const { Category } = require("../models");

// Get categories
router.get("/categories/list", async (req, res) => {
  try {
    const categories = await Category.findAll({
      attributes: ["category_id", "category_name"],
      order: [["category_id", "ASC"]]
    });
    res.json(categories);
  } catch (error) {
    console.error("GET CATEGORIES ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get services for current logged in photographer
router.get("/me", verifyToken, serviceController.getMyServices);

// Create service (protected - photographer only)
router.post("/", verifyToken, serviceController.createService);

// Get all services (public)
router.get("/", serviceController.getAllServices);

module.exports = router;