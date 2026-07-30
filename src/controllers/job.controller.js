const Job = require('../models/Job.model');
const Skill = require('../models/Skill.model');
const { calculateMatchScore } = require('../services/jobMatch.service');

// @route GET /api/jobs
const getJobs = async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.query.type) filter.type = req.query.type;
    if (req.query.experienceLevel) filter.experienceLevel = req.query.experienceLevel;

    const jobs = await Job.find(filter).sort({ postedAt: -1 });
    res.status(200).json({ status: 'success', results: jobs.length, data: { jobs } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error fetching jobs' });
  }
};

// @route GET /api/jobs/:id
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ status: 'fail', message: 'Job not found' });
    }
    res.status(200).json({ status: 'success', data: { job } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error fetching job' });
  }
};

// @route GET /api/jobs/recommended
const getRecommendedJobs = async (req, res) => {
  try {
    const [userSkills, jobs] = await Promise.all([
      Skill.find({ user: req.user.id }),
      Job.find({ isActive: true }),
    ]);

    if (userSkills.length === 0) {
      return res.status(200).json({
        status: 'success',
        message: 'Add some skills to get personalized job recommendations.',
        data: { jobs: [] },
      });
    }

    const scoredJobs = jobs.map((job) => {
      const { matchScore, matchedRequired, missingRequired, matchedPreferred } = calculateMatchScore(
        userSkills,
        job
      );
      return {
        job,
        matchScore,
        matchedRequired,
        missingRequired,
        matchedPreferred,
      };
    });

    // Sort best match first
    scoredJobs.sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json({ status: 'success', results: scoredJobs.length, data: { jobs: scoredJobs } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error generating job recommendations' });
  }
};

module.exports = { getJobs, getJobById, getRecommendedJobs };