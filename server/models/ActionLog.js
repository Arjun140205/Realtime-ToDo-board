// backend/models/ActionLog.js

const mongoose = require('mongoose');

const actionLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
  },
  action: {
    type: String,
    required: true,
    enum: ['created', 'updated', 'deleted', 'assigned'],
  },
  description: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('ActionLog', actionLogSchema);