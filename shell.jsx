/* ===========================================================================
   App shell — DemoState context, sidebar, topbar, router host.
   =========================================================================== */
const T = window.TOKENS;
const { Icon, UI } = window;

/* ---- DemoState: single mutable context seeded from demo-data ----------- */
const DemoCtx = React.createContext(null);
const useDemo = () => React.useContext(DemoCtx);

function initialState() {
  return {
    route: "projects",            // projects | knowledge | kc-detail | admin
    nonce: 0,                     // bumped on reset to remount chat
    kcVersion: "v9.2.0",
    kcChunks: 21,
    contributions: window.CONTRIBUTIONS_SEED.map((c) => ({ ...c })),
    reqStatus: "idle",            // idle | generating | pending_hotl | approved
    reqApprover: null,
    reqExported: false,
    chat: [],                     // {role, id, answerKey?, text?, rated?}
    lowRatings: 2,
  };
}

function DemoProvider({ children }) {
  const [state, setState] = React.useState(initialState);
  const set = React.useCallback((patch) => {
    setState((s) => ({ ...s, ...(typeof patch === "function" ? patch(s) : patch) }));
  }, []);
  const reset = React.useCallback(() => setState((s) => ({ ...initialState(), nonce: s.nonce + 1 })), []);
  return <DemoCtx.Provider value={{ state, set, reset }}>{children}</DemoCtx.Provider>;
}

window.Demo = { DemoCtx, useDemo, DemoProvider };

/* ---- Sidebar ----------------------------------------------------------- */
const NAV = [
  { id: "projects",  label: "Projects",  Icon: Icon.LayoutGrid },
  { id: "knowledge", label: "Knowledge", Icon: Icon.Library },
  { id: "admin",     label: "Admin",     Icon: Icon.Settings },
];

function Sidebar() {
  const { state, set } = useDemo();
  const active = state.route === "kc-detail" ? "knowledge" : state.route;
  return (
    <nav style={{ width: 224, background: T.navBg, color: "#fff", flex: "0 0 auto",
      display: "flex", flexDirection: "column", padding: "0 0 16px" }}>
      {/* wordmark */}
      <div style={{ padding: "20px 20px 22px", display: "flex", alignItems: "center", gap: 10 }}>
        {/* drop real logo here */}
        <div style={{ width: 30, height: 30, borderRadius: 7, background: T.pgYellow,
          display: "grid", placeItems: "center", flex: "0 0 auto" }}>
          <span style={{ font: "800 15px Georgia, serif", color: T.pgBlack, letterSpacing: "-.04em" }}>pg</span>
        </div>
        <div style={{ lineHeight: 1.15 }}>
          <div style={{ font: "700 14px 'Segoe UI'", letterSpacing: ".01em" }}>pg.ai</div>
          <div style={{ font: "500 11px 'Segoe UI'", color: T.slateLight }}>EPM Copilot</div>
        </div>
      </div>

      <div style={{ padding: "0 12px", display: "flex", flexDirection: "column", gap: 3 }}>
        {NAV.map((n) => {
          const on = active === n.id;
          return (
            <button key={n.id} onClick={() => set({ route: n.id })} style={{
              display: "flex", alignItems: "center", gap: 11, width: "100%",
              padding: "10px 12px", borderRadius: 8, cursor: "pointer", textAlign: "left",
              font: "600 13.5px 'Segoe UI'", transition: "all .16s",
              color: on ? "#fff" : T.slateLight,
              background: on ? T.tealGlass : "transparent",
              borderLeft: `3px solid ${on ? T.pgYellow : "transparent"}`,
              borderTop: "none", borderRight: "none", borderBottom: "none",
            }}
            onMouseEnter={(e) => { if (!on) e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={(e) => { if (!on) e.currentTarget.style.color = T.slateLight; }}>
              <n.Icon size={18}/>
              <span>{n.label}</span>
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: "auto", padding: "0 20px", color: T.slateLight }}>
        <div style={{ height: 1, background: "rgba(255,255,255,.08)", margin: "0 -8px 14px" }}/>
        <div style={{ font: "600 10.5px 'Segoe UI'", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 7, color: "#5a5a70" }}>Tenant</div>
        <div style={{ font: "600 12.5px 'Segoe UI'", color: "#fff" }}>PG India</div>
        <div style={{ font: "400 11.5px 'Segoe UI'", marginTop: 1 }}>Financial Services</div>
      </div>
    </nav>
  );
}

window.Demo = { DemoCtx, useDemo, DemoProvider, Sidebar };

/* ---- Topbar ------------------------------------------------------------ */
function Topbar({ onHelp }) {
  const { state, set, reset } = useDemo();
  const toast = UI.useToast();
  const [menu, setMenu] = React.useState(false);
  const crumbs = {
    projects:    ["Projects", "Project Atlas"],
    knowledge:   ["Knowledge", "Cartridges"],
    "kc-detail": ["Knowledge", "OneStream v9.x"],
    admin:       ["Admin"],
  }[state.route] || ["Projects"];

  return (
    <header style={{ height: 60, background: "#fff", borderBottom: `1px solid ${T.border}`,
      display: "flex", alignItems: "center", padding: "0 22px", flex: "0 0 auto", position: "relative", zIndex: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, font: "500 13px 'Segoe UI'", color: T.slate }}>
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && <Icon.ChevronRight size={14} style={{ color: T.slateLight }}/>}
            <span style={{ color: i === crumbs.length - 1 ? T.pgBlack : T.slate, fontWeight: i === crumbs.length - 1 ? 700 : 500 }}>{c}</span>
          </React.Fragment>
        ))}
      </div>

      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 14 }}>
        <button onClick={onHelp} style={{
          display: "flex", alignItems: "center", gap: 7, padding: "7px 13px", borderRadius: 8,
          border: `1px solid ${T.border}`, background: "#fff", cursor: "pointer",
          font: "600 12.5px 'Segoe UI'", color: T.epmTeal, transition: "all .15s" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = T.tealGlass; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}>
          <Icon.Help size={16}/> How it works
        </button>

        <div style={{ width: 1, height: 26, background: T.border }}/>

        <div style={{ position: "relative" }}>
          <button onClick={() => setMenu((m) => !m)} style={{ display: "flex", alignItems: "center", gap: 10,
            background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <UI.Avatar initials="PG" size={34}/>
            <div style={{ textAlign: "left", lineHeight: 1.2 }}>
              <div style={{ font: "700 12.5px 'Segoe UI'", color: T.pgBlack }}>Prashant Garg</div>
              <div style={{ font: "400 11px 'Segoe UI'", color: T.slate }}>Partner</div>
            </div>
          </button>
          {menu && (
            <>
              <div onClick={() => setMenu(false)} style={{ position: "fixed", inset: 0, zIndex: 30 }}/>
              <div style={{ position: "absolute", right: 0, top: 46, width: 210, background: "#fff",
                border: `1px solid ${T.border}`, borderRadius: 10, boxShadow: "0 14px 36px rgba(26,26,38,.16)",
                padding: 6, zIndex: 31 }}>
                <div style={{ padding: "8px 10px", font: "400 11.5px 'Segoe UI'", color: T.slate }}>Signed in as Partner</div>
                <div style={{ height: 1, background: T.border, margin: "4px 0" }}/>
                <button onClick={() => { reset(); setMenu(false); toast("Demo state restored to initial values.", { title: "Reset demo" }); }}
                  style={{ display: "flex", alignItems: "center", gap: 9, width: "100%", padding: "9px 10px",
                    border: "none", background: "none", borderRadius: 7, cursor: "pointer",
                    font: "600 12.5px 'Segoe UI'", color: T.pgBlack, textAlign: "left" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = T.offWhite}
                  onMouseLeave={(e) => e.currentTarget.style.background = "none"}>
                  <Icon.RotateCcw size={15} style={{ color: T.slate }}/> Reset demo
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

window.Demo = { DemoCtx, useDemo, DemoProvider, Sidebar, Topbar };
