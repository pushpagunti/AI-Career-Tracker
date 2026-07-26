const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ status: 'fail', message: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id); // attach user to request

    if (!req.user) {
      return res.status(401).json({ status: 'fail', message: 'User no longer exists' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ status: 'fail', message: 'Not authorized, invalid token' });
  }
};

// Role-based access control — we'll use this for the Admin Panel later
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: `Role '${req.user.role}' is not permitted to access this resource`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };