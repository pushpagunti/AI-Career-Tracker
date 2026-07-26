const express = require('express');
const router = express.Router();
const {
  getLearningItems,
  addLearningItem,
  updateLearningItem,
  deleteLearningItem,
} = require('../controllers/learning.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/', getLearningItems);
router.post('/', addLearningItem);
router.put('/:id', updateLearningItem);
router.delete('/:id', deleteLearningItem);

module.exports = router;