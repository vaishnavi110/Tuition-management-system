const express = require('express');
const router = express.Router();
const { 
  getGrades, 
  createGrade, 
  updateGrade, 
  getSessions, 
  createSession, 
  rescheduleSession, 
  cancelSession 
} = require('../controllers/scheduleController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

// Grade Rate Cards (Publicly viewable or managed by Admin)
router.get('/grades', getGrades);
router.post('/grades', verifyToken, requireRole('ADMIN'), createGrade);
router.put('/grades/:id', verifyToken, requireRole('ADMIN'), updateGrade);

// 1-on-1 Sessions (Authenticated)
router.get('/sessions', verifyToken, getSessions);
router.post('/sessions', verifyToken, requireRole('ADMIN', 'TEACHER'), createSession);
router.put('/sessions/:id', verifyToken, requireRole('ADMIN', 'TEACHER'), rescheduleSession);
router.patch('/sessions/:id/cancel', verifyToken, requireRole('ADMIN', 'TEACHER'), cancelSession);

module.exports = router;

