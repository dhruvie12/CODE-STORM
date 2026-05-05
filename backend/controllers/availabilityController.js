const { Availability, Photographer } = require("../models");

// ============================
// ADD AVAILABILITY (Photographer only)
// ============================
exports.addAvailability = async (req, res) => {
  try {
    const { available_date, start_time, end_time } = req.body;

    if (req.user.role !== "photographer") {
      return res.status(403).json({
        message: "Only photographers can add availability."
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

    const newAvailability = await Availability.create({
      photographer_id: photographer.photographer_id,
      available_date,
      start_time: start_time || "09:00:00",
      end_time: end_time || "17:00:00"
    });

    res.status(201).json({
      message: "Availability added successfully",
      availability: newAvailability
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============================
// GET AVAILABILITY BY PHOTOGRAPHER
// ============================
exports.getAvailabilityByPhotographer = async (req, res) => {
  try {
    const { photographer_id } = req.params;

    const availability = await Availability.findAll({
      where: { photographer_id, is_booked: false }
    });

    res.json(availability);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============================
// GET AVAILABILITY BY PHOTOGRAPHER
// ============================
exports.getAvailabilityByPhotographer = async (req, res) => {
  try {
    const { photographer_id } = req.params;

    const availability = await Availability.findAll({
      where: { photographer_id, is_booked: false }
    });

    res.json(availability);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};