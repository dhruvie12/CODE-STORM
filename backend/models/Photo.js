const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Photo = sequelize.define(
  "Photo",
  {
    image_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    album_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    photographer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    title: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },

    image_url: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    caption: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    is_featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    sort_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    uploaded_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "portfolio_images",
    timestamps: false,
  }
);

module.exports = Photo;