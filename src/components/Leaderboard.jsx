import React, { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { db } from "../firebase/firebaseConfig";
import { getBadge } from "../utils/badge";

export default function Leaderboard() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const scoresRef = ref(db, "users");

    const unsubscribe = onValue(scoresRef, (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        setScores([]);
        return;
      }

      const formatted = Object.keys(data).map((key) => ({
        uid: key,
        name: data[key].name || "Unknown",
        points: data[key].totalPoints || 0,
        tasksDone: data[key].taskCount || 0,
        status: data[key].status || "Good",
      }));

      formatted.sort((a, b) => b.points - a.points);
      setScores(formatted);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="card">
      <h2 className="card-title">🏅 Leaderboard</h2>

      {scores.length === 0 && <p className="empty">No scores yet.</p>}

      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Points</th>
            <th>Tasks Done</th>
            <th>Badge</th>
          </tr>
        </thead>

        <tbody>
          {scores.map((user, index) => {
            const badge = getBadge(user.points, user.status);

            const rankEmoji =
              index === 0 ? "🥇"
              : index === 1 ? "🥈"
              : index === 2 ? "🥉"
              : `#${index + 1}`;

            return (
              <tr key={user.uid} className={index === 0 ? "top-row" : ""}>
                <td className="rank">{rankEmoji}</td>
                <td>{user.name}</td>
                <td><strong>{user.points}</strong> pts</td>
                <td>{user.tasksDone}</td>
                <td>
                  <span className="badge" style={{ backgroundColor: badge.color }}>
                    {badge.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
