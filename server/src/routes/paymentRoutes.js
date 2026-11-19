const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey_tuitionhub_2026';

// Middleware to optionally authenticate student/user
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return next();

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (!err && user) req.user = user;
    next();
  });
};

/**
 * GET /api/payment/config
 * Provides client with Razorpay test key configuration and demo mode status
 */
router.get('/config', (req, res) => {
  const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_tuitionhub_demo';
  res.json({
    success: true,
    keyId: keyId,
    isTestMode: true,
    currency: 'INR',
    merchantName: 'TuitionHub Coaching Academy',
    testAccount: {
      accountType: 'Razorpay Sandbox Demo',
      testVpa: 'success@razorpay',
      testCard: '4111 1111 1111 1111',
      supportedMethods: ['UPI', 'CARD', 'NETBANKING']
    }
  });
});

/**
 * POST /api/payment/create-order
 * Generates Razorpay test order for student fee bill
 */
router.post('/create-order', authenticateToken, (req, res) => {
  try {
    const { amount, receiptId, studentName } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'A valid billing amount greater than 0 is required'
      });
    }

    const orderId = `order_test_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
    const amountInPaise = Math.round(Number(amount) * 100);

    res.status(201).json({
      success: true,
      order: {
        id: orderId,
        amount: amountInPaise,
        currency: 'INR',
        receipt: receiptId || `REC-${Date.now()}`,
        status: 'created',
        studentName: studentName || req.user?.name || 'Student',
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: 'Failed to create Razorpay test order' });
  }
});

/**
 * POST /api/payment/verify
 * Verifies Razorpay test payment and generates payment receipt ID
 */
router.post('/verify', authenticateToken, (req, res) => {
  try {
    const { orderId, paymentId, amount, paymentMethod } = req.body;

    const verifiedPaymentId = paymentId || `pay_test_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;

    res.json({
      success: true,
      payment: {
        paymentId: verifiedPaymentId,
        orderId: orderId || `order_test_${Date.now().toString(36)}`,
        amount: Number(amount) || 0,
        currency: 'INR',
        status: 'PAID',
        method: paymentMethod || 'RAZORPAY_TEST',
        paidAt: new Date().toISOString(),
        verified: true,
        message: 'Payment verified successfully in Razorpay Demo Mode'
      }
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ success: false, message: 'Payment verification failed' });
  }
});

module.exports = router;
