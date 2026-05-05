const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Booking = sequelize.define(
  "Booking",
  {
    booking_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    photographer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    availability_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    booking_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    event_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    event_location: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    total_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
    },

    status: {
      type: DataTypes.ENUM(
        "pending",
        "approved",
        "confirmed",
        "rejected",
        "cancelled",
        "completed"
      ),
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    tableName: "bookings",
    timestamps: false,
  }
);

module.exports = Booking;