const express = require('express');
const router = express.Router();
const { getProfile, createProfile, updateProfile } = require('../controllers/profile.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect); // every route below requires authentication

router.get('/', getProfile);
router.post('/', createProfile);
router.put('/', updateProfile);

module.exports = router;