const express = require('express');
const PlannerController = require('../controllers/plannerController');
const verifyToken = require('../middleware/auth');

const router = express.Router();

router.get('/history', verifyToken, PlannerController.getHistory); 
router.post('/generate', verifyToken, PlannerController.generatePlan);

// TAMBAHKAN RUTE DELETE INI
router.delete('/:id', verifyToken, PlannerController.deletePlan);

module.exports = router;