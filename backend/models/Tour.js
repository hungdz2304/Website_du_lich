const db = require('../config/database');

const buildCategorySubquery = () => `(
    SELECT GROUP_CONCAT(DISTINCT c.name)
    FROM tour_categories tc
    JOIN categories c ON tc.category_id = c.category_id
    WHERE tc.tour_id = t.tour_id
)`;

const parseJsonArray = value => {
    if (!value) return [];
    try {
        const parsed = typeof value === 'string' ? JSON.parse(value) : value;
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        return [];
    }
};

const mapTourRow = tour => ({
    ...tour,
    image_gallery: parseJsonArray(tour.image_gallery),
    inclusions: parseJsonArray(tour.inclusions),
    exclusions: parseJsonArray(tour.exclusions)
});

const Tour = {
    async getAll(filters = {}) {
        let query = `
            SELECT 
                t.*,
                d.name as destination_name,
                d.slug as destination_slug,
                ${buildCategorySubquery()} as categories
            FROM tours t
            LEFT JOIN destinations d ON t.destination_id = d.destination_id
            WHERE t.is_active = TRUE
        `;

        const params = [];

        if (filters.destination_id) {
            query += ' AND t.destination_id = ?';
            params.push(filters.destination_id);
        }

        if (filters.category_id) {
            query += ` AND EXISTS (
                SELECT 1 FROM tour_categories tc
                WHERE tc.tour_id = t.tour_id AND tc.category_id = ?
            )`;
            params.push(filters.category_id);
        }

        if (filters.min_price) {
            query += ' AND t.price_adult >= ?';
            params.push(filters.min_price);
        }

        if (filters.max_price) {
            query += ' AND t.price_adult <= ?';
            params.push(filters.max_price);
        }

        if (filters.search) {
            query += ' AND (t.title LIKE ? OR t.description LIKE ?)';
            const searchTerm = `%${filters.search}%`;
            params.push(searchTerm, searchTerm);
        }

        if (filters.sort_by) {
            switch (filters.sort_by) {
                case 'price_asc':
                    query += ' ORDER BY t.price_adult ASC';
                    break;
                case 'price_desc':
                    query += ' ORDER BY t.price_adult DESC';
                    break;
                case 'rating':
                    query += ' ORDER BY t.rating_average DESC';
                    break;
                case 'popular':
                    query += ' ORDER BY t.booking_count DESC';
                    break;
                case 'newest':
                    query += ' ORDER BY t.created_at DESC';
                    break;
                default:
                    query += ' ORDER BY t.created_at DESC';
            }
        } else {
            query += ' ORDER BY t.created_at DESC';
        }

        const limit = filters.limit || 12;
        const page = filters.page || 1;
        const offset = (page - 1) * limit;
        const safeLimit = Math.min(100, Math.max(1, Number(limit) || 12));
        const safeOffset = Math.max(0, Number(offset) || 0);

        query += ` LIMIT ${safeLimit} OFFSET ${safeOffset}`;

        const [rows] = await db.execute(query, params);
        return rows.map(mapTourRow);
    },

    async getCount(filters = {}) {
        let query = `
            SELECT COUNT(DISTINCT t.tour_id) as total
            FROM tours t
            WHERE t.is_active = TRUE
        `;

        const params = [];

        if (filters.destination_id) {
            query += ' AND t.destination_id = ?';
            params.push(filters.destination_id);
        }

        if (filters.category_id) {
            query += ` AND EXISTS (
                SELECT 1 FROM tour_categories tc
                WHERE tc.tour_id = t.tour_id AND tc.category_id = ?
            )`;
            params.push(filters.category_id);
        }

        if (filters.min_price) {
            query += ' AND t.price_adult >= ?';
            params.push(filters.min_price);
        }

        if (filters.max_price) {
            query += ' AND t.price_adult <= ?';
            params.push(filters.max_price);
        }

        if (filters.search) {
            query += ' AND (t.title LIKE ? OR t.description LIKE ?)';
            const searchTerm = `%${filters.search}%`;
            params.push(searchTerm, searchTerm);
        }

        const [rows] = await db.execute(query, params);
        return rows[0].total;
    },

    async getFeatured(limit = 8) {
        const safeLimit = Math.max(1, parseInt(limit, 10) || 8);
        const query = `
            SELECT 
                t.*,
                d.name as destination_name,
                d.slug as destination_slug,
                ${buildCategorySubquery()} as categories
            FROM tours t
            LEFT JOIN destinations d ON t.destination_id = d.destination_id
            WHERE t.is_featured = TRUE AND t.is_active = TRUE AND t.status = 'active'
            ORDER BY t.booking_count DESC, t.rating_average DESC
            LIMIT ${safeLimit}
        `;

        const [rows] = await db.execute(query);
        return rows.map(mapTourRow);
    },

    async getById(tourId) {
        const query = `
            SELECT 
                t.*,
                d.name as destination_name,
                d.slug as destination_slug,
                d.country,
                d.region,
                ${buildCategorySubquery()} as categories
            FROM tours t
            LEFT JOIN destinations d ON t.destination_id = d.destination_id
            WHERE t.tour_id = ?
        `;

        const [rows] = await db.execute(query, [tourId]);
        if (rows.length === 0) return null;
        return mapTourRow(rows[0]);
    },

    async getBySlug(slug) {
        const query = `
            SELECT 
                t.*,
                d.name as destination_name,
                d.slug as destination_slug,
                d.country,
                d.region,
                ${buildCategorySubquery()} as categories
            FROM tours t
            LEFT JOIN destinations d ON t.destination_id = d.destination_id
            WHERE t.slug = ?
        `;

        const [rows] = await db.execute(query, [slug]);
        if (rows.length === 0) return null;
        return mapTourRow(rows[0]);
    },

    async getSchedules(tourId) {
        const query = `
            SELECT *
            FROM tour_schedules
            WHERE tour_id = ? AND departure_date >= CURDATE() AND status = 'available'
            ORDER BY departure_date ASC
        `;

        const [rows] = await db.execute(query, [tourId]);
        return rows;
    },

    async incrementViewCount(tourId) {
        const query = 'UPDATE tours SET view_count = view_count + 1 WHERE tour_id = ?';
        await db.execute(query, [tourId]);
    },

    async getRelated(tourId, limit = 4) {
        const safeLimit = Math.min(12, Math.max(1, Number(limit) || 4));
        const query = `
            SELECT DISTINCT
                t.*,
                d.name as destination_name,
                ${buildCategorySubquery()} as categories
            FROM tours t
            LEFT JOIN destinations d ON t.destination_id = d.destination_id
            LEFT JOIN tour_categories tc ON t.tour_id = tc.tour_id
            WHERE t.tour_id != ? 
            AND t.is_active = TRUE
            AND (
                t.destination_id = (SELECT destination_id FROM tours WHERE tour_id = ?)
                OR tc.category_id IN (SELECT category_id FROM tour_categories WHERE tour_id = ?)
            )
            ORDER BY t.rating_average DESC, t.booking_count DESC
            LIMIT ${safeLimit}
        `;

        const [rows] = await db.execute(query, [tourId, tourId, tourId]);
        return rows.map(mapTourRow);
    }
};

module.exports = Tour;
