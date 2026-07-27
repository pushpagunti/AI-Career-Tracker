const buildAnswerEvaluationPrompt = ({ role, question, answer }) => {
  return `You are a technical interviewer evaluating a candidate's answer during a mock interview for a ${role} position.

Question asked: "${question}"
Candidate's answer: "${answer}"

Evaluate this answer honestly and constructively. Consider technical accuracy (if applicable), clarity, and completeness.

Respond with ONLY valid JSON, no markdown formatting, no code fences, no extra text before or after. Use exactly this structure:

{
  "score": 1-10 (integer),
  "strengths": ["string", "string"],
  "improvements": ["string", "string"],
  "modelAnswerNotes": "string - brief note on what a strong answer would include"
}`;
};

module.exports = buildAnswerEvaluationPrompt;