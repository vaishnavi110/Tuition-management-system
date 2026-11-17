const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile, getDemoUsers } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

// Public Auth Routes
router.post('/register', register);
router.post('/login', login);
router.get('/demo-users', getDemoUsers);

// Protected Auth Routes (Requires valid JWT)
router.get('/me', verifyToken, getMe);
router.put('/profile', verifyToken, updateProfile);

module.exports = router;
