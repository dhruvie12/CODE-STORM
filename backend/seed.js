const { sequelize, User, Role, UserRole, Category } = require("./models");
const bcrypt = require("bcryptjs");

async function seedDatabase() {
  try {
    // Sync database without force
    await sequelize.sync();

    console.log("Database synced successfully");

    // Check if roles already exist
    const existingRoles = await Role.findAll();
    if (existingRoles.length > 0) {
      console.log("Roles already exist, skipping role creation");
    } else {
      // Create roles
      await Role.bulkCreate([
        { role_name: "admin" },
        { role_name: "photographer" },
        { role_name: "client" },
      ]);
      console.log("Roles created successfully");
    }

    // Check if categories already exist
    const existingCategories = await Category.findAll();
    if (existingCategories.length > 0) {
      console.log("Categories already exist, skipping category creation");
    } else {
      // Create categories
      await Category.bulkCreate([
        { category_name: "Weddings", description: "Wedding photography services" },
        { category_name: "Portraits", description: "Portrait photography services" },
        { category_name: "Events", description: "Event photography services" },
        { category_name: "Commercial", description: "Commercial photography services" },
      ]);
      console.log("Categories created successfully");
    }

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ where: { email: "admin@gmail.com" } });
    if (existingAdmin) {
      console.log("Admin user already exists");
      console.log("Email: admin@gmail.com");
      console.log("Password: Admin123");
      return;
    }

    // Get admin role
    const adminRole = await Role.findOne({ where: { role_name: "admin" } });
    if (!adminRole) {
      console.error("Admin role not found");
      return;
    }

    // Create admin user
    const adminPassword = "Admin123"; // You can change this
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const adminUser = await User.create({
      full_name: "Admin User",
      email: "admin@gmail.com",
      password_hash: hashedPassword,
      phone: "1234567890",
      active_role_id: adminRole.role_id,
      is_active: true,
    });

    // Associate admin user with admin role
    await adminUser.addRole(adminRole);

    console.log("Admin user created successfully");
    console.log("Email: admin@gmail.com");
    console.log("Password: Admin123");
    console.log("Please change the password after first login");

  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seedDatabase();