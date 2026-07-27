const Roadmap = require('../models/Roadmap.model');
const LearningItem = require('../models/LearningItem.model');
const Skill = require('../models/Skill.model');
const { getRoadmap } = require('../services/ai/aiService');

// @route POST /api/roadmap/generate
const generateRoadmap = async (req, res) => {
  try {
    const { targetRole } = req.body;
    if (!targetRole) {
      return res.status(400).json({ status: 'fail', message: 'targetRole is required' });
    }

    const skills = await Skill.find({ user: req.user.id });
    const inputSnapshot = {
      skills: skills.map((s) => s.name),
      experienceLevel: req.body.experienceLevel || 'student',
    };

    const { parsed, rawResponse } = await getRoadmap({ targetRole, ...inputSnapshot });

    // Seed progressLinks — one entry per topic, unlinked initially
    const progressLinks = parsed.stages.flatMap((stage) =>
      stage.topics.map((t) => ({ topic: t.topic, learningItem: null }))
    );

    const roadmap = await Roadmap.create({
      user: req.user.id,
      targetRole,
      inputSnapshot,
      stages: parsed.stages,
      progressLinks,
      rawModelResponse: rawResponse,
    });

    res.status(201).json({ status: 'success', data: { roadmap } });
  } catch (error) {
    console.error('Roadmap generation error:', error.message);
    res.status(502).json({ status: 'error', message: 'Failed to generate roadmap. Please try again.' });
  }
};

// @route GET /api/roadmap
const getRoadmaps = async (req, res) => {
  try {
    const roadmaps = await Roadmap.find({ user: req.user.id })
      .select('targetRole createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json({ status: 'success', results: roadmaps.length, data: { roadmaps } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error fetching roadmaps' });
  }
};

// @route GET /api/roadmap/:id  — includes live progress status per topic
const getRoadmapById = async (req, res) => {
  try {
    const roadmap = await Roadmap.findOne({ _id: req.params.id, user: req.user.id }).populate(
      'progressLinks.learningItem',
      'status progressPercent'
    );

    if (!roadmap) {
      return res.status(404).json({ status: 'fail', message: 'Roadmap not found' });
    }

    res.status(200).json({ status: 'success', data: { roadmap } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error fetching roadmap' });
  }
};

// @route POST /api/roadmap/:id/link-topic
const linkTopic = async (req, res) => {
  try {
    const { topic, learningItemId, createNew, title } = req.body;

    const roadmap = await Roadmap.findOne({ _id: req.params.id, user: req.user.id });
    if (!roadmap) {
      return res.status(404).json({ status: 'fail', message: 'Roadmap not found' });
    }

    const linkEntry = roadmap.progressLinks.find((p) => p.topic === topic);
    if (!linkEntry) {
      return res.status(400).json({ status: 'fail', message: `Topic "${topic}" not found on this roadmap` });
    }

    let itemId = learningItemId;

    if (createNew) {
      const newItem = await LearningItem.create({
        user: req.user.id,
        title: title || topic,
        type: 'course',
      });
      itemId = newItem._id;
    } else if (learningItemId) {
      // verify ownership of the existing item before linking
      const existing = await LearningItem.findOne({ _id: learningItemId, user: req.user.id });
      if (!existing) {
        return res.status(404).json({ status: 'fail', message: 'Learning item not found' });
      }
    } else {
      return res.status(400).json({
        status: 'fail',
        message: 'Provide either learningItemId or createNew + title',
      });
    }

    linkEntry.learningItem = itemId;
    await roadmap.save();

    res.status(200).json({ status: 'success', data: { roadmap } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error linking topic' });
  }
};

// @route DELETE /api/roadmap/:id
const deleteRoadmap = async (req, res) => {
  try {
    const roadmap = await Roadmap.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!roadmap) {
      return res.status(404).json({ status: 'fail', message: 'Roadmap not found' });
    }
    res.status(200).json({ status: 'success', message: 'Roadmap deleted' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error deleting roadmap' });
  }
};

module.exports = { generateRoadmap, getRoadmaps, getRoadmapById, linkTopic, deleteRoadmap };