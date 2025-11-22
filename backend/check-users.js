const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function checkAndCreateUsers() {
    let connection;
    
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'tour_booking_db'
        });

        console.log('✅ Connected to database\n');

        // Check existing users
        const [users] = await connection.execute(
            'SELECT user_id, email, full_name, role FROM users'
        );

        console.log('📋 Current users in database:');
        console.table(users);

        // Check if admin exists
        const [adminExists] = await connection.execute(
            "SELECT * FROM users WHERE email = 'admin@toursite.com'"
        );

        if (adminExists.length === 0) {
            console.log('\n⚠️  Admin account not found. Creating...');
            
            const hashedPassword = await bcrypt.hash('password123', 10);
            
            await connection.execute(
                `INSERT INTO users (email, password_hash, full_name, role, phone) 
                 VALUES (?, ?, ?, ?, ?)`,
                ['admin@toursite.com', hashedPassword, 'Administrator', 'admin', '0900000001']
            );
            
            console.log('✅ Created admin@toursite.com / password123');
        } else {
            console.log('\n✅ Admin account exists');
        }

        // Check if customer exists
        const [customerExists] = await connection.execute(
            "SELECT * FROM users WHERE email = 'customer@example.com'"
        );

        if (customerExists.length === 0) {
            console.log('\n⚠️  Customer account not found. Creating...');
            
            const hashedPassword = await bcrypt.hash('password123', 10);
            
            await connection.execute(
                `INSERT INTO users (email, password_hash, full_name, role, phone) 
                 VALUES (?, ?, ?, ?, ?)`,
                ['customer@example.com', hashedPassword, 'Test Customer', 'customer', '0900000002']
            );
            
            console.log('✅ Created customer@example.com / password123');
        } else {
            console.log('\n✅ Customer account exists');
        }

        // Show final users
        const [finalUsers] = await connection.execute(
            'SELECT user_id, email, full_name, role, created_at FROM users'
        );

        console.log('\n📋 Final users list:');
        console.table(finalUsers);

        console.log('\n✅ Done! You can now login with:');
        console.log('   Admin: admin@toursite.com / password123');
        console.log('   Customer: customer@example.com / password123');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

checkAndCreateUsers();
