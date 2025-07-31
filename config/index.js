const express = require('express');
require('dotenv').config();
const sequelize = require('./database');
const Test = require('../models/test');


const app = express();
app.use(express.json());

// Health check route
app.get('/', (req, res) => res.send('Course Management API running...'));

// Connect to DB
sequelize.sync({ alter: true }).then(() => {
  console.log('Connected to MySQL and models synced');
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Server running on port ${port}`));
}).catch(err => console.error('Database connection failed:', err));
