const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['frontend', 'backend', 'database', 'devops', 'dsa', 'soft-skill', 'other'],
      default: 'other',
    },
    proficiency: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'beginner',
    },
    source: {
      type: String,
      enum: ['self-taught', 'course', 'college', 'project', 'bootcamp'],
      default: 'self-taught',
    },
  },
  { timestamps: true }
);

// Compound unique index: same user cannot add the same skill name twice
skillSchema.index({ user: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Skill', skillSchema);