const express = require('express');
const router = express.Router();
const {
  overview,
  skillsGrowth,
  codingActivity,
  learningTrend,
  interviewTrend,
} = require('../controllers/analytics.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/overview', overview);
router.get('/skills-growth', skillsGrowth);
router.get('/coding-activity', codingActivity);
router.get('/learning-trend', learningTrend);
router.get('/interview-trend', interviewTrend);

module.exports = router;