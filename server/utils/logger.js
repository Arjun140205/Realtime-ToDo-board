// backend/utils/logger.js

const ActionLog = require('../models/ActionLog');

const logAction = async ({ userId, taskId, action, description }) => {
  try {
    await ActionLog.create({
      user: userId,
      task: taskId,
      action,
      description,
    });
  } catch (err) {
    console.error('Action log failed:', err.message);
  }
};

module.exports = { logAction };