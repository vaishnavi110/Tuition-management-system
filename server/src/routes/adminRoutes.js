const express = require('express');
const router = express.Router();
const { 
  getAdminUsers, 
  deleteAdminUser,
  getAdminInvites,
  createAdminInvite,
  revokeAdminInvite
} = require('../controllers/adminController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

// All admin routes strictly require valid JWT and ADMIN role
router.get('/users', verifyToken, requireRole('ADMIN'), getAdminUsers);
router.delete('/users/:id', verifyToken, requireRole('ADMIN'), deleteAdminUser);

// Invitation code manager endpoints
router.get('/invites', verifyToken, requireRole('ADMIN'), getAdminInvites);
router.post('/invites', verifyToken, requireRole('ADMIN'), createAdminInvite);
router.delete('/invites/:code', verifyToken, requireRole('ADMIN'), revokeAdminInvite);

module.exports = router;
