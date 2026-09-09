const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    userPhone: {
      type: String,
      default: '',
    },
    serviceId: {
      type: String,
      required: true,
    },
    serviceName: {
      type: String,
      required: true,
    },
    serviceCategory: {
      type: String,
      default: 'General',
    },
    serviceOwnerName: {
      type: String,
      default: '',
    },
    serviceOwnerPhone: {
      type: String,
      default: '',
    },
    servicePrice: {
      type: String,
      default: '',
    },
    bookingDate: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
      enum: [
        'Morning (9 AM - 12 PM)',
        'Afternoon (12 PM - 3 PM)',
        'Evening (3 PM - 6 PM)',
        'Night (6 PM - 9 PM)',
      ],
    },
    notes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    address: {
      type: String,
      default: '',
    },
  },
  { timestamps: true },
  { collection: 'bookings' }
);

const Bookings = mongoose.model('bookings', BookingSchema);

module.exports = Bookings;
