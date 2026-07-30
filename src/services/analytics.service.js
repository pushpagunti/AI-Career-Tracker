const mongoose = require('mongoose');
const Skill = require('../models/Skill.model');
const LearningItem = require('../models/LearningItem.model');
const CodingProblem = require('../models/CodingProblem.model');
const Resume = require('../models/Resume.model');
const InterviewSession = require('../models/InterviewSession.model');
const { calculateStreaks } = require('./streak.service');

const getOverview = async (userId) => {
  const [
    totalSkills,
    completedLearning,
    totalProblems,
    totalResumes,
    completedInterviews,
    streaks,
  ] = await Promise.all([
    Skill.countDocuments({ user: userId }),
    LearningItem.countDocuments({ user: userId, status: 'completed' }),
    CodingProblem.countDocuments({ user: userId }),
    Resume.countDocuments({ user: userId }),
    InterviewSession.countDocuments({ user: userId, status: 'completed' }),
    calculateStreaks(userId),
  ]);

  return {
    totalSkills,
    completedLearning,
    totalProblems,
    totalResumes,
    completedInterviews,
    currentStreak: streaks.currentStreak,
    longestStreak: streaks.longestStreak,
  };
};

const getSkillsGrowth = async (userId) => {
  return Skill.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } }, // chronological order for a trend chart
  ]);
};

const getCodingActivity = async (userId) => {
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

  return CodingProblem.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId), solvedAt: { $gte: ninetyDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$solvedAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

const getLearningTrend = async (userId) => {
  return LearningItem.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId), status: 'completed' } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$completedAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

const getInterviewTrend = async (userId) => {
  return InterviewSession.find(
    { user: userId, status: 'completed' },
    'role overallScore completedAt'
  ).sort({ completedAt: 1 });
};

module.exports = { getOverview, getSkillsGrowth, getCodingActivity, getLearningTrend, getInterviewTrend };