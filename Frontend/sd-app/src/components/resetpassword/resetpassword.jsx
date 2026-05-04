import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./resetpassword.css";
import { handleResetPasswordSubmit } from "./resetpassword";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const passwordMin = 8;
  const passwordMax = 32;

  const isLengthValid = password.length >= passwordMin && password.length <= passwordMax;
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]?]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const isPasswordValid = isLengthValid && hasNumber && hasSpecial && passwordsMatch;
  const passwordResetSuccessful = message !== "";

  return (
    <div className="reset-page">
      <div className="reset-page-center">
        <div className="reset-card">
          <h1 className="reset-title">Reset Password</h1>

          {!passwordResetSuccessful && (
            <p className="reset-subtext">Enter your new password.</p>
          )}

          {error && <div className="status error">{error}</div>}
          {message && <div className="status success">{message}</div>}

          {!passwordResetSuccessful ? (
            <form
              className="reset-form"
              onSubmit={(e) =>
                handleResetPasswordSubmit(e, {
                  token,
                  password,
                  confirmPassword,
                  isPasswordValid,
                  setPassword,
                  setConfirmPassword,
                  setLoading,
                  setError,
                  setMessage,
                })
              }
            >
              <input
                className="reset-input"
                type="password"
                placeholder="New Password"
                value={password}
                disabled={loading}
                onChange={(e) => setPassword(e.target.value)}
              />

              <input
                className="reset-input"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                disabled={loading}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <div className="reset-check">
                <div className="reset-circle" style={{ background: isLengthValid ? "green" : "red" }}></div>
                <span>8–32 characters</span>
              </div>

              <div className="reset-check">
                <div className="reset-circle" style={{ background: hasNumber ? "green" : "red" }}></div>
                <span>Contains number</span>
              </div>

              <div className="reset-check">
                <div className="reset-circle" style={{ background: hasSpecial ? "green" : "red" }}></div>
                <span>Contains special character</span>
              </div>

              <div className="reset-check">
                <div className="reset-circle" style={{ background: passwordsMatch ? "green" : "red" }}></div>
                <span>Passwords match</span>
              </div>

              <button className="reset-btn" type="submit" disabled={loading || !isPasswordValid}>
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          ) : (
            <button
              type="button"
              className="reset-btn"
              onClick={() => navigate("/")}
            >
              Back to Login
            </button>
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="resetpassword-footer">
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

export default ResetPassword;