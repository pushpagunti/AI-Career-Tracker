const express = require('express');
const router = express.Router();
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

module.exports = router;