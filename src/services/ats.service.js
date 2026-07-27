const skillsDictionary = require('../data/skillsDictionary');

// --- Text normalization helpers ---

const normalize = (text) => text.toLowerCase().replace(/[^\w\s+.#-]/g, ' ');

// --- Step A: extract known keywords from any text (JD or resume) ---
const extractKeywords = (text) => {
  const normalized = normalize(text);
  const found = new Set();

  skillsDictionary.forEach((keyword) => {
    // word-boundary-ish check so "java" doesn't match inside "javascript"
    const pattern = new RegExp(`(^|\\s)${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s|$)`, 'i');
    if (pattern.test(normalized)) {
      found.add(keyword);
    }
  });

  return [...found];
};

// --- Step B: compare JD keywords against resume text ---
const calculateKeywordMatch = (resumeText, jobDescription) => {
  const jdKeywords = extractKeywords(jobDescription);
  const resumeKeywords = new Set(extractKeywords(resumeText));

  const matched = jdKeywords.filter((kw) => resumeKeywords.has(kw));
  const missing = jdKeywords.filter((kw) => !resumeKeywords.has(kw));

  const percentage = jdKeywords.length === 0 ? 0 : Number(((matched.length / jdKeywords.length) * 100).toFixed(1));

  return { matched, missing, percentage };
};

// --- Step C: convert a Resume document into a flat searchable string ---
const resumeToText = (resume) => {
  const parts = [
    resume.summary,
    ...(resume.experience || []).flatMap((e) => [e.role, e.company, ...(e.bullets || [])]),
    ...(resume.projects || []).flatMap((p) => [p.title, p.description, ...(p.techStack || [])]),
    ...(resume.skills || []).flatMap((s) => s.items || []),
    ...(resume.certifications || []).map((c) => c.name),
  ];

  return parts.filter(Boolean).join(' ');
};

// --- Step D: structure/formatting checks ---
const calculateStructureScore = (resume) => {
  const checks = [];

  checks.push({
    label: 'Professional Summary',
    passed: Boolean(resume.summary && resume.summary.trim().length > 20),
    message: 'Add a concise 2-3 sentence summary at the top of your resume.',
  });

  checks.push({
    label: 'Contact Information',
    passed: Boolean(resume.personalInfo?.email && resume.personalInfo?.phone),
    message: 'Include both an email and a phone number.',
  });

  checks.push({
    label: 'Education Section',
    passed: (resume.education || []).length > 0,
    message: 'Add at least one education entry.',
  });

  checks.push({
    label: 'Experience or Projects',
    passed: (resume.experience || []).length > 0 || (resume.projects || []).length > 0,
    message: 'Add at least one experience entry or project.',
  });

  const allBullets = (resume.experience || []).flatMap((e) => e.bullets || []);
  const bulletsWithMetrics = allBullets.filter((b) => /\d/.test(b));
  checks.push({
    label: 'Quantified Achievements',
    passed: allBullets.length > 0 && bulletsWithMetrics.length / allBullets.length >= 0.3,
    message: 'Add numbers/metrics to your bullet points (e.g. "improved load time by 30%").',
  });

  checks.push({
    label: 'Skills Section',
    passed: (resume.skills || []).some((s) => (s.items || []).length > 0),
    message: 'Add a populated skills section.',
  });

  const passedCount = checks.filter((c) => c.passed).length;
  const percentage = Number(((passedCount / checks.length) * 100).toFixed(1));

  return { checks, percentage };
};

// --- Step E: combine into overall score ---
const KEYWORD_WEIGHT = 0.6;
const STRUCTURE_WEIGHT = 0.4;

const generateAtsScore = (resume, jobDescription) => {
  const resumeText = resumeToText(resume);
  const keywordScore = calculateKeywordMatch(resumeText, jobDescription);
  const structureScore = calculateStructureScore(resume);

  const overallScore = Number(
    (keywordScore.percentage * KEYWORD_WEIGHT + structureScore.percentage * STRUCTURE_WEIGHT).toFixed(1)
  );

  return { keywordScore, structureScore, overallScore };
};

module.exports = { extractKeywords, calculateKeywordMatch, calculateStructureScore, generateAtsScore };