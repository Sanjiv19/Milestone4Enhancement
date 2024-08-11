const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Ticket = sequelize.define('Ticket', {
  ticket_id: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  subject: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.TEXT,
  },
  email: {
    type: DataTypes.STRING,
  },
  priority: {
    type: DataTypes.INTEGER,
  },
  status: {
    type: DataTypes.INTEGER,
  },
  source: {
    type: DataTypes.INTEGER,
  },
  processed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'tickets',
  timestamps: false,
});

module.exports = Ticket;
