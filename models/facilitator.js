const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Facilitator = sequelize.define('Facilitator', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  employee_id: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  specialization: {
    type: DataTypes.STRING,
    allowNull: true
  },
  qualifications: {
    type: DataTypes.JSON,
    defaultValue: []
  }
}, {
  tableName: 'facilitators'
});

module.exports = Facilitator;