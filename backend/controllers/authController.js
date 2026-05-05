const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, Role } = require("../models");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { full_name, email, password, phone, role } = req.body;

    if (!full_name || !email || !password || !role) {
      return res.status(400).json({
        message: "Full name, email, password, and role are required",
      });
    }

    // Prevent registering as admin
    if (role === "admin") {
      return res.status(400).json({
        message: "Cannot register as admin",
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    const selectedRole = await Role.findOne({
      where: { role_name: role },
    });

    if (!selectedRole) {
      return res.status(400).json({
        message: "Selected role is invalid",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      full_name,
      email,
      password_hash: hashedPassword,
      phone: phone || null,
      active_role_id: selectedRole.role_id,
      is_active: true,
    });

    await newUser.addRole(selectedRole);

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        user_id: newUser.user_id,
        full_name: newUser.full_name,
        email: newUser.email,
        phone: newUser.phone,
      },
      activeRole: selectedRole.role_name,
      roles: [selectedRole.role_name],
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: Role,
          as: "roles",
          through: { attributes: [] },
          attributes: ["role_id", "role_name"],
        },
      ],
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const roleNames = user.roles.map((r) => r.role_name);

    let activeRole = "client";
    if (user.active_role_id) {
      const matchedRole = user.roles.find(
        (r) => r.role_id === user.active_role_id
      );
      if (matchedRole) {
        activeRole = matchedRole.role_name;
      } else if (roleNames.length > 0) {
        activeRole = roleNames[0];
      }
    } else if (roleNames.length > 0) {
      activeRole = roleNames[0];
    }

    const token = jwt.sign(
      {
        user_id: user.user_id,
        email: user.email,
        role: activeRole,
        roles: roleNames,
      },
      process.env.JWT_SECRET || "mysecretkey",
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
      },
      activeRole,
      roles: roleNames,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};