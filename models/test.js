const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Test = sequelize.define('Test', {
  name: DataTypes.STRING,
});

module.exports = Test;
