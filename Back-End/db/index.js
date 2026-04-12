const { Pool } = require('pg');
require('dotenv').config();

// Solusi untuk error SELF_SIGNED_CERT_IN_CHAIN
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    // Mematikan validasi ketat agar bisa konek ke Pooler IPv4
    rejectUnauthorized: false 
  },
  connectionTimeoutMillis: 10000, 
  idleTimeoutMillis: 30000,
  max: 10
});

// Tambahkan log saat berhasil konek
pool.on('connect', () => {
  // Hanya log sekali saat koneksi pertama kali terbuka jika perlu
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};