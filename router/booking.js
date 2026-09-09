const booking = require('express').Router();
const {
  createBooking,
  getUserBookings,
  getMerchantBookings,
  updateBookingStatus,
  getBookingById,
  verifyDoorstepPin,
  addBookingReview,
} = require('../controller/bookingController');

booking.route('/create').post(createBooking);
booking.route('/user/:userId').get(getUserBookings);
booking.route('/merchant/:userId').get(getMerchantBookings);
booking.route('/update/:bookingId').put(updateBookingStatus);
booking.route('/verify-pin/:bookingId').post(verifyDoorstepPin);
booking.route('/review/:bookingId').post(addBookingReview);
booking.route('/:bookingId').get(getBookingById);

module.exports = booking;
