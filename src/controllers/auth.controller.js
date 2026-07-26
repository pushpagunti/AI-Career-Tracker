const User = require('../models/User.model');
const generateToken = require('../utils/generateToken');

// Helper: Send JWT as httpOnly cookie
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id, user.role);

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  res.cookie('token', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
};


// @desc    Register a new user
// @route   POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        status: 'fail',
        message: 'An account with this email already exists',
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    sendTokenResponse(user, 201, res);

  } catch (error) {
    console.error('Register Error:', error);

    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};


// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid email or password',
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid email or password',
      });
    }

    sendTokenResponse(user, 200, res);

  } catch (error) {
    console.error('Login Error:', error);

    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};


// @desc    Logout user
// @route   POST /api/auth/logout
const logout = (req, res) => {

  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully',
  });
};


// @desc    Get currently logged in user
// @route   GET /api/auth/me
const getMe = async (req, res) => {

  res.status(200).json({
    status: 'success',
    data: {
      user: req.user,
    },
  });

};


// Export controllers
module.exports = {
  register,
  login,
  logout,
  getMe,
};