import API from '../utils/api';

const TaskCard = ({ task }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('taskId', task._id);
  };

  const handleSmartAssign = async () => {
    try {
      await API.put(`/tasks/${task._id}/smart-assign`);
      // updated task will sync via socket
    } catch (err) {
      alert('Smart assign failed');
    }
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="task-card fade-in"
    >
      <h4>{task.title}</h4>
      <p>{task.description}</p>
      <small>Assigned to: {task.assignedTo?.name || 'Unassigned'}</small>
      <br />
      <button onClick={handleSmartAssign} style={{ marginTop: '8px' }}>
        Smart Assign
      </button>
    </div>
  );
};

export default TaskCard;