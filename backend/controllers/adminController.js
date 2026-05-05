const { User, Role, Photographer, Booking, Service } = require("../models");

// ============================
// GET STATS
// ============================
exports.getStats = async (req, res) => {
  try {
    const [totalUsers, totalPhotographers, totalBookings, pendingBookings] = await Promise.all([
      User.count(),
      Photographer.count(),
      Booking.count(),
      Booking.count({ where: { status: "pending" } }),
    ]);
    res.json({ totalUsers, totalPhotographers, totalBookings, pendingBookings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============================
// GET ALL USERS
// ============================
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password_hash"] },
      include: [{ model: Role, as: "roles", through: { attributes: [] }, attributes: ["role_name"] }],
      order: [["created_at", "DESC"]],
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============================
// GET ALL BOOKINGS
// ============================
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        { model: User, as: "client", attributes: ["full_name", "email"] },
        {
          model: Service,
          as: "service",
          attributes: ["name", "price"],
          include: [
            {
              model: Photographer,
              as: "photographer",
              attributes: ["photographer_id"],
              include: [{ model: User, as: "user", attributes: ["full_name"] }],
            },
          ],
        },
      ],
      order: [["booking_date", "DESC"]],
    });
    res.json(bookings);
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
      include: [{ model: User, as: "user", attributes: ["user_id", "full_name", "email", "is_active"] }],
      order: [["photographer_id", "ASC"]],
    });
    res.json(photographers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============================
// TOGGLE USER ACTIVE STATUS
// ============================
exports.toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found." });
    await user.update({ is_active: !user.is_active });
    res.json({ message: "User status updated.", is_active: !user.is_active });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
