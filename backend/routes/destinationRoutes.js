const express = require('express');
const router = express.Router();
const destinationController = require('../controllers/destinationController');

/**
 * @route   GET /api/destinations/featured
 * @desc    Get featured destinations
 * @access  Public
 */
router.get('/featured', destinationController.getFeaturedDestinations);

/**
 * @route   GET /api/destinations/slug/:slug
 * @desc    Get destination by slug
 * @access  Public
 */
router.get('/slug/:slug', destinationController.getDestinationBySlug);

/**
 * @route   GET /api/destinations/:id
 * @desc    Get destination by ID
 * @access  Public
 */
router.get('/:id', destinationController.getDestinationById);

/**
 * @route   GET /api/destinations
 * @desc    Get all destinations
 * @access  Public
 */
router.get('/', destinationController.getAllDestinations);

module.exports = router;
