const express = require('express');
const router = express.Router();
const { submitClassLog, getMonthlySummary, getAllLogs } = require('../controllers/logController');
const { verifyToken } = require('../middleware/authMiddleware');

// All log endpoints require authentication
router.post('/submit', verifyToken, submitClassLog);
router.get('/monthly-summary', verifyToken, getMonthlySummary);
router.get('/all', verifyToken, getAllLogs);

module.exports = router;
