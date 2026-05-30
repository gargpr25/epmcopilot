/* ===========================================================================
   Flow 2 — Requirements accelerator drawer.
   Inputs → grounded FR/NFR draft → HOTL approve → real file export.
   =========================================================================== */
const T = window.TOKENS;
const { Icon, UI } = window;
const { Citation } = UI;
const useDemo = window.Demo.useDemo;

function RequirementsDrawer({ open, onClose, onCite }) {
  const { state, set } = useDemo();
  const toast = UI.useToast();
  const [step, setStep] = React.useState(1);

  React.useEffect(() => { if (open) setStep(state.reqStatus === "approved" ? 3 : 1); }, [open]);

  if (!open) return null;
  const status = state.reqStatus;

  const generate = () => {
    set({ reqStatus: "generating" });
    setStep(2);
    setTimeout(() => set({ reqStatus: "pending_hotl" }), 2400);
  };
  const approve = () => {
    const ts = new Date().toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
    set({ reqStatus: "approved", reqApprover: { name: "Prashant Garg", ts } });
    toast("Approved by Prashant Garg · Partner", { title: "Sign-off recorded" });
  };
  const exportFile = () => {
    downloadRequirements();
    set({ reqExported: true });
    toast("Atlas_Requirements_v1.docx · 24 KB · sha256 9f3c…a71b", { title: "Exported" });
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 150, background: "rgba(26,26,38,.5)",
      backdropFilter: "blur(2px)", display: "flex", justifyContent: "flex-end", animation: "pgFade .2s ease" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "min(860px, 94vw)", background: T.offWhite,
        height: "100%", display: "flex", flexDirection: "column", boxShadow: "-20px 0 60px rgba(26,26,38,.3)",
        animation: "pgSlideRight .3s cubic-bezier(.2,.8,.2,1)" }}>

        {/* header */}
        <div style={{ background: "#fff", borderBottom: `1px solid ${T.border}`, padding: "18px 26px", flex: "0 0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 9, background: T.epmTeal, display: "grid", placeItems: "center" }}>
              <Icon.Sparkles size={19} style={{ color: "#fff" }}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <h2 style={{ font: "400 19px Georgia, serif", color: T.pgBlack, margin: 0 }}>Requirements Accelerator</h2>
                <span style={{ font: "800 9px 'Segoe UI'", letterSpacing: ".04em", color: T.pgBlack,
                  background: T.pgYellow, padding: "2px 6px", borderRadius: 4 }}>★ MVP</span>
              </div>
              <div style={{ font: "400 12px 'Segoe UI'", color: T.slate, marginTop: 2 }}>Project Atlas · OneStream v9.x · grounded in KC §3</div>
            </div>
            <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: 8, border: `1px solid ${T.border}`,
              background: "#fff", cursor: "pointer", display: "grid", placeItems: "center", color: T.slate }}><Icon.X size={17}/></button>
          </div>
          <Stepper step={step} status={status}/>
        </div>

        {/* body */}
        <div style={{ flex: 1, overflow: "auto", padding: "24px 26px 40px" }}>
          {step === 1 && <StepInputs onGenerate={generate}/>}
          {step === 2 && <StepDraft status={status} onCite={onCite} onContinue={() => setStep(3)}/>}
          {step === 3 && <StepGate status={status} approver={state.reqApprover} exported={state.reqExported}
            onApprove={approve} onExport={exportFile} onCite={onCite} onBack={() => setStep(2)}/>}
        </div>
      </div>
    </div>
  );
}

window.RequirementsDrawer = RequirementsDrawer;

/* ---- stepper ----------------------------------------------------------- */
function Stepper({ step, status }) {
  const labels = ["Inputs", "Generated deliverable", "HOTL gate + export"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginTop: 18 }}>
      {labels.map((l, i) => {
        const n = i + 1, on = step === n, done = step > n;
        return (
          <React.Fragment key={l}>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <span style={{ width: 24, height: 24, borderRadius: 99, flex: "0 0 auto", display: "grid", placeItems: "center",
                font: "700 12px 'Segoe UI'", transition: "all .2s",
                background: done ? T.success : on ? T.epmTeal : "#fff",
                color: done || on ? "#fff" : T.slateLight,
                border: `1.5px solid ${done ? T.success : on ? T.epmTeal : T.border}` }}>
                {done ? <Icon.Check size={13} sw={3}/> : n}
              </span>
              <span style={{ font: `${on ? 700 : 500} 12.5px 'Segoe UI'`, color: on ? T.pgBlack : T.slate }}>{l}</span>
            </div>
            {i < labels.length - 1 && <div style={{ flex: 1, height: 1.5, background: step > n ? T.success : T.border, margin: "0 14px" }}/>}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ---- step 1: inputs ---------------------------------------------------- */
function StepInputs({ onGenerate }) {
  return (
    <div style={{ maxWidth: 700 }}>
      <Banner tone="teal" icon={<Icon.Clock size={16}/>}>
        Traditionally <strong>~2 weeks of workshops</strong>. Drafted here in seconds.
      </Banner>

      <Card title="Project context">
        <Field k="Project" v="Project Atlas"/>
        <Field k="Software" v="OneStream v9.x · v9.2.0"/>
        <Field k="AS-IS docs" v="client RFP.pdf (mock)"/>
        <Field k="Grounding KC" v="OneStream §3 — Requirements catalogue"/>
      </Card>

      <Card title="Discovery questionnaire" note="auto-generated from KC §3 Requirements catalogue">
        {window.QUESTIONNAIRE.map((row, i) => (
          <div key={i} style={{ display: "flex", gap: 14, padding: "10px 0",
            borderTop: i ? `1px solid ${T.border}` : "none" }}>
            <div style={{ flex: 1, font: "500 13px 'Segoe UI'", color: T.slate }}>{row.q}</div>
            <div style={{ flex: "0 0 auto", font: "600 13px 'Segoe UI'", color: T.pgBlack, display: "flex", alignItems: "center", gap: 7 }}>
              {row.a}
              <Icon.Check size={14} style={{ color: T.success }}/>
            </div>
          </div>
        ))}
      </Card>

      <button onClick={onGenerate} style={{ display: "flex", alignItems: "center", gap: 9, marginTop: 6,
        padding: "13px 24px", background: T.epmTeal, color: "#fff", border: "none", borderRadius: 10,
        cursor: "pointer", font: "700 14px 'Segoe UI'", boxShadow: "0 6px 18px rgba(0,139,139,.28)" }}>
        <Icon.Sparkles size={17}/> Generate requirements
      </button>
    </div>
  );
}

/* ---- step 2: generated deliverable ------------------------------------- */
function StepDraft({ status, onCite, onContinue }) {
  const generating = status === "generating";
  return (
    <div style={{ maxWidth: 720 }}>
      {generating
        ? <GeneratingState/>
        : <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div>
                <h3 style={{ font: "400 18px Georgia, serif", color: T.pgBlack, margin: 0 }}>FR / NFR Register</h3>
                <div style={{ font: "400 12px 'Segoe UI'", color: T.slate, marginTop: 2 }}>9 requirements · each traceable to a KC section</div>
              </div>
              <UI.Badge color={T.warning} style={{ fontFamily: "Consolas, monospace", padding: "5px 11px" }}>
                <UI.StatusDot color={T.warning}/> pending_hotl
              </UI.Badge>
            </div>
            <ReqTable onCite={onCite}/>
            <button onClick={onContinue} style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 18,
              marginLeft: "auto", padding: "11px 20px", background: T.pgBlack, color: "#fff", border: "none",
              borderRadius: 9, cursor: "pointer", font: "700 13.5px 'Segoe UI'" }}>
              Continue to sign-off <Icon.ArrowRight size={16}/>
            </button>
          </>}
    </div>
  );
}

function ReqTable({ onCite }) {
  return (
    <div style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 10, overflow: "hidden" }}>
      {window.REQUIREMENTS.map((r, i) => (
        <div key={r.id} style={{ display: "flex", gap: 14, padding: "13px 16px", alignItems: "flex-start",
          borderTop: i ? `1px solid ${T.border}` : "none",
          background: r.nfr ? "rgba(0,139,139,0.03)" : "#fff" }}>
          <span style={{ font: "700 11px Consolas, monospace", color: r.nfr ? T.blue : T.epmTeal,
            flex: "0 0 auto", minWidth: 58, marginTop: 2 }}>{r.id}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ font: "600 13.5px 'Segoe UI'", color: T.pgBlack }}>{r.title}</div>
            <div style={{ font: "400 12.5px/1.45 'Segoe UI'", color: T.slate, marginTop: 2 }}>{r.desc}</div>
          </div>
          <div style={{ flex: "0 0 auto", marginTop: 1 }}>
            <Citation label="KC" anchor={r.cite} onClick={() => onCite && onCite(r.cite)}/>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---- step 3: HOTL gate + export ---------------------------------------- */
function StepGate({ status, approver, exported, onApprove, onExport, onCite, onBack }) {
  const approved = status === "approved";
  return (
    <div style={{ maxWidth: 720 }}>
      <Banner tone={approved ? "success" : "warn"} icon={<Icon.ShieldCheck size={16}/>}>
        <strong>Human-on-the-loop:</strong> no client deliverable leaves without manager sign-off.
      </Banner>

      <div style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 12, padding: 20, marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, flex: "0 0 auto", display: "grid", placeItems: "center",
            background: approved ? `${T.success}1a` : `${T.warning}1a`, color: approved ? T.success : T.warning }}>
            {approved ? <Icon.ShieldCheck size={22}/> : <Icon.Clock size={22}/>}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ font: "700 15px 'Segoe UI'", color: T.pgBlack }}>Atlas — Requirements v1</div>
            <div style={{ font: "400 12.5px 'Segoe UI'", color: T.slate, marginTop: 2 }}>
              {approved
                ? <>Approved by <strong style={{ color: T.pgBlack }}>{approver?.name}</strong> · {approver?.ts}</>
                : "Awaiting manager approval before export is unlocked."}
            </div>
          </div>
          <UI.Badge color={approved ? T.success : T.warning} solid style={{ fontFamily: "Consolas, monospace" }}>
            {approved ? "approved" : "pending_hotl"}
          </UI.Badge>
        </div>

        <div style={{ display: "flex", gap: 11, marginTop: 18, paddingTop: 18, borderTop: `1px solid ${T.border}` }}>
          <button onClick={!approved ? onApprove : undefined} disabled={approved} style={{
            display: "flex", alignItems: "center", gap: 8, padding: "11px 20px", borderRadius: 9,
            border: "none", cursor: approved ? "default" : "pointer", font: "700 13.5px 'Segoe UI'",
            background: approved ? T.offWhite : T.success, color: approved ? T.slateLight : "#fff",
            boxShadow: approved ? "none" : "0 5px 14px rgba(0,196,140,.3)" }}>
            <Icon.ShieldCheck size={16}/> {approved ? "Approved" : "Approve as Partner"}
          </button>
          <button onClick={approved ? onExport : undefined} disabled={!approved} title={!approved ? "Approve first" : ""} style={{
            display: "flex", alignItems: "center", gap: 8, padding: "11px 20px", borderRadius: 9,
            cursor: approved ? "pointer" : "not-allowed", font: "700 13.5px 'Segoe UI'",
            border: `1px solid ${approved ? T.epmTeal : T.border}`,
            background: approved ? T.epmTeal : "#fff", color: approved ? "#fff" : T.slateLight }}>
            {approved ? <Icon.Download size={16}/> : <Icon.Lock size={15}/>}
            Export .docx
          </button>
          {exported && <span style={{ display: "flex", alignItems: "center", gap: 6, font: "600 12px 'Segoe UI'", color: T.success }}>
            <Icon.Check size={15}/> Downloaded
          </span>}
        </div>
      </div>

      <div style={{ font: "700 11px 'Segoe UI'", letterSpacing: ".06em", textTransform: "uppercase", color: T.slateLight, margin: "0 0 10px 2px" }}>Deliverable preview</div>
      <ReqTable onCite={onCite}/>
      <button onClick={onBack} style={{ marginTop: 14, padding: "8px 14px", background: "none",
        border: `1px solid ${T.border}`, borderRadius: 8, cursor: "pointer", font: "600 12.5px 'Segoe UI'", color: T.slate }}>
        ← Back to draft
      </button>
    </div>
  );
}

/* ---- small shared bits ------------------------------------------------- */
function Banner({ children, tone, icon }) {
  const c = tone === "success" ? T.success : tone === "warn" ? T.warning : T.epmTeal;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "12px 15px", borderRadius: 10,
      background: `${c}12`, border: `1px solid ${c}33`, marginBottom: 18, font: "400 13px/1.45 'Segoe UI'", color: T.pgBlack }}>
      <span style={{ color: c, flex: "0 0 auto" }}>{icon}</span>
      <span>{children}</span>
    </div>
  );
}
function Card({ title, note, children }) {
  return (
    <div style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 12, padding: "16px 18px", marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 12 }}>
        <h4 style={{ font: "700 13px 'Segoe UI'", color: T.pgBlack, margin: 0 }}>{title}</h4>
        {note && <span style={{ font: "400 11px 'Segoe UI'", color: T.slateLight }}>· {note}</span>}
      </div>
      {children}
    </div>
  );
}
function Field({ k, v }) {
  return (
    <div style={{ display: "flex", gap: 14, padding: "7px 0" }}>
      <div style={{ flex: "0 0 130px", font: "500 12.5px 'Segoe UI'", color: T.slate }}>{k}</div>
      <div style={{ flex: 1, font: "600 12.5px 'Segoe UI'", color: T.pgBlack }}>{v}</div>
    </div>
  );
}
function GeneratingState() {
  const lines = ["Querying OneStream KC §3 — Requirements catalogue…", "Mapping discovery answers to capabilities…", "Drafting FR/NFR register with citations…"];
  const [n, setN] = React.useState(0);
  React.useEffect(() => { const id = setInterval(() => setN((x) => Math.min(x + 1, lines.length)), 720); return () => clearInterval(id); }, []);
  return (
    <div style={{ maxWidth: 520, padding: "30px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 20 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: T.epmTeal, display: "grid", placeItems: "center",
          animation: "pgPulse 1.4s infinite" }}><Icon.Sparkles size={16} style={{ color: "#fff" }}/></div>
        <span style={{ font: "600 14px 'Segoe UI'", color: T.pgBlack }}>Generating…</span>
      </div>
      {lines.map((l, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0",
          opacity: i < n ? 1 : 0.35, transition: "opacity .3s" }}>
          {i < n ? <Icon.Check size={15} style={{ color: T.success }}/>
            : <span style={{ width: 15, height: 15, borderRadius: 99, border: `2px solid ${T.border}`, borderTopColor: T.epmTeal,
                animation: "pgSpin .7s linear infinite", display: "inline-block" }}/>}
          <span style={{ font: "400 13px 'Segoe UI'", color: i < n ? T.pgBlack : T.slate }}>{l}</span>
        </div>
      ))}
    </div>
  );
}

/* ---- real file download (.doc-flavoured HTML blob) --------------------- */
function downloadRequirements() {
  const rows = window.REQUIREMENTS.map((r) =>
    `<tr><td style="font-family:Consolas;color:#008B8B"><b>${r.id}</b></td><td><b>${r.title}</b><br>${r.desc}</td><td>${r.cite}</td></tr>`).join("");
  const html = `<!DOCTYPE html><html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><title>Atlas Requirements v1</title></head>
  <body style="font-family:'Segoe UI',sans-serif;color:#2E2E38">
  <h1 style="font-family:Georgia,serif">Project Atlas — Requirements Register v1</h1>
  <p>Client: Global Manufacturing Co. · Software: OneStream v9.x · Status: APPROVED (Prashant Garg, Partner)</p>
  <p style="color:#6B6B80">Grounded in OneStream Knowledge Cartridge v9.2.0. Every requirement cites a KC section anchor.</p>
  <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%">
  <tr style="background:#F5F5F7"><th align="left">ID</th><th align="left">Requirement</th><th align="left">KC cite</th></tr>
  ${rows}</table>
  <p style="margin-top:24px;color:#9898A8;font-size:11px">Generated by pg.ai EPM Copilot · Human-on-the-loop approved · sha256 9f3c…a71b</p>
  </body></html>`;
  const blob = new Blob([html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "Atlas_Requirements_v1.docx";
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
