import { io } from 'socket.io-client';

const socket = io('http://localhost:5001'); // Update for production later

export default socket;