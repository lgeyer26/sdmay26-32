import React, { useEffect, useState } from "react";
import "./mainscreen.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import { showToast } from '../utils/functions';
import { useNavigate, useLocation } from "react-router-dom";
import { useMainScreenLogic, predict } from "./mainscreenLogic";
import ResultsPopup from "../results/results";

/* ─────────────────────────────────────────────
   MapController — zooms to selected zone or
   fits all three zones for the overview.
───────────────────────────────────────────── */
function MapController({ selectedZone }) {
  const map = useMap();
  useEffect(() => {
    if (selectedZone) {
      map.fitBounds(selectedZone.bounds, { padding: [32, 32] });
    } else {
      map.fitBounds([[35.59, -90.30], [47.46, -66.95]], { padding: [24, 24] });
    }
  }, [selectedZone, map]);
  return null;
}

/* ─────────────────────────────────────────────
   SubzoneLayer — one selectable subzone.
───────────────────────────────────────────── */
function SubzoneLayer({ sub, zone, isSelected, isDisabled, onSelect }) {
  const styleFunc = () => ({
    color: isSelected ? "#fff" : zone.color,
    fillColor: zone.color,
    fillOpacity: isSelected ? 0.75 : isDisabled ? 0.08 : 0.25,
    weight: isSelected ? 3 : 1.5,
    dashArray: isDisabled ? "5 5" : null,
  });

  const onEach = (_feature, layer) => {
    layer.bindTooltip(sub.label, { sticky: true });
    layer.on({
      click: () => { if (!isDisabled) onSelect(sub); },
      mouseover: (e) => { if (!isDisabled) e.target.setStyle({ fillOpacity: isSelected ? 0.85 : 0.42 }); },
      mouseout: (e) => { e.target.setStyle(styleFunc()); },
    });
  };

  return (
    <GeoJSON
      key={`${sub.id}-${isSelected}-${isDisabled}`}
      data={sub.geo}
      style={styleFunc}
      onEachFeature={onEach}
    />
  );
}

/* ─────────────────────────────────────────────
   OverviewLayer — subzone shown on overview.
   Clicking selects the parent zone.
───────────────────────────────────────────── */
function OverviewLayer({ sub, zone, onZoneSelect }) {
  const style = () => ({
    color: zone.color,
    fillColor: zone.color,
    fillOpacity: 0.2,
    weight: 1.5,
  });

  const onEach = (_feature, layer) => {
    layer.bindTooltip(`${zone.label} — Click to select`, { sticky: true });
    layer.on({
      click: () => onZoneSelect(zone),
      mouseover: (e) => e.target.setStyle({ fillOpacity: 0.42 }),
      mouseout: (e) => e.target.setStyle(style()),
    });
  };

  return (
    <GeoJSON
      key={`overview-${sub.id}`}
      data={sub.geo}
      style={style}
      onEachFeature={onEach}
    />
  );
}

/* ─────────────────────────────────────────────
   MAIN SCREEN
───────────────────────────────────────────── */
export default function MainScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState([]);

  const {
    ZONES,
    USA_outline,
    sessionUser,
    selectedZone,
    selectedSubzones,
    selectSubzone,
    handleZoneSelect,
    clearZone,
    clearSubzones,
    canRunPrediction,
    handleSignOut,
    handleTeamPage,
    handleHistory,
  } = useMainScreenLogic(navigate);

  const handleClick = async () => {
  try {
    console.log("Sending:", {
      userId: sessionUser?.user_id,
      dataset: selectedZone.id,
      subs: selectedSubzones.map(s => s.id)
    });

    const formattedResults = [];

    for (const sub of selectedSubzones) {
      try {
        const res = await predict(sessionUser?.user_id, selectedZone.id, sub.id);
	
	console.log("Received for subzone", sub.id, ":", res);

        if (res) {
          formattedResults.push({
            dataset: res.meta.dataset,
            subzone: res.meta.sub,
            enc_in: res.meta.enc_in,
            true_values: res.true_target,
            predicted_values: res.pred
          });
        }

	console.log("Result Pushed");

      } catch (err) {
        console.error("Error for subzone:", sub.id, err);
      }
    }

    if (formattedResults.length === 0) {
      console.log("All predictions failed");
      return;
    }

    setResults(formattedResults);
    setIsOpen(true);

    console.log("Finished Predictions"); 	  

  } catch (err) {
    console.error("Prediction error:", err);
  }
};

  const atLimit = selectedSubzones.length >= 3;

  return (
    <div className="mainscreen-wrapper">

      {/* ── Navbar ── */}
      <nav className="mainscreen-navbar">
        <div className="navbar-brand">
          <h1>Geo-Location Load Forecasting</h1>
          <button className="team-link" onClick={handleTeamPage}>SDmay26-32</button>
        </div>
        <div className="navbar-toggle">
          <button
            className={`toggle-btn ${location.pathname === "/main" ? "active" : ""}`}
            onClick={() => navigate("/main")}
          >Map</button>
          <button
            className={`toggle-btn ${location.pathname === "/history" ? "active" : ""}`}
            onClick={handleHistory}
          >History</button>
        </div>
        <div className="navbar-right">
          <span className="navbar-user">
            {sessionUser?.email ?? "user@example.com"}
          </span>
          <button className="nav-btn signout" onClick={handleSignOut}>Sign Out</button>
        </div>
      </nav>

      {/* ── Body ── */}
      <div className="mainscreen-body">

        <div className="section-header">
          <span className="section-title">Load Zone Selection</span>
          <span className="section-meta">
            {selectedZone
              ? <>{selectedZone.label} &nbsp;·&nbsp; Regions selected: <span>{selectedSubzones.length} / 3</span></>
              : "Click a zone on the map or use the panel to begin"}
          </span>
        </div>

        <div className="map-sidebar-row">

          {/* ── Map card ── */}
          <div className="map-card">
            <div className="map-card-header">
              <span className="map-card-title">
                {selectedZone
                  ? `${selectedZone.label} — Select up to 3 regions`
                  : "Grid Map — All Zones Overview"}
              </span>
              <span className="map-card-hint">
                {selectedZone
                  ? atLimit ? "3 / 3 regions selected" : "Click a region to select"
                  : "Click a zone to drill in"}
              </span>
            </div>

            <div className="map-container">
              <MapContainer
                center={[41.5, -78.0]}
                zoom={5}
                minZoom={4}
                maxZoom={12}
                maxBounds={[[33.0, -95.0], [50.0, -60.0]]}
                maxBoundsViscosity={1.0}
                className="map"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />

                {/* USA state outlines — always visible as geographic reference */}
                <GeoJSON
                  key="usa-outline"
                  data={USA_outline}
                  style={() => ({
                    color: "#999",
                    fillColor: "transparent",
                    fillOpacity: 0,
                    weight: 1,
                    dashArray: "3 3",
                  })}
                />

                <MapController selectedZone={selectedZone} />

                {/* Overview: boundary outline + faded subzones before selection */}
                {!selectedZone && ZONES.map(zone => (
                  <React.Fragment key={`overview-${zone.id}`}>

                    {/* Faded subzones so internal lines are visible */}
                    {zone.subzones.map(sub => (
                      <OverviewLayer
                        key={`ov-${sub.id}`}
                        sub={sub}
                        zone={zone}
                        onZoneSelect={handleZoneSelect}
                      />
                    ))}

                    {/* Crisp outer border on top */}
                    <GeoJSON
                      key={`border-${zone.id}`}
                      data={zone.boundary}
                      style={() => ({
                        color: zone.color,
                        fillColor: "transparent",
                        fillOpacity: 0,
                        weight: 3,
                      })}
                      onEachFeature={(_f, layer) => {
                        layer.bindTooltip(`${zone.label} — Click to select`, { sticky: true });
                        layer.on({ click: () => handleZoneSelect(zone) });
                      }}
                    />

                  </React.Fragment>
                ))}

                {/* Subzones: after zone is selected */}
                {selectedZone && selectedZone.subzones.map(sub => {
                  const isSelected = selectedSubzones.some(s => s.id === sub.id);
                  const isDisabled = !isSelected && atLimit;
                  return (
                    <SubzoneLayer
                      key={sub.id}
                      sub={sub}
                      zone={selectedZone}
                      isSelected={isSelected}
                      isDisabled={isDisabled}
                      onSelect={selectSubzone}
                    />
                  );
                })}

              </MapContainer>
            </div>

            <div className="map-info-bar">
              <span className="map-info-selected">
                {selectedSubzones.length > 0
                  ? <>Selected: {selectedSubzones.map(s => <span key={s.id} className="zone-chip">{s.id}</span>)}</>
                  : selectedZone
                    ? "No regions selected — click a region on the map"
                    : "No zone selected"}
              </span>
              <button
                className="clear-btn"
                onClick={clearSubzones}
                disabled={selectedSubzones.length === 0}
              >
                Clear Regions
              </button>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="prediction-sidebar">

            <div className="sidebar-section">
              <span className="section-title">Dataset</span>
              <div className="sidebar-dropdown">
                <button className={`sidebar-dropdown-trigger ${selectedZone ? "has-value" : ""}`}>
                  <span>{selectedZone ? selectedZone.label : "Select Dataset"}</span>
                  <span className="dropdown-chevron">▾</span>
                </button>
                <div className="sidebar-dropdown-menu">
                  {ZONES.map(zone => (
                    <button
                      key={zone.id}
                      className={`sidebar-dropdown-item ${selectedZone?.id === zone.id ? "selected" : ""}`}
                      onClick={() => handleZoneSelect(zone)}
                    >
                      {zone.label}
                    </button>
                  ))}
                </div>
              </div>
              {selectedZone && (
                <button className="clear-zone-btn" onClick={clearZone}>
                  ✕ Clear dataset selection
                </button>
              )}
              <p className="sidebar-hint">Hover to choose a zone dataset</p>
            </div>

            <div className="sidebar-divider" />

            <div className="sidebar-section">
              <span className="section-title">Selected Regions</span>
              <p className="sidebar-hint">
                {selectedZone ? "Click regions on the map to select" : "Choose a dataset first"}
              </p>
              <div className="region-tracker">
                {[0, 1, 2].map(i => {
                  const sub = selectedSubzones[i];
                  return (
                    <div key={i} className={`region-slot ${sub ? "filled" : ""}`}>
                      {sub
                        ? <><span className="region-slot-dot" /><span className="region-slot-label">{sub.label}</span></>
                        : <><span className="region-slot-dot empty" /><span className="region-slot-empty">Empty</span></>
                      }
                    </div>
                  );
                })}
              </div>
              <div className={`region-counter ${atLimit ? "at-limit" : ""}`}>
                {selectedSubzones.length} / 3 regions selected
              </div>
            </div>

            <div className="sidebar-divider" />

            <div className="sidebar-summary">
              <div className={`summary-row ${selectedZone ? "ready" : ""}`}>
                <span className="summary-dot" />
                <span>{selectedZone ? selectedZone.label : "No dataset selected"}</span>
              </div>
              <div className={`summary-row ${selectedSubzones.length > 0 ? "ready" : ""}`}>
                <span className="summary-dot" />
                <span>
                  {selectedSubzones.length > 0
                    ? `${selectedSubzones.length} region${selectedSubzones.length > 1 ? "s" : ""} selected`
                    : "No regions selected"}
                </span>
              </div>
            </div>

            <button
              className={`run-prediction-btn ${canRunPrediction ? "active" : ""}`}
              disabled={!canRunPrediction}
              onClick={handleClick}
            >
              Run Prediction
            </button>

            {!canRunPrediction && (
              <p className="run-prediction-hint">
                {!selectedZone
                  ? "Select a dataset to begin"
                  : "Select at least 1 region to continue"}
              </p>
            )}

          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="mainscreen-footer">
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
        results={results}
      />

    </div>
  );
}
