const CodingProblem = require('../models/CodingProblem.model');
const { calculateStreaks } = require('../services/streak.service');
const { createNotification } = require('../services/notification.service');

const STREAK_MILESTONES = [7, 30, 100];

// @route GET /api/coding
const getProblems = async (req, res) => {
  try {
    const filter = { user: req.user.id };

    if (req.query.difficulty) filter.difficulty = req.query.difficulty;
    if (req.query.platform) filter.platform = req.query.platform;
    if (req.query.topic) filter.topics = req.query.topic;

    const problems = await CodingProblem.find(filter).sort({ solvedAt: -1 });

    res.status(200).json({
      status: 'success',
      results: problems.length,
      data: { problems },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Server error fetching problems',
    });
  }
};

// @route POST /api/coding
const addProblem = async (req, res) => {
  try {
    const problem = await CodingProblem.create({
      ...req.body,
      user: req.user.id,
    });

    // Check if this problem pushed the user's streak to a milestone
    const { currentStreak } = await calculateStreaks(req.user.id);

    if (STREAK_MILESTONES.includes(currentStreak)) {
      await createNotification(
        req.user.id,
        'streak',
        `🔥 You've hit a ${currentStreak}-day coding streak! Keep it up.`,
        '/coding'
      );
    }

    res.status(201).json({
      status: 'success',
      data: { problem },
    });
  } catch (error) {
    console.error('Add Problem Error:', error);

    res.status(500).json({
      status: 'error',
      message: 'Server error logging problem',
    });
  }
};

// @route PUT /api/coding/:id
const updateProblem = async (req, res) => {
  try {
    const problem = await CodingProblem.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      {
        $set: req.body,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!problem) {
      return res.status(404).json({
        status: 'fail',
        message: 'Problem not found or you do not have permission to edit it',
      });
    }

    res.status(200).json({
      status: 'success',
      data: { problem },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Server error updating problem',
    });
  }
};

// @route DELETE /api/coding/:id
const deleteProblem = async (req, res) => {
  try {
    const problem = await CodingProblem.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!problem) {
      return res.status(404).json({
        status: 'fail',
        message: 'Problem not found or you do not have permission to delete it',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Problem deleted',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Server error deleting problem',
    });
  }
};

// @route GET /api/coding/stats
const getCodingStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const [difficultyBreakdown, streaks, allProblems] = await Promise.all([
      CodingProblem.aggregate([
        { $match: { user: userId } },
        { $group: { _id: '$difficulty', count: { $sum: 1 } } },
      ]),
      calculateStreaks(userId),
      CodingProblem.find({ user: userId }, 'solvedAt'),
    ]);

    const totalSolved = allProblems.length;

    const byDifficulty = {
      easy: 0,
      medium: 0,
      hard: 0,
    };

    difficultyBreakdown.forEach((d) => {
      byDifficulty[d._id] = d.count;
    });

    const last7Days = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const dateKey = date.toISOString().split('T')[0];

      const count = allProblems.filter(
        (p) => new Date(p.solvedAt).toISOString().split('T')[0] === dateKey
      ).length;

      last7Days.push({
        date: dateKey,
        count,
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        totalSolved,
        byDifficulty,
        currentStreak: streaks.currentStreak,
        longestStreak: streaks.longestStreak,
        last7Days,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Server error generating coding stats',
    });
  }
};

module.exports = {
  getProblems,
  addProblem,
  updateProblem,
  deleteProblem,
  getCodingStats,
};