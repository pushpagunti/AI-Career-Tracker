const Notification = require('../models/Notification.model');

const createNotification = async (userId, type, message, link = '') => {
  try {
    await Notification.create({ user: userId, type, message, link });
  } catch (error) {
    // Deliberately swallow errors here — a failed notification should never
    // break the primary action that triggered it (e.g. saving a coding problem)
    console.error('Failed to create notification:', error.message);
  }
};

module.exports = { createNotification };