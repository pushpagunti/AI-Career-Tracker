const express = require('express');
const router = express.Router();

const {
  createResume,
  getResumes,
  getResume,
  updateResume,
  deleteResume,
  downloadResumePDF
} = require('../controllers/resume.controller');

const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.post('/', createResume);

router.get('/', getResumes);

router.get('/:id', getResume);

router.put('/:id', updateResume);

router.delete('/:id', deleteResume);

router.get('/:id/pdf', downloadResumePDF);

module.exports = router;