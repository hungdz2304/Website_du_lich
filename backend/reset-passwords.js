const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function resetPasswords() {
    let connection;
    
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'tour_booking_db'
        });

        console.log('✅ Connected to database\n');

        // Hash new password
        const newPassword = 'password123';
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update admin password
        await connection.execute(
            "UPDATE users SET password_hash = ? WHERE email = 'admin@toursite.com'",
            [hashedPassword]
        );
        console.log('✅ Reset password for admin@toursite.com');

        // Update customer password
        await connection.execute(
            "UPDATE users SET password_hash = ? WHERE email = 'customer@example.com'",
            [hashedPassword]
        );
        console.log('✅ Reset password for customer@example.com');

        console.log('\n🎉 Done! Login credentials:');
        console.log('   👨‍💼 Admin:    admin@toursite.com / password123');
        console.log('   👤 Customer: customer@example.com / password123');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

resetPasswords();
