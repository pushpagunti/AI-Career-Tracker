const express = require('express');
const router = express.Router();

const { register, login, logout } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const {
  registerValidation,
  loginValidation,
} = require('../middleware/validators/auth.validator');
const validateRequest = require('../middleware/validateRequest');

router.post('/register', registerValidation, validateRequest, register);
router.post('/login', loginValidation, validateRequest, login);
router.post('/logout', protect, logout);

module.exports = router;