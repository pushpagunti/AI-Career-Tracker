// Simulates an AI provider call without hitting any real API.
// Returns realistic fake data for different AI features.

const mockCareerRecommendation = {
  recommendations: [
    {
      role: 'Full Stack Developer',
      fitLevel: 'strong-match',
      rationale:
        'Your combination of frontend and backend skills aligns well with full stack roles.',
      skillGaps: ['System Design', 'Testing (Jest/Cypress)'],
    },
    {
      role: 'Backend Developer',
      fitLevel: 'growth-opportunity',
      rationale:
        'Your backend fundamentals are solid; deepening database and API design skills would strengthen this path.',
      skillGaps: ['Database Optimization', 'API Security'],
    },
    {
      role: 'DevOps Engineer',
      fitLevel: 'stretch-goal',
      rationale:
        'This would require building new skills beyond your current profile, but is a reasonable long-term stretch goal.',
      skillGaps: ['Docker', 'Kubernetes', 'CI/CD Pipelines'],
    },
  ],
};

const mockRoadmap = {
  stages: [
    {
      stageTitle: 'Foundation',
      estimatedDuration: '4-6 weeks',
      topics: [
        {
          topic: 'REST API Design',
          description:
            'Core to building backend services that any frontend or client can consume.',
          resources: [
            'Official REST API documentation',
            'Build a CRUD API project',
          ],
        },
        {
          topic: 'Database Fundamentals',
          description:
            'Understanding schema design and queries is essential for backend roles.',
          resources: [
            'MongoDB University',
            'Practice database design',
          ],
        },
      ],
    },
    {
      stageTitle: 'Intermediate',
      estimatedDuration: '6-8 weeks',
      topics: [
        {
          topic: 'Authentication & Authorization',
          description:
            'Learn secure authentication using JWT and role-based access control.',
          resources: [
            'JWT Documentation',
            'Build an authentication system',
          ],
        },
        {
          topic: 'System Design Basics',
          description:
            'Understand scalability, load balancing, caching, and architecture.',
          resources: [
            'System Design Primer (GitHub)',
            'Design practice exercises',
          ],
        },
      ],
    },
    {
      stageTitle: 'Advanced',
      estimatedDuration: '6-10 weeks',
      topics: [
        {
          topic: 'Microservices & Docker',
          description:
            'Containerize applications and understand distributed architectures.',
          resources: [
            'Docker Official Docs',
            'Containerize an existing project',
          ],
        },
      ],
    },
  ],
};

const mockInterviewQuestions = (questionCount) => ({
  questions: Array.from({ length: questionCount }, (_, i) =>
    i === 0
      ? 'Tell me about a challenging project you worked on and how you approached it.'
      : `Mock technical question ${i + 1} for this role.`
  ),
});

const mockAnswerEvaluation = {
  score: 7,
  strengths: [
    'Clear structure in your answer',
    'Good use of a concrete example',
  ],
  improvements: [
    'Could go deeper into trade-offs considered',
    'Mention specific tools/technologies used',
  ],
  modelAnswerNotes:
    'A strong answer would also quantify the impact and discuss what you would do differently.',
};

// Simulates an AI provider call
const complete = async (
  prompt,
  responseType = 'careerRecommendation',
  options = {}
) => {
  // Simulate API latency
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (responseType === 'interviewQuestions') {
    return JSON.stringify(
      mockInterviewQuestions(options.questionCount || 5)
    );
  }

  const mockResponses = {
    careerRecommendation: mockCareerRecommendation,
    roadmap: mockRoadmap,
    answerEvaluation: mockAnswerEvaluation,
  };

  return JSON.stringify(mockResponses[responseType] || {});
};

module.exports = { complete };