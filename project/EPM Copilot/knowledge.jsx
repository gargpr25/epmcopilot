/* ===========================================================================
   Flow 3 — Knowledge: KC catalogue grid, KC detail, contribution flywheel.
   =========================================================================== */
const T = window.TOKENS;
const { Icon, UI } = window;
const useDemo = window.Demo.useDemo;

/* ---- catalogue grid (/knowledge) --------------------------------------- */
function KnowledgeGrid() {
  const { state, set } = useDemo();
  return (
    <div style={{ padding: "30px 36px", overflow: "auto", height: "100%" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <div style={{ marginBottom: 6 }}>
          <h1 style={{ font: "400 26px Georgia, serif", color: T.pgBlack, margin: 0 }}>Knowledge Cartridges</h1>
          <p style={{ font: "400 14px/1.5 'Segoe UI'", color: T.slate, margin: "6px 0 0", maxWidth: 620 }}>
            PG's EPM delivery IP — one structured, versioned cartridge per software, wrapped as a queryable MCP service so the Copilot can ground every answer.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 18, marginTop: 26 }}>
          {window.KCS.map((kc) => {
            const isOne = kc.slug === "onestream";
            const version = isOne ? state.kcVersion : kc.version;
            const chunks = isOne ? state.kcChunks : kc.indexedChunks;
            return (
              <button key={kc.slug} onClick={() => isOne && set({ route: "kc-detail" })}
                style={{ textAlign: "left", background: "#fff", border: `1px solid ${T.border}`, borderRadius: 14,
                  padding: 20, cursor: isOne ? "pointer" : "default", transition: "all .16s", position: "relative", overflow: "hidden" }}
                onMouseEnter={(e) => { if (isOne) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 30px rgba(26,26,38,.1)"; } }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 4, background: kc.vendorColour }}/>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: kc.vendorColour, color: "#fff",
                    display: "grid", placeItems: "center", font: "800 15px 'Segoe UI'", flex: "0 0 auto" }}>
                    {kc.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ font: "700 15px 'Segoe UI'", color: T.pgBlack }}>{kc.name}</div>
                    <div style={{ font: "400 12px Consolas, monospace", color: T.slate, marginTop: 2 }}>{version}</div>
                  </div>
                  {isOne && <Icon.ArrowUpRight size={18} style={{ color: T.slateLight }}/>}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
                  <UI.Badge color={T.success}><UI.StatusDot color={T.success}/> Published</UI.Badge>
                  <span style={{ font: "500 11.5px 'Segoe UI'", color: T.slate }}>{chunks} chunks</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12, paddingTop: 12,
                  borderTop: `1px solid ${T.border}`, font: "600 11.5px 'Segoe UI'", color: T.success }}>
                  <UI.StatusDot color={T.success} pulse/> MCP server running
                  {isOne && <span style={{ marginLeft: "auto", color: T.epmTeal, font: "600 11.5px 'Segoe UI'" }}>Open detail →</span>}
                </div>
              </button>
            );
          })}

          {/* new cartridge */}
          <div title="Adding new cartridges is a curator workflow — coming soon" style={{ border: `1.5px dashed ${T.border}`,
            borderRadius: 14, padding: 20, display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", gap: 10, color: T.slateLight, minHeight: 150 }}>
            <div style={{ width: 40, height: 40, borderRadius: 99, border: `1.5px dashed ${T.slateLight}`, display: "grid", placeItems: "center" }}>
              <Icon.Plus size={20}/>
            </div>
            <span style={{ font: "600 13px 'Segoe UI'" }}>New cartridge</span>
          </div>
        </div>
      </div>
    </div>
  );
}

window.KnowledgeGrid = KnowledgeGrid;

/* ---- KC detail (/knowledge/onestream) ---------------------------------- */
function KCDetail() {
  const { state, set } = useDemo();
  const [sec, setSec] = React.useState("§4.12");
  const [flyOpen, setFlyOpen] = React.useState(false);
  const kc = window.KCS[0];

  return (
    <div style={{ overflow: "auto", height: "100%" }}>
      {/* header */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${T.border}`, padding: "22px 36px" }}>
        <button onClick={() => set({ route: "knowledge" })} style={{ display: "inline-flex", alignItems: "center", gap: 6,
          background: "none", border: "none", cursor: "pointer", font: "600 12px 'Segoe UI'", color: T.slate, marginBottom: 14, padding: 0 }}>
          ← Knowledge
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 11, background: kc.vendorColour, color: "#fff",
            display: "grid", placeItems: "center", font: "800 18px 'Segoe UI'", flex: "0 0 auto" }}>OS</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
              <h1 style={{ font: "400 24px Georgia, serif", color: T.pgBlack, margin: 0 }}>OneStream v9.x</h1>
              <span key={state.kcVersion} style={{ font: "700 12px Consolas, monospace", color: T.epmTeal,
                background: T.tealGlass, padding: "3px 9px", borderRadius: 6, animation: "pgPop .4s ease" }}>{state.kcVersion}</span>
              <UI.Badge color={T.success}><UI.StatusDot color={T.success}/> Published</UI.Badge>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 6, font: "600 12px 'Segoe UI'", color: T.success }}>
              <UI.StatusDot color={T.success} pulse/> MCP server running
              <span style={{ color: T.slate, fontWeight: 400 }}>· <span key={state.kcChunks} style={{ animation: "pgPop .4s ease", display: "inline-block" }}>{state.kcChunks}</span> chunks indexed</span>
            </div>
          </div>
          <button onClick={() => setFlyOpen(true)} style={{ display: "flex", alignItems: "center", gap: 9,
            padding: "11px 18px", background: T.epmTeal, color: "#fff", border: "none", borderRadius: 10, cursor: "pointer",
            font: "700 13px 'Segoe UI'", boxShadow: "0 5px 16px rgba(0,139,139,.28)" }}>
            <Icon.GitBranch size={16}/> Promote artefact to KC
          </button>
        </div>
      </div>

      <div style={{ padding: "28px 36px", maxWidth: 1120, margin: "0 auto" }}>
        {/* section browser */}
        <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 22, marginBottom: 32 }}>
          <div style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 12, padding: 10, height: "fit-content" }}>
            <div style={{ font: "700 10.5px 'Segoe UI'", letterSpacing: ".06em", textTransform: "uppercase",
              color: T.slateLight, padding: "6px 8px 8px" }}>Section browser</div>
            {window.KC_SECTIONS.map((s) => {
              const on = sec === s.anchor;
              return (
                <button key={s.anchor} onClick={() => setSec(s.anchor)} style={{ display: "flex", gap: 9, width: "100%",
                  textAlign: "left", padding: s.sub ? "8px 10px 8px 24px" : "8px 10px", borderRadius: 7, cursor: "pointer",
                  border: "none", background: on ? T.tealGlass : "transparent", transition: "all .14s", marginBottom: 1 }}
                  onMouseEnter={(e) => { if (!on) e.currentTarget.style.background = T.offWhite; }}
                  onMouseLeave={(e) => { if (!on) e.currentTarget.style.background = "transparent"; }}>
                  <span style={{ font: "700 11px Consolas, monospace", color: on ? T.epmTeal : T.slateLight, minWidth: s.sub ? 30 : 22, marginTop: 1 }}>{s.anchor}</span>
                  <span style={{ font: `${on ? 600 : 500} 12.5px 'Segoe UI'`, color: on ? T.pgBlack : T.slate }}>{s.label}</span>
                </button>
              );
            })}
          </div>

          <div style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 12, padding: 26, minHeight: 240 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <span style={{ font: "700 13px Consolas, monospace", color: T.epmTeal, background: T.tealGlass, padding: "3px 9px", borderRadius: 6 }}>{sec}</span>
              <h3 style={{ font: "400 19px Georgia, serif", color: T.pgBlack, margin: 0 }}>
                {window.KC_SECTIONS.find((x) => x.anchor === sec)?.label}
              </h3>
            </div>
            <p style={{ font: "400 14.5px/1.7 'Segoe UI'", color: T.pgBlack, margin: 0 }}>{window.KC_EXCERPTS[sec]}</p>
            <div style={{ display: "flex", gap: 8, marginTop: 22, paddingTop: 18, borderTop: `1px solid ${T.border}`, flexWrap: "wrap" }}>
              <UI.Badge color={T.slate}><Icon.FileText size={12}/> Markdown source</UI.Badge>
              <UI.Badge color={T.slate}>Indexed & embedded</UI.Badge>
              <UI.Badge color={T.epmTeal}>Citable anchor</UI.Badge>
            </div>
          </div>
        </div>

        {/* contributions + feedback loop */}
        <ContributionsPanel onPromote={() => setFlyOpen(true)}/>
        <FeedbackLoop/>
      </div>

      <FlywheelModal open={flyOpen} onClose={() => setFlyOpen(false)}/>
    </div>
  );
}

function ContributionsPanel({ onPromote }) {
  const { state } = useDemo();
  return (
    <div style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 12, padding: 22, marginBottom: 22 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <div>
          <h3 style={{ font: "400 18px Georgia, serif", color: T.pgBlack, margin: 0 }}>Contributions</h3>
          <p style={{ font: "400 12.5px 'Segoe UI'", color: T.slate, margin: "4px 0 0" }}>The quality flywheel — every project enriches the cartridge.</p>
        </div>
        <button onClick={onPromote} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 15px",
          border: `1px solid ${T.epmTeal}`, background: "#fff", color: T.epmTeal, borderRadius: 9, cursor: "pointer", font: "700 12.5px 'Segoe UI'" }}>
          <Icon.Plus size={15}/> Promote Atlas design note
        </button>
      </div>
      <div style={{ marginTop: 16 }}>
        {state.contributions.map((c, i) => (
          <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 13, padding: "12px 0",
            borderTop: i ? `1px solid ${T.border}` : `1px solid ${T.border}` }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: T.tealGlass, color: T.epmTeal, display: "grid", placeItems: "center", flex: "0 0 auto" }}>
              <Icon.FileText size={16}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ font: "600 13.5px 'Segoe UI'", color: T.pgBlack }}>{c.title}</div>
              <div style={{ font: "400 11.5px 'Segoe UI'", color: T.slate, marginTop: 1 }}>{c.author} · {c.section} · {c.date}</div>
            </div>
            {c.fresh && <UI.Badge color={T.success} solid style={{ fontSize: 9.5 }}>NEW</UI.Badge>}
            <UI.Badge color={T.success}><Icon.Check size={11}/> Curated</UI.Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeedbackLoop() {
  const { state } = useDemo();
  const cards = [
    { icon: <Icon.ThumbsUp size={18}/>, title: "Consultants rate answers", body: "Every Copilot answer gets a thumbs up / down in the workspace." },
    { icon: <Icon.GitBranch size={18}/>, title: "Low ratings auto-cluster", body: `5+ low ratings on a section route to the Curator queue. Currently ${state.lowRatings} flagged.` },
    { icon: <Icon.RotateCcw size={18}/>, title: "Curator enriches & publishes", body: "The weak section is improved and a new KC version ships to every project." },
  ];
  return (
    <div>
      <div style={{ font: "700 11px 'Segoe UI'", letterSpacing: ".06em", textTransform: "uppercase", color: T.slateLight, margin: "0 0 12px 2px" }}>The feedback loop</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {cards.map((c, i) => (
          <div key={i} style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 12, padding: 18, position: "relative" }}>
            <div style={{ position: "absolute", top: 16, right: 16, font: "800 13px 'Segoe UI'", color: T.border }}>{i + 1}</div>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: T.tealGlass, color: T.epmTeal, display: "grid", placeItems: "center", marginBottom: 12 }}>{c.icon}</div>
            <div style={{ font: "700 13.5px 'Segoe UI'", color: T.pgBlack, marginBottom: 4 }}>{c.title}</div>
            <div style={{ font: "400 12px/1.5 'Segoe UI'", color: T.slate }}>{c.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

window.KCDetail = KCDetail;

/* ---- flywheel modal: promote → redact → curate → bump ------------------ */
function FlywheelModal({ open, onClose }) {
  const { state, set } = useDemo();
  const toast = UI.useToast();
  const [stage, setStage] = React.useState(0); // 0 promote, 1 redact, 2 curate, 3 done
  const C = window.CONTRIBUTION;

  React.useEffect(() => { if (open) setStage(0); }, [open]);
  if (!open) return null;

  const approve = () => {
    set((s) => ({
      kcVersion: "v9.3.0",
      kcChunks: 22,
      contributions: [{ id: "c-new", title: C.title, author: "Aarti Menon", section: "§4.12", date: "2026-05-30", fresh: true }, ...s.contributions],
    }));
    setStage(3);
    toast("v9.3.0 published — every project attached to OneStream now benefits, no re-attach needed.", { title: "KC published", duration: 6000 });
  };

  const stages = ["Promote", "Auto-redaction", "Curator gate", "Published"];
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(26,26,38,.55)",
      backdropFilter: "blur(3px)", display: "grid", placeItems: "center", padding: 26, animation: "pgFade .2s ease" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "min(860px, 96vw)", maxHeight: "90vh", overflow: "auto",
        background: "#fff", borderRadius: 16, boxShadow: "0 30px 80px rgba(26,26,38,.4)" }}>

        <div style={{ padding: "20px 28px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: T.epmTeal, display: "grid", placeItems: "center" }}>
            <Icon.GitBranch size={18} style={{ color: "#fff" }}/>
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ font: "400 18px Georgia, serif", color: T.pgBlack, margin: 0 }}>Contribution flywheel</h2>
            <div style={{ font: "400 12px 'Segoe UI'", color: T.slate }}>Project Atlas → curated KC → next project</div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.border}`,
            background: "#fff", cursor: "pointer", display: "grid", placeItems: "center", color: T.slate }}><Icon.X size={16}/></button>
        </div>

        {/* stage rail */}
        <div style={{ display: "flex", padding: "16px 28px", gap: 0, borderBottom: `1px solid ${T.border}`, background: T.offWhite }}>
          {stages.map((s, i) => (
            <React.Fragment key={s}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 22, height: 22, borderRadius: 99, display: "grid", placeItems: "center", font: "700 11px 'Segoe UI'",
                  background: stage > i ? T.success : stage === i ? T.epmTeal : "#fff", color: stage >= i ? "#fff" : T.slateLight,
                  border: `1.5px solid ${stage > i ? T.success : stage === i ? T.epmTeal : T.border}` }}>
                  {stage > i ? <Icon.Check size={12} sw={3}/> : i + 1}
                </span>
                <span style={{ font: `${stage === i ? 700 : 500} 12px 'Segoe UI'`, color: stage === i ? T.pgBlack : T.slate }}>{s}</span>
              </div>
              {i < stages.length - 1 && <div style={{ flex: 1, height: 1.5, background: stage > i ? T.success : T.border, margin: "0 12px" }}/>}
            </React.Fragment>
          ))}
        </div>

        <div style={{ padding: 28 }}>
          {stage === 0 && (
            <div>
              <Caption>Promoting an artefact from Project Atlas into the OneStream cartridge.</Caption>
              <div style={{ background: T.offWhite, border: `1px solid ${T.border}`, borderRadius: 11, padding: 20, marginTop: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
                  <Icon.FileText size={17} style={{ color: T.epmTeal }}/>
                  <span style={{ font: "700 14px 'Segoe UI'", color: T.pgBlack }}>{C.title}</span>
                </div>
                <p style={{ font: "400 13.5px/1.7 'Segoe UI'", color: T.slate, margin: 0 }}>{C.raw}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, font: "400 12px 'Segoe UI'", color: T.warning }}>
                <Icon.ShieldCheck size={14}/> Contains client identifiers — these are stripped automatically in the next step.
              </div>
              <ModalActions>
                <PrimaryBtn onClick={() => setStage(1)}>Run auto-redaction <Icon.ArrowRight size={15}/></PrimaryBtn>
              </ModalActions>
            </div>
          )}

          {stage === 1 && (
            <div>
              <Caption>Client identifiers stripped automatically before any human sees it.</Caption>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 }}>
                <DiffCol label="Raw (Atlas)" tone={T.danger} text={C.raw} marks={C.redactions.map((r) => r.raw)} markTone={T.danger}/>
                <DiffCol label="Redacted" tone={T.success} text={C.redacted} marks={C.redactions.map((r) => r.token)} markTone={T.success}/>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
                {C.redactions.map((r) => (
                  <span key={r.token} style={{ font: "600 11px Consolas, monospace", color: T.slate, background: T.offWhite,
                    border: `1px solid ${T.border}`, borderRadius: 6, padding: "4px 8px" }}>
                    <span style={{ color: T.danger }}>{r.raw}</span> → <span style={{ color: T.success }}>{r.token}</span>
                  </span>
                ))}
              </div>
              <ModalActions>
                <PrimaryBtn onClick={() => setStage(2)}>Send to curator <Icon.ArrowRight size={15}/></PrimaryBtn>
              </ModalActions>
            </div>
          )}

          {stage === 2 && (
            <div>
              <Caption>Curator review — a human approves before the IP compounds.</Caption>
              <div style={{ background: T.offWhite, border: `1px solid ${T.border}`, borderRadius: 11, padding: 20, marginTop: 14,
                display: "flex", alignItems: "center", gap: 13 }}>
                <UI.Avatar initials="AM" size={40} bg={T.blue}/>
                <div style={{ flex: 1 }}>
                  <div style={{ font: "700 14px 'Segoe UI'", color: T.pgBlack }}>Aarti Menon</div>
                  <div style={{ font: "400 12px 'Segoe UI'", color: T.slate }}>Curator · reviewing redacted design note → §4.12</div>
                </div>
                <UI.Badge color={T.warning}><UI.StatusDot color={T.warning}/> Pending review</UI.Badge>
              </div>
              <ModalActions>
                <button onClick={onClose} style={ghostBtn}>Reject</button>
                <button onClick={onClose} style={ghostBtn}>Request changes</button>
                <PrimaryBtn onClick={approve} tone={T.success}><Icon.Check size={16}/> Approve & publish</PrimaryBtn>
              </ModalActions>
            </div>
          )}

          {stage === 3 && (
            <div style={{ textAlign: "center", padding: "14px 0 4px" }}>
              <div style={{ width: 60, height: 60, borderRadius: 99, background: `${T.success}1a`, color: T.success,
                display: "grid", placeItems: "center", margin: "0 auto 16px", animation: "pgPop .4s ease" }}>
                <Icon.Check size={32} sw={3}/>
              </div>
              <h3 style={{ font: "400 22px Georgia, serif", color: T.pgBlack, margin: "0 0 8px" }}>v9.3.0 published</h3>
              <p style={{ font: "400 13.5px/1.6 'Segoe UI'", color: T.slate, maxWidth: 440, margin: "0 auto 8px" }}>
                The OneStream cartridge bumped <strong style={{ color: T.pgBlack }}>v9.2.0 → v9.3.0</strong> and now indexes <strong style={{ color: T.pgBlack }}>22 chunks</strong>.
              </p>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 9,
                background: `${T.success}12`, border: `1px solid ${T.success}33`, font: "600 12.5px 'Segoe UI'", color: T.pgBlack }}>
                <Icon.RotateCcw size={15} style={{ color: T.success }}/>
                Every project attached to OneStream benefits — no re-attach needed.
              </div>
              <ModalActions center>
                <PrimaryBtn onClick={onClose}>Done</PrimaryBtn>
              </ModalActions>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DiffCol({ label, tone, text, marks, markTone }) {
  // highlight each mark within text
  let parts = [text];
  marks.forEach((m) => {
    parts = parts.flatMap((p) => typeof p !== "string" ? [p] : p.split(m).flatMap((seg, i, arr) =>
      i < arr.length - 1 ? [seg, { mark: m }] : [seg]));
  });
  return (
    <div style={{ border: `1px solid ${tone}40`, borderRadius: 11, overflow: "hidden" }}>
      <div style={{ background: `${tone}12`, padding: "9px 14px", font: "700 11px 'Segoe UI'", letterSpacing: ".04em",
        textTransform: "uppercase", color: tone, display: "flex", alignItems: "center", gap: 7 }}>
        <UI.StatusDot color={tone}/> {label}
      </div>
      <p style={{ font: "400 12.5px/1.7 'Segoe UI'", color: T.pgBlack, margin: 0, padding: 16 }}>
        {parts.map((p, i) => typeof p === "string" ? <span key={i}>{p}</span> :
          <mark key={i} style={{ background: `${markTone}24`, color: markTone, fontWeight: 600, borderRadius: 3,
            padding: "0 3px", fontFamily: p.mark.includes("[") ? "Consolas, monospace" : "inherit" }}>{p.mark}</mark>)}
      </p>
    </div>
  );
}

function Caption({ children }) {
  return <div style={{ font: "400 13px/1.5 'Segoe UI'", color: T.slate }}>{children}</div>;
}
function ModalActions({ children, center }) {
  return <div style={{ display: "flex", gap: 10, marginTop: 22, justifyContent: center ? "center" : "flex-end" }}>{children}</div>;
}
function PrimaryBtn({ children, onClick, tone }) {
  return (
    <button onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 20px",
      background: tone || T.epmTeal, color: "#fff", border: "none", borderRadius: 9, cursor: "pointer",
      font: "700 13.5px 'Segoe UI'", boxShadow: `0 5px 14px ${(tone || T.epmTeal)}44` }}>{children}</button>
  );
}
const ghostBtn = { padding: "11px 18px", background: "#fff", border: `1px solid ${T.border}`, borderRadius: 9,
  cursor: "pointer", font: "600 13px 'Segoe UI'", color: T.slate };

window.FlywheelModal = FlywheelModal;
