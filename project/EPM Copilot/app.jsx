/* ===========================================================================
   App root — router, admin placeholder, intro modal wiring.
   =========================================================================== */
const T = window.TOKENS;
const { Icon, UI } = window;
const { DemoProvider, useDemo, Sidebar, Topbar } = window.Demo;
const { AtlasWorkspace, KnowledgeGrid, KCDetail, IntroModal, RequirementsDrawer } = window;

/* ---- admin (read-only placeholder) ------------------------------------- */
function AdminScreen() {
  const rows = [
    { k: "Tenant", v: "PG India" },
    { k: "Data residency", v: "India · isolated" },
    { k: "SSO", v: "Enabled · SAML 2.0" },
    { k: "Published KCs", v: "3 (OneStream, Tagetik, Oracle FCCS)" },
    { k: "Active projects", v: "1 (Project Atlas)" },
    { k: "Export policy", v: "HOTL — manager sign-off required" },
  ];
  return (
    <div style={{ padding: "34px 36px", overflow: "auto", height: "100%" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <h1 style={{ font: "400 26px Georgia, serif", color: T.pgBlack, margin: 0 }}>Admin</h1>
        <p style={{ font: "400 13.5px 'Segoe UI'", color: T.slate, margin: "6px 0 24px" }}>Read-only tenant configuration for this demo environment.</p>
        <div style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden" }}>
          {rows.map((r, i) => (
            <div key={r.k} style={{ display: "flex", padding: "15px 20px", borderTop: i ? `1px solid ${T.border}` : "none" }}>
              <div style={{ flex: "0 0 200px", font: "500 13px 'Segoe UI'", color: T.slate }}>{r.k}</div>
              <div style={{ flex: 1, font: "600 13px 'Segoe UI'", color: T.pgBlack }}>{r.v}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, font: "400 11.5px 'Segoe UI'", color: T.slateLight }}>
          <Icon.Lock size={13}/> Mocked demo — the production system runs real LLMs, per-KC MCP servers, and tenant-isolated storage.
        </div>
      </div>
    </div>
  );
}

/* ---- router ------------------------------------------------------------ */
function Router({ onOpenReq, onCite }) {
  const { state } = useDemo();
  switch (state.route) {
    case "knowledge":  return <KnowledgeGrid/>;
    case "kc-detail":  return <KCDetail/>;
    case "admin":      return <AdminScreen/>;
    default:           return <AtlasWorkspace onOpenReq={onOpenReq}/>;
  }
}

/* ---- app root ---------------------------------------------------------- */
function App() {
  const [intro, setIntro] = React.useState(false);
  const [reqOpen, setReqOpen] = React.useState(false);

  React.useEffect(() => {
    if (!localStorage.getItem("epm_demo_seen")) {
      setIntro(true);
      localStorage.setItem("epm_demo_seen", "1");
    }
  }, []);

  // citation jump only matters on workspace; the workspace handles its own rail,
  // so onCite here is a no-op fallback used by the requirements drawer table.
  const onCite = () => {};

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: T.offWhite }}>
      <Sidebar/>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Topbar onHelp={() => setIntro(true)}/>
        <main style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
          <Router onOpenReq={() => setReqOpen(true)} onCite={onCite}/>
        </main>
      </div>
      <IntroModal open={intro} onClose={() => setIntro(false)}/>
      <RequirementsDrawer open={reqOpen} onClose={() => setReqOpen(false)} onCite={onCite}/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <UI.ToastHost>
    <DemoProvider>
      <App/>
    </DemoProvider>
  </UI.ToastHost>
);
