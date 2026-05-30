/* Shared UI primitives — icons, badges, citation chips, toasts.
   Exposed on window for the other babel scripts. */
const T = window.TOKENS;

function Svg({ children, size = 18, sw = 1.75, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth={sw} strokeLinecap="round"
         strokeLinejoin="round" style={style}>{children}</svg>
  );
}
const Icon = {
  LayoutGrid: (p) => <Svg {...p}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></Svg>,
  Library: (p) => <Svg {...p}><path d="M7 4v16M3 4v16"/><rect x="11" y="4" width="4" height="16" rx="1"/><path d="m18.5 5 2.3 .6-3.2 13.6-2.3-.6z"/></Svg>,
  Settings: (p) => <Svg {...p}><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/></Svg>,
  Help: (p) => <Svg {...p}><circle cx="12" cy="12" r="9"/><path d="M9.2 9a2.8 2.8 0 0 1 5.4 1c0 1.8-2.6 2-2.6 4"/><path d="M12 17.5h.01"/></Svg>,
  ArrowUpRight: (p) => <Svg {...p}><path d="M7 17 17 7"/><path d="M9 7h8v8"/></Svg>,
  ThumbsUp: (p) => <Svg {...p}><path d="M7 11v9H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1z"/><path d="M7 11l4-7a2 2 0 0 1 2 2v3h5.2a2 2 0 0 1 2 2.4l-1.3 6A2 2 0 0 1 17 20H7"/></Svg>,
  ThumbsDown: (p) => <Svg {...p}><path d="M17 13V4h3a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1z"/><path d="M17 13l-4 7a2 2 0 0 1-2-2v-3H5.8a2 2 0 0 1-2-2.4l1.3-6A2 2 0 0 1 7 4h10"/></Svg>,
  Send: (p) => <Svg {...p}><path d="m4 4 16 8-16 8 3-8z"/><path d="M7 12h13"/></Svg>,
  Check: (p) => <Svg {...p}><path d="m5 12 5 5 9-11"/></Svg>,
  Download: (p) => <Svg {...p}><path d="M12 3v12"/><path d="m7 11 5 5 5-5"/><path d="M4 21h16"/></Svg>,
  Lock: (p) => <Svg {...p}><rect x="4" y="11" width="16" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></Svg>,
  Sparkles: (p) => <Svg {...p}><path d="M12 3l1.6 4.6L18 9l-4.4 1.4L12 15l-1.6-4.6L6 9l4.4-1.4z"/><path d="M19 14l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/></Svg>,
  Server: (p) => <Svg {...p}><rect x="3" y="4" width="18" height="7" rx="1.5"/><rect x="3" y="13" width="18" height="7" rx="1.5"/><path d="M7 7.5h.01M7 16.5h.01"/></Svg>,
  ChevronRight: (p) => <Svg {...p}><path d="m9 6 6 6-6 6"/></Svg>,
  Plus: (p) => <Svg {...p}><path d="M12 5v14M5 12h14"/></Svg>,
  X: (p) => <Svg {...p}><path d="M6 6l12 12M18 6 6 18"/></Svg>,
  RotateCcw: (p) => <Svg {...p}><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></Svg>,
  FileText: (p) => <Svg {...p}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h6"/></Svg>,
  ArrowRight: (p) => <Svg {...p}><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></Svg>,
  ShieldCheck: (p) => <Svg {...p}><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z"/><path d="m9 12 2 2 4-4"/></Svg>,
  GitBranch: (p) => <Svg {...p}><circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="8" r="2.5"/><path d="M6 8.5v7M18 10.5c0 4-6 1.5-6 5.5"/></Svg>,
  Users: (p) => <Svg {...p}><circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-5 6-5s6 1.7 6 5"/><path d="M16 5.2a3 3 0 0 1 0 5.6M21 20c0-2.6-1.5-4.2-3.5-4.8"/></Svg>,
  Clock: (p) => <Svg {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></Svg>,
  Building: (p) => <Svg {...p}><rect x="5" y="3" width="14" height="18" rx="1"/><path d="M9 7h.01M15 7h.01M9 11h.01M15 11h.01M9 15h.01M15 15h.01"/></Svg>,
};
window.Icon = Icon;

/* ---- status dot --------------------------------------------------------- */
function StatusDot({ color = T.success, pulse, size = 8 }) {
  return <span style={{ display: "inline-block", width: size, height: size, borderRadius: 99,
    background: color, flex: "0 0 auto",
    animation: pulse ? "pgPulse 1.9s infinite" : "none" }}/>;
}

/* ---- badge -------------------------------------------------------------- */
function Badge({ children, color = T.epmTeal, solid, style }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5,
      font: "600 11px/1.3 'Segoe UI', system-ui, sans-serif", letterSpacing: ".02em",
      padding: "3px 9px", borderRadius: 999,
      color: solid ? "#fff" : color,
      background: solid ? color : `${color}14`,
      border: solid ? "none" : `1px solid ${color}33`, ...style }}>{children}</span>
  );
}

/* ---- avatar ------------------------------------------------------------- */
function Avatar({ initials, size = 30, bg = T.epmTeal, style }) {
  return (
    <span style={{ width: size, height: size, borderRadius: 99, background: bg,
      color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center",
      font: `700 ${size * 0.4}px 'Segoe UI', system-ui`, flex: "0 0 auto", ...style }}>{initials}</span>
  );
}

/* ---- citation chip ------------------------------------------------------ */
function Citation({ label, anchor, onClick }) {
  return (
    <button onClick={onClick} title={`Jump to ${anchor} in Sources`} style={{
      display: "inline-flex", alignItems: "center", gap: 4, verticalAlign: "baseline",
      background: T.tealGlass, color: T.epmTeal, border: `1px solid ${T.epmTeal}33`,
      borderRadius: 6, font: "600 12px/1 'Segoe UI', system-ui", padding: "3px 7px",
      margin: "0 1px", cursor: "pointer", whiteSpace: "nowrap", transition: "all .15s" }}
      onMouseEnter={(e) => { e.currentTarget.style.background = T.epmTeal; e.currentTarget.style.color = "#fff"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = T.tealGlass; e.currentTarget.style.color = T.epmTeal; }}>
      <Icon.ArrowUpRight size={11} sw={2.2}/>
      <span>{label} <span style={{ fontFamily: "Consolas, monospace", opacity: .8 }}>{anchor}</span></span>
    </button>
  );
}

/* ---- toast system ------------------------------------------------------- */
const ToastCtx = React.createContext(() => {});
function ToastHost({ children }) {
  const [items, setItems] = React.useState([]);
  const push = React.useCallback((msg, opts = {}) => {
    const id = Math.random().toString(36).slice(2);
    setItems((x) => [...x, { id, msg, ...opts }]);
    setTimeout(() => setItems((x) => x.filter((i) => i.id !== id)), opts.duration || 4000);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div style={{ position: "fixed", top: 18, right: 18, zIndex: 999,
        display: "flex", flexDirection: "column", gap: 10, pointerEvents: "none" }}>
        {items.map((t) => (
          <div key={t.id} style={{ pointerEvents: "auto", minWidth: 280, maxWidth: 380,
            background: "#fff", borderRadius: 12, padding: "13px 15px",
            boxShadow: "0 12px 32px rgba(26,26,38,.18)", border: `1px solid ${T.border}`,
            borderLeft: `3px solid ${t.tone === "warn" ? T.warning : t.tone === "danger" ? T.danger : T.success}`,
            display: "flex", gap: 11, alignItems: "flex-start", animation: "pgSlideIn .3s cubic-bezier(.2,.8,.2,1)" }}>
            <div style={{ marginTop: 1, color: t.tone === "warn" ? T.warning : t.tone === "danger" ? T.danger : T.success }}>
              {t.tone === "warn" ? <Icon.Sparkles size={17}/> : <Icon.Check size={17} sw={2.4}/>}
            </div>
            <div style={{ flex: 1 }}>
              {t.title && <div style={{ font: "700 13px/1.3 'Segoe UI'", color: T.pgBlack, marginBottom: 2 }}>{t.title}</div>}
              <div style={{ font: "400 12.5px/1.45 'Segoe UI'", color: T.slate }}>{t.msg}</div>
            </div>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
const useToast = () => React.useContext(ToastCtx);

window.UI = { Svg, Icon, StatusDot, Badge, Avatar, Citation, ToastHost, useToast };
