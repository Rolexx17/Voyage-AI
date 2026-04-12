require('dotenv').config();

const config = {
  app: {
    port: process.env.PORT || 5000,
  },
  db: {
    // Kita simpan dalam satu variabel string saja
    connectionString: process.env.DATABASE_URL,
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