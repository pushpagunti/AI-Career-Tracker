const InterviewSession = require('../models/InterviewSession.model');
const { getInterviewQuestions, getAnswerEvaluation } = require('../services/ai/aiService');

// @route POST /api/interview/start
const startInterview = async (req, res) => {
  try {
    const { role, difficulty = 'intermediate', questionCount = 5 } = req.body;

    if (!role) {
      return res.status(400).json({ status: 'fail', message: 'role is required' });
    }
    if (![3, 5, 10].includes(Number(questionCount))) {
      return res.status(400).json({ status: 'fail', message: 'questionCount must be 3, 5, or 10' });
    }

    const { parsed, rawResponse } = await getInterviewQuestions({ role, difficulty, questionCount });

    const session = await InterviewSession.create({
      user: req.user.id,
      role,
      difficulty,
      questions: parsed.questions.map((q) => ({ questionText: q })),
    });

    res.status(201).json({ status: 'success', data: { session } });
  } catch (error) {
    console.error('Interview start error:', error.message);
    res.status(502).json({ status: 'error', message: 'Failed to start interview. Please try again.' });
  }
};

// @route POST /api/interview/:sessionId/answer
const submitAnswer = async (req, res) => {
  try {
    const { questionIndex, answer } = req.body;

    if (typeof questionIndex !== 'number' || !answer || !answer.trim()) {
      return res.status(400).json({
        status: 'fail',
        message: 'questionIndex (number) and answer (non-empty string) are required',
      });
    }

    const session = await InterviewSession.findOne({ _id: req.params.sessionId, user: req.user.id });
    if (!session) {
      return res.status(404).json({ status: 'fail', message: 'Interview session not found' });
    }

    if (session.status === 'completed') {
      return res.status(400).json({ status: 'fail', message: 'This interview session is already completed' });
    }

    const targetQuestion = session.questions[questionIndex];
    if (!targetQuestion) {
      return res.status(400).json({ status: 'fail', message: 'Invalid questionIndex' });
    }

    if (targetQuestion.userAnswer) {
      return res.status(400).json({ status: 'fail', message: 'This question has already been answered' });
    }

    const { parsed, rawResponse } = await getAnswerEvaluation({
      role: session.role,
      question: targetQuestion.questionText,
      answer,
    });

    targetQuestion.userAnswer = answer;
    targetQuestion.feedback = parsed;
    targetQuestion.answeredAt = new Date();

    await session.save();

    res.status(200).json({ status: 'success', data: { question: targetQuestion } });
  } catch (error) {
    console.error('Answer evaluation error:', error.message);
    res.status(502).json({ status: 'error', message: 'Failed to evaluate answer. Please try again.' });
  }
};

// @route POST /api/interview/:id/complete
const completeInterview = async (req, res) => {
  try {
    const session = await InterviewSession.findOne({ _id: req.params.id, user: req.user.id });
    if (!session) {
      return res.status(404).json({ status: 'fail', message: 'Interview session not found' });
    }

    const answeredQuestions = session.questions.filter((q) => q.feedback.score !== null);
    if (answeredQuestions.length === 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'Cannot complete an interview with no answered questions',
      });
    }

    const avgScore =
      answeredQuestions.reduce((sum, q) => sum + q.feedback.score, 0) / answeredQuestions.length;

    session.status = 'completed';
    session.overallScore = Number(avgScore.toFixed(1));
    session.completedAt = new Date();

    await session.save();

    res.status(200).json({ status: 'success', data: { session } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error completing interview' });
  }
};

// @route GET /api/interview
const getInterviews = async (req, res) => {
  try {
    const sessions = await InterviewSession.find({ user: req.user.id })
      .select('role difficulty status overallScore createdAt completedAt')
      .sort({ createdAt: -1 });

    res.status(200).json({ status: 'success', results: sessions.length, data: { sessions } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error fetching interview sessions' });
  }
};

// @route GET /api/interview/:id
const getInterviewById = async (req, res) => {
  try {
    const session = await InterviewSession.findOne({ _id: req.params.id, user: req.user.id });
    if (!session) {
      return res.status(404).json({ status: 'fail', message: 'Interview session not found' });
    }
    res.status(200).json({ status: 'success', data: { session } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error fetching interview session' });
  }
};

module.exports = { startInterview, submitAnswer, completeInterview, getInterviews, getInterviewById };