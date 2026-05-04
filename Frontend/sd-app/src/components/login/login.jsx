import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../utils/functions.js";
import { useUser } from "../../context/UserContext";
import "./login.css";
import {
  handleLoginSubmit,
  handleEmailChange,
  handlePasswordChange,
} from "./login.js";

function Login() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");

  const navigate    = useNavigate();
  const { setUser } = useUser();

  const handleClick = async (event) => {
    const result = await handleLoginSubmit(event, email, password, setError);
    if (result.success) {
      setUser(result.user);                          // store in context + localStorage
      navigate("/main", { replace: true });          // no state needed — context handles it
    } else {
      showToast(`Login failed: ${result.error}`, "error");
    }
  };

  return (
    <div className="login-page">
      <div className="login-page-center">
        <div className="login-card">

          <h1>Geo-Location Load Forecasting</h1>
          <p className="login-subtitle">SDmay26-32</p>

          {error && <p className="login-error">{error}</p>}

          <form onSubmit={(e) => handleClick(e)}>
            <input
              className="login-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => handleEmailChange(e, setEmail)}
            />
            <input
              className="login-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => handlePasswordChange(e, setPassword)}
            />
            <button type="submit" className="login-btn">Log In</button>
          </form>

          <button className="login-btn" type="button" onClick={() => navigate("/forgot-password")}>
            Forgot Password
          </button>
          <button className="login-btn" type="button" onClick={() => navigate("/signup")}>
            Sign Up
          </button>

        </div>
      </div>

      <footer className="login-footer">
        <p>Iowa State University · Senior Design Team sdmay26-32 · 2025–2026</p>
        <p>
          <a href="http://ece.iastate.edu" target="_blank" rel="noopener noreferrer">ECpE @ ISU</a>
          {" · "}
          <a href="http://seniord.ece.iastate.edu" target="_blank" rel="noopener noreferrer">ECpE Senior Design</a>
          {" · "}
          <a href="https://git.ece.iastate.edu/sd/sdmay26-32" target="_blank" rel="noopener noreferrer">GitLab Repo</a>
        </p>
      </footer>
    </div>
  );
}

export default Login;
