const express = require('express');
const router = express.Router();
const { createFullActivityRecord } = require('../controllers/fullCreationController');

router.post('/full-activity', createFullActivityRecord);

module.exports = router;
