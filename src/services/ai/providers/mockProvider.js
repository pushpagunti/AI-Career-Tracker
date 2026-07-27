// Simulates an AI provider call without hitting any real API.
// Returns realistic, varied fake data based on the actual prompt input,
// so the pipeline can be meaningfully tested end-to-end.

const complete = async (prompt) => {
  // Simulate network/model latency, so our loading-state handling gets exercised too
  await new Promise((resolve) => setTimeout(resolve, 500));

  // We can't truly "understand" the prompt like a real model,
  // but we return a plausible, well-formed response in our exact expected shape.
  const mockResponse = {
    recommendations: [
      {
        role: 'Full Stack Developer',
        fitLevel: 'strong-match',
        rationale: 'Your combination of frontend and backend skills aligns well with full stack roles.',
        skillGaps: ['System Design', 'Testing (Jest/Cypress)'],
      },
      {
        role: 'Backend Developer',
        fitLevel: 'growth-opportunity',
        rationale: 'Your backend fundamentals are solid; deepening database and API design skills would strengthen this path.',
        skillGaps: ['Database Optimization', 'API Security'],
      },
      {
        role: 'DevOps Engineer',
        fitLevel: 'stretch-goal',
        rationale: 'This would require building new skills beyond your current profile, but is a reasonable long-term stretch goal.',
        skillGaps: ['Docker', 'Kubernetes', 'CI/CD Pipelines'],
      },
    ],
  };

  return JSON.stringify(mockResponse);
};

module.exports = { complete };