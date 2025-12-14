const Booking = require('../models/Booking');
const emailService = require('../utils/emailService');

// Payment methods that are processed instantly (online)
const ONLINE_PAYMENT_METHODS = ['bank_card', 'momo', 'zalopay', 'vnpay', 'credit_card'];

// Valid payment methods accepted by the system
const VALID_PAYMENT_METHODS = [
    'momo',           // Ví MoMo
    'zalopay',        // Ví ZaloPay
    'vnpay',          // Ví VNPay
    'bank_card',      // Thẻ ATM nội địa
    'credit_card',    // Thẻ quốc tế Visa/Master
    'bank_transfer',  // Chuyển khoản ngân hàng
    'pay_later',      // Thanh toán tại văn phòng
    'installment'     // Trả góp 0%
];

const bookingController = {
    /**
     * Create a new booking
     * POST /api/bookings
     */
    async createBooking(req, res) {
        try {
            const userId = req.user.userId;
            const {
                tour_id,
                schedule_id,
                num_adults,
                num_children,
                num_infants,
                contact_name,
                contact_email,
                contact_phone,
                payment_method,
                special_requests
            } = req.body;

            // Calculate price
            const priceInfo = await Booking.calculatePrice(
                tour_id,
                schedule_id,
                num_adults,
                num_children || 0,
                num_infants || 0
            );

            // Check availability if schedule is specified
            if (schedule_id) {
                const totalParticipants = num_adults + (num_children || 0);
                const availability = await Booking.checkAvailability(schedule_id, totalParticipants);

                if (!availability.available) {
                    return res.status(400).json({
                        success: false,
                        message: availability.message || 'Tour is not available',
                        remaining_slots: availability.remaining_slots
                    });
                }
            }

            // Validate payment method
            const selectedPaymentMethod = payment_method || 'bank_transfer';
            if (!VALID_PAYMENT_METHODS.includes(selectedPaymentMethod)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid payment method'
                });
            }

            // Determine initial payment status based on payment method
            const isOnlinePayment = ONLINE_PAYMENT_METHODS.includes(selectedPaymentMethod);
            const initialPaymentStatus = isOnlinePayment ? 'paid' : 'pending';

            // Create booking
            const bookingData = {
                user_id: userId,
                tour_id,
                schedule_id,
                num_adults,
                num_children: num_children || 0,
                num_infants: num_infants || 0,
                contact_name,
                contact_email,
                contact_phone,
                total_price: priceInfo.total_price,
                deposit_amount: 0,
                discount_amount: 0,
                final_price: priceInfo.total_price,
                payment_method: selectedPaymentMethod,
                payment_status: initialPaymentStatus,
                special_requests
            };

            const result = await Booking.create(bookingData);

            // Get created booking details
            const booking = await Booking.getById(result.booking_id);

            // Send confirmation email (async, don't wait)
            emailService.sendBookingConfirmation(booking).catch(err => 
                console.error('Email send failed:', err)
            );

            res.status(201).json({
                success: true,
                message: 'Booking created successfully',
                data: {
                    booking,
                    booking_reference: result.booking_reference,
                    price_breakdown: {
                        price_adult: priceInfo.price_adult,
                        price_child: priceInfo.price_child,
                        price_infant: priceInfo.price_infant,
                        total_price: priceInfo.total_price
                    }
                }
            });
        } catch (error) {
            console.error('Create booking error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create booking',
                error: error.message
            });
        }
    },

    /**
     * Get user's booking history
     * GET /api/bookings/my-history
     */
    async getMyBookings(req, res) {
        try {
            const userId = req.user.userId;
            const status = req.query.status;
            const limit = parseInt(req.query.limit) || 20;

            const bookings = await Booking.getUserBookings(userId, { status, limit });

            res.json({
                success: true,
                data: bookings
            });
        } catch (error) {
            console.error('Get bookings error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get booking history',
                error: error.message
            });
        }
    },

    /**
     * Get booking by ID
     * GET /api/bookings/:id
     */
    async getBookingById(req, res) {
        try {
            const bookingId = req.params.id;
            const userId = req.user.userId;

            const booking = await Booking.getById(bookingId);

            if (!booking) {
                return res.status(404).json({
                    success: false,
                    message: 'Booking not found'
                });
            }

            // Check if booking belongs to user (unless admin)
            if (booking.user_id !== userId && req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied'
                });
            }

            res.json({
                success: true,
                data: booking
            });
        } catch (error) {
            console.error('Get booking error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get booking details',
                error: error.message
            });
        }
    },

    /**
     * Public booking lookup (no auth required)
     * POST /api/bookings/lookup
     */
    async publicBookingLookup(req, res) {
        try {
            const { booking_reference, contact_info } = req.body;

            if (!booking_reference || !contact_info) {
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng nhập mã booking và email/số điện thoại'
                });
            }

            const booking = await Booking.getByReference(booking_reference.toUpperCase());

            if (!booking) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy đơn đặt tour với mã này'
                });
            }

            // Verify contact info matches (email or phone)
            const contactLower = contact_info.toLowerCase().trim();
            const emailMatch = booking.contact_email?.toLowerCase() === contactLower;
            const phoneMatch = booking.contact_phone?.replace(/\s/g, '') === contact_info.replace(/\s/g, '');

            if (!emailMatch && !phoneMatch) {
                return res.status(403).json({
                    success: false,
                    message: 'Email hoặc số điện thoại không khớp với đơn đặt tour'
                });
            }

            // Return booking with limited info for privacy
            res.json({
                success: true,
                data: {
                    booking_reference: booking.booking_reference,
                    tour_title: booking.tour_title,
                    tour_image: booking.tour_image,
                    departure_date: booking.departure_date,
                    num_adults: booking.num_adults,
                    num_children: booking.num_children,
                    num_infants: booking.num_infants,
                    total_price: booking.total_price,
                    final_price: booking.final_price,
                    status: booking.status,
                    payment_status: booking.payment_status,
                    payment_method: booking.payment_method,
                    contact_name: booking.contact_name,
                    created_at: booking.created_at
                }
            });
        } catch (error) {
            console.error('Public booking lookup error:', error);
            res.status(500).json({
                success: false,
                message: 'Không thể tra cứu đơn đặt tour',
                error: error.message
            });
        }
    },

    /**
     * Get booking by reference
     * GET /api/bookings/reference/:reference
     */
    async getBookingByReference(req, res) {
        try {
            const bookingReference = req.params.reference;

            const booking = await Booking.getByReference(bookingReference);

            if (!booking) {
                return res.status(404).json({
                    success: false,
                    message: 'Booking not found'
                });
            }

            if (booking.user_id !== req.user.userId && req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied'
                });
            }

            res.json({
                success: true,
                data: booking
            });
        } catch (error) {
            console.error('Get booking by reference error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get booking details',
                error: error.message
            });
        }
    },

    /**
     * Cancel booking
     * PUT /api/bookings/:id/cancel
     */
    async cancelBooking(req, res) {
        try {
            const bookingId = req.params.id;
            const userId = req.user.userId;

            const booking = await Booking.getById(bookingId);

            if (!booking) {
                return res.status(404).json({
                    success: false,
                    message: 'Booking not found'
                });
            }

            // Check if booking belongs to user
            if (booking.user_id !== userId && req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied'
                });
            }

            // Check if booking can be cancelled
            if (booking.status === 'cancelled') {
                return res.status(400).json({
                    success: false,
                    message: 'Booking is already cancelled'
                });
            }

            if (booking.status === 'completed') {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot cancel completed booking'
                });
            }

            // Update booking status
            await Booking.updateStatus(bookingId, 'cancelled');

            if (booking.payment_status === 'paid') {
                await Booking.updatePaymentStatus(bookingId, 'refunded', 0);
            }

            // Send cancellation email
            emailService.sendCancellationEmail(booking).catch(err =>
                console.error('Email send failed:', err)
            );

            res.json({
                success: true,
                message: 'Booking cancelled successfully'
            });
        } catch (error) {
            console.error('Cancel booking error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to cancel booking',
                error: error.message
            });
        }
    },

    /**
     * Calculate booking price (for frontend)
     * POST /api/bookings/calculate-price
     */
    async calculatePrice(req, res) {
        try {
            const { tour_id, schedule_id, num_adults, num_children, num_infants } = req.body;

            const priceInfo = await Booking.calculatePrice(
                tour_id,
                schedule_id,
                num_adults,
                num_children || 0,
                num_infants || 0
            );

            res.json({
                success: true,
                data: priceInfo
            });
        } catch (error) {
            console.error('Calculate price error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to calculate price',
                error: error.message
            });
        }
    },

    /**
     * Pay booking via online method
     * POST /api/bookings/:id/pay
     */
    async payBooking(req, res) {
        try {
            const bookingId = req.params.id;
            const userId = req.user.userId;
            const { payment_method } = req.body;

            if (!ONLINE_PAYMENT_METHODS.includes(payment_method)) {
                return res.status(400).json({
                    success: false,
                    message: 'Phương thức thanh toán không hợp lệ'
                });
            }

            const booking = await Booking.getById(bookingId);

            if (!booking) {
                return res.status(404).json({
                    success: false,
                    message: 'Booking not found'
                });
            }

            if (booking.user_id !== userId && req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied'
                });
            }

            if (booking.status === 'cancelled') {
                return res.status(400).json({
                    success: false,
                    message: 'Không thể thanh toán đơn đã hủy'
                });
            }

            if (booking.payment_status === 'paid') {
                return res.status(400).json({
                    success: false,
                    message: 'Booking đã được thanh toán'
                });
            }

            await Booking.markAsPaid(bookingId, payment_method, booking.final_price);
            const updated = await Booking.getById(bookingId);

            // Send payment confirmation email
            emailService.sendPaymentConfirmation(updated).catch(err =>
                console.error('Email send failed:', err)
            );

            res.json({
                success: true,
                message: 'Thanh toán thành công',
                data: updated
            });
        } catch (error) {
            console.error('Pay booking error:', error);
            res.status(500).json({
                success: false,
                message: 'Không thể xử lý thanh toán',
                error: error.message
            });
        }
    }
};

module.exports = bookingController;
