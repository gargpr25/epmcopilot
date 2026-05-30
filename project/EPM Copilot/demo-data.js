/* ===========================================================================
   pg.ai EPM Copilot — single source of truth for the demo.
   All mock data + scripted AI answers live here.
   =========================================================================== */

window.SESSION = { name: "Prashant Garg", role: "Partner", initials: "PG" };

window.TOKENS = {
  pgBlack:   "#2E2E38",
  navBg:     "#1A1A26",
  pgYellow:  "#FFE600",
  epmTeal:   "#008B8B",
  tealLight: "#00AAAA",
  tealGlass: "rgba(0,139,139,0.12)",
  white:     "#FFFFFF",
  offWhite:  "#F5F5F7",
  border:    "#E4E4ED",
  slate:     "#6B6B80",
  slateLight:"#9898A8",
  success:   "#00C48C",
  warning:   "#FFB020",
  danger:    "#FF4D4D",
  blue:      "#2E75B6",
};

/* ---- 5.1 Project Atlas --------------------------------------------------- */
window.PROJECT_ATLAS = {
  id: "atlas",
  name: "Project Atlas",
  client: "Global Manufacturing Co.",
  tenant: "PG India",
  industry: "Financial Services",
  projectType: "Consolidation & Close",
  software: { name: "OneStream", version: "9.x", vendor: "OneStream Software" },
  lifecycleStage: "Requirements",
  region: "India",
  team: [
    { name: "Prashant Garg", role: "Engagement Partner", initials: "PG" },
    { name: "Aarti Menon",   role: "EPM Lead",           initials: "AM" },
    { name: "David Okafor",  role: "Senior Consultant",  initials: "DO" },
  ],
  attachedKCs: ["onestream"],
};

/* ---- KC section tree (shared) ------------------------------------------- */
window.KC_SECTIONS = [
  { anchor: "§1",    label: "Overview & architecture",   highlight: false },
  { anchor: "§2",    label: "Sizing & licensing",        highlight: false },
  { anchor: "§3",    label: "Requirements catalogue",    highlight: true },
  { anchor: "§4",    label: "Configurable components",   highlight: true },
  { anchor: "§4.12", label: "Currency Translation",      highlight: true, sub: true },
  { anchor: "§4.18", label: "ICP Matching",              highlight: true, sub: true },
  { anchor: "§5",    label: "Design patterns",           highlight: false },
  { anchor: "§8",    label: "Testing patterns",          highlight: false },
  { anchor: "§11",   label: "Security & compliance",     highlight: false },
];

/* short mock excerpts for the KC section browser */
window.KC_EXCERPTS = {
  "§1":    "Reference architecture for a multi-entity OneStream deployment: application tiers, stage engine, and the Local → Group → Reporting close topology.",
  "§2":    "Sizing guidance by entity count and concurrent-user bands. Licensing notes for consolidation, analytic blend, and the OneStream MarketPlace solutions.",
  "§3":    "Catalogue of ~120 reusable EPM requirements grouped by capability (consolidation, currency, intercompany, cash flow, disclosure) with default acceptance criteria.",
  "§4":    "Configurable components and the native levers that satisfy each requirement without custom Business Rules where possible.",
  "§4.12": "Currency Translation: Current Rate for the Balance Sheet, Average Rate for P&L, Historical Rate for Equity — modelled natively via CTRs in v9.x.",
  "§4.18": "ICP Matching: monthly intercompany matching and elimination pass executed before group close, with tolerance and auto-match rules.",
  "§5":    "Field-tested design patterns: Currency Base Entity, COC close calendar, SmartLoad ERP→chart bridge, and group-only disclosure cells.",
  "§8":    "Testing patterns and reusable test-script skeletons mapped to the requirements catalogue.",
  "§11":   "Security & compliance: SSO, role-based cell security by entity, and full drill-back audit trail from group figures to source.",
};

/* ---- 5.2 Knowledge Cartridges (3) -------------------------------------- */
window.KCS = [
  { slug: "onestream", name: "OneStream v9.x",    version: "v9.2.0", status: "Published", vendorColour: "#B91C1C", indexedChunks: 21, mcpStatus: "running" },
  { slug: "tagetik",   name: "Tagetik GA 2026",   version: "v1.4.0", status: "Published", vendorColour: "#1D4ED8", indexedChunks: 20, mcpStatus: "running" },
  { slug: "fccs",      name: "Oracle FCCS 25.04", version: "v2.1.0", status: "Published", vendorColour: "#7F1D1D", indexedChunks: 18, mcpStatus: "running" },
];

/* ---- Scripted Copilot answers ------------------------------------------ */
window.SUGGESTED_PROMPTS = [
  {
    id: "currency",
    primary: true,
    label: "Multi-currency consolidation for 45 entities, 12 currencies?",
    short: "OneStream multi-currency",
  },
  {
    id: "tagetik",
    label: "How should I model a multi-entity close in Tagetik?",
    short: "Tagetik multi-entity close",
  },
  {
    id: "sap",
    label: "What's the right SAP S/4HANA migration sequence?",
    short: "SAP S/4HANA (out of scope)",
  },
];

window.ANSWERS = {
  currency: {
    grounded: true,
    segments: [
      { t: "For a 45-entity, 12-currency OneStream deployment, use a Currency Base Entity pattern" },
      { cite: 1 },
      { t: ". Apply Current Rate for the Balance Sheet, Average Rate for P&L, and Historical Rate for Equity — handled natively via CTRs in v9.x without custom Business Rules" },
      { cite: 2 },
      { t: ". Validate with an ICP elimination pass before group close" },
      { cite: 3 },
      { t: "." },
    ],
    citations: [
      { n: 1, label: "Currency Translation", anchor: "§4.12" },
      { n: 2, label: "Configurable Components", anchor: "§4" },
      { n: 3, label: "ICP Matching", anchor: "§4.18" },
    ],
  },
  tagetik: {
    grounded: true,
    segments: [
      { t: "For a multi-entity close on Tagetik, model the COC calendar as Local Close → Group Close → Reporting" },
      { cite: 1 },
      { t: ", and enforce SmartLoad's mapping table as the single ERP→chart bridge. Disclosure pulls only from Group Close cells" },
      { cite: 2 },
      { t: "." },
    ],
    citations: [
      { n: 1, label: "Overview & architecture", anchor: "§1" },
      { n: 2, label: "Design patterns", anchor: "§5.2" },
    ],
  },
  sap: {
    grounded: false,
    text: "I don't have grounded coverage for SAP S/4HANA migration in the cartridges attached to this project (OneStream v9.x). I won't guess. Attach the SAP Group Reporting KC, or ask me about OneStream consolidation, currency translation, or close.",
    citations: [],
  },
};

/* ---- 5.3 Requirements deliverable -------------------------------------- */
window.QUESTIONNAIRE = [
  { q: "How many legal entities?",        a: "45" },
  { q: "How many currencies?",            a: "12" },
  { q: "Close calendar?",                 a: "Local → Group → Reporting" },
  { q: "Intercompany eliminations?",      a: "Yes, monthly" },
  { q: "Cash flow method?",               a: "Indirect, from movement accounts" },
  { q: "Security model?",                 a: "SSO + role-based cell security by entity" },
];

window.REQUIREMENTS = [
  { id: "FR-001", title: "Multi-currency translation", desc: "Translate BS at Current, P&L at Average, Equity at Historical via native CTRs.", cite: "§4.12" },
  { id: "FR-002", title: "Intercompany eliminations",  desc: "Monthly ICP matching + elimination before group close.", cite: "§4.18" },
  { id: "FR-003", title: "Close calendar",             desc: "Local Close → Group Close → Reporting workflow.", cite: "§1" },
  { id: "FR-004", title: "Entity hierarchy",           desc: "45 legal entities, 3 consolidation tiers.", cite: "§4" },
  { id: "FR-005", title: "Cash flow",                  desc: "Indirect method, derived from movement accounts.", cite: "§4" },
  { id: "FR-006", title: "Audit trail",                desc: "Full drill-back from group figures to source.", cite: "§11" },
  { id: "NFR-001", title: "Close performance",         desc: "Full consolidation < 8 minutes for 45 entities.", cite: "§9", nfr: true },
  { id: "NFR-002", title: "Concurrent users",          desc: "60 concurrent close users, no degradation.", cite: "§2", nfr: true },
  { id: "NFR-003", title: "Security",                  desc: "SSO + role-based cell security by entity.", cite: "§11", nfr: true },
];

/* ---- 5.4 Contribution / flywheel artefact ------------------------------ */
window.CONTRIBUTION = {
  title: "OneStream Currency Translation — Atlas Design Note",
  raw: "Design note for Global Manufacturing Co. (Project Atlas). For entity GMC_EU_DE01 and its 11 sibling EU entities, currency translation uses Current Rate for the Balance Sheet and Average Rate for P&L, with Historical Rate held for Equity. Reviewed by david.okafor@pg.com. Native CTRs in OneStream v9.x avoid custom Business Rules; an ICP elimination pass runs before group close.",
  redacted: "Design note for [CLIENT] (Project Atlas). For entity [ENTITY_CODE] and its 11 sibling EU entities, currency translation uses Current Rate for the Balance Sheet and Average Rate for P&L, with Historical Rate held for Equity. Reviewed by [EMAIL]. Native CTRs in OneStream v9.x avoid custom Business Rules; an ICP elimination pass runs before group close.",
  redactions: [
    { raw: "Global Manufacturing Co.", token: "[CLIENT]" },
    { raw: "GMC_EU_DE01", token: "[ENTITY_CODE]" },
    { raw: "david.okafor@pg.com", token: "[EMAIL]" },
  ],
  curator: "Aarti Menon (Curator)",
};

/* existing contributions list shown on KC detail */
window.CONTRIBUTIONS_SEED = [
  { id: "c-101", title: "ICP tolerance defaults", author: "David Okafor", section: "§4.18", date: "2026-04-18" },
  { id: "c-102", title: "Cash flow movement mapping", author: "Aarti Menon", section: "§4", date: "2026-05-02" },
];

/* ---- 7-stage accelerator strip ----------------------------------------- */
window.ACCELERATORS = [
  { id: "sow",      label: "SoW",          wired: false },
  { id: "req",      label: "Requirements", wired: true, mvp: true },
  { id: "design",   label: "Design",       wired: false },
  { id: "build",    label: "Build",        wired: false },
  { id: "test",     label: "Test Script",  wired: false },
  { id: "review",   label: "Test Review",  wired: false },
  { id: "arch",     label: "Architecture", wired: false },
];

/* ---- intro modal data --------------------------------------------------- */
window.COMPARISON_ROWS = [
  { task: "Requirements gathering", trad: "2–3 weeks", copilot: "2–3 days" },
  { task: "Design document",        trad: "1–2 weeks", copilot: "1–2 days" },
  { task: "Test script creation",   trad: "1 week",    copilot: "Hours" },
  { task: "SoW drafting",           trad: "3–5 days",  copilot: "Hours" },
  { task: "Total",                  trad: "5–6 weeks", copilot: "~1 week", total: true },
];

window.TIMELINE = [
  { when: "Day 1",   title: "Workspace created",     body: "KCs auto-suggested by software + industry + project type.", state: "done" },
  { when: "Day 2",   title: "Requirements drafted",  body: "Questionnaire generated → FR/NFR document same day (normally 2 weeks).", state: "done" },
  { when: "Day 3–4", title: "Manager HOTL review",   body: "Client receives DOCX for sign-off; design begins (normally week 3).", state: "active" },
  { when: "Week 2",  title: "Build + Test",          body: "KC-grounded build guidance; test scripts generated; senior consultants freed for advisory.", state: "future" },
];

/* lifecycle stages */
window.LIFECYCLE = ["Pre-Sales", "SoW", "Requirements", "Design", "Build", "Test", "Deploy", "Run"];
