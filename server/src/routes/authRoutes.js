const express = require('express');
const router = express.Router();
const { login, getMe, getDemoUsers } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

// Public Auth Routes
router.post('/login', login);
router.get('/demo-users', getDemoUsers);

// Protected Auth Routes (Requires valid JWT)
router.get('/me', verifyToken, getMe);

module.exports = router;
