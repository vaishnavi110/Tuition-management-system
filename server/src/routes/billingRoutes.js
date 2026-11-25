const express = require('express');
const router = express.Router();
const { 
  getAdminInvoices, 
  getAdminPayroll, 
  getBillingSummary, 
  getMyStudentInvoice 
} = require('../controllers/billingController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

// Student-accessible invoice endpoint
router.get('/my-invoice', verifyToken, getMyStudentInvoice);

// Admin-only invoicing & payroll reports
router.get('/invoices', verifyToken, requireRole('ADMIN'), getAdminInvoices);
router.get('/payroll', verifyToken, requireRole('ADMIN'), getAdminPayroll);
router.get('/summary', verifyToken, requireRole('ADMIN'), getBillingSummary);

module.exports = router;
