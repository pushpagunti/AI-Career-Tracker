process.env.AI_PROVIDER = 'mock';

const { getCareerRecommendation } = require('../ai/aiService');

describe('getCareerRecommendation (via mock provider)', () => {

  it('returns validated, parsed recommendations from the mock provider', async () => {
    const result = await getCareerRecommendation({
      skills: ['React', 'Node.js'],
      experienceLevel: 'student',
      careerGoal: 'Full Stack Developer',
    });

    expect(result.parsed).toHaveProperty('recommendations');
    expect(Array.isArray(result.parsed.recommendations)).toBe(true);
    expect(result.parsed.recommendations.length).toBeGreaterThan(0);

    result.parsed.recommendations.forEach((rec) => {
      expect(['strong-match', 'growth-opportunity', 'stretch-goal']).toContain(rec.fitLevel);
      expect(typeof rec.role).toBe('string');
      expect(Array.isArray(rec.skillGaps)).toBe(true);
    });
  });

  it('rejects malformed JSON gracefully', async () => {
    const mockProvider = require('../ai/providers/mockProvider');
    const original = mockProvider.complete;

    mockProvider.complete = jest.fn().mockResolvedValue('not valid json{{{');

    await expect(
      getCareerRecommendation({
        skills: [],
        experienceLevel: 'student',
        careerGoal: '',
      })
    ).rejects.toThrow('AI response was not valid JSON');

    mockProvider.complete = original;
  });

  it('rejects a validly-parsed but wrongly-shaped response', async () => {
    const mockProvider = require('../ai/providers/mockProvider');
    const original = mockProvider.complete;

    mockProvider.complete = jest.fn().mockResolvedValue(
      JSON.stringify({ wrongField: true })
    );

    await expect(
      getCareerRecommendation({
        skills: [],
        experienceLevel: 'student',
        careerGoal: '',
      })
    ).rejects.toThrow('Invalid response shape');

    mockProvider.complete = original;
  });
});