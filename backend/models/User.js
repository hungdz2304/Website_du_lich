const db = require('../config/database');
const bcrypt = require('bcryptjs');

const User = {
    /**
     * Create a new user
     */
    async create(userData) {
        const { email, password, full_name, phone, date_of_birth, gender, address } = userData;
        
        // Hash password
        const password_hash = await bcrypt.hash(password, 10);
        
        const query = `
            INSERT INTO users (email, password_hash, full_name, phone, date_of_birth, gender, address)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        const [result] = await db.execute(query, [
            email,
            password_hash,
            full_name,
            phone || null,
            date_of_birth || null,
            gender || null,
            address || null
        ]);
        
        return result.insertId;
    },

    /**
     * Find user by email
     */
    async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await db.execute(query, [email]);
        return rows[0];
    },

    /**
     * Find user by ID
     */
    async findById(userId) {
        const query = 'SELECT user_id, email, full_name, phone, date_of_birth, gender, address, avatar_url, role, is_verified, created_at FROM users WHERE user_id = ?';
        const [rows] = await db.execute(query, [userId]);
        return rows[0];
    },

    /**
     * Verify password
     */
    async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    },

    /**
     * Update user profile
     */
    async update(userId, updateData = {}) {
        const allowedFields = ['full_name', 'phone', 'date_of_birth', 'gender', 'address', 'avatar_url'];
        const setClauses = [];
        const params = [];

        allowedFields.forEach(field => {
            if (Object.prototype.hasOwnProperty.call(updateData, field)) {
                setClauses.push(`${field} = ?`);
                params.push(updateData[field] ?? null);
            }
        });

        if (setClauses.length === 0) {
            return false;
        }

        setClauses.push('updated_at = CURRENT_TIMESTAMP');

        const query = `
            UPDATE users 
            SET ${setClauses.join(', ')}
            WHERE user_id = ?
        `;

        params.push(userId);

        const [result] = await db.execute(query, params);
        
        return result.affectedRows > 0;
    },

    /**
     * Update last login time
     */
    async updateLastLogin(userId) {
        const query = 'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = ?';
        await db.execute(query, [userId]);
    },

    /**
     * Check if email exists
     */
    async emailExists(email) {
        const query = 'SELECT COUNT(*) as count FROM users WHERE email = ?';
        const [rows] = await db.execute(query, [email]);
        return rows[0].count > 0;
    },

    /**
     * Verify user account
     */
    async verifyAccount(userId) {
        const query = 'UPDATE users SET is_verified = TRUE WHERE user_id = ?';
        const [result] = await db.execute(query, [userId]);
        return result.affectedRows > 0;
    }
};

module.exports = User;
