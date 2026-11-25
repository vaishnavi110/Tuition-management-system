const express = require('express');
const router = express.Router();
const {
  getHomeworkList,
  createHomework,
  submitHomeworkSolution,
  reviewHomeworkSubmission,
  removeHomeworkSubmission
} = require('../controllers/homeworkController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

// Shared role-filtered list
router.get('/', verifyToken, getHomeworkList);

// Teacher & Admin assign homework with question sheet photo
router.post('/', verifyToken, requireRole('TEACHER', 'ADMIN'), createHomework);

// Student uploads or removes completed notebook page photo
router.post('/:id/submit', verifyToken, submitHomeworkSolution);
router.delete('/:id/submission', verifyToken, removeHomeworkSubmission);

// Teacher & Admin review submitted notebook work
router.patch('/:id/review', verifyToken, requireRole('TEACHER', 'ADMIN'), reviewHomeworkSubmission);

module.exports = router;
