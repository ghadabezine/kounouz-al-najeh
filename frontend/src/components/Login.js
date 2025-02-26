import React, { useState } from "react";
import axios from "axios";
import "../styles/Login.css";

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("❌ Please enter both email and password");
      return;
    }

    if (email !== "admin@gmail.com") {
      alert("❌ Access denied. Only admin can log in.");
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:5001/api/auth/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      alert(data.message || "✅ Logged in successfully");
      console.log("Received Token:", data.token);
      setIsAuthenticated(true); // ✅ Update authentication state
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "❌ Login failed");
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-header">Admin Login</h1>

      <form onSubmit={handleLogin} className="login-form">
        <input
          className="login-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="off"
        />
        <input
          className="login-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
};

export default Login;
