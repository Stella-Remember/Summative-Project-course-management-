const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Manager = sequelize.define('Manager', {
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
  department: {
    type: DataTypes.STRING,
    allowNull: true
  },
  permissions: {
    type: DataTypes.JSON,
    defaultValue: {
      course_allocation: true,
      view_all_activities: true,
      manage_users: true
    }
  }
}, {
  tableName: 'managers'
});

module.exports = Manager;