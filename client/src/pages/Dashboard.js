// eslint-disable-next-line no-unused-vars
import { useContext, useEffect, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { AuthContext } from '../context/AuthContext';
import TaskBoard from '../components/TaskBoard';
import API from '../utils/api';
import socket from '../utils/socket';
import './Dashboard.css';

const Dashboard = () => {
  // Removed unused AuthContext destructuring
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
    <div 
      className="dashboard-main"
      style={{
        backgroundImage: 'url("/dashboard.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', flexWrap: 'wrap' }}>
        <TaskBoard tasks={tasks} setTasks={setTasks} />
      </div>
    </div>
  );
};

export default Dashboard;