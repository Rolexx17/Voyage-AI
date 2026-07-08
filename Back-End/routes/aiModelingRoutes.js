const express = require('express');
const verifyToken = require('../middleware/auth');
const AIModelingController = require('../controllers/aiModelingController');

const router = express.Router();

// Jalankan semua model
router.post('/run-all', verifyToken, AIModelingController.runAll);

// Jalankan per modul
router.post('/csp', verifyToken, AIModelingController.runCSP);
router.post('/game-theory', verifyToken, AIModelingController.runGameTheory);
router.post('/logic', verifyToken, AIModelingController.runLogic);
router.post('/planning', verifyToken, AIModelingController.runPlanning);

module.exports = router;
