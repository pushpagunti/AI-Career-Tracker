const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    questionText: { type: String, required: true },
    userAnswer: { type: String, default: null },
    feedback: {
      score: { type: Number, min: 1, max: 10, default: null },
      strengths: { type: [String], default: [] },
      improvements: { type: [String], default: [] },
      modelAnswerNotes: { type: String, default: '' },
    },
    answeredAt: { type: Date, default: null },
  },
  { _id: false }
);

const interviewSessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate',
    },
    status: {
      type: String,
      enum: ['in-progress', 'completed'],
      default: 'in-progress',
    },
    questions: [questionSchema],
    overallScore: { type: Number, default: null },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('InterviewSession', interviewSessionSchema);