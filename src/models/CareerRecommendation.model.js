const mongoose = require('mongoose');

const careerRecommendationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    inputSnapshot: {
      skills: [String],
      experienceLevel: String,
      careerGoal: String,
    },
    recommendations: [
      {
        role: String,
        fitLevel: { type: String, enum: ['strong-match', 'growth-opportunity', 'stretch-goal'] },
        rationale: String,
        skillGaps: [String],
      },
    ],
    rawModelResponse: { type: String, select: false }, // hidden by default, debugging-only field
  },
  { timestamps: true }
);

module.exports = mongoose.model('CareerRecommendation', careerRecommendationSchema);