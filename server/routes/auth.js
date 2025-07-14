// backend/routes/auth.js

const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getProfile, listUsers } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getProfile);
router.get('/users', listUsers); // TEMP: List all users

module.exports = router;