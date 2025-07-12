const TaskCard = ({ task }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('taskId', task._id);
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
      }}
    >
      <h4>{task.title}</h4>
      <p>{task.description}</p>
      <small>Assigned to: {task.assignedTo?.name || 'Unassigned'}</small>
    </div>
  );
};

export default TaskCard;