const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { reviewValidation, validate } = require('../utils/validators');

/**
 * @route   POST /api/reviews
 * @desc    Create a new review
 * @access  Private
 */
router.post('/', authMiddleware, reviewValidation, validate, reviewController.createReview);

/**
 * @route   GET /api/reviews/my-reviews
 * @desc    Get user's reviews
 * @access  Private
 */
router.get('/my-reviews', authMiddleware, reviewController.getMyReviews);

/**
 * @route   PUT /api/reviews/:id
 * @desc    Update review
 * @access  Private
 */
router.put('/:id', authMiddleware, reviewValidation, validate, reviewController.updateReview);

/**
 * @route   DELETE /api/reviews/:id
 * @desc    Delete review
 * @access  Private
 */
router.delete('/:id', authMiddleware, reviewController.deleteReview);

/**
 * @route   POST /api/reviews/:id/helpful
 * @desc    Mark review as helpful
 * @access  Public
 */
router.post('/:id/helpful', reviewController.markHelpful);

module.exports = router;
