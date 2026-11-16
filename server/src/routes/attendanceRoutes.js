const express = require('express');
const router = express.Router();
const { recordJoin, getSessionAttendance, getAllAttendance } = require('../controllers/attendanceController');
const { verifyToken } = require('../middleware/authMiddleware');

// Protected Attendance routes
router.post('/join', verifyToken, recordJoin);
router.get('/session/:sessionId', verifyToken, getSessionAttendance);
router.get('/all', verifyToken, getAllAttendance);

module.exports = router;
