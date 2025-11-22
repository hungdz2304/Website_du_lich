const db = require('../config/database');

// Ensures the bookings.payment_method enum always contains the online options we expose in the UI

const REQUIRED_PAYMENT_METHODS = [
    'bank_transfer',
    'bank_card',
    'momo',
    'apple_pay',
    'credit_card',
    'cash',
    'other'
];

function parseEnumValues(columnType) {
    if (!columnType || !columnType.startsWith("enum")) {
        return [];
    }

    const matches = [...columnType.matchAll(/'([^']+)'/g)];
    return matches.map(match => match[1]);
}

async function ensureBookingPaymentColumn() {
    try {
        const [rows] = await db.query(
            `SELECT COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS
             WHERE TABLE_SCHEMA = DATABASE()
               AND TABLE_NAME = 'bookings'
               AND COLUMN_NAME = 'payment_method'`
        );

        if (!rows || rows.length === 0) {
            console.warn('[schema] Could not find bookings.payment_method metadata');
            return;
        }

        const currentValues = parseEnumValues(rows[0].COLUMN_TYPE);
        const normalized = new Set(currentValues);
        let updated = false;

        REQUIRED_PAYMENT_METHODS.forEach(method => {
            if (!normalized.has(method)) {
                normalized.add(method);
                updated = true;
            }
        });

        if (!updated) {
            return;
        }

        const enumDefinition = Array.from(normalized)
            .map(value => `'${value}'`)
            .join(', ');

        await db.query(
            `ALTER TABLE bookings
             MODIFY payment_method ENUM(${enumDefinition})
             NOT NULL DEFAULT 'bank_transfer'`
        );

        console.log('[schema] Synchronized payment_method enum with online methods');
    } catch (error) {
        console.warn('[schema] Unable to verify/alter payment_method enum:', error.message);
    }
}

module.exports = {
    ensureBookingPaymentColumn
};
