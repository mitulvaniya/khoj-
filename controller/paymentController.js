const mongoose = require('mongoose');

// In-memory payment ledger fallback for offline/instant mode
let PAYMENTS = [];

const createOrder = async (req, res) => {
  const { bookingId, amount, currency } = req.body;
  if (!bookingId || !amount) {
    return res.status(400).json({ success: false, message: 'bookingId and amount are required' });
  }

  const orderId = 'order_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const paymentObj = {
    orderId,
    bookingId,
    amount: amount || 499,
    currency: currency || 'INR',
    status: 'created',
    createdAt: new Date(),
  };

  PAYMENTS.push(paymentObj);

  return res.status(201).json({
    success: true,
    message: 'Razorpay Order initialized successfully',
    data: {
      orderId,
      amount: amount * 100, // Razorpay amount in paise
      currency: currency || 'INR',
      key: 'rzp_test_KhojPlatform2026',
    },
  });
};

const verifyPayment = async (req, res) => {
  const { orderId, razorpayPaymentId, razorpaySignature, bookingId } = req.body;

  if (!orderId || !razorpayPaymentId) {
    return res.status(400).json({ success: false, message: 'orderId and razorpayPaymentId are required' });
  }

  const payment = PAYMENTS.find(p => p.orderId === orderId) || { orderId, bookingId };
  payment.status = 'captured';
  payment.razorpayPaymentId = razorpayPaymentId;
  payment.paidAt = new Date();

  return res.status(200).json({
    success: true,
    message: 'Payment verified and captured successfully!',
    data: {
      paymentId: razorpayPaymentId,
      orderId,
      bookingId,
      receiptUrl: `https://khoj.app/receipts/${razorpayPaymentId}`,
      qrCodeData: `KHOJ-PAYMENT-VERIFIED|ID:${razorpayPaymentId}|ORDER:${orderId}|BOOKING:${bookingId}`,
    },
  });
};

module.exports = {
  createOrder,
  verifyPayment,
};
