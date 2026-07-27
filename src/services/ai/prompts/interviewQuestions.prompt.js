const buildInterviewQuestionsPrompt = ({ role, difficulty, questionCount }) => {
  return `You are a technical interviewer conducting a mock interview for a ${role} position.

Generate exactly ${questionCount} interview questions at ${difficulty} difficulty level, appropriate for this role. Mix technical and behavioral questions where relevant to the role, weighted toward technical.

Respond with ONLY valid JSON, no markdown formatting, no code fences, no extra text before or after. Use exactly this structure:

{
  "questions": ["string", "string"]
}`;
};

module.exports = buildInterviewQuestionsPrompt;