import { useState } from "react";
import { useUser } from "../../context/UserContext";

/* ─────────────────────────────────────────────────────────────────
   STATIC GEOJSON IMPORTS
   Vite handles JSON imports natively — no fetch needed.
   Files must be at: src/components/mainscreen/geojson/PJM/AE.geojson etc.
───────────────────────────────────────────────────────────────── */

// Zone outer boundary outlines (shown on overview map)
import PJM_boundary   from "./geojson/boundaries/PJM_boundary.geojson";
import NYISO_boundary from "./geojson/boundaries/NYISO_boundary.geojson";
import ISNE_boundary  from "./geojson/boundaries/ISNE_boundary.geojson";
import USA_outline    from "./geojson/boundaries/USA_outline.geojson";

// PJM
import AE from "./geojson/PJM/AE.geojson";
import AEP from "./geojson/PJM/AEP.geojson";
import AP from "./geojson/PJM/AP.geojson";
import ATSI from "./geojson/PJM/ATSI.geojson";
import BC from "./geojson/PJM/BC.geojson";
import CE from "./geojson/PJM/CE.geojson";
import DAY from "./geojson/PJM/DAY.geojson";
import DEOK from "./geojson/PJM/DEOK.geojson";
import DOM from "./geojson/PJM/DOM.geojson";
import DPL from "./geojson/PJM/DPL.geojson";
import DUQ from "./geojson/PJM/DUQ.geojson";
import EKPC from "./geojson/PJM/EKPC.geojson";
import JC from "./geojson/PJM/JC.geojson";
import ME from "./geojson/PJM/ME.geojson";
import PE from "./geojson/PJM/PE.geojson";
import PEP from "./geojson/PJM/PEP.geojson";
import PL from "./geojson/PJM/PL.geojson";
import PN from "./geojson/PJM/PN.geojson";
import PS from "./geojson/PJM/PS.geojson";

// NYISO
import ZoneA from "./geojson/NYISO/A.geojson";
import ZoneB from "./geojson/NYISO/B.geojson";
import ZoneC from "./geojson/NYISO/C.geojson";
import ZoneD from "./geojson/NYISO/D.geojson";
import ZoneE from "./geojson/NYISO/E.geojson";
import ZoneF from "./geojson/NYISO/F.geojson";
import ZoneG from "./geojson/NYISO/G.geojson";
import ZoneH from "./geojson/NYISO/H.geojson";
import ZoneI from "./geojson/NYISO/I.geojson";
import ZoneJ from "./geojson/NYISO/J.geojson";
import ZoneK from "./geojson/NYISO/K.geojson";

// ISONE
import Z4001 from "./geojson/ISNE/4001.geojson";
import Z4002 from "./geojson/ISNE/4002.geojson";
import Z4003 from "./geojson/ISNE/4003.geojson";
import Z4004 from "./geojson/ISNE/4004.geojson";
import Z4005 from "./geojson/ISNE/4005.geojson";
import Z4006 from "./geojson/ISNE/4006.geojson";
import Z4007 from "./geojson/ISNE/4007.geojson";
import Z4008 from "./geojson/ISNE/4008.geojson";

/* ─────────────────────────────────────────────────────────────────
   ZONE DATA
   geo: the imported GeoJSON object, available immediately on load.
   bounds: real values derived from the actual GeoJSON files.
───────────────────────────────────────────────────────────────── */
export const ZONES = [
  {
    id: "PJM",
    label: "PJM Interconnection",
    color: "#4a90d9",
    bounds: [[35.59, -90.30], [42.51, -73.89]],
    boundary: PJM_boundary,
    subzones: [
      { id: "AE", label: "Atlantic City Electric (AE)", geo: AE },
      { id: "AEP", label: "American Electric Power (AEP)", geo: AEP },
      { id: "AP", label: "Allegheny Power (AP)", geo: AP },
      { id: "ATSI", label: "American Transmission Systems (ATSI)", geo: ATSI },
      { id: "BC", label: "Baltimore Gas & Electric (BC)", geo: BC },
      { id: "CE", label: "Commonwealth Edison (CE)", geo: CE },
      { id: "DAY", label: "Dayton Power & Light (DAY)", geo: DAY },
      { id: "DEOK", label: "Duke Energy Ohio/Kentucky (DEOK)", geo: DEOK },
      { id: "DOM", label: "Dominion Energy (DOM)", geo: DOM },
      { id: "DPL", label: "Delmarva Power & Light (DPL)", geo: DPL },
      { id: "DUQ", label: "Duquesne Light (DUQ)", geo: DUQ },
      { id: "EKPC", label: "East Kentucky Power Cooperative (EKPC)", geo: EKPC },
      { id: "JC", label: "Jersey Central Power & Light (JC)", geo: JC },
      { id: "ME", label: "Metropolitan Edison (ME)", geo: ME },
      { id: "PE", label: "PECO Energy (PE)", geo: PE },
      { id: "PEP", label: "Potomac Electric Power (PEP)", geo: PEP },
      { id: "PL", label: "Pennsylvania Power & Light (PL)", geo: PL },
      { id: "PN", label: "Pennsylvania Power (PN)", geo: PN },
      { id: "PS", label: "Public Service Electric & Gas (PS)", geo: PS },
    ],
  },
  {
    id: "NYIS",
    label: "NY Independent System Operator",
    color: "#e8a020",
    bounds: [[40.50, -79.76], [45.01, -71.86]],
    boundary: NYISO_boundary,
    subzones: [
      { id: "ZONA", label: "Zone A — West (Buffalo)", geo: ZoneA },
      { id: "ZONB", label: "Zone B — Genesee (Rochester)", geo: ZoneB },
      { id: "ZONC", label: "Zone C — Central (Syracuse)", geo: ZoneC },
      { id: "ZOND", label: "Zone D — North", geo: ZoneD },
      { id: "ZONE", label: "Zone E — Mohawk Valley", geo: ZoneE },
      { id: "ZONF", label: "Zone F — Capital District (Albany)", geo: ZoneF },
      { id: "ZONG", label: "Zone G — Hudson Valley", geo: ZoneG },
      { id: "ZONH", label: "Zone H — Millwood", geo: ZoneH },
      { id: "ZONI", label: "Zone I — Dunwoodie", geo: ZoneI },
      { id: "ZONJ", label: "Zone J — New York City", geo: ZoneJ },
      { id: "ZONK", label: "Zone K — Long Island", geo: ZoneK },
    ],
  },
  {
    id: "ISNE",
    label: "ISO New England",
    color: "#2ecc71",
    bounds: [[40.99, -73.73], [47.46, -66.95]],
    boundary: ISNE_boundary,
    subzones: [
      { id: "4001", label: "4001 — Maine", geo: Z4001 },
      { id: "4002", label: "4002 — New Hampshire", geo: Z4002 },
      { id: "4003", label: "4003 — Vermont", geo: Z4003 },
      { id: "4004", label: "4004 — Connecticut", geo: Z4004 },
      { id: "4005", label: "4005 — Rhode Island", geo: Z4005 },
      { id: "4006", label: "4006 — SE Massachusetts (SEMASS)", geo: Z4006 },
      { id: "4007", label: "4007 — W/C Massachusetts (WCMASS)", geo: Z4007 },
      { id: "4008", label: "4008 — NE Massachusetts / Boston", geo: Z4008 },
    ],
  },
];

/* ─────────────────────────────────────────────────────────────────
   LOGIC HOOK
───────────────────────────────────────────────────────────────── */
export function useMainScreenLogic(navigate) {
  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedSubzones, setSelectedSubzones] = useState([]);

  const handleZoneSelect = (zone) => {
    if (selectedZone?.id === zone.id) return;
    setSelectedZone(zone);
    setSelectedSubzones([]);
  };

  const clearZone = () => {
    setSelectedZone(null);
    setSelectedSubzones([]);
  };

  const selectSubzone = (subzone) => {
    const already = selectedSubzones.some(s => s.id === subzone.id);
    if (already) {
      setSelectedSubzones(prev => prev.filter(s => s.id !== subzone.id));
    } else {
      if (selectedSubzones.length >= 3) return;
      setSelectedSubzones(prev => [...prev, subzone]);
    }
  };

  const clearSubzones = () => setSelectedSubzones([]);
  const canRunPrediction = !!selectedZone && selectedSubzones.length >= 1;

  const { user, clearUser } = useUser();

  const handleSignOut  = () => { clearUser(); navigate("/"); };
  const handleTeamPage = () => navigate("/team");
  const handleHistory = () => navigate("/history");

  return {
    ZONES,
    USA_outline,
    sessionUser: user,
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
  };
}

export async function predict(userId, dataset, sub) {
  const inputs = {
    "userId": userId,
    "dataset": dataset,
    "sub": sub
  }

  try {
    // Send POST request
    const response = await fetch("/api/predict", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(inputs),
    });

    // Convert response to JSON
    const data = await response.json();
    if (data) {
      // Handle successful prediction
      return data;
    }
    else {
      // Handle prediction failure
      return "failed";
    }
  } catch (error) {
    // Catch network or server errors
    return error;
  }
}
