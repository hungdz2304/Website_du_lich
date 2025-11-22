const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { bookingValidation, validate } = require('../utils/validators');

/**
 * @route   POST /api/bookings
 * @desc    Create a new booking
 * @access  Private
 */
router.post('/', authMiddleware, bookingValidation, validate, bookingController.createBooking);

/**
 * @route   POST /api/bookings/calculate-price
 * @desc    Calculate booking price
 * @access  Public
 */
router.post('/calculate-price', bookingController.calculatePrice);

/**
 * @route   GET /api/bookings/my-history
 * @desc    Get user's booking history
 * @access  Private
 */
router.get('/my-history', authMiddleware, bookingController.getMyBookings);

/**
 * @route   GET /api/bookings/reference/:reference
 * @desc    Get booking by reference (requires auth)
 * @access  Private
 */
router.get('/reference/:reference', authMiddleware, bookingController.getBookingByReference);

/**
 * @route   GET /api/bookings/:id
 * @desc    Get booking by ID
 * @access  Private
 */
router.get('/:id', authMiddleware, bookingController.getBookingById);

/**
 * @route   PUT /api/bookings/:id/cancel
 * @desc    Cancel booking
 * @access  Private
 */
router.put('/:id/cancel', authMiddleware, bookingController.cancelBooking);

/**
 * @route   POST /api/bookings/:id/pay
 * @desc    Pay booking via online method
 * @access  Private
 */
router.post('/:id/pay', authMiddleware, bookingController.payBooking);

module.exports = router;
