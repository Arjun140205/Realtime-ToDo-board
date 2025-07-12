import { useState } from 'react';
import TaskCard from './TaskCard';
import API from '../utils/api';
import './TaskBoard.css';

const TaskBoard = ({ tasks, setTasks }) => {
  const columns = ['Todo', 'In Progress', 'Done'];
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'Medium' });
  const [conflictData, setConflictData] = useState(null);
  const [showForm, setShowForm] = useState(false);

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
      {/* Board Title and Add Task Link */}
      <div className="board-header">
        <h2 className="board-title">Work Tasks</h2>
        <button
          className="add-task-link"
          onClick={() => setShowForm((v) => !v)}
          type="button"
        >
          + Add Task
        </button>
        {showForm && (
          <div className="add-task-modal" onClick={() => setShowForm(false)}>
            <form
              onSubmit={(e) => {
                handleCreate(e);
                setShowForm(false);
              }}
              className="task-form-modal"
              onClick={(e) => e.stopPropagation()}
            >
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
              <button type="submit">Add</button>
            </form>
          </div>
        )}
      </div>

      {/* Kanban board */}
      <div className="kanban-board-wrapper">
        <div className="kanban-board">
          {columns.map((status) => (
            <div
              key={status}
              className="kanban-column"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const taskId = e.dataTransfer.getData('taskId');
                handleDrop(taskId, status);
              }}
            >
              <div className="column-header">
                <h3 className="column-title">{status}</h3>
              </div>
              {tasks.filter(t => t.status === status).map(task => (
                <TaskCard key={task._id} task={task} />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Conflict Resolution Modal */}
      {conflictData && (
        <div className="conflict-modal-overlay">
          <div className="conflict-modal">
            <h3>⚠️ Conflict Detected</h3>
            <p>Two users tried editing this task. Choose which version to keep:</p>

            <div className="conflict-versions">
              <div className="conflict-version">
                <h4>Your Version</h4>
                <pre>{JSON.stringify(conflictData.clientVersion, null, 2)}</pre>
                <button onClick={() => handleConflictResolve('overwrite')}>Overwrite</button>
              </div>
              <div className="conflict-version">
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