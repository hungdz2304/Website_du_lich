const User = require('../models/User');
const jwt = require('jsonwebtoken');

const authController = {
    /**
     * Register a new user
     * POST /api/auth/register
     */
    async register(req, res) {
        try {
            const { email, password, full_name, phone, date_of_birth, gender, address } = req.body;

            // Check if email already exists
            const emailExists = await User.emailExists(email);
            if (emailExists) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already registered'
                });
            }

            // Create new user
            const userId = await User.create({
                email,
                password,
                full_name,
                phone,
                date_of_birth,
                gender,
                address
            });

            // Generate JWT token
            const token = jwt.sign(
                { userId, email, role: 'customer' },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
            );

            res.status(201).json({
                success: true,
                message: 'Registration successful',
                data: {
                    userId,
                    email,
                    full_name,
                    token
                }
            });
        } catch (error) {
            console.error('Register error:', error);
            res.status(500).json({
                success: false,
                message: 'Registration failed',
                error: error.message
            });
        }
    },

    /**
     * Login user
     * POST /api/auth/login
     */
    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Find user by email
            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

            // Verify password
            const isPasswordValid = await User.verifyPassword(password, user.password_hash);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

            // Update last login
            await User.updateLastLogin(user.user_id);

            // Generate JWT token
            const token = jwt.sign(
                { userId: user.user_id, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
            );

            res.json({
                success: true,
                message: 'Login successful',
                data: {
                    user_id: user.user_id,
                    userId: user.user_id, // backward compatibility
                    email: user.email,
                    full_name: user.full_name,
                    phone: user.phone,
                    role: user.role,
                    avatar_url: user.avatar_url,
                    token
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'Login failed',
                error: error.message
            });
        }
    },

    /**
     * Get current user profile
     * GET /api/auth/profile
     */
    async getProfile(req, res) {
        try {
            const userId = req.user.userId;

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.json({
                success: true,
                data: user
            });
        } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get profile',
                error: error.message
            });
        }
    },

    /**
     * Update user profile
     * PUT /api/auth/profile
     */
    async updateProfile(req, res) {
        try {
            const userId = req.user.userId;
            const { full_name, phone, date_of_birth, gender, address, avatar_url } = req.body;

            const updated = await User.update(userId, {
                full_name,
                phone,
                date_of_birth,
                gender,
                address,
                avatar_url
            });

            if (!updated) {
                return res.status(400).json({
                    success: false,
                    message: 'Failed to update profile'
                });
            }

            const user = await User.findById(userId);

            res.json({
                success: true,
                message: 'Profile updated successfully',
                data: user
            });
        } catch (error) {
            console.error('Update profile error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update profile',
                error: error.message
            });
        }
    }
};

module.exports = authController;
