const Tour = require('../models/Tour');
const Review = require('../models/Review');

const tourController = {
    /**
     * Get all tours with filters
     * GET /api/tours
     */
    async getAllTours(req, res) {
        try {
            const filters = {
                destination_id: req.query.destination_id,
                category_id: req.query.category_id,
                min_price: req.query.min_price,
                max_price: req.query.max_price,
                search: req.query.search,
                sort_by: req.query.sort_by,
                limit: parseInt(req.query.limit) || 12,
                page: parseInt(req.query.page) || 1
            };

            const [tours, total] = await Promise.all([
                Tour.getAll(filters),
                Tour.getCount(filters)
            ]);

            const totalPages = Math.ceil(total / filters.limit);

            res.json({
                success: true,
                data: {
                    tours,
                    pagination: {
                        current_page: filters.page,
                        total_pages: totalPages,
                        total_items: total,
                        items_per_page: filters.limit
                    }
                }
            });
        } catch (error) {
            console.error('Get tours error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get tours',
                error: error.message
            });
        }
    },

    /**
     * Get featured tours
     * GET /api/tours/featured
     */
    async getFeaturedTours(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 8;
            const tours = await Tour.getFeatured(limit);

            res.json({
                success: true,
                data: tours
            });
        } catch (error) {
            console.error('Get featured tours error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get featured tours',
                error: error.message
            });
        }
    },

    /**
     * Get tour by ID
     * GET /api/tours/:id
     */
    async getTourById(req, res) {
        try {
            const tourId = req.params.id;

            // Increment view count
            await Tour.incrementViewCount(tourId);

            // Get tour details
            const tour = await Tour.getById(tourId);

            if (!tour) {
                return res.status(404).json({
                    success: false,
                    message: 'Tour not found'
                });
            }

            // Get available schedules
            const schedules = await Tour.getSchedules(tourId);

            // Get reviews
            const [reviews, reviewStats] = await Promise.all([
                Review.getByTourId(tourId, 5, 0),
                Review.getAverageRating(tourId)
            ]);

            // Get related tours
            const relatedTours = await Tour.getRelated(tourId, 4);

            res.json({
                success: true,
                data: {
                    tour,
                    schedules,
                    reviews: {
                        items: reviews,
                        stats: reviewStats
                    },
                    related_tours: relatedTours
                }
            });
        } catch (error) {
            console.error('Get tour error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get tour details',
                error: error.message
            });
        }
    },

    /**
     * Get tour by slug
     * GET /api/tours/slug/:slug
     */
    async getTourBySlug(req, res) {
        try {
            const slug = req.params.slug;

            const tour = await Tour.getBySlug(slug);

            if (!tour) {
                return res.status(404).json({
                    success: false,
                    message: 'Tour not found'
                });
            }

            // Increment view count
            await Tour.incrementViewCount(tour.tour_id);

            // Get available schedules
            const schedules = await Tour.getSchedules(tour.tour_id);

            // Get reviews
            const [reviews, reviewStats] = await Promise.all([
                Review.getByTourId(tour.tour_id, 5, 0),
                Review.getAverageRating(tour.tour_id)
            ]);

            // Get related tours
            const relatedTours = await Tour.getRelated(tour.tour_id, 4);

            res.json({
                success: true,
                data: {
                    tour,
                    schedules,
                    reviews: {
                        items: reviews,
                        stats: reviewStats
                    },
                    related_tours: relatedTours
                }
            });
        } catch (error) {
            console.error('Get tour by slug error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get tour details',
                error: error.message
            });
        }
    },

    /**
     * Get tour reviews
     * GET /api/tours/:id/reviews
     */
    async getTourReviews(req, res) {
        try {
            const tourId = req.params.id;
            const limit = parseInt(req.query.limit) || 10;
            const page = parseInt(req.query.page) || 1;
            const offset = (page - 1) * limit;

            const [reviews, total, stats, distribution] = await Promise.all([
                Review.getByTourId(tourId, limit, offset),
                Review.getCountByTourId(tourId),
                Review.getAverageRating(tourId),
                Review.getRatingDistribution(tourId)
            ]);

            const totalPages = Math.ceil(total / limit);

            res.json({
                success: true,
                data: {
                    reviews,
                    stats,
                    distribution,
                    pagination: {
                        current_page: page,
                        total_pages: totalPages,
                        total_items: total,
                        items_per_page: limit
                    }
                }
            });
        } catch (error) {
            console.error('Get tour reviews error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get tour reviews',
                error: error.message
            });
        }
    }
};

module.exports = tourController;
