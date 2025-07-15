import { useEffect, useState } from 'react';
import API from '../utils/api';
import socket from '../utils/socket';
import './ActivityLog.css';

const formatTime = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  }) + ' ' + d.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
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
    <div className="activity-log-page">
      <div className="activity-log-container">
        <div className="activity-log-header">
          <h1 className="activity-log-title">Activity Log</h1>
          <p className="activity-log-subtitle">Track all task activities and changes</p>
        </div>
        
        <div className="activity-log-content">
          <table className="activity-log-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>User</th>
                <th>Action</th>
                <th>Task</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log._id} className="activity-log-row">
                    <td className="log-time">{formatTime(log.timestamp)}</td>
                    <td className="log-user">{log.user?.name || 'Unknown'}</td>
                    <td className="log-action">{log.action}</td>
                    <td className="log-task">
                      {log.task?.title ? `"${log.task.title}"` : '—'}
                    </td>
                    <td className="log-details">{log.description}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-logs">
                    No activity logs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActivityLog; 