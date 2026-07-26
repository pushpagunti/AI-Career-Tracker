const express = require('express');
const router = express.Router();
const {
  getSkills,
  addSkill,
  updateSkill,
  deleteSkill,
  getSkillSummary,
} = require('../controllers/skill.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/summary', getSkillSummary); // must come before '/:id' style routes if we add one later
router.get('/', getSkills);
router.post('/', addSkill);
router.put('/:id', updateSkill);
router.delete('/:id', deleteSkill);

module.exports = router;