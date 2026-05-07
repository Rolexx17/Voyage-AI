const express = require('express');
const PackingController = require('../controllers/packingController');
const verifyToken = require('../middleware/auth');

const router = express.Router();

router.get('/', verifyToken, PackingController.getLists);
router.post('/generate', verifyToken, PackingController.generateList);
router.put('/:id', verifyToken, PackingController.updateList);
router.delete('/:id', verifyToken, PackingController.deleteList);

module.exports = router;