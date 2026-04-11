const express = require('express');
const DashboardController = require('../controllers/dashboardController');
const verifyToken = require('../middleware/auth');

const router = express.Router();

router.get('/insights', verifyToken, DashboardController.getInsights);

module.exports = router;