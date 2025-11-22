const User = require('../models/User');
const path = require('path');

const uploadController = {
    /**
     * Upload user avatar
     * POST /api/upload/avatar
     */
    async uploadAvatar(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng chọn file ảnh'
                });
            }

            const userId = req.user.userId;
            const avatarUrl = `/uploads/${req.file.filename}`;

            // Update user avatar in database
            await User.update(userId, { avatar_url: avatarUrl });

            res.json({
                success: true,
                message: 'Upload avatar thành công',
                data: {
                    avatar_url: avatarUrl,
                    full_url: `${req.protocol}://${req.get('host')}${avatarUrl}`
                }
            });
        } catch (error) {
            console.error('Upload avatar error:', error);
            res.status(500).json({
                success: false,
                message: 'Không thể upload avatar',
                error: error.message
            });
        }
    },

    /**
     * Upload review images
     * POST /api/upload/review-images
     */
    async uploadReviewImages(req, res) {
        try {
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng chọn ít nhất 1 ảnh'
                });
            }

            const imageUrls = req.files.map(file => ({
                url: `/uploads/${file.filename}`,
                full_url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
            }));

            res.json({
                success: true,
                message: 'Upload ảnh thành công',
                data: {
                    images: imageUrls
                }
            });
        } catch (error) {
            console.error('Upload review images error:', error);
            res.status(500).json({
                success: false,
                message: 'Không thể upload ảnh',
                error: error.message
            });
        }
    },

    /**
     * Upload tour image (admin only)
     * POST /api/upload/tour-image
     */
    async uploadTourImage(req, res) {
        try {
            // Check admin role
            if (req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Chỉ admin mới có quyền upload ảnh tour'
                });
            }

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng chọn file ảnh'
                });
            }

            const imageUrl = `/uploads/${req.file.filename}`;

            res.json({
                success: true,
                message: 'Upload ảnh tour thành công',
                data: {
                    image_url: imageUrl,
                    full_url: `${req.protocol}://${req.get('host')}${imageUrl}`
                }
            });
        } catch (error) {
            console.error('Upload tour image error:', error);
            res.status(500).json({
                success: false,
                message: 'Không thể upload ảnh tour',
                error: error.message
            });
        }
    }
};

module.exports = uploadController;
