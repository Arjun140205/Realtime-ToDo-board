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
      style={{
        border: '1px solid black',
        margin: '5px 0',
        padding: '10px',
        backgroundColor: '#f9f9f9',
        cursor: 'grab',
        position: 'relative',
      }}
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