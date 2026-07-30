const User = require('../models/User.model');
const Skill = require('../models/Skill.model');
const CodingProblem = require('../models/CodingProblem.model');
const LearningItem = require('../models/LearningItem.model');
const Resume = require('../models/Resume.model');
const InterviewSession = require('../models/InterviewSession.model');

const getPlatformAnalytics = async () => {
  const [
    totalUsers,
    activeUsers,
    totalSkillsTracked,
    totalProblemsLogged,
    totalLearningItemsCompleted,
    totalResumesCreated,
    totalInterviewsCompleted,
    topSkills,
  ] = await Promise.all([
    User.countDocuments({}),
    User.countDocuments({ isActive: true }),
    Skill.countDocuments({}),
    CodingProblem.countDocuments({}),
    LearningItem.countDocuments({ status: 'completed' }),
    Resume.countDocuments({}),
    InterviewSession.countDocuments({ status: 'completed' }),
    Skill.aggregate([
      { $group: { _id: '$name', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
  ]);

  return {
    totalUsers,
    activeUsers,
    disabledUsers: totalUsers - activeUsers,
    totalSkillsTracked,
    totalProblemsLogged,
    totalLearningItemsCompleted,
    totalResumesCreated,
    totalInterviewsCompleted,
    topSkills,
  };
};

module.exports = { getPlatformAnalytics };