import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MEMBERS,
  DESIGN_DOCS,
  FILTER_TABS,
  NAV_LINKS,
  FOOTER_LINKS,
  OVERVIEW_PARAGRAPHS,
  filterMembers,
  cardDelay,
} from "./TeamPage.js";
import "./TeamPage.css";

/* ─────────────────────────────────────────────
   NAV BAR
───────────────────────────────────────────── */
function NavBar() {
  const navigate = useNavigate();
  return (
    <nav className="tp-nav">
      <button className="tp-nav-back" onClick={() => navigate(-1)}>
        <span className="tp-nav-arrow">←</span>
        <span className="tp-nav-back-label">Back to Home</span>
      </button>
      <div className="tp-nav-links">
        {NAV_LINKS.map(({ label, href }) => (
          <a key={label} href={href}>{label}</a>
        ))}
      </div>
    </nav>
  );
}

/* ─────────────────────────────────────────────
   TEAM MEMBER CARD
───────────────────────────────────────────── */
function TeamMemberCard({ member, index }) {
  const [flipped, setFlipped] = useState(false);
  const isBackend = member.role === "Backend";

  return (
    <div
      className="tmc-wrapper"
      style={{ animationDelay: cardDelay(index) }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <div className={`tmc-inner ${flipped ? "tmc-flipped" : ""}`}>

        {/* FRONT */}
        <div className="tmc-face tmc-front">
          <div className={`tmc-role-bar ${isBackend ? "tmc-role-bar--backend" : ""}`} />
          <div className="tmc-photo-wrap">
            <img src={member.photo} alt={member.name} className="tmc-photo" loading="lazy" />
          </div>
          <div className="tmc-info">
            <h3 className="tmc-name">{member.name}</h3>
            <p className="tmc-title">{member.title}</p>
          </div>
          <p className="tmc-hint">Hover for details</p>
        </div>

        {/* BACK */}
        <div className="tmc-face tmc-back">
          <div className={`tmc-role-bar ${isBackend ? "tmc-role-bar--backend" : ""}`}>
            <span className="tmc-role-label">{member.role.toUpperCase()}</span>
          </div>
          <div className="tmc-back-content">
            <h3 className="tmc-name">{member.name}</h3>
            <div className="tmc-back-field">
              <span className="tmc-field-label">Major</span>
              <span>{member.major}</span>
            </div>
            {member.minor && (
              <div className="tmc-back-field">
                <span className="tmc-field-label">Minor</span>
                <span>{member.minor}</span>
              </div>
            )}
            <p className="tmc-bio">{member.bio}</p>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function TeamPage() {
  const [filter, setFilter] = useState("All");
  const filtered = filterMembers(MEMBERS, filter);

  return (
    <div className="tp-root">

      <NavBar />

      {/* HERO */}
      <section className="tp-hero">
        <div className="tp-hero-grid-bg" aria-hidden="true" />
        <div className="tp-hero-content">
          <p className="tp-hero-eyebrow">Iowa State University · Senior Design · Team 32</p>
          <h1 className="tp-hero-title">
            <span className="tp-hero-accent">Load Forecasting</span>
            <br />with Machine Learning
          </h1>
          <p className="tp-hero-sub">
            Geo-location–aware ML models that cut prediction error for utilities,
            market investors, and everyday consumers.
          </p>
        </div>
      </section>

      {/* PROJECT OVERVIEW */}
      <section className="tp-section tp-overview-section" id="overview">
        <div className="tp-inner">
          <h2 className="tp-heading">Project Overview</h2>
          {OVERVIEW_PARAGRAPHS.map((text, i) => (
            <p key={i} className="tp-overview-text">{text}</p>
          ))}
        </div>
      </section>

      {/* TEAM MEMBERS */}
      <section className="tp-section" id="teammembers">
        <div className="tp-inner">
          <h2 className="tp-heading">The Team</h2>
          <div className="tp-filter-row">
            {FILTER_TABS.map((f) => (
              <button
                key={f}
                className={`tp-filter-btn ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="tp-members-grid">
            {filtered.map((m, i) => (
              <TeamMemberCard key={m.name} member={m} index={i} />
            ))}
          </div>
          <p className="tp-contact">
            Advisor &amp; Client: <strong>Goce Trajcevski</strong> &nbsp;·&nbsp;{" "}
            <a href="mailto:sdMay26-32@iastate.edu">sdMay26-32@iastate.edu</a>
          </p>
        </div>
      </section>

      {/* DESIGN DOCUMENTS */}
      <section className="tp-section tp-docs-section" id="designdocuments">
        <div className="tp-inner">
          <h2 className="tp-heading tp-heading--light">Design Documents</h2>
          <p className="tp-docs-intro">
            All design artifacts produced throughout the senior design process —
            from initial requirements through the final comprehensive report.
          </p>
          <div className="tp-docs-grid">
            {DESIGN_DOCS.map(({ label, href, featured }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`tp-doc-card ${featured ? "tp-doc-featured" : ""}`}
              >
                <span className="tp-doc-icon">📄</span>
                <span className="tp-doc-label">{label}</span>
                {featured && <span className="tp-doc-badge">Complete</span>}
                <span className="tp-doc-arrow">→</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="tp-footer">
        <p>Iowa State University · Senior Design Team sdmay26-32 · 2025–2026</p>
        <p>
          {FOOTER_LINKS.map(({ label, href }, i) => (
            <span key={label}>
              {i > 0 && " · "}
              <a href={href} target="_blank" rel="noopener noreferrer">{label}</a>
            </span>
          ))}
        </p>
      </footer>

    </div>
  );
}
