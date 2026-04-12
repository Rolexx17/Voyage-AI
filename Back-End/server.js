const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const toolsRoutes = require('./routes/toolsRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const emergencyRoutes = require('./routes/emergencyRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const plannerRoutes = require('./routes/plannerRoutes');

const app = express();

// 1. MIDDLEWARE
app.use(cors());
app.use(express.json());

// 2. DAFTARKAN ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/tools', toolsRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/planner', plannerRoutes);

// 3. FUNGSI AUTO-MIGRATION (Membuat Tabel Otomatis)
async function initDb() {
  try {
    console.log("Checking & Initializing Database Tables in Supabase...");
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        style TEXT, budget TEXT, food TEXT, travel_type TEXT, interests TEXT, has_pets BOOLEAN,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS expenses (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        amount DECIMAL(15,2),
        currency VARCHAR(10),
        category VARCHAR(50),
        description TEXT,
        date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS itineraries (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        plan_data JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Database tables are synchronized successfully!");
  } catch (err) {
    console.error("❌ Error connecting to Supabase:", err);
  }
}

// 4. START SERVER SETELAH DATABASE SIAP
const PORT = process.env.PORT || 5000;
initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server Voyage-AI is running on port ${PORT}`);
  });
});