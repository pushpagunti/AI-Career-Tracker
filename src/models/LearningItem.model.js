const mongoose = require('mongoose');

const learningItemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },

    type: {
      type: String,
      enum: ['course', 'article', 'video', 'book', 'project', 'other'],
      default: 'course',
    },

    platform: {
      type: String,
      trim: true,
      default: '',
    },

    relatedSkill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill',
      default: null,
    },

    status: {
      type: String,
      enum: ['not-started', 'in-progress', 'completed'],
      default: 'not-started',
    },

    progressPercent: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    startedAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);


// Prevent duplicate learning items for same user (optional but useful)
learningItemSchema.index(
  {
    user: 1,
    title: 1
  },
  {
    unique: true
  }
);


module.exports = mongoose.model(
  'LearningItem',
  learningItemSchema
);