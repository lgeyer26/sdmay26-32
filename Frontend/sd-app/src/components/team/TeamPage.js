/* ─────────────────────────────────────────────────────────────────
   TeamPage.js
   All data and pure JS logic for the Team Page.
   To update content, edit the arrays below — no JSX changes needed.
───────────────────────────────────────────────────────────────── */

const BASE = "https://sdmay26-32.sd.ece.iastate.edu";

/* ── TEAM MEMBERS ───────────────────────────────────────────────
   To update bio or major/minor: edit those fields directly.
─────────────────────────────────────────────────────────────── */
export const MEMBERS = [
  {
    name: "Luke Geyer",
    role: "Frontend",
    title: "Frontend Developer",
    photo: `${BASE}/Headshots/Luke_headshot.jpg`,
    major: "Cybersecurity Engineering",
    minor: null,
    bio: "Industry experience in cloud security. Responsible for authentication flows and secure client-side data handling.",
  },
  {
    name: "Carson Cornwell",
    role: "Frontend",
    title: "Frontend Developer",
    photo: `${BASE}/Headshots/Carson_headshot.jpg`,
    major: "Electrical Engineering",
    minor: "Sales Engineering",
    bio: "Industry experience in manufacturing and continuous improvement. Bridges domain knowledge with UI/UX for power-grid contexts.",
  },
  {
    name: "Peter Hutchison",
    role: "Frontend",
    title: "Frontend Developer",
    photo: `${BASE}/Headshots/Peter_Headshot.png`,
    major: "Computer Engineering",
    minor: null,
    bio: "Experience with cybersecurity frameworks including NIST and NYDFS. Focuses on compliance-aware front-end architecture.",
  },
  {
    name: "Aidan Brown",
    role: "Frontend",
    title: "Frontend Developer",
    photo: `${BASE}/Headshots/Aidan_headshot.jpg`,
    major: "Electrical Engineering",
    minor: null,
    bio: "Industry experience in control systems and power generation. Brings deep domain expertise to visualizing load forecast outputs.",
  },
  {
    name: "Owen Arnold",
    role: "Backend",
    title: "Backend Developer",
    photo: `${BASE}/Headshots/Owen_Headshot.png`,
    major: "Electrical Engineering",
    minor: "Data Science",
    bio: "Industry experience in clean transportation. Leads data pipeline design connecting ML models to the REST API.",
  },
  {
    name: "Sathvik Kasarabada",
    role: "Backend",
    title: "Backend Developer",
    photo: `${BASE}/Headshots/Sathvik_headshot.png`,
    major: "Electrical Engineering",
    minor: "Economics",
    bio: "Industry experience in renewable integration for BESS, Wind, and Solar. Handles model integration and market-aware backend logic.",
  },
  {
    name: "Lane Sullivan",
    role: "Backend",
    title: "Backend Developer",
    photo: `${BASE}/Headshots/Lane_headshot.png`,
    major: "Electrical Engineering",
    minor: "Leadership Studies",
    bio: "Industry experience in the generation and transmission of power. Owns infrastructure, database management, and deployment.",
  },
];

/* ── DESIGN DOCUMENTS ───────────────────────────────────────────
   To update a document: change the `href` to the new URL.
   To add a document:    add a new object to the array.
   `featured: true`      adds the gold "Complete" badge (one only).
─────────────────────────────────────────────────────────────── */
export const DESIGN_DOCS = [
  { label: "Introduction",   href: `${BASE}/Design-Docs/Design_Document_Group32_Intro.docx.pdf` },
  { label: "Requirements",   href: `${BASE}/Design-Docs/Design_Document_Group32_Requirements.docx.pdf` },
  { label: "Project Plan",   href: `${BASE}/Design-Docs/Design_Document_Group32_Project_Plan.docx.pdf` },
  { label: "Design",         href: `${BASE}/Design-Docs/Design_Document_Group32_Design.docx.pdf` },
  { label: "Testing",        href: `${BASE}/Design-Docs/Design_Document_Group32_Testing.docx.pdf` },
  { label: "Final Document", href: `${BASE}/Design-Docs/sdmay26-32_FINAL_DesignDoc.pdf`, featured: true },
];

/* ── FILTER LOGIC ───────────────────────────────────────────────
   Returns the filtered member list based on the selected role tab.
─────────────────────────────────────────────────────────────── */
export function filterMembers(members, role) {
  if (role === "All") return members;
  return members.filter((m) => m.role === role);
}

/* ── FILTER TABS ────────────────────────────────────────────────
   Labels for the role filter buttons.
─────────────────────────────────────────────────────────────── */
export const FILTER_TABS = ["All", "Frontend", "Backend"];

/* ── PROJECT OVERVIEW TEXT ──────────────────────────────────────
   Edit these strings to update the overview section copy.
─────────────────────────────────────────────────────────────── */
export const OVERVIEW_PARAGRAPHS = [
  `Traditional load forecasting relies on broad, region-agnostic models that often
   underestimate how much local factors — weather patterns, population density, and
   infrastructure — can shift electricity demand between neighboring areas. Even small
   forecasting errors ripple across the grid, leading to over- or under-generation
   that raises costs for utilities, distorts market prices for investors, and ultimately
   lands on consumers as higher bills.`,

  `Our project addresses this by integrating geo-location data directly into
   ML-based forecasting models provided by client Goce Trajcevski, trained on publicly
   available time-series locational data. The resulting web application lets users
   select regions on an interactive map, choose from multiple forecasting models, and
   receive precise locational load projections — all saved to a personal profile for
   future reference. By making location a first-class input to forecasting, we aim to
   reduce prediction error and give power companies, market investors, and everyday
   users access to more reliable, transparent energy data.`,
];

/* ── NAV LINKS ──────────────────────────────────────────────────
   Anchor links shown in the sticky nav bar.
─────────────────────────────────────────────────────────────── */
export const NAV_LINKS = [
  { label: "Overview",  href: "#overview" },
  { label: "Team",      href: "#teammembers" },
  { label: "Documents", href: "#designdocuments" },
];

/* ── FOOTER LINKS ───────────────────────────────────────────────
   External links shown in the page footer.
─────────────────────────────────────────────────────────────── */
export const FOOTER_LINKS = [
  { label: "ECpE @ ISU",          href: "http://ece.iastate.edu" },
  { label: "ECpE Senior Design",  href: "http://seniord.ece.iastate.edu" },
  { label: "GitLab Repo",         href: "https://git.ece.iastate.edu/sd/sdmay26-32" },
];

/* ── CARD ANIMATION DELAY ───────────────────────────────────────
   Returns the CSS animation-delay string for staggered card reveals.
─────────────────────────────────────────────────────────────── */
export function cardDelay(index) {
  return `${index * 60}ms`;
}
