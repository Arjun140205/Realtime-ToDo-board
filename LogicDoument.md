# LogicDocument.md  
**Real-Time Collaborative To-Do Board – Internshala Full Stack Assignment (July 2025)**

This document details the logic and algorithmic approach behind two core features implemented in the project:

1. ✅ Smart Assign  
2. ⚠️ Conflict Handling  

Both features are designed to support real-time, multi-user collaboration, and have been developed without the use of external AI or logic libraries.

---

## ✅ 1. Smart Assign Logic

### 🔹 Objective  
To automatically assign a task to the user with the **fewest active (non-completed)** tasks, reducing manual coordination and balancing workload across users in a shared environment.

---

### 🔹 Approach  
The system dynamically determines which user has the least number of active tasks and assigns the task to them when the **“Smart Assign”** button is clicked on any task card.

---

### 🔹 Algorithm  

1. **Fetch** all registered users from the database.  
2. For each user:
   - Count the number of tasks assigned to them that are **not marked as "Done"**.
3. Store the task count against each user’s ID.
4. **Sort** users in ascending order of active task count.
5. Select the **first user** from the sorted list (i.e., the one with the fewest active tasks).
6. Assign that user to the task and update it in the database.
7. Emit the update to all connected users via **Socket.IO**.

---

### 🔹 Example  

Assume 3 users are active:  
- User A → 3 active tasks  
- User B → 0 active tasks  
- User C → 2 active tasks  

If Smart Assign is triggered, the task will be assigned to **User B**, since they have the least current load.

---

### 🔹 Impact  
This logic reduces decision fatigue and manual effort in task allocation, especially in teams where many users collaborate simultaneously. It ensures fairness and encourages balanced task distribution.

---

## ⚠️ 2. Conflict Handling Logic

### 🔹 Objective  
To prevent one user from **accidentally overwriting another user’s changes** when both are editing the same task at the same time.

---

### 🔹 Approach  
A **timestamp-based conflict detection system** compares the client’s version of the task with the server’s latest version and prevents unsafe updates by triggering a conflict resolution flow.

---

### 🔹 Algorithm

1. Each task stores a `lastModified` timestamp.
2. When a user edits a task, they retain the version’s timestamp from when it was fetched.
3. If another user updates the task in the meantime, the task’s `lastModified` in the database changes.
4. When the first user attempts to save:
   - The backend **compares** the client’s timestamp with the latest version.
5. If there’s a mismatch (difference > 1 second), a **409 Conflict** response is returned with:
   - `clientVersion`: The user’s attempted update.
   - `serverVersion`: The current version in the database.

---

### 🔹 Example  

- User A and User B open Task X.  
- User A changes the title and saves it → success.  
- User B edits the description and saves it **after User A**.  
- Backend detects that User B’s version is outdated and returns a conflict.  
- Frontend displays both versions and lets User B decide how to proceed.

---

### 🔹 Conflict Resolution Options

The frontend provides the user with three choices:
- ✅ Overwrite the server version with their own version.
- 📥 Keep the server version and discard changes.
- 📝 (Optional) Manually merge and re-submit later.

---

### 🔹 Impact  
This approach maintains **data integrity** in real-time collaboration, reduces accidental overwrites, and ensures that all users are informed before updating potentially stale data.

---

## 🧾 Summary

| Feature          | Purpose                                           | Outcome                                      |
|------------------|---------------------------------------------------|----------------------------------------------|
| Smart Assign      | Distribute tasks fairly by active task count     | Automated, unbiased task assignment          |
| Conflict Handling | Prevent overwrites during simultaneous edits     | Safer updates with transparent resolution UI |

---

**Prepared By:**  
Arjunbir Singh 
