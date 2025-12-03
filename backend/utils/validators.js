const { body, query, param, validationResult } = require('express-validator');

/**
 * Validation Rules
 */

// User Registration Validation
const registerValidation = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('full_name')
        .trim()
        .notEmpty()
        .withMessage('Full name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Full name must be between 2 and 100 characters'),
    body('phone')
        .optional()
        .matches(/^[0-9]{10,11}$/)
        .withMessage('Phone number must be 10-11 digits')
];

// User Login Validation
const loginValidation = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

// Booking Creation Validation
const bookingValidation = [
    body('tour_id')
        .isInt({ min: 1 })
        .withMessage('Valid tour ID is required'),
    body('schedule_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Schedule ID must be a valid integer'),
    body('num_adults')
        .isInt({ min: 1 })
        .withMessage('At least one adult is required'),
    body('num_children')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Number of children must be 0 or greater'),
    body('num_infants')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Number of infants must be 0 or greater'),
    body('contact_name')
        .trim()
        .notEmpty()
        .withMessage('Contact name is required'),
    body('contact_email')
        .isEmail()
        .withMessage('Valid contact email is required')
        .normalizeEmail(),
    body('contact_phone')
        .matches(/^[0-9]{10,11}$/)
        .withMessage('Contact phone must be 10-11 digits'),
    body('payment_method')
        .optional()
        .isIn(['bank_transfer', 'bank_card', 'momo', 'apple_pay', 'credit_card', 'cash', 'other'])
        .withMessage('Invalid payment method')
];

// Review Creation Validation
const reviewValidation = [
    body('tour_id')
        .isInt({ min: 1 })
        .withMessage('Valid tour ID is required'),
    body('rating')
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be between 1 and 5'),
    body('title')
        .optional()
        .trim()
        .isLength({ max: 255 })
        .withMessage('Title must not exceed 255 characters'),
    body('comment')
        .optional()
        .trim()
        .isLength({ max: 5000 })
        .withMessage('Comment must not exceed 5000 characters'),
    body('rating_service')
        .optional()
        .isInt({ min: 1, max: 5 })
        .withMessage('Service rating must be between 1 and 5'),
    body('rating_location')
        .optional()
        .isInt({ min: 1, max: 5 })
        .withMessage('Location rating must be between 1 and 5'),
    body('rating_price')
        .optional()
        .isInt({ min: 1, max: 5 })
        .withMessage('Price rating must be between 1 and 5'),
    body('rating_food')
        .optional()
        .isInt({ min: 1, max: 5 })
        .withMessage('Food rating must be between 1 and 5')
];

// Tour Query Validation
const tourQueryValidation = [
    query('destination_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Destination ID must be a valid integer'),
    query('min_price')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Minimum price must be a positive number'),
    query('max_price')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Maximum price must be a positive number'),
    query('sort_by')
        .optional()
        .isIn([
            'id_asc',
            'id_desc',
            'price_asc',
            'price_desc',
            'rating',
            'rating_asc',
            'rating_desc',
            'popular',
            'newest'
        ])
        .withMessage('Invalid sort option'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer')
];

// Create Tour Validation (admin)
const createTourValidation = [
    body('destination_id')
        .isInt({ min: 1 })
        .withMessage('destination_id must be a valid integer'),
    body('title')
        .trim()
        .notEmpty()
        .withMessage('title is required')
        .isLength({ max: 255 })
        .withMessage('title must not exceed 255 characters'),
    body('slug')
        .trim()
        .notEmpty()
        .withMessage('slug is required')
        .isLength({ max: 255 })
        .withMessage('slug must not exceed 255 characters'),
    body('itinerary')
        .optional()
        .isString()
        .withMessage('itinerary must be a string'),
    body('price_adult')
        .isFloat({ min: 0 })
        .withMessage('price_adult must be a positive number'),
    body('duration_days')
        .optional()
        .isInt({ min: 1 })
        .withMessage('duration_days must be at least 1'),
    body('duration_nights')
        .optional()
        .isInt({ min: 0 })
        .withMessage('duration_nights must be 0 or greater'),
    body('image_gallery')
        .optional()
        .isArray()
        .withMessage('image_gallery must be an array'),
    body('inclusions')
        .optional()
        .isArray()
        .withMessage('inclusions must be an array'),
    body('exclusions')
        .optional()
        .isArray()
        .withMessage('exclusions must be an array'),
    body('categories')
        .optional()
        .isArray()
        .withMessage('categories must be an array of category IDs'),
    body('categories.*')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Each category_id must be a valid integer'),
    body('schedules')
        .optional()
        .isArray()
        .withMessage('schedules must be an array'),
    body('schedules.*.departure_date')
        .optional()
        .isISO8601()
        .withMessage('departure_date must be a valid date'),
    body('schedules.*.return_date')
        .optional()
        .isISO8601()
        .withMessage('return_date must be a valid date'),
    body('schedules.*.available_slots')
        .optional()
        .isInt({ min: 1 })
        .withMessage('available_slots must be at least 1'),
    body('schedules.*.price_adult')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('price_adult must be a positive number for schedules'),
    body('schedules.*.price_child')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('price_child must be a positive number for schedules')
];

/**
 * Middleware to check validation results
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.path || err.param,
                message: err.msg
            }))
        });
    }
    
    next();
};

module.exports = {
    registerValidation,
    loginValidation,
    bookingValidation,
    reviewValidation,
    tourQueryValidation,
    createTourValidation,
    validate
};
