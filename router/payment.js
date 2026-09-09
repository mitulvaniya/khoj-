const payment = require('express').Router();
const { createOrder, verifyPayment } = require('../controller/paymentController');

payment.route('/create-order').post(createOrder);
payment.route('/verify').post(verifyPayment);

module.exports = payment;
