const User = require('../models/User.model');
const Job = require('../models/Job.model');
const { getPlatformAnalytics } = require('../services/admin.service');

// @route GET /api/admin/users?page=1&limit=20
const getUsers = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find({}).select('name email role isActive createdAt').sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments({}),
    ]);

    res.status(200).json({
      status: 'success',
      data: { users, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } },
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error fetching users' });
  }
};

// @route PUT /api/admin/users/:id/toggle-active
const toggleUserActive = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ status: 'fail', message: 'Cannot disable an admin account' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      status: 'success',
      data: { id: user._id, isActive: user.isActive },
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error updating user' });
  }
};

// @route GET /api/admin/analytics
const platformAnalytics = async (req, res) => {
  try {
    const data = await getPlatformAnalytics();
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error fetching platform analytics' });
  }
};

// @route POST /api/admin/jobs
const createJob = async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json({ status: 'success', data: { job } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error creating job' });
  }
};

// @route PUT /api/admin/jobs/:id
const updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!job) {
      return res.status(404).json({ status: 'fail', message: 'Job not found' });
    }

    res.status(200).json({ status: 'success', data: { job } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error updating job' });
  }
};

// @route PUT /api/admin/jobs/:id/toggle-active
const toggleJobActive = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ status: 'fail', message: 'Job not found' });
    }

    job.isActive = !job.isActive;
    await job.save();

    res.status(200).json({ status: 'success', data: { id: job._id, isActive: job.isActive } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error updating job' });
  }
};

module.exports = { getUsers, toggleUserActive, platformAnalytics, createJob, updateJob, toggleJobActive };