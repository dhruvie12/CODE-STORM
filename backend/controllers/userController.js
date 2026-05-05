const { User, Role } = require("../models");

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password_hash"] }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Switch active role
exports.switchRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByPk(req.user.user_id, {
      include: [{ model: Role, as: "roles" }]
    });

    const targetRole = user.roles.find(r => r.role_name === role);
    if (!targetRole) {
      return res.status(403).json({ message: "You do not have this role." });
    }

    await user.update({ active_role_id: targetRole.role_id });
    res.json({ message: "Role switched.", activeRole: role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};