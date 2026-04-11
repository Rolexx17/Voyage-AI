const express = require('express');
const cors = require('cors');
const config = require('./config');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const toolsRoutes = require('./routes/toolsRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const emergencyRoutes = require('./routes/emergencyRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// 1. MIDDLEWARE (Wajib di urutan paling atas)
app.use(cors());
app.use(express.json());

// 2. DEBUGGING LOG (Tambahkan ini untuk melihat request yang masuk)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// 3. DAFTARKAN ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/tools', toolsRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Start Server
app.listen(config.app.port, () => {
  console.log(`Server is running on port ${config.app.port}`);
});