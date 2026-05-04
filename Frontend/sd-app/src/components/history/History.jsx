import React, { useState, useEffect } from "react";
import "./History.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useHistoryLogic, fetchHistory } from "./History.js";
import ResultsPopup from "../results/results.jsx";

export default function History() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    user,
    handleSignOut,
    handleTeamPage,
    handleMain,
    handleHistory,
  } = useHistoryLogic(navigate);

  const [selectedItem, setSelectedItem] = useState(null);
  const [testItems, setTestItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    const loadHistory = async () => {
      const { success, history, error } = await fetchHistory(user.user_id);
      console.log("Fetch history result:", { success, history, error });
      if (success) {
        setTestItems(history);
      } else {
        console.error("Error fetching history:", error);
      }
    };
    loadHistory();
  }, [user, navigate]);

  const handleClickItem = (item) => {
    console.log("Item clicked:", item);
    setSelectedItem(item);
    setIsOpen(true);
  };

  return (
    <div className="history-wrapper">

      <nav className="history-navbar">
        <div className="history-navbar-brand">
          <h1>Geo-Location Load Forecasting</h1>
          <button className="history-team-link" onClick={handleTeamPage}>
            SDmay26-32
          </button>
        </div>

        <div className="history-navbar-toggle">
          <button
            className={`history-toggle-btn ${location.pathname === "/main" ? "active" : ""}`}
            onClick={handleMain}
          >
            Map
          </button>
          <button
            className={`history-toggle-btn ${location.pathname === "/history" ? "active" : ""}`}
            onClick={handleHistory}
          >
            History
          </button>
        </div>

        {/* Right — User + Sign Out */}
        <div className="history-navbar-right">
          <span className="history-navbar-user">
            {user?.email ?? "user@example.com"}
          </span>
          <button className="history-nav-btn signout" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </nav>

      <div className="history-body">
        <div className="history-section-header">
          <span className="history-section-title">Prediction History</span>
          <span className="history-section-meta">
            Saved runs: <span>{testItems.length}</span>
          </span>
        </div>

        <div className="history-card">
          <div className="history-card-header">
            <span className="history-card-title">Recent Forecast Runs</span>
            <span className="history-card-hint">Click a row to view details</span>
          </div>

          <div className="history-list">
            {testItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleClickItem(item)}
                className="history-list-item"
              >
                <div className="history-item-main">
                  <span className="history-item-label">Date</span>
                  <span className="history-item-value">{item.created_at}</span>
                </div>

                <div className="history-item-main">
                  <span className="history-item-label">Dataset</span>
                  <span className="history-item-value">{item.dataset}</span>
                </div>

                <div className="history-item-main">
                  <span className="history-item-label">Locations</span>
                  <span className="history-item-value">{item.subzone}</span>
                </div>

                <span className="history-view-text">View</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <footer className="history-footer">
        <p>Iowa State University · Senior Design Team sdmay26-32 · 2025–2026</p>
        <p>
          <a href="http://ece.iastate.edu" target="_blank" rel="noopener noreferrer">ECpE @ ISU</a>
          {" · "}
          <a href="http://seniord.ece.iastate.edu" target="_blank" rel="noopener noreferrer">ECpE Senior Design</a>
          {" · "}
          <a href="https://git.ece.iastate.edu/sd/sdmay26-32" target="_blank" rel="noopener noreferrer">GitLab Repo</a>
        </p>
      </footer>

      <ResultsPopup
        isOpen = {isOpen}
        onClose = {() => setIsOpen(false)}
        results={Array.isArray(selectedItem) ? selectedItem : [selectedItem]}
      />

    </div>
  );
}
