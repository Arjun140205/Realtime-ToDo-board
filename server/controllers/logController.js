// backend/controllers/logController.js

const ActionLog = require('../models/ActionLog');

const getRecentLogs = async (req, res, next) => {
  try {
    const logs = await ActionLog.find()
      .sort({ timestamp: -1 })
      .limit(20)
      .populate('user', 'name email')
      .populate('task', 'title');

    res.json(logs);
  } catch (err) {
    next(err);
  }
};

module.exports = { getRecentLogs };