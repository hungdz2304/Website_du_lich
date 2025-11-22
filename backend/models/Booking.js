const db = require('../config/database');

const INSTANT_PAYMENT_METHODS = new Set(['bank_card', 'momo', 'apple_pay']);

const Booking = {
    /**
     * Generate unique booking reference
     */
    generateBookingReference() {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `BK${timestamp}${random}`;
    },

    /**
     * Create a new booking
     */
    async create(bookingData) {
        const {
            user_id,
            tour_id,
            schedule_id,
            num_adults,
            num_children,
            num_infants,
            contact_name,
            contact_email,
            contact_phone,
            total_price,
            deposit_amount,
            discount_amount,
            final_price,
            payment_method,
            special_requests
        } = bookingData;

        const participants = (num_adults || 0) + (num_children || 0);

        const booking_reference = this.generateBookingReference();
        const normalizedPaymentMethod = payment_method || 'bank_transfer';
        const isInstantPayment = INSTANT_PAYMENT_METHODS.has(normalizedPaymentMethod);
        const initialStatus = isInstantPayment ? 'confirmed' : 'pending';
        const paymentStatus = isInstantPayment ? 'paid' : 'pending';

        const query = `
            INSERT INTO bookings (
                user_id, tour_id, schedule_id, booking_reference,
                num_adults, num_children, num_infants,
                contact_name, contact_email, contact_phone,
                total_price, deposit_amount, discount_amount, final_price,
                payment_method, special_requests, status, payment_status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.execute(query, [
            user_id,
            tour_id,
            schedule_id || null,
            booking_reference,
            num_adults,
            num_children || 0,
            num_infants || 0,
            contact_name,
            contact_email,
            contact_phone,
            total_price,
            deposit_amount || 0,
            discount_amount || 0,
            final_price,
            normalizedPaymentMethod,
            special_requests || null,
            initialStatus,
            paymentStatus
        ]);

        if (isInstantPayment) {
            await db.execute(
                `UPDATE bookings 
                 SET paid_amount = final_price,
                     payment_date = CURRENT_TIMESTAMP,
                     confirmed_at = CASE WHEN confirmed_at IS NULL THEN CURRENT_TIMESTAMP ELSE confirmed_at END
                 WHERE booking_id = ?`,
                [result.insertId]
            );
        }

        if (schedule_id) {
            await db.execute(
                `UPDATE tour_schedules SET booked_slots = booked_slots + ? WHERE schedule_id = ?`,
                [participants, schedule_id]
            );
        }

        return {
            booking_id: result.insertId,
            booking_reference
        };
    },

    /**
     * Get booking by ID
     */
    async getById(bookingId) {
        const query = `
            SELECT 
                b.*,
                t.title as tour_title,
                t.cover_image_url as tour_image,
                t.duration_days,
                t.duration_nights,
                d.name as destination_name,
                ts.departure_date,
                ts.return_date,
                u.full_name as user_name,
                u.email as user_email
            FROM bookings b
            LEFT JOIN tours t ON b.tour_id = t.tour_id
            LEFT JOIN destinations d ON t.destination_id = d.destination_id
            LEFT JOIN tour_schedules ts ON b.schedule_id = ts.schedule_id
            LEFT JOIN users u ON b.user_id = u.user_id
            WHERE b.booking_id = ?
        `;

        const [rows] = await db.execute(query, [bookingId]);
        return rows[0];
    },

    /**
     * Get booking by reference
     */
    async getByReference(bookingReference) {
        const query = `
            SELECT 
                b.*,
                t.title as tour_title,
                t.cover_image_url as tour_image,
                t.duration_days,
                t.duration_nights,
                d.name as destination_name,
                ts.departure_date,
                ts.return_date
            FROM bookings b
            LEFT JOIN tours t ON b.tour_id = t.tour_id
            LEFT JOIN destinations d ON t.destination_id = d.destination_id
            LEFT JOIN tour_schedules ts ON b.schedule_id = ts.schedule_id
            WHERE b.booking_reference = ?
        `;

        const [rows] = await db.execute(query, [bookingReference]);
        return rows[0];
    },

    /**
     * Get user's booking history
     */
    async getUserBookings(userId, filters = {}) {
        let query = `
            SELECT 
                b.*,
                t.title as tour_title,
                t.cover_image_url as tour_image,
                t.duration_days,
                t.duration_nights,
                d.name as destination_name,
                ts.departure_date,
                ts.return_date
            FROM bookings b
            LEFT JOIN tours t ON b.tour_id = t.tour_id
            LEFT JOIN destinations d ON t.destination_id = d.destination_id
            LEFT JOIN tour_schedules ts ON b.schedule_id = ts.schedule_id
            WHERE b.user_id = ?
        `;

        const params = [userId];

        // Filter by status
        if (filters.status) {
            query += ' AND b.status = ?';
            params.push(filters.status);
        }

        query += ' ORDER BY b.booking_date DESC';

        // Pagination
        if (filters.limit) {
            const safeLimit = Math.min(100, Math.max(1, Number(filters.limit) || 10));
            query += ` LIMIT ${safeLimit}`;
        }

        const [rows] = await db.execute(query, params);
        return rows;
    },

    /**
     * Update booking status
     */
    async updateStatus(bookingId, status) {
        let query = 'UPDATE bookings SET status = ?';
        const params = [status, bookingId];

        if (status === 'confirmed') {
            query += ', confirmed_at = CURRENT_TIMESTAMP';
        } else if (status === 'cancelled') {
            query += ', cancelled_at = CURRENT_TIMESTAMP';
        } else if (status === 'completed') {
            query += ', completed_at = CURRENT_TIMESTAMP';
        }

        query += ' WHERE booking_id = ?';

        const [result] = await db.execute(query, params);
        return result.affectedRows > 0;
    },

    /**
     * Update payment status
     */
    async updatePaymentStatus(bookingId, paymentStatus, paidAmount = null) {
        let query = `UPDATE bookings SET payment_status = ?`;
        const params = [paymentStatus];

        if (paidAmount !== null) {
            query += ', paid_amount = ?';
            params.push(paidAmount);
        }

        if (paymentStatus === 'paid') {
            query += ', payment_date = CURRENT_TIMESTAMP';
        } else if (paymentStatus === 'refunded' || paymentStatus === 'cancelled') {
            query += ', payment_date = NULL';
        }

        query += ' WHERE booking_id = ?';
        params.push(bookingId);

        const [result] = await db.execute(query, params);
        return result.affectedRows > 0;
    },

    async markAsPaid(bookingId, paymentMethod, amount) {
        const [result] = await db.execute(
            `UPDATE bookings 
             SET payment_method = ?, payment_status = 'paid', paid_amount = ?, payment_date = CURRENT_TIMESTAMP,
                 status = CASE WHEN status = 'pending' THEN 'confirmed' ELSE status END,
                 confirmed_at = CASE WHEN status = 'pending' THEN CURRENT_TIMESTAMP ELSE confirmed_at END
             WHERE booking_id = ?`,
            [paymentMethod, amount, bookingId]
        );
        return result.affectedRows > 0;
    },

    /**
     * Calculate booking price
     */
    async calculatePrice(tourId, scheduleId, numAdults, numChildren = 0, numInfants = 0) {
        let query = '';
        let params = [];

        if (scheduleId) {
            // Get price from schedule
            query = `
                SELECT price_adult, price_child, price_infant
                FROM tour_schedules
                WHERE schedule_id = ? AND tour_id = ?
            `;
            params = [scheduleId, tourId];
        } else {
            // Get price from tour
            query = `
                SELECT price_adult, price_child, price_infant
                FROM tours
                WHERE tour_id = ?
            `;
            params = [tourId];
        }

        const [rows] = await db.execute(query, params);

        if (rows.length === 0) {
            throw new Error('Tour or schedule not found');
        }

        const { price_adult, price_child, price_infant } = rows[0];

        const totalPrice = 
            (price_adult * numAdults) +
            (price_child * numChildren) +
            (price_infant * numInfants);

        return {
            price_adult,
            price_child,
            price_infant,
            total_price: totalPrice
        };
    },

    /**
     * Check availability
     */
    async checkAvailability(scheduleId, numParticipants) {
        const query = `
            SELECT available_slots, booked_slots
            FROM tour_schedules
            WHERE schedule_id = ?
        `;

        const [rows] = await db.execute(query, [scheduleId]);

        if (rows.length === 0) {
            return { available: false, message: 'Schedule not found' };
        }

        const { available_slots, booked_slots } = rows[0];
        const remaining = available_slots - booked_slots;

        if (remaining >= numParticipants) {
            return { available: true, remaining_slots: remaining };
        } else {
            return { available: false, message: 'Not enough slots available', remaining_slots: remaining };
        }
    }
};

module.exports = Booking;
