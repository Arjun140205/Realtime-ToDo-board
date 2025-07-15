import { io } from 'socket.io-client';

const socket = io('https://realtime-todo-board.onrender.com'); // Update for production later

export default socket;