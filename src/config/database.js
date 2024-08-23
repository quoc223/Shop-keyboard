const mysql = require('mysql2/promise');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  ssl: {
    ca: fs.readFileSync(path.join(__dirname, 'certs/DigiCertGlobalRootCA.crt.pem'))
}
});

// Test database connection
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to the MySQL database.');
    connection.release();
  } catch (err) {
    console.error('Error connecting to the database:', err);
  }
})();

module.exports = pool;
