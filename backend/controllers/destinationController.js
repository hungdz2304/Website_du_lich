const Destination = require('../models/Destination');

const destinationController = {
    /**
     * Get all destinations
     * GET /api/destinations
     */
    async getAllDestinations(req, res) {
        try {
            const destinations = await Destination.getAll();

            res.json({
                success: true,
                data: destinations
            });
        } catch (error) {
            console.error('Get destinations error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get destinations',
                error: error.message
            });
        }
    },

    /**
     * Get featured destinations
     * GET /api/destinations/featured
     */
    async getFeaturedDestinations(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 6;
            const destinations = await Destination.getFeatured(limit);

            res.json({
                success: true,
                data: destinations
            });
        } catch (error) {
            console.error('Get featured destinations error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get featured destinations',
                error: error.message
            });
        }
    },

    /**
     * Get destination by ID
     * GET /api/destinations/:id
     */
    async getDestinationById(req, res) {
        try {
            const destinationId = req.params.id;
            const destination = await Destination.getById(destinationId);

            if (!destination) {
                return res.status(404).json({
                    success: false,
                    message: 'Destination not found'
                });
            }

            res.json({
                success: true,
                data: destination
            });
        } catch (error) {
            console.error('Get destination error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get destination',
                error: error.message
            });
        }
    },

    /**
     * Get destination by slug
     * GET /api/destinations/slug/:slug
     */
    async getDestinationBySlug(req, res) {
        try {
            const slug = req.params.slug;
            const destination = await Destination.getBySlug(slug);

            if (!destination) {
                return res.status(404).json({
                    success: false,
                    message: 'Destination not found'
                });
            }

            res.json({
                success: true,
                data: destination
            });
        } catch (error) {
            console.error('Get destination by slug error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get destination',
                error: error.message
            });
        }
    }
};

module.exports = destinationController;
