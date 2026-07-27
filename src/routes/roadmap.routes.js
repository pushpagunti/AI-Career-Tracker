const express = require('express');
const router = express.Router();
const {
  generateRoadmap,
  getRoadmaps,
  getRoadmapById,
  linkTopic,
  deleteRoadmap,
} = require('../controllers/roadmap.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.post('/generate', generateRoadmap);
router.get('/', getRoadmaps);
router.get('/:id', getRoadmapById);
router.post('/:id/link-topic', linkTopic);
router.delete('/:id', deleteRoadmap);

module.exports = router;