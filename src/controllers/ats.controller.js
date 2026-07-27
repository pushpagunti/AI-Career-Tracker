const AtsScore = require('../models/AtsScore.model');
const Resume = require('../models/Resume.model');
const { generateAtsScore } = require('../services/ats.service');

// @route POST /api/ats/score
const scoreResume = async (req, res) => {
  try {
    const { resumeId, jobDescription } = req.body;

    if (!resumeId || !jobDescription) {
      return res.status(400).json({
        status: 'fail',
        message: 'resumeId and jobDescription are both required',
      });
    }

    const resume = await Resume.findOne({ _id: resumeId, user: req.user.id });
    if (!resume) {
      return res.status(404).json({ status: 'fail', message: 'Resume not found' });
    }

    const { keywordScore, structureScore, overallScore } = generateAtsScore(resume, jobDescription);

    const result = await AtsScore.create({
      user: req.user.id,
      resume: resumeId,
      jobDescription,
      keywordScore,
      structureScore,
      overallScore,
    });

    res.status(201).json({ status: 'success', data: { result } });
  } catch (error) {
  console.error('ATS Score Error:', error);

  res.status(500).json({
    status: 'error',
    message: error.message,
    stack: error.stack
  });
}
};

// @route GET /api/ats/history/:resumeId
const getScoreHistory = async (req, res) => {
  try {
    const history = await AtsScore.find({ resume: req.params.resumeId, user: req.user.id })
      .select('overallScore createdAt jobDescription')
      .sort({ createdAt: -1 });

    res.status(200).json({ status: 'success', results: history.length, data: { history } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error fetching score history' });
  }
};

// @route GET /api/ats/:id
const getScoreById = async (req, res) => {
  try {
    const result = await AtsScore.findOne({ _id: req.params.id, user: req.user.id });

    if (!result) {
      return res.status(404).json({ status: 'fail', message: 'Score result not found' });
    }

    res.status(200).json({ status: 'success', data: { result } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error fetching score' });
  }
};

module.exports = { scoreResume, getScoreHistory, getScoreById };