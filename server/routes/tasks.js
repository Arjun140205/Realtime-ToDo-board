// backend/routes/tasks.js

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  smartAssignToTask,
} = require('../controllers/taskController');

router.use(protect);

router.post('/', createTask);
router.get('/', getTasks);
router.put('/:id', updateTask);
router.put('/:id/smart-assign', smartAssignToTask);
router.delete('/:id', deleteTask);

module.exports = router;