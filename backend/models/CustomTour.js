const db = require('../config/database');

const CustomTour = {
    async getComponents(destinationIds = []) {
        const ids = destinationIds.filter(Boolean);
        if (ids.length === 0) {
            const [rows] = await db.execute('SELECT * FROM custom_components WHERE destination_id IS NULL');
            return rows;
        }

        const placeholders = ids.map(() => '?').join(',');
        const query = `
            SELECT *
            FROM custom_components
            WHERE destination_id IS NULL OR destination_id IN (${placeholders})
        `;
        const [rows] = await db.execute(query, ids);
        return rows;
    }
};

module.exports = CustomTour;
