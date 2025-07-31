const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CourseOffering = sequelize.define('CourseOffering', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  module_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'modules',
      key: 'id'
    }
  },
  class_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'classes',
      key: 'id'
    }
  },
  cohort_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'cohorts',
      key: 'id'
    }
  },
  facilitator_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'facilitators',
      key: 'id'
    }
  },
  mode_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'modes',
      key: 'id'
    }
  },
  trimester: {
    type: DataTypes.ENUM('1', '2', '3'),
    allowNull: false
  },
  intake_period: {
    type: DataTypes.ENUM('HT1', 'HT2', 'FT'),
    allowNull: false
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  max_enrollment: {
    type: DataTypes.INTEGER,
    defaultValue: 30
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'course_offerings',
  indexes: [
    {
      name: 'course_unique_index',
      unique: true,
      fields: ['module_id', 'class_id', 'cohort_id', 'trimester', 'intake_period']
    }
  ]
});


module.exports = CourseOffering;