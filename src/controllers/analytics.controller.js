const {
  getOverview,
  getSkillsGrowth,
  getCodingActivity,
  getLearningTrend,
  getInterviewTrend,
} = require('../services/analytics.service');

const overview = async (req, res) => {
  try {
    const data = await getOverview(req.user.id);
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error fetching overview' });
  }
};

const skillsGrowth = async (req, res) => {
  try {
    const data = await getSkillsGrowth(req.user.id);
    res.status(200).json({ status: 'success', data: { skillsGrowth: data } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error fetching skills growth' });
  }
};

const codingActivity = async (req, res) => {
  try {
    const data = await getCodingActivity(req.user.id);
    res.status(200).json({ status: 'success', data: { codingActivity: data } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error fetching coding activity' });
  }
};

const learningTrend = async (req, res) => {
  try {
    const data = await getLearningTrend(req.user.id);
    res.status(200).json({ status: 'success', data: { learningTrend: data } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error fetching learning trend' });
  }
};

const interviewTrend = async (req, res) => {
  try {
    const data = await getInterviewTrend(req.user.id);
    res.status(200).json({ status: 'success', data: { interviewTrend: data } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error fetching interview trend' });
  }
};

module.exports = { overview, skillsGrowth, codingActivity, learningTrend, interviewTrend };