import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./forgotpassword.css";

import {
  handleForgotPasswordSubmit,
  handleEmailChange,
  getEmailInlineError,
} from "./forgotpassword.js";

function ForgotPassword() {

  const navigate = useNavigate();

  // ===== STATE =====
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [lastRequestTime, setLastRequestTime] = useState(0);

  // Inline validation message
  const inlineEmailError = getEmailInlineError(email, emailTouched);

  return (
    <div className="forgot-page">
      <div className="forgot-page-center">
        <div className="forgot-card">

          {/* ===== TITLE ===== */}
          <h1 className="forgot-title">Forgot Password</h1>
          <p className="forgot-subtext">
            Enter your email and we'll send a reset link.
          </p>

          {/* ===== STATUS MESSAGES ===== */}
          {error && <div className="status error">{error}</div>}
          {message && <div className="status success">{message}</div>}
          {!error && !message && inlineEmailError && (
            <div className="status error">{inlineEmailError}</div>
          )}

          {/* ===== FORM ===== */}
          <form
            onSubmit={(e) =>
              handleForgotPasswordSubmit(e, {
                email,
                setLoading,
                setError,
                setMessage,
                emailTouched,
                setEmailTouched,
                lastRequestTime,
                setLastRequestTime,
              })
            }
          >
            <input
              className="forgot-input"
              type="email"
              placeholder="Email"
              value={email}
              disabled={loading}
              onChange={(e) =>
                handleEmailChange(
                  e,
                  setEmail,
                  setError,
                  setMessage,
                  setEmailTouched
                )
              }
            />

            <button className="forgot-btn" type="submit">
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          {/* ===== BACK BUTTON ===== */}
          <button
            className="forgot-btn"
            onClick={() => navigate("/")}
          >
            Back to Login
          </button>

        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="forgot-footer">
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

export default ForgotPassword;
