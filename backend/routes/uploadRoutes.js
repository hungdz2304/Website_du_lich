const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { authMiddleware } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

/**
 * @route   POST /api/upload/avatar
 * @desc    Upload user avatar
 * @access  Private
 */
router.post('/avatar', authMiddleware, upload.single('avatar'), uploadController.uploadAvatar);

/**
 * @route   POST /api/upload/review-images
 * @desc    Upload review images (multiple)
 * @access  Private
 */
router.post('/review-images', authMiddleware, upload.array('images', 5), uploadController.uploadReviewImages);

/**
 * @route   POST /api/upload/tour-image
 * @desc    Upload tour image (admin only)
 * @access  Private (Admin)
 */
router.post('/tour-image', authMiddleware, upload.single('image'), uploadController.uploadTourImage);

module.exports = router;
