/* ===========================================================================
   "How it works" intro modal — value narrative.
   =========================================================================== */
const T = window.TOKENS;
const { Icon, UI } = window;

function IntroModal({ open, onClose }) {
  if (!open) return null;
  const rows = window.COMPARISON_ROWS;
  const steps = window.TIMELINE;
  const stateColor = { done: T.success, active: T.epmTeal, future: T.slateLight };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(26,26,38,.55)", backdropFilter: "blur(3px)",
      display: "grid", placeItems: "center", padding: 28, animation: "pgFade .2s ease" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "min(940px, 96vw)", maxHeight: "90vh",
        overflow: "auto", background: "#fff", borderRadius: 16, boxShadow: "0 30px 80px rgba(26,26,38,.4)" }}>

        {/* header */}
        <div style={{ background: T.navBg, color: "#fff", padding: "26px 34px 24px", position: "relative",
          borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
          <button onClick={onClose} style={{ position: "absolute", top: 20, right: 20, background: "rgba(255,255,255,.1)",
            border: "none", width: 32, height: 32, borderRadius: 8, color: "#fff", cursor: "pointer",
            display: "grid", placeItems: "center" }}><Icon.X size={17}/></button>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "4px 11px",
            borderRadius: 999, background: "rgba(255,230,0,.14)", marginBottom: 14 }}>
            <Icon.Sparkles size={14} style={{ color: T.pgYellow }}/>
            <span style={{ font: "700 11px 'Segoe UI'", letterSpacing: ".06em", textTransform: "uppercase", color: T.pgYellow }}>How it works</span>
          </div>
          <h1 style={{ font: "400 30px/1.15 Georgia, serif", margin: 0 }}>
            We start the engagement at minute&nbsp;sixty,<br/>not minute zero.
          </h1>
          <p style={{ font: "400 14px/1.5 'Segoe UI'", color: "#b8b8c8", margin: "12px 0 0", maxWidth: 620 }}>
            A typical EPM engagement spends its first <strong style={{ color: "#fff" }}>5–6 weeks</strong> re-discovering
            what we already know. The Copilot grounds every answer in PG's own delivery IP and compresses that to <strong style={{ color: T.pgYellow }}>~1 week</strong>.
          </p>
        </div>

        {/* panels */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
          {/* Panel A — comparison */}
          <div style={{ padding: "28px 30px", borderRight: `1px solid ${T.border}` }}>
            <PanelLabel n="A" title="6 weeks → 1 week"/>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
              <thead>
                <tr style={{ font: "700 10.5px 'Segoe UI'", letterSpacing: ".06em", textTransform: "uppercase", color: T.slateLight }}>
                  <th style={{ textAlign: "left", padding: "0 0 9px" }}>Task</th>
                  <th style={{ textAlign: "right", padding: "0 0 9px" }}>Traditional</th>
                  <th style={{ textAlign: "right", padding: "0 0 9px" }}>Copilot</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} style={{ borderTop: `1px solid ${T.border}`,
                    background: r.total ? T.offWhite : "transparent" }}>
                    <td style={{ padding: "11px 0", font: `${r.total ? 700 : 500} 13px 'Segoe UI'`, color: T.pgBlack }}>{r.task}</td>
                    <td style={{ padding: "11px 0", textAlign: "right", font: "400 12.5px 'Segoe UI'", color: T.slate, textDecoration: r.total ? "none" : "none" }}>{r.trad}</td>
                    <td style={{ padding: "11px 8px 11px 0", textAlign: "right", font: `${r.total ? 800 : 700} 13px 'Segoe UI'`,
                      color: r.total ? T.pgBlack : T.epmTeal }}>{r.copilot}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Panel B — timeline */}
          <div style={{ padding: "28px 30px" }}>
            <PanelLabel n="B" title="Day 1 → Week 2"/>
            <div style={{ marginTop: 18, position: "relative" }}>
              <div style={{ position: "absolute", left: 8, top: 6, bottom: 6, width: 2, background: T.border }}/>
              {steps.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 15, paddingBottom: i < steps.length - 1 ? 20 : 0, position: "relative" }}>
                  <div style={{ width: 18, height: 18, borderRadius: 99, flex: "0 0 auto", marginTop: 2,
                    background: s.state === "future" ? "#fff" : stateColor[s.state],
                    border: `2px solid ${stateColor[s.state]}`, display: "grid", placeItems: "center", zIndex: 1 }}>
                    {s.state === "done" && <Icon.Check size={11} sw={3} style={{ color: "#fff" }}/>}
                    {s.state === "active" && <span style={{ width: 6, height: 6, borderRadius: 99, background: "#fff" }}/>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ font: "700 11px 'Segoe UI'", letterSpacing: ".04em", textTransform: "uppercase", color: stateColor[s.state] }}>{s.when}</span>
                      {s.state === "active" && <UI.Badge color={T.epmTeal} style={{ padding: "1px 7px", fontSize: 9.5 }}>NOW</UI.Badge>}
                    </div>
                    <div style={{ font: "700 13.5px 'Segoe UI'", color: T.pgBlack, margin: "2px 0 3px" }}>{s.title}</div>
                    <div style={{ font: "400 12px/1.45 'Segoe UI'", color: T.slate }}>{s.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* footer */}
        <div style={{ padding: "18px 30px 24px", borderTop: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 16, font: "600 11.5px 'Segoe UI'", color: T.slate, flexWrap: "wrap" }}>
            {["Cite or abstain", "Human-on-the-loop", "Versioned knowledge", "Compounding flywheel"].map((p) => (
              <span key={p} style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                <Icon.ShieldCheck size={14} style={{ color: T.epmTeal }}/> {p}
              </span>
            ))}
          </div>
          <button onClick={onClose} style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 22px",
            background: T.epmTeal, color: "#fff", border: "none", borderRadius: 9, cursor: "pointer",
            font: "700 13.5px 'Segoe UI'", boxShadow: "0 6px 16px rgba(0,139,139,.28)" }}>
            Get started <Icon.ArrowRight size={16}/>
          </button>
        </div>
      </div>
    </div>
  );
}

function PanelLabel({ n, title }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ width: 24, height: 24, borderRadius: 7, background: T.tealGlass, color: T.epmTeal,
        display: "grid", placeItems: "center", font: "800 12px 'Segoe UI'" }}>{n}</span>
      <h2 style={{ font: "400 19px Georgia, serif", color: T.pgBlack, margin: 0 }}>{title}</h2>
    </div>
  );
}

window.IntroModal = IntroModal;
