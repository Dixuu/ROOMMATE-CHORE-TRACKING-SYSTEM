// src/components/TaskList.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebaseConfig';
import { ref, onValue } from 'firebase/database';
import { completeTask, updateTask, deleteTask } from '../firebase/firebaseService';

export default function TaskList({ onUpdate }) {
  const [tasks, setTasks] = useState([]);
  const [toast, setToast] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPoints, setEditPoints] = useState('');

  useEffect(() => {
    const unsub = onValue(ref(db, 'tasks'), (snap) => {
      const data = snap.val() || {};
      const list = Object.entries(data).map(([tid, d]) => ({ tid, ...d }));
      setTasks(list);
    });
    return unsub;
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleComplete = async (task) => {
    const result = await completeTask(task.tid, task.assignedTo, task.assignedName);
    if (result.success) {
      showToast(`✅ +${result.pointsAwarded} points awarded to ${task.assignedName}!`);
      onUpdate();
    } else {
      showToast(result.message, 'error');
    }
  };

  const startEdit = (task) => {
    setEditingId(task.tid);
    setEditTitle(task.title);
    setEditPoints(String(task.points));
  };

  const handleSaveEdit = async (tid) => {
    if (!editTitle.trim()) {
      showToast('Task name cannot be empty.', 'error');
      return;
    }

    const pts = parseInt(editPoints);
    if (isNaN(pts) || pts < 1) {
      showToast('Points must be a positive number.', 'error');
      return;
    }

    await updateTask(tid, {
      title: editTitle.trim(),
      points: pts
    });

    showToast('✏️ Task updated!');
    setEditingId(null);
    onUpdate();
  };

  const handleDelete = async (tid, title) => {
    if (window.confirm(`Delete "${title}"?`)) {
      await deleteTask(tid);
      showToast('🗑️ Task deleted.');
      onUpdate();
    }
  };

  const pending = tasks.filter(t => t.status === 'pending');
  const completed = tasks.filter(t => t.status === 'completed');

  return (
    <div className="card">
      <h2 className="card-title">📋 Tasks</h2>

      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}

      {/* ================= PENDING TASKS ================= */}
      <h3 className="section-label">Pending ({pending.length})</h3>

      {pending.length === 0 && (
        <p className="empty">All tasks completed! 🎉</p>
      )}

      <ul className="task-list">
        {pending.map(task => (
          <li key={task.tid} className="task-item pending">

            {editingId === task.tid ? (
              <div className="edit-form">
                <input
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="edit-input"
                  placeholder="Task name"
                />

                <input
                  type="number"
                  value={editPoints}
                  onChange={e => setEditPoints(e.target.value)}
                  className="edit-input edit-input-sm"
                  placeholder="Points"
                  min="1"
                />

                <div className="edit-actions">
                  <button className="btn btn-primary btn-sm"
                    onClick={() => handleSaveEdit(task.tid)}>
                    Save
                  </button>
                  <button className="btn btn-secondary btn-sm"
                    onClick={() => setEditingId(null)}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="task-info">
                  <span className="task-title">{task.title}</span>

                  
                  <span className="task-meta">
  Assigned to: {task.assignedName} · <strong>{task.points} pts</strong>
  {task.dueDate && (
    <> · 📅 Due: {task.dueDate}</>
  )}
</span>

                </div>

                <div className="task-actions">
                  <button
                    className="btn btn-complete"
                    onClick={() => handleComplete(task)}
                  >
                    ✔ Complete
                  </button>

                  <button
                    className="btn btn-edit"
                    onClick={() => startEdit(task)}
                  >
                    ✏️ Edit
                  </button>

                  <button
                    className="btn btn-delete"
                    onClick={() => handleDelete(task.tid, task.title)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </>
            )}

          </li>
        ))}
      </ul>

      {/* ================= COMPLETED TASKS ================= */}
      <h3 className="section-label">Completed ({completed.length})</h3>

      <ul className="task-list">
        {completed.map(task => (
          <li key={task.tid} className="task-item completed">
            <div className="task-info">
              <span className="task-title">{task.title}</span>

              <span className="task-meta">
                Done by: {task.completedName} · <strong>{task.points} pts</strong>
              </span>

              {/* ⭐ DUE DATE */}
              {task.dueDate && (
                <span className="task-meta">
                  📅 Due: {new Date(task.dueDate).toDateString()}
                </span>
              )}
            </div>

            <div className="task-actions">
              <span className="done-tag">✔ Done</span>

              <button
                className="btn btn-delete"
                onClick={() => handleDelete(task.tid, task.title)}
              >
                🗑️ Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

    </div>
  );
}