import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../utils/functions";
import { useUser } from "../../context/UserContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { postData } from "./signup";
import "./signup.css";

function Signup() {
  // ===== STATE — declared before any function that uses them =====
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");

  const navigate    = useNavigate();
  const { setUser } = useUser();

  // ===== VALIDATION =====
  const isEmailValid   = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isLengthValid  = password.length >= 8 && password.length <= 32;
  const hasNumber      = /\d/.test(password);
  const hasSpecial     = /[!@#$%^&*()_+\-=\[\]?]/.test(password);
  const isPasswordValid = isLengthValid && hasNumber && hasSpecial;
  const isFormValid    = isEmailValid && isPasswordValid;

  const handleClick = async () => {
    const result = await postData(email, password);
    if (result.success) {
      setUser(result.user);                        // store in context + localStorage
      navigate("/main", { replace: true });        // no state needed
    } else {
      showToast(`Signup failed: ${result.error}`, "error");
    }
  };

  return (
    <div className="signup-page">
      <ToastContainer />
      <div className="signup-page-center">
        <div className="signup-card">

          <h1 className="signup-title">Sign Up</h1>

          <input
            className="signup-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="signup-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="signup-check">
            <div className="signup-circle" style={{ background: isEmailValid  ? "green" : "red" }} />
            <span>Valid Email</span>
          </div>
          <div className="signup-check">
            <div className="signup-circle" style={{ background: isLengthValid ? "green" : "red" }} />
            <span>8–32 characters</span>
          </div>
          <div className="signup-check">
            <div className="signup-circle" style={{ background: hasNumber    ? "green" : "red" }} />
            <span>Contains number</span>
          </div>
          <div className="signup-check">
            <div className="signup-circle" style={{ background: hasSpecial   ? "green" : "red" }} />
            <span>Contains special character</span>
          </div>

          <button className="signup-btn" disabled={!isFormValid} onClick={handleClick}>
            Sign Up
          </button>
          <button className="signup-btn" onClick={() => navigate("/")}>
            Back to Login
          </button>

        </div>
      </div>

      <footer className="signup-footer">
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

export default Signup;
