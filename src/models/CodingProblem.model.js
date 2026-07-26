const mongoose = require('mongoose');

const codingProblemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Problem title is required'],
      trim: true,
    },
    platform: {
      type: String,
      enum: ['leetcode', 'gfg', 'codeforces', 'hackerrank', 'other'],
      default: 'leetcode',
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: [true, 'Difficulty is required'],
    },
    topics: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['attempted', 'solved'],
      default: 'solved',
    },
    solvedAt: {
      type: Date,
      default: Date.now,
    },
    notes: { type: String, default: '' },
    url: { type: String, default: '' },
  },
  { timestamps: true }
);

// Index to make date-range queries (used heavily by streak calculation) fast
codingProblemSchema.index({ user: 1, solvedAt: -1 });

module.exports = mongoose.model('CodingProblem', codingProblemSchema);