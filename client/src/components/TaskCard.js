import { useState } from 'react';
import API from '../utils/api';
import './TaskCard.css';

const getPriorityClass = (priority) => {
  if (priority === 'High') return 'priority-badge high';
  if (priority === 'Medium') return 'priority-badge medium';
  if (priority === 'Low') return 'priority-badge low';
  return 'priority-badge';
};

const TaskCard = ({ task, onDragStart, onDragEnd }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [touchStart, setTouchStart] = useState(null);

  const handleDragStart = (e) => {
    console.log('Drag start for task:', task);
    console.log('Task._id:', task._id);
    console.log('Task keys:', Object.keys(task));
    
    if (!task._id) {
      console.error('Task ID is missing:', task);
      e.preventDefault(); // Prevent drag if no ID
      return;
    }
    
    // Use text/plain as it's more reliable across browsers
    e.dataTransfer.setData('text/plain', task._id);
    e.dataTransfer.effectAllowed = 'move';
    
    console.log('Data set in dataTransfer with text/plain:', task._id);
    
    setIsDragging(true);
    onDragStart?.(task._id);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    onDragEnd?.();
  };

  // Touch events for mobile drag and drop
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setTouchStart({
      x: touch.clientX,
      y: touch.clientY,
      target: e.currentTarget
    });
    setIsDragging(true);
    onDragStart?.(task._id);
    
    // Add visual feedback and dragging class
    e.currentTarget.classList.add('dragging');
    e.currentTarget.style.transition = 'transform 0.2s ease';
    e.currentTarget.style.transform = 'scale(1.05) rotate(2deg)';
    e.currentTarget.style.zIndex = '1000';
    e.currentTarget.style.opacity = '0.9';
  };

  const handleTouchMove = (e) => {
    if (!touchStart) return;

    const touch = e.touches[0];
    const element = touchStart.target;
    
    // Move the element with touch
    element.style.position = 'fixed';
    element.style.left = `${touch.clientX - element.offsetWidth / 2}px`;
    element.style.top = `${touch.clientY - element.offsetHeight / 2}px`;
    element.style.transform = 'scale(1.05) rotate(3deg)';
    element.style.zIndex = '1000';
    element.style.pointerEvents = 'none';
    
    // Highlight drop zones
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    const dropZone = elementBelow?.closest('.kanban-column');
    
    // Remove previous highlights
    document.querySelectorAll('.kanban-column').forEach(col => {
      col.classList.remove('drop-zone-active');
    });
    
    // Add highlight to current drop zone
    if (dropZone && dropZone.dataset.status !== task.status) {
      dropZone.classList.add('drop-zone-active');
    }
  };

  const handleTouchEnd = (e) => {
    if (!touchStart) return;

    const touch = e.changedTouches[0];
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    const dropZone = elementBelow?.closest('.kanban-column');
    
    // Reset element position and style
    const element = touchStart.target;
    element.classList.remove('dragging');
    element.style.position = '';
    element.style.zIndex = '';
    element.style.left = '';
    element.style.top = '';
    element.style.transform = '';
    element.style.transition = '';
    element.style.opacity = '';
    element.style.pointerEvents = '';

    // Remove all drop zone highlights
    document.querySelectorAll('.kanban-column').forEach(col => {
      col.classList.remove('drop-zone-active');
    });

    // Handle drop
    if (dropZone && onDragEnd) {
      const status = dropZone.dataset.status;
      if (status && status !== task.status) {
        onDragEnd(task._id, status);
        
        // Visual feedback for successful drop
        element.style.transition = 'transform 0.3s ease';
        element.style.transform = 'scale(1.1)';
        setTimeout(() => {
          element.style.transform = '';
          element.style.transition = '';
        }, 300);
      }
    }

    setTouchStart(null);
    setIsDragging(false);
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
      onDragEnd={handleDragEnd}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`task-card fade-in ${isDragging ? 'dragging' : ''}`}
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