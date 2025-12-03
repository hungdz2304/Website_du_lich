const db = require('../config/database');

const buildCategorySubquery = () => `(
    SELECT GROUP_CONCAT(DISTINCT c.name)
    FROM tour_categories tc
    JOIN categories c ON tc.category_id = c.category_id
    WHERE tc.tour_id = t.tour_id
)`;

const buildCategoryIdsSubquery = () => `(
    SELECT GROUP_CONCAT(DISTINCT tc.category_id)
    FROM tour_categories tc
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
    exclusions: parseJsonArray(tour.exclusions),
    category_ids: (tour.category_ids || '')
        .split(',')
        .map(id => parseInt(id, 10))
        .filter(id => !Number.isNaN(id))
});

const Tour = {
    async create(data) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const {
                destination_id,
                title,
                slug,
                description = '',
                itinerary = '',
                duration_days = 1,
                duration_nights = 0,
                price_adult,
                price_child = 0,
                price_infant = 0,
                original_price = null,
                discount_percentage = 0,
                cover_image_url = null,
                image_gallery = [],
                departure_location = null,
                transportation = null,
                hotel_rating = null,
                max_participants = null,
                min_participants = 1,
                inclusions = [],
                exclusions = [],
                is_featured = false,
                is_active = true,
                status = 'active',
                meta_title = null,
                meta_description = null,
                meta_keywords = null,
                categories = [],
                schedules = []
            } = data;

            const [result] = await connection.execute(
                `
                INSERT INTO tours (
                    destination_id, title, slug, description, itinerary,
                    duration_days, duration_nights,
                    price_adult, price_child, price_infant, original_price, discount_percentage,
                    cover_image_url, image_gallery,
                    departure_location, transportation, hotel_rating,
                    max_participants, min_participants,
                    inclusions, exclusions,
                    is_featured, is_active, status,
                    meta_title, meta_description, meta_keywords
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [
                    destination_id,
                    title,
                    slug,
                    description,
                    itinerary,
                    duration_days,
                    duration_nights,
                    price_adult,
                    price_child,
                    price_infant,
                    original_price,
                    discount_percentage,
                    cover_image_url,
                    JSON.stringify(image_gallery || []),
                    departure_location,
                    transportation,
                    hotel_rating,
                max_participants,
                min_participants,
                JSON.stringify(inclusions || []),
                JSON.stringify(exclusions || []),
                is_featured ? 1 : 0,
                    is_active ? 1 : 0,
                    status,
                    meta_title,
                    meta_description,
                    meta_keywords
                ]
            );

            const tourId = result.insertId;

            if (categories && Array.isArray(categories) && categories.length > 0) {
                const categoryValues = categories.map(catId => [tourId, catId]);
                await connection.query(
                    'INSERT INTO tour_categories (tour_id, category_id) VALUES ?',
                    [categoryValues]
                );
            }

            if (schedules && Array.isArray(schedules) && schedules.length > 0) {
                const scheduleValues = schedules.map(s => [
                    tourId,
                    s.departure_date,
                    s.return_date,
                    s.available_slots || 0,
                    s.booked_slots || 0,
                    s.price_adult || price_adult,
                    s.price_child || price_child,
                    s.price_infant || price_infant,
                    s.status || 'available'
                ]);

                await connection.query(
                    `INSERT INTO tour_schedules 
                        (tour_id, departure_date, return_date, available_slots, booked_slots, price_adult, price_child, price_infant, status)
                     VALUES ?`,
                    [scheduleValues]
                );
            }

            await connection.commit();
            return tourId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    async update(tourId, data) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const {
                destination_id,
                title,
                slug,
                description = '',
                itinerary = '',
                duration_days = 1,
                duration_nights = 0,
                price_adult,
                price_child = 0,
                price_infant = 0,
                original_price = null,
                discount_percentage = 0,
                cover_image_url = null,
                image_gallery = [],
                departure_location = null,
                transportation = null,
                hotel_rating = null,
                max_participants = null,
                min_participants = 1,
                inclusions = [],
                exclusions = [],
                is_featured = false,
                is_active = true,
                status = 'active',
                meta_title = null,
                meta_description = null,
                meta_keywords = null,
                categories = []
            } = data;

            const [result] = await connection.execute(
                `
                UPDATE tours SET
                    destination_id = ?,
                    title = ?,
                    slug = ?,
                    description = ?,
                    itinerary = ?,
                    duration_days = ?,
                    duration_nights = ?,
                    price_adult = ?,
                    price_child = ?,
                    price_infant = ?,
                    original_price = ?,
                    discount_percentage = ?,
                    cover_image_url = ?,
                    image_gallery = ?,
                    departure_location = ?,
                    transportation = ?,
                    hotel_rating = ?,
                    max_participants = ?,
                    min_participants = ?,
                    inclusions = ?,
                    exclusions = ?,
                    is_featured = ?,
                    is_active = ?,
                    status = ?,
                    meta_title = ?,
                    meta_description = ?,
                    meta_keywords = ?
                WHERE tour_id = ?
                `,
                [
                    destination_id,
                    title,
                    slug,
                    description,
                    itinerary,
                    duration_days,
                    duration_nights,
                    price_adult,
                    price_child,
                    price_infant,
                    original_price,
                    discount_percentage,
                    cover_image_url,
                    JSON.stringify(image_gallery || []),
                    departure_location,
                    transportation,
                    hotel_rating,
                    max_participants,
                    min_participants,
                    JSON.stringify(inclusions || []),
                    JSON.stringify(exclusions || []),
                    is_featured ? 1 : 0,
                    is_active ? 1 : 0,
                    status,
                    meta_title,
                    meta_description,
                    meta_keywords,
                    tourId
                ]
            );

            if (categories && Array.isArray(categories)) {
                await connection.execute('DELETE FROM tour_categories WHERE tour_id = ?', [tourId]);
                if (categories.length > 0) {
                    const categoryValues = categories.map(catId => [tourId, catId]);
                    await connection.query(
                        'INSERT INTO tour_categories (tour_id, category_id) VALUES ?',
                        [categoryValues]
                    );
                }
            }

            await connection.commit();
            return result.affectedRows > 0;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    async delete(tourId) {
        const [result] = await db.execute('DELETE FROM tours WHERE tour_id = ?', [tourId]);
        return result.affectedRows > 0;
    },

    async getAll(filters = {}) {
        let query = `
            SELECT 
                t.*,
                d.name as destination_name,
                d.slug as destination_slug,
                ${buildCategorySubquery()} as categories,
                ${buildCategoryIdsSubquery()} as category_ids
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
                case 'id_asc':
                    query += ' ORDER BY t.tour_id ASC';
                    break;
                case 'id_desc':
                    query += ' ORDER BY t.tour_id DESC';
                    break;
                case 'price_asc':
                    query += ' ORDER BY t.price_adult ASC';
                    break;
                case 'price_desc':
                    query += ' ORDER BY t.price_adult DESC';
                    break;
                case 'rating':
                case 'rating_desc':
                    query += ' ORDER BY t.rating_average DESC';
                    break;
                case 'rating_asc':
                    query += ' ORDER BY t.rating_average ASC';
                    break;
                case 'popular':
                    query += ' ORDER BY t.booking_count DESC';
                    break;
                case 'newest':
                    query += ' ORDER BY t.created_at DESC';
                    break;
                default:
                    query += ' ORDER BY t.tour_id ASC';
            }
        } else {
            query += ' ORDER BY t.tour_id ASC';
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
                ${buildCategorySubquery()} as categories,
                ${buildCategoryIdsSubquery()} as category_ids
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
                ${buildCategorySubquery()} as categories,
                ${buildCategoryIdsSubquery()} as category_ids
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
