require('dotenv').config();

// Semua value konstan dan config disimpan di sini agar mudah di-maintain
const config = {
  app: {
    port: process.env.PORT || 5000,
  },
  db: {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    saltRounds: 10,
  },
  ai: {
    groqApiKey: process.env.GROQ_API_KEY,
  }
};

module.exports = config;