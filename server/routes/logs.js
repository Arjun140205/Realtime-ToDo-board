// backend/routes/logs.js

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getRecentLogs } = require('../controllers/logController');

router.use(protect);

router.get('/', getRecentLogs);

module.exports = router;