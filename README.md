# Real-Time Collaborative To-Do Board

A collaborative task management application built with React, Node.js, MongoDB, and Socket.IO. Features real-time updates, smart task assignment, and conflict resolution for seamless team productivity.

## 📋 Project Overview

Full-stack web application for teams to manage tasks efficiently with real-time collaboration. Key features include intelligent task assignment, drag-and-drop interface, conflict handling, and activity logging.

## 🛠️ Tech Stack

**Frontend:** React, Socket.IO Client, Axios, React Router DOM
**Backend:** Node.js, Express, MongoDB, Socket.IO, JWT, bcryptjs
**Tools:** Nodemon, CORS, dotenv

## ⚡ Setup Instructions

### Prerequisites
- Node.js (v14+), MongoDB, Git

### 1. Clone & Install
```bash
git clone https://github.com/Arjun140205/Realtime-ToDo-board.git
cd Realtime-ToDo-board
```

### 2. Backend Setup
```bash
cd server
npm install

# Create .env file with:
# MONGO_URI=mongodb://localhost:27017/todoboard
# JWT_SECRET=your_jwt_secret_key
# PORT=5000

npm start  # Runs on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd client
npm install
npm start  # Runs on http://localhost:3000
```

## ✨ Features

- **Authentication:** User registration/login with JWT
- **Task Management:** Create, edit, delete tasks with drag-and-drop
- **Smart Assignment:** Auto-assign tasks to users with least workload
- **Real-time Updates:** Instant collaboration via Socket.IO
- **Conflict Resolution:** Prevents data overwrites during simultaneous edits
- **Activity Logging:** Track all task-related actions
- **Responsive Design:** Works on desktop and mobile

## 🧠 Smart Assign Logic

Automatically assigns tasks to the user with the fewest active tasks:

1. Fetch all registered users from the database
2. Count active (non-"Done") tasks for each user
3. Sort users by task count (ascending order)
4. Assign task to user with minimum workload
5. Broadcast update via Socket.IO

**Example:**
- User A: 3 active tasks
- User B: 0 active tasks  
- User C: 2 active tasks
- **Result:** Task gets assigned to User B (least workload)

## ⚠️ Conflict Handling Logic

Prevents data loss during simultaneous edits using timestamp comparison:

1. Each task stores a `lastModified` timestamp when created/updated
2. When user attempts to update task, compare their timestamp with current server timestamp
3. If difference > 1 second, detect conflict and return 409 status
4. Frontend presents resolution options: Overwrite, Discard, or Manual Merge

**Example:**
- User A and User B both open Task X at 10:00:00
- User A saves changes at 10:00:05 → Success (task timestamp now 10:00:05)
- User B saves changes at 10:00:08 → Conflict detected (their timestamp is 10:00:00, server is 10:00:05)
- **Result:** User B sees both versions and chooses how to resolve

## 🌐 Live Demo

**Live App:** [https://realtime-to-do-board.vercel.app](https://realtime-to-do-board.vercel.app)
**Demo Video:** [Watch Demo](https://drive.google.com/file/d/1YEq03SUAw3uC0JqtBoZf1gTO2M1tmS6o/view?usp=sharing)
**GitHub Repository:** [https://github.com/Arjun140205/Realtime-ToDo-board](https://github.com/Arjun140205/Realtime-ToDo-board)
**Backend API:** [https://realtime-todo-board.onrender.com](https://realtime-todo-board.onrender.com)

---

**Author:** Arjunbir Singh | [@Arjun140205](https://github.com/Arjun140205) | [arjunbirsingh1699@gmail.com](mailto:arjunbirsingh1699@gmail.com)