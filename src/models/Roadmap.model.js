const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema(
  {
    topic: String,
    description: String,
    resources: [String],
  },
  { _id: false }
);

const stageSchema = new mongoose.Schema(
  {
    stageTitle: String,
    estimatedDuration: String,
    topics: [topicSchema],
  },
  { _id: false }
);

const progressLinkSchema = new mongoose.Schema(
  {
    topic: { type: String, required: true },
    learningItem: { type: mongoose.Schema.Types.ObjectId, ref: 'LearningItem', default: null },
  },
  { _id: false }
);

const roadmapSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetRole: { type: String, required: true },
    inputSnapshot: {
      skills: [String],
      experienceLevel: String,
    },
    stages: [stageSchema],
    progressLinks: [progressLinkSchema],
    rawModelResponse: { type: String, select: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Roadmap', roadmapSchema);