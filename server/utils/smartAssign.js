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
  const chosen = sorted[0];
  if (chosen) {
    console.log(`[SmartAssign] Chose user: ${chosen.user.name} <${chosen.user.email}> (active tasks: ${chosen.count})`);
  } else {
    console.log('[SmartAssign] No users found to assign.');
  }
  return chosen?.user?._id || null;
};

module.exports = { getSmartAssignedUser };