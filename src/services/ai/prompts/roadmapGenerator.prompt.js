const buildRoadmapPrompt = ({ targetRole, skills, experienceLevel }) => {
  const skillList = skills.length > 0 ? skills.join(', ') : 'no skills recorded yet';

  return `You are a career mentor creating a learning roadmap for a software engineering student or early-career developer.

Target role: ${targetRole}
Current experience level: ${experienceLevel}
Current skills: ${skillList}

Create a staged learning roadmap to help this person reach the target role, building on what they already know and avoiding topics they've already covered where reasonable. Use 3 to 4 stages, ordered from foundational to advanced. Each stage should have 2 to 4 topics.

Respond with ONLY valid JSON, no markdown formatting, no code fences, no extra text before or after. Use exactly this structure:

{
  "stages": [
    {
      "stageTitle": "string - e.g. Foundation, Intermediate, Advanced",
      "estimatedDuration": "string - e.g. '4-6 weeks'",
      "topics": [
        {
          "topic": "string - specific skill or subject",
          "description": "string - 1 sentence on why this matters for the target role",
          "resources": ["string", "string"]
        }
      ]
    }
  ]
}`;
};

module.exports = buildRoadmapPrompt;