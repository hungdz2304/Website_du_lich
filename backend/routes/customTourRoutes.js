const express = require('express');
const router = express.Router();
const customTourController = require('../controllers/customTourController');

/**
 * @route   POST /api/custom-tours/estimate
 * @desc    Build custom tour plan by budget
 * @access  Public
 */
router.post('/estimate', customTourController.estimate);

module.exports = router;
