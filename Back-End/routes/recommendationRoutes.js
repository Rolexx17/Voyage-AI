const express = require('express');
const RecommendationController = require('../controllers/recommendationController');
const verifyToken = require('../middleware/auth');

const router = express.Router();

// Pastikan ada titik dua (:) sebelum kata category
router.get('/:category', verifyToken, RecommendationController.getRecommendations);

module.exports = router;