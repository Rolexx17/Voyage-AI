require('dotenv').config();
const express = require('express');
const cors = require('cors');
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

app.use(cors());
app.use(express.json());

// Logger sederhana untuk memantau request
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Daftarkan Routes
app.use('/api/auth', authRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/tools', toolsRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/planner', plannerRoutes);

// FUNGSI AUTO-MIGRATION
async function initDb() {
  try {
    console.log("Checking Database Connection...");
    // Test ping database
    const time = await db.query('SELECT NOW()');
    console.log("✅ Supabase Connected at:", time.rows[0].now);

    console.log("Synchronizing Tables...");
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        style TEXT, budget TEXT, food TEXT, travel_type TEXT, interests TEXT, has_pets BOOLEAN DEFAULT FALSE,
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
    console.log("✅ All tables are ready!");
  } catch (err) {
    console.error("❌ DATABASE ERROR DURING INIT:", err.message);
  }
}

const PORT = process.env.PORT || 5000;
initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server Voyage-AI running on port ${PORT}`);
  });
});