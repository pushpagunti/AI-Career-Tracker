const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema(
  {
    degree: String,
    institution: String,
    fieldOfStudy: String,
    startYear: Number,
    endYear: Number,
  },
  { _id: false }
);

const experienceSchema = new mongoose.Schema(
  {
    role: String,
    company: String,
    startDate: String,
    endDate: String,
    isCurrent: { type: Boolean, default: false },
    bullets: [String],
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    techStack: [String],
    link: String,
  },
  { _id: false }
);

const skillGroupSchema = new mongoose.Schema(
  {
    category: String,
    items: [String],
  },
  { _id: false }
);

const certificationSchema = new mongoose.Schema(
  {
    name: String,
    issuer: String,
    year: Number,
  },
  { _id: false }
);

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Resume title is required'],
      default: 'My Resume',
    },
    personalInfo: {
      fullName: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      location: { type: String, default: '' },
      links: {
        github: { type: String, default: '' },
        linkedin: { type: String, default: '' },
        portfolio: { type: String, default: '' },
      },
    },
    summary: { type: String, default: '' },
    education: [educationSchema],
    experience: [experienceSchema],
    projects: [projectSchema],
    skills: [skillGroupSchema],
    certifications: [certificationSchema],
    template: {
      type: String,
      enum: ['classic', 'modern', 'minimal'],
      default: 'classic',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resume', resumeSchema);