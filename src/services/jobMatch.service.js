const PROFICIENCY_WEIGHTS = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 };
const MAX_PROFICIENCY_WEIGHT = 4;
const REQUIRED_WEIGHT = 0.7;
const PREFERRED_WEIGHT = 0.3;

// Build a quick lookup: skill name (lowercase) -> proficiency
const buildUserSkillMap = (userSkills) => {
  const map = {};
  userSkills.forEach((skill) => {
    map[skill.name.toLowerCase().trim()] = skill.proficiency;
  });
  return map;
};

const calculateMatchScore = (userSkills, job) => {
  const userSkillMap = buildUserSkillMap(userSkills);

  // --- Required skills score (proficiency-weighted) ---
  let requiredScore = 0;
  const matchedRequired = [];
  const missingRequired = [];

  if (job.requiredSkills.length > 0) {
    job.requiredSkills.forEach((skillName) => {
      const proficiency = userSkillMap[skillName];
      if (proficiency) {
        requiredScore += PROFICIENCY_WEIGHTS[proficiency];
        matchedRequired.push(skillName);
      } else {
        missingRequired.push(skillName);
      }
    });
    requiredScore = requiredScore / (job.requiredSkills.length * MAX_PROFICIENCY_WEIGHT);
  }

  // --- Preferred skills score (presence-only) ---
  let preferredScore = 0;
  const matchedPreferred = [];

  if (job.preferredSkills.length > 0) {
    job.preferredSkills.forEach((skillName) => {
      if (userSkillMap[skillName]) {
        matchedPreferred.push(skillName);
        preferredScore += 1;
      }
    });
    preferredScore = preferredScore / job.preferredSkills.length;
  }

  const matchScore = Number(
    ((requiredScore * REQUIRED_WEIGHT + preferredScore * PREFERRED_WEIGHT) * 100).toFixed(1)
  );

  return {
    matchScore,
    matchedRequired,
    missingRequired,
    matchedPreferred,
  };
};

module.exports = { calculateMatchScore };