import { useState, useEffect } from 'react';
import TaskCard from './TaskCard';
import API from '../utils/api';
import './TaskBoard.css';

const TaskBoard = ({ tasks, setTasks }) => {
  const columns = ['Todo', 'In Progress', 'Done'];
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'Medium', status: 'Todo' });
  const [showForm, setShowForm] = useState(null); // status string or null
  const [conflictData, setConflictData] = useState(null);
  const [sortOptions, setSortOptions] = useState({}); // { [status]: sortType }
  const [showDropdown, setShowDropdown] = useState(null); // which column dropdown is open

  const handleDragStart = (taskId) => {
    console.log('Drag started for task:', taskId);
  };

  const handleDrop = async (taskId, newStatus) => {
    console.log('Drop handler called with:', { taskId, newStatus, type: typeof taskId });
    
    // Validate inputs
    if (!taskId) {
      console.error('TaskId is missing or falsy:', taskId);
      return;
    }
    
    if (!newStatus) {
      console.error('NewStatus is missing:', newStatus);
      return;
    }
    
    try {
      const task = tasks.find(t => t._id === taskId);
      if (!task) {
        console.error('Task not found:', taskId);
        console.log('Available tasks:', tasks.map(t => ({ id: t._id, title: t.title })));
        return;
      }
      
      console.log('Found task:', task);
      const updated = {
        ...task,
        status: newStatus,
        lastModified: task.lastModified,
      };

      console.log('Updating task to:', updated);
      await API.put(`/tasks/${taskId}`, updated);
      console.log('Task updated successfully');
      // sync via socket
    } catch (err) {
      console.error('Drop error:', err);
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
      await API.post('/tasks', { ...newTask, status: showForm });
      setNewTask({ title: '', description: '', priority: 'Medium', status: 'Todo' });
      setShowForm(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create task');
    }
  };

  const openForm = (status) => {
    setShowForm(status);
    setNewTask({ title: '', description: '', priority: 'Medium', status });
  };

  // Sorting functions
  const sortTasks = (tasks, sortType) => {
    const tasksCopy = [...tasks];
    switch (sortType) {
      case 'priority':
        return tasksCopy.sort((a, b) => {
          const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
      case 'date':
        return tasksCopy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'alphabetical':
        return tasksCopy.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return tasksCopy;
    }
  };

  const handleSort = (status, sortType) => {
    setSortOptions(prev => ({ ...prev, [status]: sortType }));
    setShowDropdown(null);
  };

  const getFilteredAndSortedTasks = (status) => {
    const filtered = tasks.filter(t => t.status === status);
    const sortType = sortOptions[status];
    return sortType ? sortTasks(filtered, sortType) : filtered;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.column-options')) {
        setShowDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="taskboard-container">
      {/* Board Title */}
      <div className="board-header">
        <h2 className="board-title">Work Tasks</h2>
      </div>
      {/* Kanban board */}
      <div className="kanban-board-wrapper">
        <div className="kanban-board">
        {columns.map((status) => {
          const tasksInColumn = getFilteredAndSortedTasks(status);
          const taskCount = tasksInColumn.length;
          
          return (
          <div
            key={status}
            className={`kanban-column ${taskCount === 0 ? 'empty-column' : 'has-tasks'}`}
            data-status={status}
            data-task-count={taskCount}
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add('drag-over');
            }}
            onDragLeave={(e) => {
              // Only remove if not dragging over a child element
              if (!e.currentTarget.contains(e.relatedTarget)) {
                e.currentTarget.classList.remove('drag-over');
              }
            }}
            onDrop={(e) => {
              e.preventDefault();
              console.log('Column drop event triggered for status:', status);
              e.currentTarget.classList.remove('drag-over');
              
              // Get taskId from text/plain (most reliable)
              const taskId = e.dataTransfer.getData('text/plain');
              
              console.log('Retrieved taskId from text/plain:', taskId);
              console.log('DataTransfer types available:', Array.from(e.dataTransfer.types));
              
              if (taskId && taskId.trim() !== '') {
                console.log('Valid taskId found, calling handleDrop');
                handleDrop(taskId, status);
              } else {
                console.error('No valid taskId found in dataTransfer');
                console.log('All available data:', {
                  'text/plain': e.dataTransfer.getData('text/plain'),
                  'text/html': e.dataTransfer.getData('text/html'),
                  'types': Array.from(e.dataTransfer.types)
                });
              }
            }}
          >
            <div className="column-header">
              <h3 className="column-title">{status}</h3>
              <div className="column-options">
                <button 
                  className="options-btn"
                  onClick={() => setShowDropdown(showDropdown === status ? null : status)}
                >
                  ⋯
                </button>
                {showDropdown === status && (
                  <div className="dropdown-menu">
                    <button onClick={() => handleSort(status, 'priority')}>
                      Sort by Priority
                    </button>
                    <button onClick={() => handleSort(status, 'date')}>
                      Sort by Date
                    </button>
                    <button onClick={() => handleSort(status, 'alphabetical')}>
                      Sort Alphabetically
                    </button>
                    <button onClick={() => handleSort(status, null)}>
                      Clear Sort
                    </button>
                  </div>
                )}
              </div>
            </div>
            {tasksInColumn.map(task => {
              console.log('Rendering task:', task, 'ID:', task._id);
              return (
                <TaskCard 
                  key={task._id} 
                  task={task} 
                  onDragStart={handleDragStart}
                  onDragEnd={() => {
                    // Simple cleanup function for drag end
                    console.log('Drag ended for task:', task._id);
                  }}
                />
              );
            })}
            <button className="add-task-btn" onClick={() => openForm(status)}>
              + Add Task
            </button>
          </div>
        );
        })}
      </div>
      </div>
      {/* Add Task Modal */}
      {showForm && (
        <div className="task-modal-overlay" onClick={() => setShowForm(null)}>
          <div className="task-form-modal" onClick={e => e.stopPropagation()}>
            <h3>Add new task</h3>
            <form onSubmit={handleCreate} autoComplete="off">
              <label htmlFor="task-title">title</label>
              <input
                id="task-title"
                type="text"
                placeholder="Title"
                value={newTask.title}
                onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                required
              />
              <label htmlFor="task-desc">description</label>
              <textarea
                id="task-desc"
                placeholder="Description"
                value={newTask.description}
                onChange={e => setNewTask({ ...newTask, description: e.target.value })}
              />
              <label htmlFor="task-priority">Priority</label>
              <select
                id="task-priority"
                value={newTask.priority}
                onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <div className="task-form-actions">
                <button type="submit">Save</button>
                <button type="button" onClick={() => setShowForm(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
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