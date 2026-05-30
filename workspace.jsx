/* ===========================================================================
   Flow 1 — Atlas workspace: project header, accelerator strip,
   Copilot chat (streaming + citations), Sources rail.
   =========================================================================== */
const T = window.TOKENS;
const { Icon, UI } = window;
const { Citation } = UI;
const useDemo = window.Demo.useDemo;

function AtlasWorkspace({ onOpenReq }) {
  const [highlight, setHighlight] = React.useState(null); // anchor pulsed in rail
  const railRef = React.useRef(null);

  const jumpTo = React.useCallback((anchor) => {
    setHighlight(anchor);
    const el = railRef.current && railRef.current.querySelector(`[data-anchor="${CSS.escape(anchor)}"]`);
    if (el) el.scrollIntoView({ block: "center" });
    setTimeout(() => setHighlight((h) => (h === anchor ? null : h)), 1600);
  }, []);

  const P = window.PROJECT_ATLAS;
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <ProjectHeader P={P}/>
      <AcceleratorStrip onOpenReq={onOpenReq}/>
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "minmax(0,1fr) 332px", minHeight: 0 }}>
        <ChatPanel onCite={jumpTo}/>
        <SourcesRail railRef={railRef} highlight={highlight}/>
      </div>
    </div>
  );
}

/* ---- project header bar ------------------------------------------------ */
function ProjectHeader({ P }) {
  return (
    <div style={{ background: "#fff", borderBottom: `1px solid ${T.border}`, padding: "16px 24px",
      display: "flex", alignItems: "center", gap: 18, flex: "0 0 auto" }}>
      <div style={{ width: 42, height: 42, borderRadius: 9, background: T.pgBlack, color: "#fff",
        display: "grid", placeItems: "center", font: "400 19px Georgia, serif", flex: "0 0 auto" }}>A</div>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h1 style={{ font: "400 21px Georgia, serif", color: T.pgBlack, margin: 0 }}>{P.name}</h1>
          <UI.Badge color={T.epmTeal} style={{ borderRadius: 6 }}>{P.lifecycleStage}</UI.Badge>
        </div>
        <div style={{ font: "400 12.5px 'Segoe UI'", color: T.slate, marginTop: 3 }}>
          {P.client} · {P.industry} · {P.projectType}
        </div>
      </div>

      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 8,
          border: `1px solid ${T.border}`, background: T.offWhite }}>
          <span style={{ width: 18, height: 18, borderRadius: 4, background: "#B91C1C", color: "#fff",
            display: "grid", placeItems: "center", font: "800 9px 'Segoe UI'" }}>OS</span>
          <span style={{ font: "600 12.5px 'Segoe UI'", color: T.pgBlack }}>OneStream v9.x</span>
        </div>
        <div style={{ display: "flex", marginLeft: 2 }}>
          {P.team.map((m, i) => (
            <div key={m.initials} title={`${m.name} · ${m.role}`} style={{ marginLeft: i ? -8 : 0,
              border: "2px solid #fff", borderRadius: 99 }}>
              <UI.Avatar initials={m.initials} size={30} bg={i === 0 ? T.epmTeal : i === 1 ? T.blue : T.slate}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

window.AtlasWorkspace = AtlasWorkspace;

/* ---- build token stream from a scripted answer ------------------------- */
function tokenize(ans) {
  const toks = [];
  if (!ans.grounded) {
    ans.text.split(/(\s+)/).forEach((w) => toks.push({ type: "w", v: w }));
    return toks;
  }
  ans.segments.forEach((seg) => {
    if (seg.cite != null) {
      const c = ans.citations.find((x) => x.n === seg.cite);
      toks.push({ type: "cite", c });
    } else {
      seg.t.split(/(\s+)/).forEach((w) => { if (w !== "") toks.push({ type: "w", v: w }); });
    }
  });
  return toks;
}

/* ---- a single assistant answer (handles its own streaming) ------------- */
function AnswerCard({ answerKey, onCite, onRate }) {
  const ans = window.ANSWERS[answerKey];
  const toks = React.useMemo(() => tokenize(ans), [answerKey]);
  const [shown, setShown] = React.useState(0);
  const [rated, setRated] = React.useState(null);
  const [missNote, setMissNote] = React.useState(false);
  const done = shown >= toks.length;

  React.useEffect(() => {
    if (shown >= toks.length) return;
    const id = setInterval(() => setShown((s) => {
      if (s >= toks.length) { clearInterval(id); return s; }
      return s + 1;
    }), 24);
    return () => clearInterval(id);
  }, [toks]);

  const grounded = ans.grounded;
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start", maxWidth: 720 }}>
      <div style={{ width: 30, height: 30, borderRadius: 8, flex: "0 0 auto",
        background: grounded ? T.epmTeal : T.warning, display: "grid", placeItems: "center" }}>
        <Icon.Sparkles size={16} style={{ color: "#fff" }}/>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ background: "#fff", border: `1px solid ${T.border}`,
          borderLeft: grounded ? `1px solid ${T.border}` : `3px solid ${T.warning}`,
          borderRadius: 10, padding: "14px 16px",
          font: "400 14px/1.65 'Segoe UI'", color: grounded ? T.pgBlack : T.slate }}>
          {!grounded && (
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8,
              font: "700 11px 'Segoe UI'", letterSpacing: ".05em", textTransform: "uppercase", color: T.warning }}>
              <Icon.ShieldCheck size={14}/> No grounding · won't guess
            </div>
          )}
          <span>
            {toks.slice(0, shown).map((t, i) =>
              t.type === "cite"
                ? <Citation key={i} label={t.c.label} anchor={t.c.anchor} onClick={() => onCite(t.c.anchor)}/>
                : <span key={i}>{t.v}</span>
            )}
            {!done && <span style={{ display: "inline-block", width: 7, height: 15, background: T.epmTeal,
              marginLeft: 2, borderRadius: 1, animation: "pgBlink 1s step-end infinite", verticalAlign: "middle" }}/>}
          </span>
        </div>

        {done && grounded && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 9 }}>
            <RateBtn active={rated === "up"} onClick={() => { setRated("up"); setMissNote(false); onRate("up"); }}><Icon.ThumbsUp size={14}/></RateBtn>
            <RateBtn active={rated === "down"} down onClick={() => { setRated("down"); setMissNote(true); onRate("down"); }}><Icon.ThumbsDown size={14}/></RateBtn>
            <span style={{ font: "400 11.5px 'Segoe UI'", color: T.slateLight, marginLeft: 4 }}>Was this grounded correctly?</span>
          </div>
        )}
        {missNote && (
          <div style={{ marginTop: 9, maxWidth: 460, animation: "pgFade .2s ease" }}>
            <input placeholder="What was missing or wrong?" style={{ width: "100%", padding: "9px 12px",
              border: `1px solid ${T.border}`, borderRadius: 8, font: "400 13px 'Segoe UI'", outline: "none" }}
              onFocus={(e) => e.target.style.borderColor = T.epmTeal}
              onBlur={(e) => e.target.style.borderColor = T.border}/>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 7,
              font: "400 11.5px/1.4 'Segoe UI'", color: T.slate }}>
              <Icon.GitBranch size={13} style={{ color: T.warning, flex: "0 0 auto" }}/>
              Low ratings cluster into the Curator's quality queue.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RateBtn({ children, active, down, onClick }) {
  return (
    <button onClick={onClick} style={{ width: 30, height: 30, borderRadius: 7, cursor: "pointer",
      display: "grid", placeItems: "center", transition: "all .15s",
      border: `1px solid ${active ? (down ? T.warning : T.success) : T.border}`,
      background: active ? (down ? `${T.warning}1a` : `${T.success}1a`) : "#fff",
      color: active ? (down ? T.warning : T.success) : T.slate }}>{children}</button>
  );
}

/* ---- chat panel -------------------------------------------------------- */
function ChatPanel({ onCite }) {
  const { state, set } = useDemo();
  const toast = UI.useToast();
  const [msgs, setMsgs] = React.useState([]);
  const [input, setInput] = React.useState("");
  const scrollRef = React.useRef(null);
  const idRef = React.useRef(0);

  // remount-clear on reset
  React.useEffect(() => { setMsgs([]); setInput(""); }, [state.nonce]);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs]);

  const ask = (promptId, label) => {
    const uid = ++idRef.current, aid = ++idRef.current;
    setMsgs((m) => [...m,
      { id: uid, role: "user", text: label },
      { id: aid, role: "assistant", answerKey: promptId }]);
    setInput("");
  };

  const submitFree = () => {
    const v = input.trim();
    if (!v) return;
    // route free text: currency-ish → currency, sap → sap, else tagetik
    const lc = v.toLowerCase();
    const key = /sap|s\/4|migration/.test(lc) ? "sap"
      : /tagetik|close/.test(lc) ? "tagetik" : "currency";
    ask(key, v);
  };

  const onRate = (kind) => {
    if (kind === "up") toast("Rating recorded — reinforces this KC section.", { title: "Thanks" });
    else { set((s) => ({ lowRatings: s.lowRatings + 1 }));
      toast("Routed to the Curator's quality queue.", { title: "Feedback logged", tone: "warn" }); }
  };

  const empty = msgs.length === 0;
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: 0, background: T.offWhite }}>
      <div ref={scrollRef} style={{ flex: 1, overflow: "auto", padding: empty ? "0" : "26px 28px" }}>
        {empty
          ? <WelcomeState onPick={ask}/>
          : <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              {msgs.map((m) => m.role === "user"
                ? <UserBubble key={m.id} text={m.text}/>
                : <AnswerCard key={m.id} answerKey={m.answerKey} onCite={onCite} onRate={onRate}/>)}
            </div>}
      </div>

      <div style={{ borderTop: `1px solid ${T.border}`, background: "#fff", padding: "14px 28px" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-end", maxWidth: 760 }}>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={1}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submitFree(); } }}
            placeholder="Ask the Copilot — answers are grounded in OneStream v9.x…"
            style={{ flex: 1, resize: "none", border: `1px solid ${T.border}`, borderRadius: 10,
              padding: "11px 14px", font: "400 13.5px/1.4 'Segoe UI'", outline: "none", maxHeight: 100 }}
            onFocus={(e) => e.target.style.borderColor = T.epmTeal}
            onBlur={(e) => e.target.style.borderColor = T.border}/>
          <button onClick={submitFree} style={{ width: 42, height: 42, borderRadius: 10, flex: "0 0 auto",
            background: T.epmTeal, color: "#fff", border: "none", cursor: "pointer", display: "grid", placeItems: "center" }}>
            <Icon.Send size={18}/>
          </button>
        </div>
        <div style={{ font: "400 10.5px 'Segoe UI'", color: T.slateLight, marginTop: 8, maxWidth: 760,
          display: "flex", alignItems: "center", gap: 6 }}>
          <Icon.ShieldCheck size={12} style={{ color: T.epmTeal }}/>
          Every answer cites a KC section anchor — or says it can't, and stops.
        </div>
      </div>
    </div>
  );
}

function UserBubble({ text }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <div style={{ maxWidth: 520, background: T.pgBlack, color: "#fff", borderRadius: "12px 12px 3px 12px",
        padding: "11px 15px", font: "400 14px/1.5 'Segoe UI'" }}>{text}</div>
    </div>
  );
}

/* ---- welcome / suggested prompts --------------------------------------- */
function WelcomeState({ onPick }) {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center",
      alignItems: "center", padding: "32px 28px", textAlign: "center" }}>
      <div style={{ width: 52, height: 52, borderRadius: 13, background: T.epmTeal, display: "grid",
        placeItems: "center", marginBottom: 18, boxShadow: "0 10px 26px rgba(0,139,139,.3)" }}>
        <Icon.Sparkles size={26} style={{ color: "#fff" }}/>
      </div>
      <h2 style={{ font: "400 24px Georgia, serif", color: T.pgBlack, margin: "0 0 8px" }}>Ask the EPM Copilot</h2>
      <p style={{ font: "400 14px/1.55 'Segoe UI'", color: T.slate, maxWidth: 440, margin: "0 0 26px" }}>
        Grounded in OneStream v9.x — the Knowledge Cartridge attached to Project Atlas. Try one:
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "min(540px, 100%)" }}>
        {window.SUGGESTED_PROMPTS.map((p) => (
          <button key={p.id} onClick={() => onPick(p.id, p.label)} style={{ display: "flex", alignItems: "center",
            gap: 12, textAlign: "left", padding: "14px 16px", borderRadius: 11, cursor: "pointer",
            background: "#fff", transition: "all .15s",
            border: `1px solid ${p.primary ? T.epmTeal : T.border}`,
            boxShadow: p.primary ? "0 4px 14px rgba(0,139,139,.12)" : "none" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = T.epmTeal; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = p.primary ? T.epmTeal : T.border; e.currentTarget.style.transform = "none"; }}>
            <span style={{ width: 30, height: 30, borderRadius: 8, flex: "0 0 auto", display: "grid", placeItems: "center",
              background: p.id === "sap" ? `${T.warning}1a` : T.tealGlass, color: p.id === "sap" ? T.warning : T.epmTeal }}>
              {p.id === "sap" ? <Icon.Lock size={15}/> : <Icon.Sparkles size={15}/>}
            </span>
            <span style={{ flex: 1, font: "500 13.5px/1.4 'Segoe UI'", color: T.pgBlack }}>{p.label}</span>
            {p.primary && <UI.Badge color={T.epmTeal} solid style={{ fontSize: 9.5 }}>TRY FIRST</UI.Badge>}
            {p.id === "sap" && <span style={{ font: "600 10.5px 'Segoe UI'", color: T.warning }}>tests abstention</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---- 7-stage accelerator strip ----------------------------------------- */
function AcceleratorStrip({ onOpenReq }) {
  const toast = UI.useToast();
  const [tip, setTip] = React.useState(null);
  return (
    <div style={{ background: "#fff", borderBottom: `1px solid ${T.border}`, padding: "11px 24px",
      display: "flex", alignItems: "center", gap: 10, flex: "0 0 auto" }}>
      <span style={{ font: "700 10.5px 'Segoe UI'", letterSpacing: ".07em", textTransform: "uppercase",
        color: T.slateLight, marginRight: 4 }}>Accelerators</span>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {window.ACCELERATORS.map((a) => {
          const wired = a.wired;
          return (
            <div key={a.id} style={{ position: "relative" }}
              onMouseEnter={() => !wired && setTip(a.id)} onMouseLeave={() => setTip(null)}>
              <button onClick={() => wired ? onOpenReq() : null} style={{
                display: "flex", alignItems: "center", gap: 7, padding: "7px 13px", borderRadius: 8,
                cursor: wired ? "pointer" : "default", transition: "all .15s",
                border: `1px solid ${wired ? T.epmTeal : T.border}`,
                background: wired ? T.epmTeal : "#fff",
                color: wired ? "#fff" : T.slate, font: "600 12.5px 'Segoe UI'",
                opacity: wired ? 1 : 0.78 }}>
                {!wired && <Icon.Lock size={12} style={{ color: T.slateLight }}/>}
                {wired && <Icon.Sparkles size={13}/>}
                {a.label}
                {a.mvp && <span style={{ font: "800 9px 'Segoe UI'", letterSpacing: ".04em", color: T.pgBlack,
                  background: T.pgYellow, padding: "1px 5px", borderRadius: 4, marginLeft: 2 }}>★ MVP</span>}
              </button>
              {tip === a.id && (
                <div style={{ position: "absolute", top: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)",
                  background: T.pgBlack, color: "#fff", font: "500 11.5px 'Segoe UI'", padding: "7px 11px",
                  borderRadius: 7, whiteSpace: "nowrap", zIndex: 40, boxShadow: "0 6px 18px rgba(0,0,0,.25)" }}>
                  Coming in this build
                  <span style={{ position: "absolute", bottom: "100%", left: "50%", transform: "translateX(-50%)",
                    borderLeft: "5px solid transparent", borderRight: "5px solid transparent",
                    borderBottom: `5px solid ${T.pgBlack}` }}/>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---- Sources rail ------------------------------------------------------ */
function SourcesRail({ railRef, highlight }) {
  const [open, setOpen] = React.useState(null); // anchor whose excerpt is shown
  return (
    <aside ref={railRef} style={{ borderLeft: `1px solid ${T.border}`, background: T.offWhite,
      overflow: "auto", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "16px 18px 14px", borderBottom: `1px solid ${T.border}`, background: "#fff",
        position: "sticky", top: 0, zIndex: 2 }}>
        <div style={{ font: "700 10.5px 'Segoe UI'", letterSpacing: ".07em", textTransform: "uppercase",
          color: T.slateLight, marginBottom: 8 }}>Grounding</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 22, height: 22, borderRadius: 5, background: "#B91C1C", color: "#fff",
            display: "grid", placeItems: "center", font: "800 10px 'Segoe UI'", flex: "0 0 auto" }}>OS</span>
          <div>
            <div style={{ font: "700 13px 'Segoe UI'", color: T.pgBlack }}>OneStream v9.x</div>
            <div style={{ font: "400 11px Consolas, monospace", color: T.slate }}>v9.2.0 · 21 chunks</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10,
          font: "600 11px 'Segoe UI'", color: T.success }}>
          <UI.StatusDot color={T.success} pulse/> MCP server running
        </div>
      </div>

      <div style={{ padding: "12px 12px 20px" }}>
        <div style={{ font: "700 10.5px 'Segoe UI'", letterSpacing: ".06em", textTransform: "uppercase",
          color: T.slateLight, padding: "4px 6px 8px" }}>Section index</div>
        {window.KC_SECTIONS.map((s) => {
          const lit = highlight === s.anchor;
          const expanded = open === s.anchor;
          return (
            <div key={s.anchor} data-anchor={s.anchor} style={{ marginBottom: 2 }}>
              <button onClick={() => setOpen(expanded ? null : s.anchor)} style={{
                display: "flex", alignItems: "flex-start", gap: 9, width: "100%", textAlign: "left",
                padding: s.sub ? "8px 10px 8px 26px" : "8px 10px", borderRadius: 7, cursor: "pointer",
                border: `1px solid ${lit ? T.epmTeal : "transparent"}`,
                background: lit ? T.tealGlass : (s.highlight ? "rgba(0,139,139,0.05)" : "transparent"),
                transition: "all .25s", animation: lit ? "pgPulseBox 1.5s ease" : "none" }}
                onMouseEnter={(e) => { if (!lit) e.currentTarget.style.background = "#fff"; }}
                onMouseLeave={(e) => { if (!lit) e.currentTarget.style.background = s.highlight ? "rgba(0,139,139,0.05)" : "transparent"; }}>
                <span style={{ font: "700 11px Consolas, monospace", color: s.highlight ? T.epmTeal : T.slateLight,
                  flex: "0 0 auto", marginTop: 1, minWidth: s.sub ? 32 : 24 }}>{s.anchor}</span>
                <span style={{ font: `${s.highlight ? 600 : 500} 12.5px 'Segoe UI'`,
                  color: s.highlight ? T.pgBlack : T.slate, flex: 1 }}>{s.label}</span>
              </button>
              {expanded && (
                <div style={{ font: "400 12px/1.55 'Segoe UI'", color: T.slate, padding: "8px 12px 12px 26px",
                  animation: "pgFade .2s ease" }}>{window.KC_EXCERPTS[s.anchor]}</div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
