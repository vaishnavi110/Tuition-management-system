const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const https = require('https');
const crypto = require('crypto');
const { markInvoicePaid, resetDemoInvoicePayment } = require('../controllers/billingController');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey_tuitionhub_2026';
const SANDBOX_ORDERS = new Map();

const hasConfiguredRazorpayKeys = () => {
  const keyId = process.env.RAZORPAY_KEY_ID || '';
  const keySecret = process.env.RAZORPAY_KEY_SECRET || '';
  return Boolean(
    keyId &&
    keySecret &&
    !keyId.includes('placeholder') &&
    !keySecret.includes('placeholder')
  );
};

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
 * Helper to call Razorpay REST API
 */
const createRazorpayLiveOrder = (keyId, keySecret, amountInPaise, receiptId) => {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const payload = JSON.stringify({
      amount: amountInPaise,
      currency: 'INR',
      receipt: receiptId || `rec_${Date.now()}`
    });

    const req = https.request(
      {
        hostname: 'api.razorpay.com',
        port: 443,
        path: '/v1/orders',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
          'Authorization': `Basic ${auth}`
        }
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(parsed);
            } else {
              reject(new Error(parsed.error?.description || 'Razorpay order creation rejected'));
            }
          } catch (e) {
            reject(e);
          }
        });
      }
    );

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
};

/**
 * GET /api/payment/config
 * Provides client with Razorpay configuration (gracefully reports whether live/test API keys are active)
 */
router.get('/config', (req, res) => {
  const configured = hasConfiguredRazorpayKeys();
  const keyId = configured ? process.env.RAZORPAY_KEY_ID : null;
  res.json({
    success: true,
    keyId,
    hasValidKeys: configured,
    isTestMode: !keyId || keyId.startsWith('rzp_test_'),
    currency: 'INR',
    merchantName: 'TuitionHub Coaching Academy'
  });
});

/**
 * POST /api/payment/create-order
 * Generates official Razorpay order when keys are configured, or a deterministic sandbox order otherwise
 */
router.post('/create-order', authenticateToken, async (req, res) => {
  try {
    const { amount, receiptId, studentName, studentId, month = 11, year = 2026 } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'A valid billing amount greater than 0 is required'
      });
    }

    const amountInPaise = Math.round(Number(amount) * 100);
    const resolvedStudentId = studentId || req.user?.id || null;
    const resolvedStudentName = studentName || req.user?.name || 'Student';

    if (hasConfiguredRazorpayKeys()) {
      const keyId = process.env.RAZORPAY_KEY_ID;
      const keySecret = process.env.RAZORPAY_KEY_SECRET;
      try {
        const razorpayOrder = await createRazorpayLiveOrder(keyId, keySecret, amountInPaise, receiptId);
        SANDBOX_ORDERS.set(razorpayOrder.id, {
          studentId: resolvedStudentId,
          studentName: resolvedStudentName,
          month: Number(month),
          year: Number(year),
          amount: Number(amount)
        });
        return res.status(201).json({
          success: true,
          order: {
            id: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            receipt: razorpayOrder.receipt,
            status: razorpayOrder.status,
            studentName: resolvedStudentName,
            createdAt: new Date().toISOString()
          }
        });
      } catch (apiErr) {
        console.warn('Razorpay Live Order API failed, using sandbox fallback:', apiErr.message);
      }
    }

    // Built-in sandbox order when Razorpay API keys are not yet configured
    const fallbackOrderId = `order_test_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
    SANDBOX_ORDERS.set(fallbackOrderId, {
      studentId: resolvedStudentId,
      studentName: resolvedStudentName,
      month: Number(month),
      year: Number(year),
      amount: Number(amount)
    });

    res.status(201).json({
      success: true,
      order: {
        id: fallbackOrderId,
        amount: amountInPaise,
        currency: 'INR',
        receipt: receiptId || `rec_${Date.now()}`,
        status: 'created',
        studentName: resolvedStudentName,
        isSandbox: true,
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: 'Failed to create payment order' });
  }
});

/**
 * POST /api/payment/verify
 * Verifies Razorpay signature (when live/keyed) and persists PAID status on the student's monthly invoice
 */
router.post('/verify', authenticateToken, async (req, res) => {
  try {
    const {
      orderId,
      paymentId,
      signature,
      amount,
      paymentMethod,
      studentId,
      studentName,
      month = 11,
      year = 2026
    } = req.body;

    const keyId = process.env.RAZORPAY_KEY_ID || '';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || '';
    const isLiveMode = Boolean(keyId.startsWith('rzp_live_') && keySecret && !keySecret.includes('placeholder'));
    const isSandboxOrder = !orderId || String(orderId).startsWith('order_test_');
    let isSignatureValid = false;

    if (signature && keySecret && !keySecret.includes('placeholder') && !isSandboxOrder) {
      // Cryptographically verify whenever Razorpay SDK returns a signature
      const expectedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');
      isSignatureValid = expectedSignature === signature;
      if (!isSignatureValid) {
        return res.status(400).json({ success: false, message: 'Invalid Razorpay payment signature' });
      }
    } else if (isLiveMode) {
      // Strictly reject unsigned verifications in live production mode
      return res.status(400).json({ success: false, message: 'Missing Razorpay signature or payment ID' });
    } else {
      // In Sandbox / Test mode without client KYC, allow built-in simulated checkout & test verification
      isSignatureValid = true;
    }

    const orderMeta = orderId ? SANDBOX_ORDERS.get(orderId) : null;
    const resolvedStudentId = studentId || orderMeta?.studentId || req.user?.id || null;
    const resolvedStudentName = studentName || orderMeta?.studentName || req.user?.name || null;
    const resolvedMonth = Number(month || orderMeta?.month || 11);
    const resolvedYear = Number(year || orderMeta?.year || 2026);

    const verifiedPaymentId = paymentId || `pay_test_${Date.now().toString(36).toUpperCase()}`;
    const resolvedOrderId = orderId || `order_test_${Date.now().toString(36)}`;
    const resolvedMethod = paymentMethod || 'RAZORPAY_SANDBOX';

    const updatedInvoice = await markInvoicePaid({
      studentId: resolvedStudentId,
      studentName: resolvedStudentName,
      month: resolvedMonth,
      year: resolvedYear,
      orderId: resolvedOrderId,
      paymentId: verifiedPaymentId,
      paymentMethod: resolvedMethod,
      amount: Number(amount || orderMeta?.amount || 0)
    });

    res.json({
      success: true,
      payment: {
        paymentId: verifiedPaymentId,
        orderId: resolvedOrderId,
        amount: Number(amount || orderMeta?.amount || 0),
        currency: 'INR',
        status: 'PAID',
        method: resolvedMethod,
        signatureVerified: isSignatureValid,
        paidAt: updatedInvoice?.paidAt || new Date().toISOString(),
        verified: true,
        message: 'Payment verified and invoice marked as PAID'
      },
      invoice: updatedInvoice
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ success: false, message: 'Payment verification failed' });
  }
});

/**
 * POST /api/payment/webhook
 * Razorpay webhook listener for automatic invoice settlement (payment.captured / order.paid)
 */
router.post('/webhook', async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const receivedSignature = req.headers['x-razorpay-signature'];

    if (webhookSecret && !webhookSecret.includes('placeholder')) {
      if (!receivedSignature) {
        return res.status(400).json({ success: false, message: 'Missing x-razorpay-signature header' });
      }
      const expectedSig = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(req.body))
        .digest('hex');

      if (expectedSig !== receivedSignature) {
        return res.status(400).json({ success: false, message: 'Invalid Razorpay webhook signature' });
      }
    }

    const event = req.body?.event;
    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = req.body?.payload?.payment?.entity || {};
      const orderEntity = req.body?.payload?.order?.entity || {};
      const orderId = paymentEntity.order_id || orderEntity.id || null;
      const paymentId = paymentEntity.id || `pay_wh_${Date.now().toString(36)}`;
      const orderMeta = orderId ? SANDBOX_ORDERS.get(orderId) : null;
      const notes = paymentEntity.notes || orderEntity.notes || {};

      const updatedInvoice = await markInvoicePaid({
        studentId: notes.studentId || orderMeta?.studentId || null,
        studentName: notes.studentName || orderMeta?.studentName || null,
        month: Number(notes.month || orderMeta?.month || 11),
        year: Number(notes.year || orderMeta?.year || 2026),
        orderId,
        paymentId,
        paymentMethod: paymentEntity.method || 'RAZORPAY_WEBHOOK',
        amount: paymentEntity.amount ? Math.round(paymentEntity.amount / 100) : (orderMeta?.amount || 0)
      });

      return res.json({
        success: true,
        handled: true,
        event,
        invoiceStatus: updatedInvoice?.status || 'PAID',
        paymentId
      });
    }

    res.json({ success: true, handled: false, event: event || 'ignored' });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ success: false, message: 'Webhook processing failed' });
  }
});

/**
 * POST /api/payment/reset-demo
 * Resets a student's test invoice back to UNPAID during walkthroughs
 */
router.post('/reset-demo', authenticateToken, async (req, res) => {
  try {
    await resetDemoInvoicePayment({
      studentId: req.user?.id || req.body?.studentId,
      studentName: req.user?.name || req.body?.studentName,
      month: Number(req.body?.month || 11),
      year: Number(req.body?.year || 2026)
    });
    res.json({ success: true, message: 'Demo invoice reset to UNPAID' });
  } catch (error) {
    console.error('reset-demo error:', error);
    res.status(500).json({ success: false, message: 'Failed to reset demo bill' });
  }
});

module.exports = router;
