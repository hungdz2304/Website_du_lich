const Review = require('../models/Review');
const Booking = require('../models/Booking');

const reviewController = {
    /**
     * Create a new review
     * POST /api/reviews
     */
    async createReview(req, res) {
        try {
            const userId = req.user.userId;
            const {
                tour_id,
                booking_id,
                rating,
                title,
                comment,
                rating_service,
                rating_location,
                rating_price,
                rating_food
            } = req.body;

            // Check if user has already reviewed this tour
            const hasReviewed = await Review.hasUserReviewed(userId, tour_id);
            if (hasReviewed) {
                return res.status(400).json({
                    success: false,
                    message: 'Bạn đã đánh giá tour này rồi'
                });
            }

            // If booking_id provided, verify booking belongs to user
            if (booking_id) {
                const booking = await Booking.getById(booking_id);
                if (!booking || booking.user_id !== userId) {
                    return res.status(403).json({
                        success: false,
                        message: 'Booking không hợp lệ'
                    });
                }

                // Check if booking is completed
                if (booking.status !== 'completed') {
                    return res.status(400).json({
                        success: false,
                        message: 'Chỉ có thể đánh giá tour đã hoàn thành'
                    });
                }
            }

            const reviewId = await Review.create({
                tour_id,
                user_id: userId,
                booking_id,
                rating,
                title,
                comment,
                rating_service,
                rating_location,
                rating_price,
                rating_food
            });

            res.status(201).json({
                success: true,
                message: 'Đánh giá thành công',
                data: { review_id: reviewId }
            });
        } catch (error) {
            console.error('Create review error:', error);
            res.status(500).json({
                success: false,
                message: 'Không thể tạo đánh giá',
                error: error.message
            });
        }
    },

    /**
     * Get user's reviews
     * GET /api/reviews/my-reviews
     */
    async getMyReviews(req, res) {
        try {
            const userId = req.user.userId;
            const reviews = await Review.getUserReviews(userId);

            res.json({
                success: true,
                data: reviews
            });
        } catch (error) {
            console.error('Get my reviews error:', error);
            res.status(500).json({
                success: false,
                message: 'Không thể lấy danh sách đánh giá',
                error: error.message
            });
        }
    },

    /**
     * Update review
     * PUT /api/reviews/:id
     */
    async updateReview(req, res) {
        try {
            const reviewId = req.params.id;
            const userId = req.user.userId;
            const {
                rating,
                title,
                comment,
                rating_service,
                rating_location,
                rating_price,
                rating_food
            } = req.body;

            const updated = await Review.update(reviewId, userId, {
                rating,
                title,
                comment,
                rating_service,
                rating_location,
                rating_price,
                rating_food
            });

            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy đánh giá hoặc không có quyền chỉnh sửa'
                });
            }

            res.json({
                success: true,
                message: 'Cập nhật đánh giá thành công'
            });
        } catch (error) {
            console.error('Update review error:', error);
            res.status(500).json({
                success: false,
                message: 'Không thể cập nhật đánh giá',
                error: error.message
            });
        }
    },

    /**
     * Delete review
     * DELETE /api/reviews/:id
     */
    async deleteReview(req, res) {
        try {
            const reviewId = req.params.id;
            const userId = req.user.userId;

            const deleted = await Review.delete(reviewId, userId);

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy đánh giá hoặc không có quyền xóa'
                });
            }

            res.json({
                success: true,
                message: 'Xóa đánh giá thành công'
            });
        } catch (error) {
            console.error('Delete review error:', error);
            res.status(500).json({
                success: false,
                message: 'Không thể xóa đánh giá',
                error: error.message
            });
        }
    },

    /**
     * Mark review as helpful
     * POST /api/reviews/:id/helpful
     */
    async markHelpful(req, res) {
        try {
            const reviewId = req.params.id;
            await Review.incrementHelpful(reviewId);

            res.json({
                success: true,
                message: 'Cảm ơn phản hồi của bạn'
            });
        } catch (error) {
            console.error('Mark helpful error:', error);
            res.status(500).json({
                success: false,
                message: 'Không thể xử lý yêu cầu',
                error: error.message
            });
        }
    }
};

module.exports = reviewController;
