const Notification = require('../models/Notification.model');

// @route GET /api/notifications?unreadOnly=true
const getNotifications = async (req, res) => {
  try {
    const filter = { user: req.user.id };
    if (req.query.unreadOnly === 'true') {
      filter.isRead = false;
    }

    const notifications = await Notification.find(filter).sort({ createdAt: -1 }).limit(50);

    res.status(200).json({ status: 'success', results: notifications.length, data: { notifications } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error fetching notifications' });
  }
};

// @route GET /api/notifications/unread-count
const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({ user: req.user.id, isRead: false });
    res.status(200).json({ status: 'success', data: { count } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error fetching unread count' });
  }
};

// @route PUT /api/notifications/:id/read
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ status: 'fail', message: 'Notification not found' });
    }

    res.status(200).json({ status: 'success', data: { notification } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error updating notification' });
  }
};

// @route PUT /api/notifications/read-all
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user.id, isRead: false }, { isRead: true });
    res.status(200).json({ status: 'success', message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error updating notifications' });
  }
};

module.exports = { getNotifications, getUnreadCount, markAsRead, markAllAsRead };