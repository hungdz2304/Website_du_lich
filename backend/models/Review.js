const db = require('../config/database');

const Review = {
    /**
     * Create a new review
     */
    async create(reviewData) {
        const {
            tour_id,
            user_id,
            booking_id,
            rating,
            title,
            comment,
            rating_service,
            rating_location,
            rating_price,
            rating_food
        } = reviewData;

        const query = `
            INSERT INTO reviews (
                tour_id, user_id, booking_id, rating, title, comment,
                rating_service, rating_location, rating_price, rating_food
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.execute(query, [
            tour_id,
            user_id,
            booking_id || null,
            rating,
            title || null,
            comment || null,
            rating_service || null,
            rating_location || null,
            rating_price || null,
            rating_food || null
        ]);

        return result.insertId;
    },

    /**
     * Get reviews for a tour
     */
    async getByTourId(tourId, limit = 10, offset = 0) {
        const safeLimit = Math.min(50, Math.max(1, Number(limit) || 10));
        const safeOffset = Math.max(0, Number(offset) || 0);

        const query = `
            SELECT 
                r.*,
                u.full_name as user_name,
                u.avatar_url as user_avatar
            FROM reviews r
            LEFT JOIN users u ON r.user_id = u.user_id
            WHERE r.tour_id = ? AND r.is_approved = TRUE
            ORDER BY r.created_at DESC
            LIMIT ${safeLimit} OFFSET ${safeOffset}
        `;

        const [rows] = await db.execute(query, [tourId]);
        
        return rows.map(review => ({
            ...review,
            images: review.images ? JSON.parse(review.images) : []
        }));
    },

    /**
     * Get review count for a tour
     */
    async getCountByTourId(tourId) {
        const query = `
            SELECT COUNT(*) as total
            FROM reviews
            WHERE tour_id = ? AND is_approved = TRUE
        `;

        const [rows] = await db.execute(query, [tourId]);
        return rows[0].total;
    },

    /**
     * Get average rating for a tour
     */
    async getAverageRating(tourId) {
        const query = `
            SELECT 
                AVG(rating) as avg_rating,
                AVG(rating_service) as avg_service,
                AVG(rating_location) as avg_location,
                AVG(rating_price) as avg_price,
                AVG(rating_food) as avg_food,
                COUNT(*) as review_count
            FROM reviews
            WHERE tour_id = ? AND is_approved = TRUE
        `;

        const [rows] = await db.execute(query, [tourId]);
        return rows[0];
    },

    /**
     * Get rating distribution
     */
    async getRatingDistribution(tourId) {
        const query = `
            SELECT 
                rating,
                COUNT(*) as count
            FROM reviews
            WHERE tour_id = ? AND is_approved = TRUE
            GROUP BY rating
            ORDER BY rating DESC
        `;

        const [rows] = await db.execute(query, [tourId]);
        return rows;
    },

    /**
     * Check if user has reviewed a tour
     */
    async hasUserReviewed(userId, tourId) {
        const query = `
            SELECT COUNT(*) as count
            FROM reviews
            WHERE user_id = ? AND tour_id = ?
        `;

        const [rows] = await db.execute(query, [userId, tourId]);
        return rows[0].count > 0;
    },

    /**
     * Get user's reviews
     */
    async getUserReviews(userId) {
        const query = `
            SELECT 
                r.*,
                t.title as tour_title,
                t.cover_image_url as tour_image
            FROM reviews r
            LEFT JOIN tours t ON r.tour_id = t.tour_id
            WHERE r.user_id = ?
            ORDER BY r.created_at DESC
        `;

        const [rows] = await db.execute(query, [userId]);
        
        return rows.map(review => ({
            ...review,
            images: review.images ? JSON.parse(review.images) : []
        }));
    },

    /**
     * Update review
     */
    async update(reviewId, userId, updateData) {
        const { rating, title, comment, rating_service, rating_location, rating_price, rating_food } = updateData;

        const query = `
            UPDATE reviews
            SET rating = ?, title = ?, comment = ?,
                rating_service = ?, rating_location = ?, rating_price = ?, rating_food = ?
            WHERE review_id = ? AND user_id = ?
        `;

        const [result] = await db.execute(query, [
            rating,
            title,
            comment,
            rating_service,
            rating_location,
            rating_price,
            rating_food,
            reviewId,
            userId
        ]);

        return result.affectedRows > 0;
    },

    /**
     * Delete review
     */
    async delete(reviewId, userId) {
        const query = 'DELETE FROM reviews WHERE review_id = ? AND user_id = ?';
        const [result] = await db.execute(query, [reviewId, userId]);
        return result.affectedRows > 0;
    },

    /**
     * Increment helpful count
     */
    async incrementHelpful(reviewId) {
        const query = 'UPDATE reviews SET helpful_count = helpful_count + 1 WHERE review_id = ?';
        await db.execute(query, [reviewId]);
    }
};

module.exports = Review;
