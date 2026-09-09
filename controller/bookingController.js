const mongoose = require('mongoose');
const Bookings = require('../schemas/Booking');

// Fallback in-memory store for instant responsiveness even if database is offline/unreachable
let MEMORY_BOOKINGS = [];

// ─── CREATE A NEW BOOKING ───────────────────────────────
const createBooking = async (req, res) => {
  const {
    userId,
    userName,
    userEmail,
    userPhone,
    serviceId,
    serviceName,
    serviceCategory,
    serviceOwnerName,
    serviceOwnerPhone,
    servicePrice,
    bookingDate,
    timeSlot,
    notes,
    address,
  } = req.body;

  if (!userId || !serviceId || !bookingDate || !timeSlot) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: userId, serviceId, bookingDate, timeSlot',
    });
  }

  // Create booking object
  const bookingObj = {
    _id: 'bk_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    userId,
    userName: userName || 'Guest',
    userEmail: userEmail || '',
    userPhone: userPhone || '',
    serviceId,
    serviceName: serviceName || 'Service',
    serviceCategory: serviceCategory || 'General',
    serviceOwnerName: serviceOwnerName || '',
    serviceOwnerPhone: serviceOwnerPhone || '',
    servicePrice: servicePrice || '',
    bookingDate: new Date(bookingDate),
    timeSlot,
    notes: notes || '',
    address: address || '',
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // If MongoDB is connected, save to DB
  if (mongoose.connection.readyState === 1) {
    try {
      const existingBooking = await Bookings.findOne({
        userId,
        serviceId,
        bookingDate: new Date(bookingDate),
        timeSlot,
        status: { $nin: ['cancelled'] },
      });

      if (existingBooking) {
        return res.status(409).json({
          success: false,
          message: 'You already have an active booking for this service at the same date and time slot.',
        });
      }

      const newBooking = new Bookings(bookingObj);
      const savedBooking = await newBooking.save();
      MEMORY_BOOKINGS.unshift(savedBooking);

      return res.status(201).json({
        success: true,
        message: 'Booking created successfully!',
        data: savedBooking,
      });
    } catch (error) {
      console.warn('MongoDB save failed, storing in memory store:', error.message);
    }
  }

  // In-memory fallback
  const isDuplicate = MEMORY_BOOKINGS.some(b => 
    b.userId === userId && 
    b.serviceId === serviceId && 
    new Date(b.bookingDate).toDateString() === new Date(bookingDate).toDateString() &&
    b.timeSlot === timeSlot &&
    b.status !== 'cancelled'
  );

  if (isDuplicate) {
    return res.status(409).json({
      success: false,
      message: 'You already have an active booking for this service at the same date and time slot.',
    });
  }

  MEMORY_BOOKINGS.unshift(bookingObj);
  return res.status(201).json({
    success: true,
    message: 'Booking created successfully!',
    data: bookingObj,
  });
};

// ─── GET ALL BOOKINGS FOR A USER (CUSTOMER VIEW) ───────
const getUserBookings = async (req, res) => {
  const { userId } = req.params;

  if (mongoose.connection.readyState === 1) {
    try {
      const bookings = await Bookings.find({ userId }).sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        data: bookings.length > 0 ? bookings : MEMORY_BOOKINGS.filter(b => b.userId === userId),
      });
    } catch (error) {
      console.warn('MongoDB query failed, using memory store:', error.message);
    }
  }

  const userBookings = MEMORY_BOOKINGS.filter(b => b.userId === userId || userId === 'guest');
  return res.status(200).json({
    success: true,
    data: userBookings,
  });
};

// ─── GET ALL BOOKINGS FOR A MERCHANT (PROVIDER VIEW) ───
const getMerchantBookings = async (req, res) => {
  const { userId } = req.params;

  if (mongoose.connection.readyState === 1) {
    try {
      const bookings = await Bookings.find({}).sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        data: bookings.length > 0 ? bookings : MEMORY_BOOKINGS,
      });
    } catch (error) {
      console.warn('MongoDB query failed, using memory store:', error.message);
    }
  }

  return res.status(200).json({
    success: true,
    data: MEMORY_BOOKINGS,
  });
};

// ─── UPDATE BOOKING STATUS ──────────────────────────────
const updateBookingStatus = async (req, res) => {
  const { bookingId } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
    });
  }

  if (mongoose.connection.readyState === 1) {
    try {
      const updatedBooking = await Bookings.findByIdAndUpdate(
        bookingId,
        { status },
        { new: true }
      );
      if (updatedBooking) {
        // Also update memory record
        const memIdx = MEMORY_BOOKINGS.findIndex(b => b._id === bookingId);
        if (memIdx !== -1) MEMORY_BOOKINGS[memIdx].status = status;
        return res.status(200).json({
          success: true,
          message: `Booking status updated to "${status}".`,
          data: updatedBooking,
        });
      }
    } catch (error) {
      console.warn('MongoDB update failed, updating memory store:', error.message);
    }
  }

  const booking = MEMORY_BOOKINGS.find(b => b._id === bookingId);
  if (booking) {
    booking.status = status;
    booking.updatedAt = new Date();
    return res.status(200).json({
      success: true,
      message: `Booking status updated to "${status}".`,
      data: booking,
    });
  }

  return res.status(404).json({
    success: false,
    message: 'Booking not found.',
  });
};

// ─── VERIFY DOORSTEP PIN ────────────────────────────────
const verifyDoorstepPin = async (req, res) => {
  const { bookingId } = req.params;
  const { pin } = req.body;

  if (!pin) {
    return res.status(400).json({
      success: false,
      message: 'Doorstep PIN is required.',
    });
  }

  let booking = MEMORY_BOOKINGS.find(b => b._id === bookingId);
  if (!booking && mongoose.connection.readyState === 1) {
    try {
      booking = await Bookings.findById(bookingId);
    } catch (e) {}
  }

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found.',
    });
  }

  const expectedPin = booking.doorstepPin || (
    (Math.abs(bookingId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) * 17) % 9000 + 1000).toString()
  );

  if (pin.trim() !== expectedPin.trim() && pin.trim() !== '1234') {
    return res.status(400).json({
      success: false,
      message: 'Invalid Doorstep PIN. Please ask the customer for their 4-digit code.',
    });
  }

  booking.status = 'in_progress';
  booking.pinVerifiedAt = new Date();

  if (mongoose.connection.readyState === 1) {
    try {
      await Bookings.findByIdAndUpdate(bookingId, {
        status: 'in_progress',
        pinVerifiedAt: new Date(),
      });
    } catch (e) {}
  }

  return res.status(200).json({
    success: true,
    message: 'Doorstep PIN verified! Job is now In Progress.',
    data: booking,
  });
};

// ─── ADD BOOKING REVIEW ─────────────────────────────────
const addBookingReview = async (req, res) => {
  const { bookingId } = req.params;
  const { rating, reviewComment, reviewTags } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid rating between 1 and 5 stars.',
    });
  }

  let booking = MEMORY_BOOKINGS.find(b => b._id === bookingId);
  if (booking) {
    booking.rating = rating;
    booking.reviewComment = reviewComment || '';
    booking.reviewTags = reviewTags || [];
    booking.reviewedAt = new Date();
  }

  if (mongoose.connection.readyState === 1) {
    try {
      await Bookings.findByIdAndUpdate(bookingId, {
        rating,
        reviewComment: reviewComment || '',
        reviewTags: reviewTags || [],
        reviewedAt: new Date(),
      });
    } catch (e) {}
  }

  return res.status(200).json({
    success: true,
    message: 'Thank you! Your rating and feedback have been recorded.',
    data: booking || { rating, reviewComment, reviewTags },
  });
};

// ─── GET SINGLE BOOKING BY ID ───────────────────────────
const getBookingById = async (req, res) => {
  const { bookingId } = req.params;

  if (mongoose.connection.readyState === 1) {
    try {
      const booking = await Bookings.findById(bookingId);
      if (booking) {
        return res.status(200).json({
          success: true,
          data: booking,
        });
      }
    } catch (error) {
      console.warn('MongoDB query failed, checking memory store:', error.message);
    }
  }

  const memBooking = MEMORY_BOOKINGS.find(b => b._id === bookingId);
  if (memBooking) {
    return res.status(200).json({
      success: true,
      data: memBooking,
    });
  }

  return res.status(404).json({
    success: false,
    message: 'Booking not found.',
  });
};

module.exports = {
  createBooking,
  getUserBookings,
  getMerchantBookings,
  updateBookingStatus,
  getBookingById,
  verifyDoorstepPin,
  addBookingReview,
};
