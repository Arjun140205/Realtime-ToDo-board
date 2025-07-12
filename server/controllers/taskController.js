// backend/controllers/taskController.js

const Task = require('../models/Task');
const User = require('../models/User');
const { getSmartAssignedUser } = require('../utils/smartAssign');
const { logAction } = require('../utils/logger');

const reservedTitles = ['Todo', 'In Progress', 'Done'];

// CREATE
const createTask = async (req, res, next) => {
  try {
    const { title, description, assignedTo, priority } = req.body;

    if (reservedTitles.includes(title)) {
      return res.status(400).json({ message: 'Title cannot match column names' });
    }

    const exists = await Task.findOne({ title });
    if (exists) return res.status(400).json({ message: 'Task title already exists' });

    const task = await Task.create({
      title,
      description,
      assignedTo,
      priority,
    });
    await logAction({
  userId: req.user._id,
  taskId: task._id,
  action: 'created',
  description: `Created task: ${task.title}`,
});

    // Emit socket update
    req.app.get('io').emit('taskCreated', task);

    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

// GET
const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find().populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};
// UPDATE
const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { lastModified: clientTimestamp, ...updateData } = req.body;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const serverTimestamp = new Date(task.lastModified).getTime();
    const clientTime = new Date(clientTimestamp).getTime();

    // Conflict check
    if (Math.abs(serverTimestamp - clientTime) > 1000) { // 1 second tolerance
      return res.status(409).json({
        message: 'Conflict detected',
        conflict: true,
        clientVersion: { ...task.toObject(), ...updateData },
        serverVersion: task,
      });
    }

    // No conflict — proceed
    task.set({ ...updateData, lastModified: Date.now() });
    await task.save();

    const updated = await Task.findById(id).populate('assignedTo', 'name email');

    req.app.get('io').emit('taskUpdated', updated);
    await logAction({
      userId: req.user._id,
      taskId: id,
      action: 'updated',
      description: `Updated task: ${updated.title}`,
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
};
// DELETE
const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);

    if (!task) return res.status(404).json({ message: 'Task not found' });

    await logAction({
      userId: req.user._id,
      taskId: id,
      action: 'deleted',
      description: `Deleted task`,
    });

    req.app.get('io').emit('taskDeleted', id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
};
// Assign task to least-burdened user
const smartAssignToTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const smartUserId = await getSmartAssignedUser();
    if (!smartUserId) return res.status(500).json({ message: 'No users found' });

    task.assignedTo = smartUserId;
    task.lastModified = Date.now();

    await task.save();

    await logAction({
      userId: req.user._id,
      taskId: task._id,
      action: 'assigned',
      description: `Smart-assigned to user ${smartUserId}`,
    });

    const updated = await Task.findById(id).populate('assignedTo', 'name email');
    req.app.get('io').emit('taskUpdated', updated);

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask, smartAssignToTask };