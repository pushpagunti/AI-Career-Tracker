const Skill = require('../models/Skill.model');
const LearningItem = require('../models/LearningItem.model');

// @route GET /api/dashboard
const getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    // Run both aggregations concurrently — they're independent of each other
    const [skillsByCategory, learningItems] = await Promise.all([
      Skill.aggregate([
        { $match: { user: userId } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      LearningItem.find({ user: userId }).sort({ updatedAt: -1 }),
    ]);

    const totalSkills = skillsByCategory.reduce((sum, c) => sum + c.count, 0);

    const totalItems = learningItems.length;
    const completed = learningItems.filter((i) => i.status === 'completed').length;
    const inProgress = learningItems.filter((i) => i.status === 'in-progress').length;
    const notStarted = learningItems.filter((i) => i.status === 'not-started').length;
    const completionRate = totalItems === 0 ? 0 : Number(((completed / totalItems) * 100).toFixed(1));

    const recentActivity = learningItems.slice(0, 5).map((item) => ({
      id: item._id,
      title: item.title,
      status: item.status,
      progressPercent: item.progressPercent,
      updatedAt: item.updatedAt,
    }));

    res.status(200).json({
      status: 'success',
      data: {
        skillsSummary: { totalSkills, byCategory: skillsByCategory },
        learningSummary: { totalItems, completed, inProgress, notStarted, completionRate },
        recentActivity,
      },
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error building dashboard' });
  }
};

module.exports = { getDashboard };