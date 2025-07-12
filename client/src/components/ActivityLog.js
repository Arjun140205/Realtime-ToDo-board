import { useEffect, useState } from 'react';
import API from '../utils/api';
import socket from '../utils/socket';
import './ActivityLog.css';

const formatTime = (iso) => {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

const ActivityLog = () => {
  const [logs, setLogs] = useState([]);

  const fetchLogs = async () => {
    try {
      const res = await API.get('/logs');
      setLogs(res.data);
    } catch (err) {
      // handle error
    }
  };

  useEffect(() => {
    fetchLogs();
    // Listen for task events to refresh log
    const refresh = () => fetchLogs();
    socket.on('taskCreated', refresh);
    socket.on('taskUpdated', refresh);
    socket.on('taskDeleted', refresh);
    return () => {
      socket.off('taskCreated', refresh);
      socket.off('taskUpdated', refresh);
      socket.off('taskDeleted', refresh);
    };
  }, []);

  return (
    <aside className="activity-log-panel">
      <h3 className="activity-log-title">Activity Log</h3>
      <ul className="activity-log-list">
        {logs.map((log) => (
          <li key={log._id} className="activity-log-item">
            <span className="log-time">{formatTime(log.timestamp)}</span>
            <span className="log-user">{log.user?.name || 'Unknown'}</span>
            <span className="log-action">{log.action}</span>
            <span className="log-task">{log.task?.title ? `"${log.task.title}"` : ''}</span>
            <span className="log-desc">{log.description}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default ActivityLog; 