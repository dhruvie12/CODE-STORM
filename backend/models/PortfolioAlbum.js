const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const PortfolioAlbum = sequelize.define(
  "PortfolioAlbum",
  {
    album_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    photographer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    album_title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    client_name: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },

    album_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    shoot_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "portfolio_albums",
    timestamps: false,
  }
);

module.exports = PortfolioAlbum;