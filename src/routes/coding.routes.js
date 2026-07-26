const express = require('express');
const router = express.Router();
const {
  getProblems,
  addProblem,
  updateProblem,
  deleteProblem,
  getCodingStats,
} = require('../controllers/coding.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/stats', getCodingStats); // before '/:id'-style routes, same reasoning as Milestone 3
router.get('/', getProblems);
router.post('/', addProblem);
router.put('/:id', updateProblem);
router.delete('/:id', deleteProblem);

module.exports = router;