// backend/utils/smartAssign.js

const User = require('../models/User');
const Task = require('../models/Task');

// Returns user ID with least active tasks
const getSmartAssignedUser = async () => {
  const users = await User.find();

  const userTaskCounts = await Promise.all(
    users.map(async (user) => {
      const count = await Task.countDocuments({
        assignedTo: user._id,
        status: { $ne: 'Done' }, // Only count active tasks
      });
      return { user, count };
    })
  );

  const sorted = userTaskCounts.sort((a, b) => a.count - b.count);
  return sorted[0]?.user?._id || null;
};

module.exports = { getSmartAssignedUser };