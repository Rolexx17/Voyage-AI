const { Pool } = require('pg');
require('dotenv').config();

// Mematikan validasi SSL ketat untuk koneksi IPv4/Pooler
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Log jika koneksi berhasil
pool.on('connect', () => {
  console.log('🐘 PostgreSQL Pool Connected to Supabase');
});

// Log jika ada error mendadak pada pool
pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};