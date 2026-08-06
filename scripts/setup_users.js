const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function setup() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ai_sales_employee'
  });

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Users table created or verified.");

    const email = 'nikhil@gmail.com';
    const password = '123';
    const hash = await bcrypt.hash(password, 10);

    await pool.query(`
      INSERT INTO users (email, password)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE password = VALUES(password)
    `, [email, hash]);

    console.log("Admin user seeded successfully.");
  } catch (error) {
    console.error("Error setting up database:", error);
  } finally {
    await pool.end();
  }
}

setup();
