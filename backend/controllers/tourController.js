const Tour = require('../models/Tour');
const Review = require('../models/Review');

const tourController = {
    /**
     * Create new tour (admin)
     * POST /api/tours
     */
    async createTour(req, res) {
        try {
            const tourData = {
                destination_id: req.body.destination_id,
                title: req.body.title,
                slug: req.body.slug,
                description: req.body.description || '',
                itinerary: req.body.itinerary || '',
                duration_days: req.body.duration_days || 1,
                duration_nights: req.body.duration_nights || 0,
                price_adult: req.body.price_adult,
                price_child: req.body.price_child || 0,
                price_infant: req.body.price_infant || 0,
                original_price: req.body.original_price || null,
                discount_percentage: req.body.discount_percentage || 0,
                cover_image_url: req.body.cover_image_url || null,
                image_gallery: req.body.image_gallery || [],
                departure_location: req.body.departure_location || null,
                transportation: req.body.transportation || null,
                hotel_rating: req.body.hotel_rating || null,
                max_participants: req.body.max_participants || null,
                min_participants: req.body.min_participants || 1,
                inclusions: req.body.inclusions || [],
                exclusions: req.body.exclusions || [],
                is_featured: req.body.is_featured ?? false,
                is_active: req.body.is_active ?? true,
                status: req.body.status || 'active',
                meta_title: req.body.meta_title || null,
                meta_description: req.body.meta_description || null,
                meta_keywords: req.body.meta_keywords || null,
                categories: req.body.categories || [],
                schedules: req.body.schedules || []
            };

            const tourId = await Tour.create(tourData);
            const created = await Tour.getById(tourId);

            res.status(201).json({
                success: true,
                message: 'Tour created successfully',
                data: created
            });
        } catch (error) {
            console.error('Create tour error:', error);

            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({
                    success: false,
                    message: 'Slug already exists, please use a different slug'
                });
            }

            res.status(500).json({
                success: false,
                message: 'Failed to create tour',
                error: error.message
            });
        }
    },
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

            // Increment view count (skip when increment=false for admin)
            if (req.query.increment !== 'false') {
                await Tour.incrementViewCount(tourId);
            }

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
     * Update tour (admin)
     * PUT /api/tours/:id
     */
    async updateTour(req, res) {
        try {
            const tourId = req.params.id;
            const data = {
                destination_id: req.body.destination_id,
                title: req.body.title,
                slug: req.body.slug,
                description: req.body.description || '',
                itinerary: req.body.itinerary || '',
                duration_days: req.body.duration_days || 1,
                duration_nights: req.body.duration_nights || 0,
                price_adult: req.body.price_adult,
                price_child: req.body.price_child || 0,
                price_infant: req.body.price_infant || 0,
                original_price: req.body.original_price || null,
                discount_percentage: req.body.discount_percentage || 0,
                cover_image_url: req.body.cover_image_url || null,
                image_gallery: req.body.image_gallery || [],
                departure_location: req.body.departure_location || null,
                transportation: req.body.transportation || null,
                hotel_rating: req.body.hotel_rating || null,
                max_participants: req.body.max_participants || null,
                min_participants: req.body.min_participants || 1,
                inclusions: req.body.inclusions || [],
                exclusions: req.body.exclusions || [],
                is_featured: req.body.is_featured ?? false,
                is_active: req.body.is_active ?? true,
                status: req.body.status || 'active',
                meta_title: req.body.meta_title || null,
                meta_description: req.body.meta_description || null,
                meta_keywords: req.body.meta_keywords || null
            };

            const updated = await Tour.update(tourId, data);
            if (!updated) {
                return res.status(404).json({ success: false, message: 'Tour not found' });
            }

            const tour = await Tour.getById(tourId);
            res.json({ success: true, message: 'Tour updated successfully', data: tour });
        } catch (error) {
            console.error('Update tour error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update tour',
                error: error.message
            });
        }
    },

    /**
     * Delete tour (admin)
     * DELETE /api/tours/:id
     */
    async deleteTour(req, res) {
        try {
            const tourId = req.params.id;
            const deleted = await Tour.delete(tourId);

            if (!deleted) {
                return res.status(404).json({ success: false, message: 'Tour not found' });
            }

            res.json({ success: true, message: 'Tour deleted successfully' });
        } catch (error) {
            console.error('Delete tour error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete tour',
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
