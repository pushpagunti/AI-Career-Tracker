const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema(
  {
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    fieldOfStudy: { type: String },
    startYear: { type: Number },
    endYear: { type: Number },
  },
  { _id: false } // sub-documents here don't need their own _id
);

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // one profile per user
    },
    bio: { type: String, maxlength: 500, default: '' },
    avatarUrl: { type: String, default: '' },
    location: { type: String, default: '' },
    education: [educationSchema],
    careerGoal: { type: String, default: '' },
    experienceLevel: {
      type: String,
      enum: ['student', 'entry', 'mid', 'senior'],
      default: 'student',
    },
    links: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      portfolio: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', profileSchema);