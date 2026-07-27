const buildCareerRecommendationPrompt = ({ skills, experienceLevel, careerGoal }) => {
  const skillList = skills.length > 0 ? skills.join(', ') : 'no skills recorded yet';

  return `You are a career advisor for software engineering students and early-career developers.

User profile:
- Experience level: ${experienceLevel}
- Stated career goal: ${careerGoal || 'not specified'}
- Current skills: ${skillList}

Based on this profile, suggest 2 to 3 realistic career paths/roles that fit this person right now or represent a reasonable next step.

Respond with ONLY valid JSON, no markdown formatting, no code fences, no extra text before or after. Use exactly this structure:

{
  "recommendations": [
    {
      "role": "string - job title",
      "fitLevel": "strong-match" | "growth-opportunity" | "stretch-goal",
      "rationale": "string - 1-2 sentences explaining why this fits, referencing their actual skills",
      "skillGaps": ["string", "string"]
    }
  ]
}`;
};

module.exports = buildCareerRecommendationPrompt;