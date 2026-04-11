const express = require('express');
const EmergencyController = require('../controllers/emergencyController');
const verifyToken = require('../middleware/auth');

const router = express.Router();

router.get('/local-numbers', verifyToken, EmergencyController.getLocalNumbers);

module.exports = router;