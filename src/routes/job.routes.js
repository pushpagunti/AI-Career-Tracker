const express = require('express');
const router = express.Router();
const { getJobs, getJobById, getRecommendedJobs } = require('../controllers/job.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/recommended', protect, getRecommendedJobs); // before '/:id', same reasoning as earlier milestones
router.get('/', getJobs); // public — no protect, browsing all jobs doesn't require login
router.get('/:id', getJobById); // public

module.exports = router;