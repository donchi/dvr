const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'dvr_db_user',
  host: process.env.DB_HOST || 'dpg-d1tda5er433s73dkjvdg-a',
  database: process.env.DB_NAME || 'dvr_db',
  password: process.env.DB_PASSWORD || 'hXVTpSDgWdlPiEyRSZ8c6PB2CIDQJdMI',
  port: process.env.DB_PORT || 5432,
});

async function testDbConnection() {
  try {
    await pool.query('SELECT NOW()');
    console.log('Database connection successful');
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
}

module.exports = {
  pool,
  testDbConnection
};