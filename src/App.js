import React, { useState, useEffect } from "react";
import { subscribeToScores } from "./firebase/firebaseService";

import Leaderboard from "./components/Leaderboard";
import TaskList from "./components/TaskList";
import AddTask from "./components/AddTask";
import ScoreSummary from "./components/ScoreSummary";
import IncentiveBoard from "./components/IncentiveBoard";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase/firebaseConfig";

import "./styles/App.css";

const TABS = [
  "Dashboard",
  "Add Task",
  "Tasks",
  "Leaderboard",
  "Incentives"
];

export default function App() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);
  const [authMode, setAuthMode] = useState("login"); // login | signup

  
  useEffect(() => {
    const unsub = subscribeToScores(() => setTick((t) => t + 1));
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    return unsub;
  }, []);

  useEffect(() => {
    if (user) setActiveTab("Dashboard");
  }, [user]);

  const refresh = () => setTick((t) => t + 1);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setActiveTab("Dashboard");
  };

  if (loading) return <p>Loading...</p>;

  if (!user) {
    return (
      <div>
        {authMode === "login" ? (
          <Login
            setUser={setUser}
            goToSignup={() => setAuthMode("signup")}
          />
        ) : (
          <Signup
            setUser={setUser}
            goToLogin={() => setAuthMode("login")}
          />
        )}
      </div>
    );
  }

  return (
    <div className="app">

      {/* HEADER */}
      <header className="header">
        <div className="header-inner">
          <div>
            <h1 className="app-title"> 🏠 Roommate Chore Tracker ✨ </h1>
            <p className="app-sub"> Turning chores into rewards, Stay Fair 💖</p>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>
      

      {/* NAVIGATION */}
      <nav className="tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* MAIN CONTENT */}
      <main className="main" key={tick}>

        {activeTab === "Dashboard" && (
          <ScoreSummary onUpdate={refresh} />
        )}


        {activeTab === "Add Task" && (
  <AddTask 
    onUpdate={refresh} 
    goToTasks={() => setActiveTab("Tasks")} 
  />
)}

        {activeTab === "Tasks" && (
          <TaskList onUpdate={refresh} />
        )}

        {activeTab === "Leaderboard" && (
          <Leaderboard />
        )}

        {activeTab === "Incentives" && (
          <IncentiveBoard />
        )}

      </main>

      {/* FOOTER */}
      <footer className="footer">
        ITEC 631 · Australian Catholic University · Roommate Chore Tracking System
      </footer>

    </div>
  );
}