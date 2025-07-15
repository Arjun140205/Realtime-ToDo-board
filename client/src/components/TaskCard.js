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

  // Get creation date for display
  const date = task.createdAt 
    ? new Date(task.createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    : new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="task-card fade-in"
    >
      <div className="task-card-header">
        <h4 className="task-title">{task.title}</h4>
        <span className="task-date">{date}</span>
      </div>
      
      <div className="task-assigned-user">
        {task.assignedTo?.name ? (
          <span title={task.assignedTo.email || ''}>
            <span className="assigned-label">Assigned to:</span>
            <span className="assigned-name">{task.assignedTo.name}</span>
          </span>
        ) : (
          <span className="unassigned">Unassigned</span>
        )}
      </div>
      
      <div className="task-desc">{task.description}</div>
      
      <div className="task-card-footer">
        <span className={getPriorityClass(task.priority)}>{task.priority?.toLowerCase()}</span>
        <button onClick={handleSmartAssign} className="smart-assign-btn">Smart Assign</button>
      </div>
    </div>
  );
};

export default TaskCard;