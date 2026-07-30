const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, default: 'Remote' },
    type: {
      type: String,
      enum: ['full-time', 'internship', 'part-time', 'contract'],
      default: 'full-time',
    },
    requiredSkills: { type: [String], default: [] }, // stored lowercase for consistent matching
    preferredSkills: { type: [String], default: [] },
    experienceLevel: {
      type: String,
      enum: ['student', 'entry', 'mid', 'senior'],
      default: 'entry',
    },
    description: { type: String, default: '' },
    applyUrl: { type: String, default: '' },
    postedAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Normalize skill arrays to lowercase before saving, so matching is always case-consistent
jobSchema.pre('save', function (next) {
  this.requiredSkills = this.requiredSkills.map((s) => s.toLowerCase().trim());
  this.preferredSkills = this.preferredSkills.map((s) => s.toLowerCase().trim());
  next();
});

module.exports = mongoose.model('Job', jobSchema);