import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import TaskBoard from '../components/TaskBoard';
import API from '../utils/api';
import socket from '../utils/socket';
import ActivityLog from '../components/ActivityLog';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const res = await API.get('/tasks');
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();

    // socket event listeners
    socket.on('taskCreated', (newTask) => {
      setTasks((prev) => [...prev, newTask]);
    });

    socket.on('taskUpdated', (updatedTask) => {
      setTasks((prev) =>
        prev.map((task) => (task._id === updatedTask._id ? updatedTask : task))
      );
    });

    socket.on('taskDeleted', (taskId) => {
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    });

    return () => {
      socket.off('taskCreated');
      socket.off('taskUpdated');
      socket.off('taskDeleted');
    };
  }, []);

  return (
    <div className="dashboard-main">
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', flexWrap: 'wrap' }}>
      <TaskBoard tasks={tasks} setTasks={setTasks} />
        <ActivityLog />
      </div>
    </div>
  );
};

export default Dashboard;