const express = require('express');
const router = express.Router();
const { scoreResume, getScoreHistory, getScoreById } = require('../controllers/ats.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.post('/score', scoreResume);
router.get('/history/:resumeId', getScoreHistory);
router.get('/:id', getScoreById);

module.exports = router;