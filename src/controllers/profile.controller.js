const Profile = require('../models/Profile.model');


// @desc    Get logged-in user's profile
// @route   GET /api/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', 'name email role');

    if (!profile) {
      return res.status(404).json({
        status: 'fail',
        message: 'Profile not found. Please create one.',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        profile,
      },
    });

  } catch (error) {
    console.error('Get Profile Error:', error);

    res.status(500).json({
      status: 'error',
      message: 'Server error fetching profile',
    });
  }
};



// @desc    Create profile
// @route   POST /api/profile
// @access  Private
const createProfile = async (req, res) => {
  try {

    const existingProfile = await Profile.findOne({
      user: req.user.id,
    });


    if (existingProfile) {
      return res.status(400).json({
        status: 'fail',
        message: 'Profile already exists. Use update instead.',
      });
    }


    const profile = await Profile.create({
      ...req.body,
      user: req.user.id,
    });


    res.status(201).json({
      status: 'success',
      data: {
        profile,
      },
    });


  } catch (error) {

    console.error('Create Profile Error:', error);


    res.status(500).json({
      status: 'error',
      message: 'Server error creating profile',
    });

  }
};




// @desc    Update profile
// @route   PUT /api/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {


    const profile = await Profile.findOneAndUpdate(
      {
        user: req.user.id,
      },
      {
        $set: req.body,
      },
      {
        new: true,
        runValidators: true,
      }
    );


    if (!profile) {
      return res.status(404).json({
        status: 'fail',
        message: 'Profile not found. Please create one first.',
      });
    }


    res.status(200).json({
      status: 'success',
      data: {
        profile,
      },
    });


  } catch (error) {

    console.error('Update Profile Error:', error);


    res.status(500).json({
      status: 'error',
      message: 'Server error updating profile',
    });

  }
};



module.exports = {
  getProfile,
  createProfile,
  updateProfile,
};