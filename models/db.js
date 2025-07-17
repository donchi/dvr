const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'dvr_db',
  password: process.env.DB_PASSWORD || '123qweasd@',
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