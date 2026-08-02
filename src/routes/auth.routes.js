const { authLimiter } = require('../middleware/rateLimiter');
const express = require('express');
const router = express.Router();

const {
  register,
  login,
  logout,
  getMe
} = require('../controllers/auth.controller');

const { protect } = require('../middleware/auth.middleware');

const {
  registerValidation,
  loginValidation,
} = require('../middleware/validators/auth.validator');

const validateRequest = require('../middleware/validateRequest');


// Get currently logged-in user
router.get('/me', protect, getMe);


// Auth routes
router.post('/register',  authLimiter,registerValidation, validateRequest, register);

router.post('/login', authLimiter, loginValidation, validateRequest, login);

router.post('/logout', protect, logout);


module.exports = router;