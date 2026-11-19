const express = require('express');
const router = express.Router();
const { getAdminUsers } = require('../controllers/adminController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

// All admin routes strictly require valid JWT and ADMIN role
router.get('/users', verifyToken, requireRole('ADMIN'), getAdminUsers);

module.exports = router;
