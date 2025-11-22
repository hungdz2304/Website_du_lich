const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');
const db = require('../config/database');

/**
 * @route   GET /api/admin/stats
 * @desc    Get admin dashboard statistics
 * @access  Admin only
 */
router.get('/stats', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const [bookingStats] = await db.execute(`
            SELECT 
                COUNT(*) as total_bookings,
                SUM(CASE WHEN payment_status = 'paid' THEN final_price ELSE 0 END) as total_revenue,
                COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_bookings,
                COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_bookings
            FROM bookings
        `);

        const [userStats] = await db.execute(`
            SELECT 
                COUNT(*) as total_users,
                COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_count,
                COUNT(CASE WHEN role = 'customer' THEN 1 END) as customer_count
            FROM users
        `);

        const [tourStats] = await db.execute(`
            SELECT COUNT(*) as total_tours FROM tours WHERE status = 'active'
        `);

        res.json({
            success: true,
            data: {
                bookings: bookingStats[0],
                users: userStats[0],
                tours: tourStats[0]
            }
        });
    } catch (error) {
        console.error('Get admin stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get statistics',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/admin/bookings
 * @desc    Get all bookings (admin)
 * @access  Admin only
 */
router.get('/bookings', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * limit;

        const [bookings] = await db.query(`
            SELECT 
                b.*,
                t.title as tour_title,
                u.full_name as customer_name,
                u.email as customer_email
            FROM bookings b
            JOIN tours t ON b.tour_id = t.tour_id
            JOIN users u ON b.user_id = u.user_id
            ORDER BY b.booking_date DESC
            LIMIT ${limit} OFFSET ${offset}
        `);

        const [total] = await db.execute('SELECT COUNT(*) as count FROM bookings');

        res.json({
            success: true,
            data: {
                bookings,
                pagination: {
                    total: total[0].count,
                    page,
                    limit,
                    total_pages: Math.ceil(total[0].count / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get all bookings error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get bookings',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/admin/users
 * @desc    Get all users (admin)
 * @access  Admin only
 */
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const [users] = await db.execute(`
            SELECT 
                user_id, email, full_name, phone, role, 
                gender, date_of_birth, address, avatar_url,
                created_at, last_login
            FROM users
            ORDER BY created_at DESC
        `);

        res.json({
            success: true,
            data: users
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get users',
            error: error.message
        });
    }
});

module.exports = router;
