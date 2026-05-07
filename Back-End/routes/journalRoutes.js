const express = require('express');
const JournalController = require('../controllers/journalController');
const verifyToken = require('../middleware/auth');

const router = express.Router();

router.get('/', verifyToken, JournalController.getJournals);
router.post('/', verifyToken, JournalController.addJournal);
router.post('/enhance', verifyToken, JournalController.enhanceStory);
router.delete('/:id', verifyToken, JournalController.deleteJournal);

module.exports = router;