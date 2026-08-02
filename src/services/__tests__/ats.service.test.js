const { calculateKeywordMatch, calculateStructureScore } = require('../ats.service');

describe('calculateKeywordMatch', () => {
  it('correctly identifies matched and missing keywords', () => {
    const resumeText = 'Experienced with react node.js and mongodb';
    const jobDescription = 'Looking for a developer skilled in react, docker, and mongodb';

    const result = calculateKeywordMatch(resumeText, jobDescription);

    expect(result.matched).toEqual(expect.arrayContaining(['react', 'mongodb']));
    expect(result.missing).toEqual(expect.arrayContaining(['docker']));
    expect(result.percentage).toBeCloseTo(66.7, 1); // 2 of 3 JD keywords matched
  });

  it('returns 0% when the job description has no recognized keywords', () => {
    const result = calculateKeywordMatch('react node.js', 'a great opportunity for a motivated person');
    expect(result.percentage).toBe(0);
  });

  it('does not false-match "java" inside "javascript"', () => {
    const result = calculateKeywordMatch('experienced in javascript', 'looking for a java developer');
    expect(result.matched).not.toContain('java');
  });
});

describe('calculateStructureScore', () => {
  it('flags a missing summary and missing phone number', () => {
    const resume = {
      summary: '',
      personalInfo: { email: 'test@test.com', phone: '' },
      education: [{ degree: 'B.Tech' }],
      experience: [],
      projects: [{ title: 'Project' }],
      skills: [{ category: 'frontend', items: ['react'] }],
    };

    const result = calculateStructureScore(resume);
    const summaryCheck = result.checks.find((c) => c.label === 'Professional Summary');
    const contactCheck = result.checks.find((c) => c.label === 'Contact Information');

    expect(summaryCheck.passed).toBe(false);
    expect(contactCheck.passed).toBe(false);
  });

  it('passes the quantified achievements check when 30%+ of bullets contain numbers', () => {
    const resume = {
      summary: 'A solid summary here with enough length.',
      personalInfo: { email: 'a@b.com', phone: '1234567890' },
      education: [{ degree: 'B.Tech' }],
      experience: [{ bullets: ['Improved performance by 30%', 'Worked on a team', 'Wrote documentation'] }],
      projects: [],
      skills: [{ category: 'frontend', items: ['react'] }],
    };

    const result = calculateStructureScore(resume);
    const metricsCheck = result.checks.find((c) => c.label === 'Quantified Achievements');
    expect(metricsCheck.passed).toBe(true); // 1 of 3 bullets = 33%, above our 30% threshold
  });
});