const express = require('express');
const router = express.Router();
const { aiLimiter } = require('../middleware/rateLimiter');
const {
  startInterview,
  submitAnswer,
  completeInterview,
  getInterviews,
  getInterviewById,
} = require('../controllers/interview.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.post('/start', startInterview);
router.get('/', getInterviews);
router.get('/:id', getInterviewById);
router.post('/:sessionId/answer', submitAnswer);
router.post('/:id/complete', completeInterview);
router.post('/start', aiLimiter, startInterview);
router.post('/:sessionId/answer', aiLimiter, submitAnswer);    

module.exports = router;