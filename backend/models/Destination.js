const db = require('../config/database');

const Destination = {
    /**
     * Get all destinations
     */
    async getAll() {
        const query = `
            SELECT 
                d.*,
                COUNT(DISTINCT t.tour_id) as tour_count
            FROM destinations d
            LEFT JOIN tours t ON d.destination_id = t.destination_id AND t.is_active = TRUE
            GROUP BY d.destination_id
            ORDER BY d.display_order ASC, d.name ASC
        `;
        
        const [rows] = await db.execute(query);
        return rows;
    },

    /**
     * Get featured destinations
     */
    async getFeatured(limit = 6) {
        const safeLimit = Math.max(1, parseInt(limit, 10) || 6);
        const query = `
            SELECT 
                d.*,
                COUNT(DISTINCT t.tour_id) as tour_count
            FROM destinations d
            LEFT JOIN tours t ON d.destination_id = t.destination_id AND t.is_active = TRUE
            WHERE d.is_featured = TRUE
            GROUP BY d.destination_id
            ORDER BY d.display_order ASC
            LIMIT ${safeLimit}
        `;
        
        const [rows] = await db.execute(query);
        return rows;
    },

    /**
     * Get destination by ID
     */
    async getById(destinationId) {
        const query = 'SELECT * FROM destinations WHERE destination_id = ?';
        const [rows] = await db.execute(query, [destinationId]);
        return rows[0];
    },

    /**
     * Get destination by slug
     */
    async getBySlug(slug) {
        const query = 'SELECT * FROM destinations WHERE slug = ?';
        const [rows] = await db.execute(query, [slug]);
        return rows[0];
    }
};

module.exports = Destination;
