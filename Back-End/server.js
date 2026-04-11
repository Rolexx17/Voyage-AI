const express = require('express');
const cors = require('cors');
const config = require('./config');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');

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

// Start Server
app.listen(config.app.port, () => {
  console.log(`Server is running on port ${config.app.port}`);
});