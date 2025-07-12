import { useState } from 'react';
import TaskCard from './TaskCard';
import API from '../utils/api';

const TaskBoard = ({ tasks, setTasks }) => {
  const columns = ['Todo', 'In Progress', 'Done'];
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'Medium' });
  const [conflictData, setConflictData] = useState(null);

  const handleDrop = async (taskId, newStatus) => {
    try {
      const task = tasks.find(t => t._id === taskId);
      const updated = {
        ...task,
        status: newStatus,
        lastModified: task.lastModified,
      };

      await API.put(`/tasks/${taskId}`, updated);
      // sync via socket
    } catch (err) {
      if (err.response?.status === 409) {
        setConflictData(err.response.data);
      } else {
        console.error(err);
      }
    }
  };

  const handleConflictResolve = async (resolution) => {
    const taskId = conflictData.serverVersion._id;
    let dataToSend;

    if (resolution === 'overwrite') {
      dataToSend = { ...conflictData.clientVersion };
    } else if (resolution === 'keepServer') {
      dataToSend = { ...conflictData.serverVersion };
    } else {
      return setConflictData(null);
    }

    try {
      await API.put(`/tasks/${taskId}`, dataToSend);
      setConflictData(null);
    } catch (err) {
      alert('Failed to resolve conflict.');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/tasks', newTask);
      setNewTask({ title: '', description: '', priority: 'Medium' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create task');
    }
  };

  return (
    <div>
      {/* Task creation form */}
      <form onSubmit={handleCreate}>
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

      {/* Kanban board */}
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
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

      {/* Conflict Resolution Modal */}
      {conflictData && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex',
          alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: '#fff', padding: '20px', borderRadius: '8px',
            width: '90%', maxWidth: '600px'
          }}>
            <h3>⚠️ Conflict Detected</h3>
            <p>Two users tried editing this task. Choose which version to keep:</p>

            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ flex: 1 }}>
                <h4>Your Version</h4>
                <pre>{JSON.stringify(conflictData.clientVersion, null, 2)}</pre>
                <button onClick={() => handleConflictResolve('overwrite')}>Overwrite</button>
              </div>
              <div style={{ flex: 1 }}>
                <h4>Server Version</h4>
                <pre>{JSON.stringify(conflictData.serverVersion, null, 2)}</pre>
                <button onClick={() => handleConflictResolve('keepServer')}>Keep Server</button>
              </div>
            </div>

            <button onClick={() => setConflictData(null)} style={{ marginTop: '10px' }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskBoard;