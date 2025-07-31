const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Student = sequelize.define('Student', {
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
  student_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  cohort_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'cohorts',
      key: 'id'
    }
  },
  enrollment_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'graduated', 'dropped'),
    defaultValue: 'active'
  }
}, {
  tableName: 'students'
});

module.exports = Student;