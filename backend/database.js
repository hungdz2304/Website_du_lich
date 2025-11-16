require('dotenv').config();
const mysql = require('mysql2/promise');

(async () => {
  try {
    const host = process.env.MYSQL_HOST || 'localhost';
    const user = process.env.MYSQL_USER || 'root';
    const password = process.env.MYSQL_PASSWORD || '';
    const port = parseInt(process.env.MYSQL_PORT || '3306', 10);
    const database = process.env.MYSQL_DATABASE || 'your_database';

    const conn = await mysql.createConnection({ host, user, password, port });
    console.log('Connected to MySQL server');

    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET = 'utf8mb4' COLLATE = 'utf8mb4_unicode_ci'`);
    console.log(`Database "${database}" ensured`);

    await conn.query(`USE \`${database}\``);

    const createTableSql = `
      CREATE TABLE IF NOT EXISTS \`Tours\` (
        \`id\` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        \`name\` VARCHAR(255) NOT NULL,
        \`description\` TEXT,
        \`price\` DECIMAL(18,2),
        \`imageUrl\` VARCHAR(500),
        \`departure\` VARCHAR(100),
        \`spots\` INT DEFAULT 0,
        \`createdAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    await conn.query(createTableSql);
    console.log('Table "Tours" ensured');

    await conn.end();
    console.log('Done');
    process.exit(0);
  } catch (err) {
    console.error('Error creating database/table:', err.message);
    process.exit(1);
  }
})();