const express = require('express');
const PlannerController = require('../controllers/plannerController');
const verifyToken = require('../middleware/auth');

const router = express.Router();

router.post('/generate', verifyToken, PlannerController.generatePlan);

module.exports = router;