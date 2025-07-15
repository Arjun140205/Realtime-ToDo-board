import axios from 'axios';

const API = axios.create({
  baseURL: 'https://realtime-todo-board.onrender.com/api', // change for deployment
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;