const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');
const { tourQueryValidation, validate } = require('../utils/validators');

/**
 * @route   GET /api/tours/featured
 * @desc    Get featured tours
 * @access  Public
 */
router.get('/featured', tourController.getFeaturedTours);

/**
 * @route   GET /api/tours/slug/:slug
 * @desc    Get tour by slug
 * @access  Public
 */
router.get('/slug/:slug', tourController.getTourBySlug);

/**
 * @route   GET /api/tours/:id
 * @desc    Get tour by ID
 * @access  Public
 */
router.get('/:id', tourController.getTourById);

/**
 * @route   GET /api/tours/:id/reviews
 * @desc    Get tour reviews
 * @access  Public
 */
router.get('/:id/reviews', tourController.getTourReviews);

/**
 * @route   GET /api/tours
 * @desc    Get all tours with filters
 * @access  Public
 */
router.get('/', tourQueryValidation, validate, tourController.getAllTours);

module.exports = router;
