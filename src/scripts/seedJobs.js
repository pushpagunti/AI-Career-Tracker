require('dotenv').config();
console.log(process.env.MONGO_URI);

const connectDB = require('../config/db');
const Job = require('../models/Job.model');

// ===============================
// Sample Jobs
// ===============================
const sampleJobs = [
  // ⬇️ Paste ALL your existing 17 job objects here.
  // Don't change anything inside them.
  {
    title: 'MERN Stack Developer Intern',
    company: 'TechNova',
    location: 'Remote',
    type: 'internship',
    requiredSkills: ['javascript', 'node.js', 'express', 'mongodb'],
    preferredSkills: ['react', 'git'],
    experienceLevel: 'student',
    description: 'Work on MERN stack applications.',
    applyUrl: 'https://example.com/jobs/mern-intern'
  },
  {
    title: 'Frontend Developer',
    company: 'Google',
    location: 'Hyderabad',
    type: 'full-time',
    requiredSkills: ['javascript', 'react', 'html', 'css'],
    preferredSkills: ['typescript', 'git'],
    experienceLevel: 'entry',
    description: 'Develop responsive web applications.',
    applyUrl: 'https://example.com/jobs/frontend'
  },
  {
    title: 'Backend Developer',
    company: 'Amazon',
    location: 'Bangalore',
    type: 'full-time',
    requiredSkills: ['node.js', 'express', 'mongodb'],
    preferredSkills: ['docker', 'aws'],
    experienceLevel: 'entry',
    description: 'Develop backend APIs.',
    applyUrl: 'https://example.com/jobs/backend'
  },
  {
    title: 'Java Developer',
    company: 'Infosys',
    location: 'Hyderabad',
    type: 'full-time',
    requiredSkills: ['java', 'spring boot', 'mysql'],
    preferredSkills: ['git', 'rest api'],
    experienceLevel: 'entry',
    description: 'Develop enterprise Java applications.',
    applyUrl: 'https://example.com/jobs/java'
  },
  {
    title: 'Python Developer',
    company: 'TCS',
    location: 'Pune',
    type: 'full-time',
    requiredSkills: ['python', 'django', 'mysql'],
    preferredSkills: ['docker'],
    experienceLevel: 'entry',
    description: 'Develop Python web applications.',
    applyUrl: 'https://example.com/jobs/python'
  },
  {
    title: 'QA Automation Engineer',
    company: 'Accenture',
    location: 'Chennai',
    type: 'full-time',
    requiredSkills: ['java', 'selenium', 'testing'],
    preferredSkills: ['testng', 'jira'],
    experienceLevel: 'entry',
    description: 'Automate software testing.',
    applyUrl: 'https://example.com/jobs/qa'
  },
  {
    title: 'Data Analyst Intern',
    company: 'Deloitte',
    location: 'Remote',
    type: 'internship',
    requiredSkills: ['sql', 'excel'],
    preferredSkills: ['python', 'power bi'],
    experienceLevel: 'student',
    description: 'Analyze business data.',
    applyUrl: 'https://example.com/jobs/data'
  },
  {
    title: 'AI/ML Intern',
    company: 'OpenAI Labs',
    location: 'Remote',
    type: 'internship',
    requiredSkills: ['python', 'machine learning'],
    preferredSkills: ['tensorflow', 'pytorch'],
    experienceLevel: 'student',
    description: 'Assist in AI model development.',
    applyUrl: 'https://example.com/jobs/ai'
  },
  {
    title: 'DevOps Engineer',
    company: 'Microsoft',
    location: 'Hyderabad',
    type: 'full-time',
    requiredSkills: ['docker', 'kubernetes', 'linux'],
    preferredSkills: ['aws', 'jenkins'],
    experienceLevel: 'mid',
    description: 'Maintain CI/CD pipelines.',
    applyUrl: 'https://example.com/jobs/devops'
  },
  {
    title: 'Cloud Engineer',
    company: 'IBM',
    location: 'Bangalore',
    type: 'full-time',
    requiredSkills: ['aws', 'linux'],
    preferredSkills: ['docker', 'terraform'],
    experienceLevel: 'entry',
    description: 'Manage cloud infrastructure.',
    applyUrl: 'https://example.com/jobs/cloud'
  },
  {
    title: 'Android Developer',
    company: 'PhonePe',
    location: 'Bangalore',
    type: 'full-time',
    requiredSkills: ['kotlin', 'android'],
    preferredSkills: ['firebase'],
    experienceLevel: 'entry',
    description: 'Develop Android apps.',
    applyUrl: 'https://example.com/jobs/android'
  },
  {
    title: 'iOS Developer',
    company: 'Apple',
    location: 'Hyderabad',
    type: 'full-time',
    requiredSkills: ['swift', 'ios'],
    preferredSkills: ['firebase'],
    experienceLevel: 'entry',
    description: 'Develop iOS applications.',
    applyUrl: 'https://example.com/jobs/ios'
  },
  {
    title: 'Full Stack Developer',
    company: 'Flipkart',
    location: 'Bangalore',
    type: 'full-time',
    requiredSkills: ['javascript', 'react', 'node.js', 'mongodb'],
    preferredSkills: ['express', 'git'],
    experienceLevel: 'entry',
    description: 'Build full stack applications.',
    applyUrl: 'https://example.com/jobs/fullstack'
  },
  {
    title: 'Software Engineer Intern',
    company: 'Adobe',
    location: 'Noida',
    type: 'internship',
    requiredSkills: ['java', 'dsa'],
    preferredSkills: ['oop'],
    experienceLevel: 'student',
    description: 'Software engineering internship.',
    applyUrl: 'https://example.com/jobs/adobe'
  },
  {
    title: 'Cyber Security Analyst',
    company: 'Wipro',
    location: 'Hyderabad',
    type: 'full-time',
    requiredSkills: ['networking', 'linux'],
    preferredSkills: ['security'],
    experienceLevel: 'entry',
    description: 'Monitor security incidents.',
    applyUrl: 'https://example.com/jobs/security'
  },
  {
    title: 'React Developer Intern',
    company: 'Zoho',
    location: 'Chennai',
    type: 'internship',
    requiredSkills: ['react', 'javascript', 'html', 'css'],
    preferredSkills: ['typescript'],
    experienceLevel: 'student',
    description: 'Frontend internship.',
    applyUrl: 'https://example.com/jobs/react'
  },
  {
    title: 'Software Developer',
    company: 'Oracle',
    location: 'Bangalore',
    type: 'full-time',
    requiredSkills: ['java', 'sql'],
    preferredSkills: ['spring boot', 'git'],
    experienceLevel: 'entry',
    description: 'Enterprise software development.',
    applyUrl: 'https://example.com/jobs/oracle'
  }
];

// ===============================
// Seed Function
// ===============================
const seedJobs = async () => {
  try {
    console.log('Connecting to MongoDB...');

    await connectDB();

    console.log('Clearing existing jobs...');
    await Job.deleteMany({});

    console.log('Inserting sample jobs...');
    await Job.insertMany(sampleJobs);

    console.log('=====================================');
    console.log(`✅ Seeded ${sampleJobs.length} jobs successfully.`);
    console.log('=====================================');

    process.exit(0);
  } catch (error) {
    console.log('=====================================');
    console.log('❌ Error while seeding jobs');
    console.error(error);
    console.log('=====================================');

    process.exit(1);
  }
};

seedJobs();