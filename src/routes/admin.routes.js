const express = require('express');
const router = express.Router();
const {
  getUsers,
  toggleUserActive,
  platformAnalytics,
  createJob,
  updateJob,
  toggleJobActive,
} = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect, authorize('admin')); // every route below requires an authenticated admin

router.get('/users', getUsers);
router.put('/users/:id/toggle-active', toggleUserActive);
router.get('/analytics', platformAnalytics);
router.post('/jobs', createJob);
router.put('/jobs/:id', updateJob);
router.put('/jobs/:id/toggle-active', toggleJobActive);
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: "Admin route is working"
  });
});
module.exports = router;