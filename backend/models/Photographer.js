const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Photographer = sequelize.define("Photographer", {
  photographer_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  bio: {
    type: DataTypes.TEXT
  },
  experience_years: {
    type: DataTypes.INTEGER
  },
  specialization: {
    type: DataTypes.STRING(150)
  },
  profile_image: {
    type: DataTypes.STRING(255)
  },
  location: {
    type: DataTypes.STRING(150)
  },
  starting_price: {
    type: DataTypes.DECIMAL(10, 2)
  },
  rating_avg: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0
  },
  total_reviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: "photographers",
  timestamps: false
});

module.exports = Photographer;