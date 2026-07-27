const mockProvider = require('./providers/mockProvider');
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

module.exports = { getCareerRecommendation };