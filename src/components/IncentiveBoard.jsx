import React, { useEffect, useState, useRef, useMemo } from "react";
import { onValue, ref } from "firebase/database";
import { db } from "../firebase/firebaseConfig";
import "../styles/incentive.css";

const GOAL = 100;

export default function IncentiveBoard() {
  const [data, setData] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [sortDesc, setSortDesc] = useState(true);
  const prevPoints = useRef({});

  useEffect(() => {
    const usersRef = ref(db, "users");

    const unsubscribe = onValue(usersRef, (snapshot) => {
      const firebaseData = snapshot.val();

      if (!firebaseData) {
        setData([]);
        return;
      }

      const formatted = Object.keys(firebaseData).map((key) => {
        const user = firebaseData[key];
        const points = user.totalPoints || 0;
        const tasksDone = user.taskCount || 0;

        let status = "Poor";
        let message = "⚠️ Extra Chores Assigned";

        if (points >= 100) {
          status = "Reward";
          message = "🎉 Movie Night Reward";
        } else if (points >= 50) {
          status = "Good";
          message = "👍 Well Done";
        }

        return {
          id: key,
          name: user.name || "Unknown",
          points,
          tasksDone,
          status,
          message,
        };
      });

      formatted.sort((a, b) => b.points - a.points);
      setData(formatted);
      setLastUpdated(new Date().toLocaleTimeString());
    });

    return () => unsubscribe();
  }, []);

  const getStreak = (user) => {
    const prev = prevPoints.current[user.name];
    prevPoints.current[user.name] = user.points;
    if (!prev) return 1;
    if (user.points >= prev) return 1;
    return 0;
  };

  const processedData = useMemo(() => {
    let filtered = [...data];

    if (filter !== "ALL") {
      filtered = filtered.filter((u) => u.status === filter);
    }

    if (search.trim()) {
      filtered = filtered.filter((u) =>
        u.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    filtered.sort((a, b) =>
      sortDesc ? b.points - a.points : a.points - b.points
    );

    return filtered;
  }, [data, search, filter, sortDesc]);

  const avgPoints =
    data.length > 0
      ? (data.reduce((sum, u) => sum + u.points, 0) / data.length).toFixed(1)
      : 0;

  const emoji = (status) => {
    if (status === "Reward") return "🎉";
    if (status === "Good") return "✨";
    return "😢";
  };

  const rankBadge = (i) => {
    if (i === 0) return "🥇";
    if (i === 1) return "🥈";
    if (i === 2) return "🥉";
    return "🎖️";
  };

  const champion = processedData[0];

  return (
    <div className="cute-bg">
      <div className="cute-header">
        <h1>🏠 Incentive Dashboard</h1>
        <p>Kind rewards for everyday teamwork ✨</p>

        <div className="summary-bar">
          <p>👥 Total Users: {data.length}</p>
          <p>📊 Avg Points: {avgPoints}</p>
          <p>⏱ Last Update: {lastUpdated || "-"}</p>
        </div>
      </div>

      {champion && (
        <div
          className={`champion-card ${
            champion.status === "Reward" ? "reward" : ""
          }`}
        >
          <h2>
            {champion.status === "Reward"
              ? "🏆 Reward Winner"
              : "🏆 Top Performer"}
          </h2>

          <p>
            {champion.name} — {champion.points} pts
          </p>

          <p>{champion.message}</p>

          {champion.status === "Reward" && (
            <div className="reward-tag">
              Congratulations, Work Hard 🎉
            </div>
          )}
        </div>
      )}

      <div className="controls">
        <input
          type="text"
          placeholder="Search roommate..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="ALL">All</option>
          <option value="Reward">Reward</option>
          <option value="Good">Good</option>
          <option value="Poor">Poor</option>
        </select>

        <button onClick={() => setSortDesc((p) => !p)}>
          Sort: {sortDesc ? "High → Low" : "Low → High"}
        </button>
      </div>

      <div className="cute-grid">
        {processedData.length === 0 ? (
          <p className="empty-state">No users found 😢</p>
        ) : (
          processedData.map((u, i) => {
            const streak = getStreak(u);

            return (
              <div
                key={u.id}
                className={`cute-card ${u.status.toLowerCase()} ${
                  u.status === "Reward" ? "reward" : ""
                }`}
              >
                <div className="cute-top">
                  <h2>
                    {rankBadge(i)} {u.name}
                  </h2>

                  <span className="emoji">
                    {emoji(u.status)} 🔥{streak}
                  </span>
                </div>

                <div className="cute-stats">
                  <div>
                    <p>Points</p>
                    <h3>{u.points}</h3>
                  </div>

                  <div>
                    <p>Tasks</p>
                    <h3>{u.tasksDone}</h3>
                  </div>
                </div>

                <div className="progress">
                  <div
                    className="bar"
                    style={{
                      width: `${Math.min(
                        (u.points / GOAL) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>

                <small>
                  🎯 Goal: {u.points}/{GOAL}
                </small>

                <div className="cute-badge">
                  {u.status} • {u.message}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}