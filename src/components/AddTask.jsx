// src/components/AddTask.jsx

import React, { useState, useEffect } from 'react';
import {
  addTask,
  addUser,
  CHORE_POINTS,
  getUsers
} from '../firebase/firebaseService';

export default function AddTask({ onUpdate, goToTasks }) {
  const [title, setTitle] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [customPoints, setCustomPoints] = useState('');
  const [newUser, setNewUser] = useState('');
  const [users, setUsers] = useState([]);
  const [toast, setToast] = useState(null);

  // ✅ Due Date State
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  const choreOptions = Object.keys(CHORE_POINTS);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const handleAddTask = async () => {
    const finalTitle =
      title === 'Custom'
        ? customTitle.trim()
        : title;

    if (!finalTitle) {
      showToast(
        'Please select or enter a chore name.',
        'error'
      );
      return;
    }

    const name = assignedTo.trim();

    if (!name) {
      showToast(
        'Please enter a roommate name.',
        'error'
      );
      return;
    }

    // Find existing user
    let user = users.find(
      u => u.name.toLowerCase() === name.toLowerCase()
    );

    // Create user if not found
    if (!user) {
      user = await addUser(name);
    }

    // Custom points
    const pts =
      title === 'Custom' && customPoints
        ? parseInt(customPoints)
        : undefined;

    // ✅ ADD TASK WITH DUE DATE
    const result = await addTask({
      title: finalTitle,
      assignedTo: user.uid,
      assignedName: user.name,
      customPoints: pts,
      dueDate: dueDate || null
    });

    showToast(
      `✅ Task "${finalTitle}" added for ${user.name} · ${result.points} pts`
    );

    // Reset form
    setTitle('');
    setCustomTitle('');
    setAssignedTo('');
    setCustomPoints('');
    setDueDate('');

    // Refresh users
    const updated = await getUsers();
    setUsers(updated);

    onUpdate();

    // ✅ Auto go to Tasks tab
    goToTasks?.();
  };

  const handleAddUser = async () => {
    if (!newUser.trim()) {
      showToast('Enter a name.', 'error');
      return;
    }

    await addUser(newUser.trim());

    showToast(`👤 ${newUser.trim()} added!`);

    setNewUser('');

    const updated = await getUsers();
    setUsers(updated);

    onUpdate();
  };

  return (
    <div className="card">

      <h2 className="card-title">
        ➕ Add New Task
      </h2>

      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.msg}
        </div>
      )}

      {/* CHORE */}
      <div className="form-row">
        <label>Chore</label>

        <select
          value={title}
          onChange={e => setTitle(e.target.value)}
        >
          <option value="">
            -- Select chore --
          </option>

          {choreOptions.map(c => (
            <option key={c} value={c}>
              {c} ({CHORE_POINTS[c]} pts)
            </option>
          ))}

          <option value="Custom">
            Custom
          </option>
        </select>
      </div>

      {/* CUSTOM CHORE */}
      {title === 'Custom' && (
        <>
          <div className="form-row">
            <label>Custom Chore Name</label>

            <input
              value={customTitle}
              onChange={e =>
                setCustomTitle(e.target.value)
              }
              placeholder="e.g. Clean Windows"
            />
          </div>

          <div className="form-row">
            <label>Points</label>

            <input
              type="number"
              value={customPoints}
              onChange={e =>
                setCustomPoints(e.target.value)
              }
              placeholder="e.g. 15"
              min="1"
            />
          </div>
        </>
      )}

      {/* ASSIGN TO */}
      <div className="form-row">
        <label>Assign To</label>

        <input
          value={assignedTo}
          onChange={e => setAssignedTo(e.target.value)}
          placeholder="e.g. Alice"
          list="roommate-suggestions"
        />

        <datalist id="roommate-suggestions">
          {users.map(u => (
            <option
              key={u.uid}
              value={u.name}
            />
          ))}
        </datalist>
      </div>

      {/* ✅ DUE DATE */}
      <div className="form-row">
        <label>Due Date</label>

        <input
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
        />
      </div>

      {/* ADD TASK BUTTON */}
      <button
        className="btn btn-primary"
        onClick={handleAddTask}
      >
        Add Task
      </button>

      <hr className="divider" />

      {/* ADD ROOMMATE */}
      <h3 className="section-label">
        👤 Add Roommate
      </h3>

      <div className="form-row">
        <input
          value={newUser}
          onChange={e => setNewUser(e.target.value)}
          placeholder="Roommate name"
        />

        <button
          className="btn btn-secondary"
          onClick={handleAddUser}
        >
          Add
        </button>
      </div>

    </div>
  );
}