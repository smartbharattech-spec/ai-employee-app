const mysql = require('mysql2/promise');

async function checkDb() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ai_sales_employee'
  });

  try {
    // Check tables
    const [tables] = await connection.query('SHOW TABLES');
    console.log('Tables:', tables);

    // Create contact_notes table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS contact_notes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        phone_number VARCHAR(50) NOT NULL UNIQUE,
        note TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('contact_notes table ensured.');
    
  } catch (err) {
    console.error(err);
  } finally {
    await connection.end();
  }
}

checkDb();
