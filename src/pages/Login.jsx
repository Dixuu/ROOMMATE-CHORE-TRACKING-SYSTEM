import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
  browserLocalPersistence
} from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import "../styles/login.css";

export default function Login({ setUser, goToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await setPersistence(
        auth,
        remember ? browserLocalPersistence : browserSessionPersistence
      );

      const userCred = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      setUser(userCred.user);

    } catch (error) {
      console.log(error.code);
      setError("Invalid email or password");
    }

    setLoading(false);
  };

  return (
    <div className="login-bg">
      <div className="login-card">

        <h1>🏠 Roommate Login</h1>
        <p>Welcome back! Please sign in to continue</p>

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label className="remember">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            Remember me
          </label>
           <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          {error && <p className="error">{error}</p>}

        </form>

        {/* ✅ ADD THIS (IMPORTANT FIX) */}
        <p
          style={{ marginTop: "10px", cursor: "pointer", color: "#2d6a9f" }}
          onClick={goToSignup}
        >
          Don't have an account? Sign up
        </p>

      </div>
    </div>
  );
}