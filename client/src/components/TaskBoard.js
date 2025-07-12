import { useState } from 'react';
import TaskCard from './TaskCard';
import API from '../utils/api';

const TaskBoard = ({ tasks, setTasks }) => {
  const columns = ['Todo', 'In Progress', 'Done'];
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'Medium' });

  const handleDrop = async (taskId, newStatus) => {
    try {
      const task = tasks.find(t => t._id === taskId);
      const updated = {
        ...task,
        status: newStatus,
        lastModified: task.lastModified,
      };

      const res = await API.put(`/tasks/${taskId}`, updated);
      // Update happens via socket listener already
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTask.title) return alert('Title required');
    try {
      const res = await API.post('/tasks', newTask);
      setNewTask({ title: '', description: '', priority: 'Medium' }); // Clear form
      // New task will come via socket
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create task');
    }
  };

  return (
    <div>
      {/* Task form */}
      <form onSubmit={handleCreate} style={{ marginBottom: '20px' }}>
        <input
          placeholder="Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          required
        />
        <input
          placeholder="Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        />
        <select
          value={newTask.priority}
          onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <button type="submit">Add Task</button>
      </form>

      {/* Columns */}
      <div style={{ display: 'flex', gap: '20px' }}>
        {columns.map((status) => (
          <div
            key={status}
            style={{
              flex: 1,
              padding: '10px',
              border: '2px solid #ccc',
              minHeight: '200px',
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const taskId = e.dataTransfer.getData('taskId');
              handleDrop(taskId, status);
            }}
          >
            <h3>{status}</h3>
            {tasks.filter(t => t.status === status).map(task => (
              <TaskCard key={task._id} task={task} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskBoard;