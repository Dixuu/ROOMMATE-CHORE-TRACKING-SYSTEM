import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import "../styles/login.css";

export default function Signup({ setUser, goToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      setUser(userCred.user);

    } catch (err) {
  console.log("SIGNUP ERROR:", err.code, err.message);
  setError(err.message);
}

    setLoading(false);
  };

  return (
    <div className="login-bg">
      <div className="login-card">

        <h1>📝 Create Account</h1>
        <p>Join your roommate dashboard</p>

        <form onSubmit={handleSignup}>

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

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Sign Up"}
          </button>

          {error && <p className="error">{error}</p>}

        </form>

        <p
          style={{ marginTop: "10px", cursor: "pointer", color: "#2d6a9f" }}
          onClick={goToLogin}
        >
          Already have an account? Login
        </p>

      </div>
    </div>
  );
}