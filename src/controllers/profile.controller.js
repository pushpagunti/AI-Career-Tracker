const Profile = require('../models/Profile.model');

// @route GET /api/profile
const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({
        status: 'fail',
        message: 'Profile not found. Please create one.',
      });
    }

    res.status(200).json({ status: 'success', data: { profile } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error fetching profile' });
  }
};

// @route POST /api/profile
const createProfile = async (req, res) => {
  try {
    const existing = await Profile.findOne({ user: req.user.id });
    if (existing) {
      return res.status(400).json({
        status: 'fail',
        message: 'Profile already exists. Use update instead.',
      });
    }

    const profile = await Profile.create({ ...req.body, user: req.user.id });
    res.status(201).json({ status: 'success', data: { profile } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error creating profile' });
  }
};

// @route PUT /api/profile
const updateProfile = async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $set: req.body },
      { new: true, runValidators: true } // return updated doc, still enforce schema rules
    );

    if (!profile) {
      return res.status(404).json({
        status: 'fail',
        message: 'Profile not found. Please create one first.',
      });
    }

    res.status(200).json({ status: 'success', data: { profile } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error updating profile' });
  }
};

module.exports = { getProfile, createProfile, updateProfile };Y
