const express = require('express');
const ToolsController = require('../controllers/toolsController');
const verifyToken = require('../middleware/auth');

const router = express.Router();

router.post('/translate', verifyToken, ToolsController.translateText);

module.exports = router;