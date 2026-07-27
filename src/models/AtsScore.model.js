const mongoose = require('mongoose');

const atsScoreSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resume: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume', required: true },
    jobDescription: { type: String, required: true },
    keywordScore: {
      matched: [String],
      missing: [String],
      percentage: Number,
    },
    structureScore: {
      checks: [
        {
          label: String,
          passed: Boolean,
          message: String,
        },
      ],
      percentage: Number,
    },
    overallScore: Number,
  },
  { timestamps: true }
);

atsScoreSchema.index({ user: 1, resume: 1, createdAt: -1 }); // fast history lookups per resume

module.exports = mongoose.model('AtsScore', atsScoreSchema);