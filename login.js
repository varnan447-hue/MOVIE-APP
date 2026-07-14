import React, { useState } from "react";

function Login({ onLogin }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  function handleLogin() {
    if (user === "admin" && pass === "1234") {
      localStorage.setItem("loggedIn", "true");
      onLogin();
    } else {
      alert("Wrong ❌");
    }
  }

  return (
    <div className="login-bg">

      <div className="login-card">
        <h3 style={{ color: "#b026ff" }}>Login</h3>

        <input
          className="form-control mt-2"
          placeholder="Username"
          onChange={(e) => setUser(e.target.value)}
        />

        <input
          type="password"
          className="form-control mt-2"
          placeholder="Password"
          onChange={(e) => setPass(e.target.value)}
        />

        <button className="btn btn-success mt-3 w-100" onClick={handleLogin}>
          Login
        </button>

      </div>

    </div>
  );
}

export default Login;