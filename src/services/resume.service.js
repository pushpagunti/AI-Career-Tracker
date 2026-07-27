const Profile = require('../models/Profile.model');
const Skill = require('../models/Skill.model');
const User = require('../models/User.model');

const buildResumeSeedData = async (userId) => {
  const [user, profile, skills] = await Promise.all([
    User.findById(userId),
    Profile.findOne({ user: userId }),
    Skill.find({ user: userId }),
  ]);

  // Group flat skill documents into { category, items } shape for resume display
  const skillsByCategory = {};
  skills.forEach((skill) => {
    if (!skillsByCategory[skill.category]) {
      skillsByCategory[skill.category] = [];
    }
    skillsByCategory[skill.category].push(skill.name);
  });

  const skillGroups = Object.entries(skillsByCategory).map(([category, items]) => ({
    category,
    items,
  }));

  return {
    personalInfo: {
      fullName: user?.name || '',
      email: user?.email || '',
      phone: '',
      location: profile?.location || '',
      links: {
        github: profile?.links?.github || '',
        linkedin: profile?.links?.linkedin || '',
        portfolio: profile?.links?.portfolio || '',
      },
    },
    summary: profile?.bio || '',
    education: profile?.education || [],
    skills: skillGroups,
  };
};

module.exports = { buildResumeSeedData };