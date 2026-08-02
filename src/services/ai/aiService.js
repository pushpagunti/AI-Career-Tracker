const mockProvider = require('../ai/providers/mockProvider');
const claudeProvider = require('./providers/claudeProvider');
const buildCareerRecommendationPrompt = require('./prompts/careerRecommendation.prompt');

const providers = {
  mock: mockProvider,
  claude: claudeProvider,
};

const getActiveProvider = () => {
  const providerName = process.env.AI_PROVIDER || 'mock';
  const provider = providers[providerName];

  if (!provider) {
    throw new Error(`Unknown AI provider: ${providerName}`);
  }

  return provider;
};

// Strips common wrapper artifacts models sometimes add, despite instructions
const cleanJsonResponse = (raw) => {
  let cleaned = raw.trim();
  cleaned = cleaned.replace(/^```json\s*/i, '').replace(/^```\s*/i, '');
  cleaned = cleaned.replace(/```\s*$/i, '');
  return cleaned.trim();
};

// Validates the shape matches exactly what we expect — never trust external output blindly
const validateCareerRecommendationShape = (data) => {
  if (!data || !Array.isArray(data.recommendations)) {
    throw new Error('Invalid response shape: missing recommendations array');
  }

  const validFitLevels = ['strong-match', 'growth-opportunity', 'stretch-goal'];

  data.recommendations.forEach((rec, i) => {
    if (typeof rec.role !== 'string' || !rec.role) {
      throw new Error(`Recommendation ${i}: missing or invalid 'role'`);
    }
    if (!validFitLevels.includes(rec.fitLevel)) {
      throw new Error(`Recommendation ${i}: invalid 'fitLevel' value`);
    }
    if (typeof rec.rationale !== 'string' || !rec.rationale) {
      throw new Error(`Recommendation ${i}: missing or invalid 'rationale'`);
    }
    if (!Array.isArray(rec.skillGaps)) {
      throw new Error(`Recommendation ${i}: 'skillGaps' must be an array`);
    }
  });

  return true;
};

const getCareerRecommendation = async ({ skills, experienceLevel, careerGoal }) => {
  const provider = getActiveProvider();
  const prompt = buildCareerRecommendationPrompt({ skills, experienceLevel, careerGoal });

  const rawResponse = await provider.complete(prompt);
  const cleaned = cleanJsonResponse(rawResponse);

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    throw new Error('AI response was not valid JSON');
  }

  validateCareerRecommendationShape(parsed);

  return { parsed, rawResponse };
};

const buildRoadmapPrompt = require('./prompts/roadmapGenerator.prompt');

// ... (keep everything already in the file: cleanJsonResponse, getActiveProvider, etc.)

const validateRoadmapShape = (data) => {
  if (!data || !Array.isArray(data.stages) || data.stages.length === 0) {
    throw new Error('Invalid response shape: missing stages array');
  }

  data.stages.forEach((stage, i) => {
    if (typeof stage.stageTitle !== 'string' || !stage.stageTitle) {
      throw new Error(`Stage ${i}: missing or invalid 'stageTitle'`);
    }
    if (!Array.isArray(stage.topics) || stage.topics.length === 0) {
      throw new Error(`Stage ${i}: 'topics' must be a non-empty array`);
    }
    stage.topics.forEach((topic, j) => {
      if (typeof topic.topic !== 'string' || !topic.topic) {
        throw new Error(`Stage ${i}, topic ${j}: missing or invalid 'topic'`);
      }
    });
  });

  return true;
};

const getRoadmap = async ({ targetRole, skills, experienceLevel }) => {
  const provider = getActiveProvider();
  const prompt = buildRoadmapPrompt({ targetRole, skills, experienceLevel });

  const rawResponse = await provider.complete(prompt, 'roadmap');
  const cleaned = cleanJsonResponse(rawResponse);

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    throw new Error('AI response was not valid JSON');
  }

  validateRoadmapShape(parsed);

  return { parsed, rawResponse };
};
const buildInterviewQuestionsPrompt = require('./prompts/interviewQuestions.prompt');
const buildAnswerEvaluationPrompt = require('./prompts/answerEvaluation.prompt');

// ... keep everything already there

const validateInterviewQuestionsShape = (data, expectedCount) => {
  if (!data || !Array.isArray(data.questions) || data.questions.length === 0) {
    throw new Error('Invalid response shape: missing questions array');
  }
  data.questions.forEach((q, i) => {
    if (typeof q !== 'string' || !q.trim()) {
      throw new Error(`Question ${i}: invalid or empty`);
    }
  });
  return true;
};

const validateAnswerEvaluationShape = (data) => {
  if (!data || typeof data.score !== 'number' || data.score < 1 || data.score > 10) {
    throw new Error('Invalid response shape: score must be a number between 1 and 10');
  }
  if (!Array.isArray(data.strengths) || !Array.isArray(data.improvements)) {
    throw new Error('Invalid response shape: strengths/improvements must be arrays');
  }
  if (typeof data.modelAnswerNotes !== 'string') {
    throw new Error('Invalid response shape: modelAnswerNotes must be a string');
  }
  return true;
};

const getInterviewQuestions = async ({ role, difficulty, questionCount }) => {
  const provider = getActiveProvider();
  const prompt = buildInterviewQuestionsPrompt({ role, difficulty, questionCount });

  const rawResponse = await provider.complete(prompt, 'interviewQuestions', { questionCount });
  const cleaned = cleanJsonResponse(rawResponse);

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    throw new Error('AI response was not valid JSON');
  }

  validateInterviewQuestionsShape(parsed, questionCount);
  return { parsed, rawResponse };
};

const getAnswerEvaluation = async ({ role, question, answer }) => {
  const provider = getActiveProvider();
  const prompt = buildAnswerEvaluationPrompt({ role, question, answer });

  const rawResponse = await provider.complete(prompt, 'answerEvaluation');
  const cleaned = cleanJsonResponse(rawResponse);

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    throw new Error('AI response was not valid JSON');
  }

  validateAnswerEvaluationShape(parsed);
  return { parsed, rawResponse };
};

module.exports = {
  getCareerRecommendation,
  getRoadmap,
  getInterviewQuestions,
  getAnswerEvaluation,
};

