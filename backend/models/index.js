const sequelize = require("../config/db");

const User = require("./User");
const Role = require("./Role");
const UserRole = require("./UserRole");
const Photographer = require("./Photographer");
const Service = require("./Service");
const Category = require("./Category");
const Availability = require("./Availability");
const Booking = require("./Booking");
const ContactMessage = require("./ContactMessage");
const Review = require("./Review");
const Photo = require("./Photo");
const PortfolioAlbum = require("./PortfolioAlbum");

// User ↔ Role (many-to-many via user_roles)
User.belongsToMany(Role, {
  through: UserRole,
  foreignKey: "user_id",
  otherKey: "role_id",
  as: "roles",
});
Role.belongsToMany(User, {
  through: UserRole,
  foreignKey: "role_id",
  otherKey: "user_id",
  as: "users",
});

// User active role
User.belongsTo(Role, {
  foreignKey: "active_role_id",
  as: "activeRole",
});

// User ↔ Photographer (one-to-one)
User.hasOne(Photographer, {
  foreignKey: "user_id",
  as: "photographerProfile",
});
Photographer.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

// Photographer ↔ Service
Photographer.hasMany(Service, {
  foreignKey: "photographer_id",
  as: "services",
});
Service.belongsTo(Photographer, {
  foreignKey: "photographer_id",
  as: "photographer",
});

// Category ↔ Service
Category.hasMany(Service, {
  foreignKey: "category_id",
  as: "services",
});
Service.belongsTo(Category, {
  foreignKey: "category_id",
  as: "category",
});

// Photographer ↔ Availability
Photographer.hasMany(Availability, {
  foreignKey: "photographer_id",
  as: "availability",
});
Availability.belongsTo(Photographer, {
  foreignKey: "photographer_id",
  as: "photographer",
});

// Service ↔ Booking
Service.hasMany(Booking, {
  foreignKey: "service_id",
  as: "bookings",
});
Booking.belongsTo(Service, {
  foreignKey: "service_id",
  as: "service",
});

// User (client) ↔ Booking
User.hasMany(Booking, {
  foreignKey: "user_id",
  as: "bookings",
});
Booking.belongsTo(User, {
  foreignKey: "user_id",
  as: "client",
});

// Booking ↔ Review (one-to-one)
Booking.hasOne(Review, {
  foreignKey: "booking_id",
  as: "review",
});
Review.belongsTo(Booking, {
  foreignKey: "booking_id",
  as: "booking",
});

// User ↔ Review (reviewer)
User.hasMany(Review, {
  foreignKey: "reviewer_id",
  as: "givenReviews",
});
Review.belongsTo(User, {
  foreignKey: "reviewer_id",
  as: "reviewer",
});

// Photographer ↔ Review
Photographer.hasMany(Review, {
  foreignKey: "photographer_id",
  as: "reviews",
});
Review.belongsTo(Photographer, {
  foreignKey: "photographer_id",
  as: "photographerReviewed",
});

// Photographer ↔ Photo (portfolio)
Photographer.hasMany(Photo, {
  foreignKey: "photographer_id",
  as: "photos",
});
Photo.belongsTo(Photographer, {
  foreignKey: "photographer_id",
  as: "photographer",
});

Photographer.hasMany(PortfolioAlbum, {
  foreignKey: "photographer_id",
  as: "albums",
});

PortfolioAlbum.belongsTo(Photographer, {
  foreignKey: "photographer_id",
  as: "photographer",
});

Category.hasMany(PortfolioAlbum, {
  foreignKey: "category_id",
  as: "albums",
});

PortfolioAlbum.belongsTo(Category, {
  foreignKey: "category_id",
  as: "category",
});

PortfolioAlbum.hasMany(Photo, {
  foreignKey: "album_id",
  as: "photos",
});

Photo.belongsTo(PortfolioAlbum, {
  foreignKey: "album_id",
  as: "album",
});

// Category ↔ Photo
// Required for: include { model: Category, as: "category" } inside Photo queries
Category.hasMany(Photo, {
  foreignKey: "category_id",
  as: "photos",
});

Photo.belongsTo(Category, {
  foreignKey: "category_id",
  as: "category",
});

module.exports = {
  sequelize,
  User,
  Role,
  UserRole,
  Photographer,
  Service,
  Category,
  Availability,
  Booking,
  ContactMessage,
  Review,
  Photo,
  PortfolioAlbum,
};
