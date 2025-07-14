import API from '../utils/api';
import './TaskCard.css';

const getPriorityClass = (priority) => {
  if (priority === 'High') return 'priority-badge high';
  if (priority === 'Medium') return 'priority-badge medium';
  if (priority === 'Low') return 'priority-badge low';
  return 'priority-badge';
};

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

  // Placeholder for progress and date (replace with real data if available)
  const progress = task.progress || '1/2';
  const date = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Jul 13, 2025';

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="task-card fade-in"
    >
      <div className="task-card-row">
        <h4 className="task-title">{task.title}</h4>
      </div>
      <div className="task-assigned-user">
        {task.assignedTo?.name ? (
          <span title={task.assignedTo.email || ''}>Assigned to: <b>{task.assignedTo.name}</b></span>
        ) : (
          <span className="unassigned">Unassigned</span>
        )}
      </div>
      <div className="task-desc">{task.description}</div>
      <div className="task-card-meta">
        <span className={getPriorityClass(task.priority)}>{task.priority?.toLowerCase()}</span>
        <span className="task-progress">{progress}</span>
        <span className="task-date">{date}</span>
      </div>
      <button onClick={handleSmartAssign} className="smart-assign-btn">Smart Assign</button>
    </div>
  );
};

export default TaskCard;