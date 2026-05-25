// src/components/ScoreSummary.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebaseConfig';
import { ref, onValue } from 'firebase/database';
import { getBadge, resetAllScores } from '../firebase/firebaseService';

export default function ScoreSummary({ onUpdate }) {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const unsub = onValue(ref(db, 'users'), (snap) => {
      const data = snap.val() || {};
      const sorted = Object.entries(data)
        .map(([uid, d]) => ({ uid, ...d }))
        .sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));
      setScores(sorted);
    });
    return unsub;
  }, []);

  const totalTasks = scores.reduce((sum, u) => sum + (u.taskCount || 0), 0);
  const totalPoints = scores.reduce((sum, u) => sum + (u.totalPoints || 0), 0);

  const handleReset = async () => {
    if (window.confirm('Reset ALL scores and task completions? (Good for testing)')) {
      await resetAllScores();
      onUpdate();
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">📊 Score Summary</h2>

      <div className="summary-stats">
        <div className="stat-box">
          <span className="stat-num">{scores.length}</span>
          <span className="stat-label">Roommates</span>
        </div>
        <div className="stat-box">
          <span className="stat-num">{totalTasks}</span>
          <span className="stat-label">Tasks Done</span>
        </div>
        <div className="stat-box">
          <span className="stat-num">{totalPoints}</span>
          <span className="stat-label">Total Points</span>
        </div>
      </div>

      <div className="score-cards">
        {scores.map((user, i) => {
          const badge = getBadge(user.totalPoints || 0);
          return (
            <div key={user.uid} className="score-card">
              <div className="score-card-header">
                <span className="score-rank">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i+1}`}</span>
                <span className="score-name">{user.name}</span>
              </div>
              <div className="score-points">{user.totalPoints || 0} <span>pts</span></div>
              <div className="score-tasks">{user.taskCount || 0} tasks completed</div>
              <span className="badge" style={{ backgroundColor: badge.color }}>{badge.label}</span>
            </div>
          );
        })}
      </div>

      <div className="reset-row">
        <button className="btn btn-danger" onClick={handleReset}>🔄 Reset All Scores (Test)</button>
      </div>
    </div>
  );
}
