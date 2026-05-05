const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ContactMessage = sequelize.define("ContactMessage", {
  message_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  subject: {
    type: DataTypes.STRING(200)
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  submitted_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: "contact_messages",
  timestamps: false
});

module.exports = ContactMessage;