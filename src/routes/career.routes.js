const express = require('express');
const router = express.Router();
const { aiLimiter } = require('../middleware/rateLimiter');
const {
  generateRecommendation,
  getRecommendationHistory,
  getRecommendationById,
} = require('../controllers/career.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.post('/recommend', generateRecommendation);
router.get('/history', getRecommendationHistory);
router.get('/:id', getRecommendationById);

router.post('/recommend', aiLimiter, generateRecommendation);

module.exports = router;