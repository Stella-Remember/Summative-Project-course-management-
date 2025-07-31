const sequelize = require('../config/database');
const User = require('./User');
const Manager = require('./Manager');
const Facilitator = require('./Facilitator');
const Student = require('./Student');
const Module = require('./Module');
const Cohort = require('./Cohort');
const Class = require('./Class');
const Mode = require('./mode');
const CourseOffering = require('./CourseOffering');
const ActivityTracker = require('./ActivityTracker');
const Notification = require('./notification');

// Define associations
const defineAssociations = () => {
  // User associations
  User.hasOne(Manager, { foreignKey: 'user_id', onDelete: 'CASCADE' });
  User.hasOne(Facilitator, { foreignKey: 'user_id', onDelete: 'CASCADE' });
  User.hasOne(Student, { foreignKey: 'user_id', onDelete: 'CASCADE' });
  
  Manager.belongsTo(User, { foreignKey: 'user_id' });
  Facilitator.belongsTo(User, { foreignKey: 'user_id' });
  Student.belongsTo(User, { foreignKey: 'user_id' });

  // Course Offering associations
  CourseOffering.belongsTo(Module, { foreignKey: 'module_id', as: 'module' });
  CourseOffering.belongsTo(Class, { foreignKey: 'class_id', as: 'class' });
  CourseOffering.belongsTo(Cohort, { foreignKey: 'cohort_id', as: 'cohort' });
  CourseOffering.belongsTo(Facilitator, { foreignKey: 'facilitator_id', as: 'facilitator' });
  CourseOffering.belongsTo(Mode, { foreignKey: 'mode_id', as: 'mode' });

  Module.hasMany(CourseOffering, { foreignKey: 'module_id' });
  Class.hasMany(CourseOffering, { foreignKey: 'class_id' });
  Cohort.hasMany(CourseOffering, { foreignKey: 'cohort_id' });
  Facilitator.hasMany(CourseOffering, { foreignKey: 'facilitator_id' });
  Mode.hasMany(CourseOffering, { foreignKey: 'mode_id' });

  // Activity Tracker associations
  ActivityTracker.belongsTo(CourseOffering, { foreignKey: 'allocation_id', as: 'courseOffering' });
  CourseOffering.hasMany(ActivityTracker, { foreignKey: 'allocation_id' });

  // Notification associations
  Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  User.hasMany(Notification, { foreignKey: 'user_id' });

  // Student-Cohort associations
  Student.belongsTo(Cohort, { foreignKey: 'cohort_id', as: 'cohort' });
  Cohort.hasMany(Student, { foreignKey: 'cohort_id' });
};

defineAssociations();

module.exports = {
  sequelize,
  User,
  Manager,
  Facilitator,
  Student,
  Module,
  Cohort,
  Class,
  Mode,
  CourseOffering,
  ActivityTracker,
  Notification
};