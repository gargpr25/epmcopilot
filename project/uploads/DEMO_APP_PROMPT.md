# ey.ai EPM Copilot — Standalone Demo App
## Claude Code Implementation Prompt (self-contained, no backend)

> **How to use this file:** Paste everything below the line into a fresh Claude Code
> session (or any capable coding agent) opened in an **empty directory**. It is fully
> self-contained — the agent does **not** need access to the real EPM Copilot monorepo.
> The output is a small, polished, fully-mocked web app you can run on a laptop and click
> through in front of an executive audience in ~10 minutes.

---

You are building a **standalone, self-contained demo** of a product called the
**ey.ai EPM Copilot**. The demo is for a 10-minute executive "show and tell" — a Partner
walking their manager through *how the product works*. It must look polished and on-brand,
run with a single `npm install && npm run dev`, and require **no backend, no database, no
API keys, no Python, and no internet** at runtime. Everything is mocked and deterministic.

Read this entire prompt before writing any code, then build the whole thing.

---

## 0. What the product is (context you must internalise)

The **ey.ai EPM Copilot** is a "delivery accelerator" for EY's **EPM** (Enterprise
Performance Management) consulting practice — the teams that implement financial
consolidation, close, and planning software like **OneStream**, **Tagetik**, and
**Oracle FCCS** for large clients.

The big idea, in four concepts (this is the spine of the demo):

1. **Client value delivery** — a typical EPM engagement spends its first **5–6 weeks**
   re-discovering things EY already knows. The Copilot compresses that to **~1 week**.
2. **Knowledge Cartridges (KCs)** — EY's hard-won EPM delivery IP, captured as **one
   structured, versioned Markdown file per software**, wrapped as a queryable service so
   AI can ground its answers in it.
3. **Productised delivery** — **seven AI accelerators** (one per delivery lifecycle stage)
   that query the KCs, build a grounded prompt, call an LLM, and produce a **validated,
   citable, exportable** client deliverable.
4. **The quality flywheel** — every project enriches the KCs: good artefacts are promoted,
   auto-redacted of client identifiers, curator-approved, and the KC version bumps — so the
   *next* engagement is better. Compounding IP.

**Four non-negotiable trust rules** the demo must visibly reinforce:
- **Cite or abstain.** Every Copilot answer cites a KC section anchor or artefact ID. If
  grounding is weak, it *says so* and does not fabricate.
- **HOTL (Human-on-the-loop).** No client-facing deliverable is exported until a manager
  approves it.
- **Versioned knowledge.** One KC server per published KC version; projects attached to a
  KC automatically benefit when it's updated.
- **The flywheel** closes the loop from project → curated KC → next project.

---

## 1. Tech stack & constraints

- **Next.js 15** (App Router) + **React 18** + **TypeScript**.
- **Tailwind CSS v3** for all styling.
- **lucide-react** for icons.
- **No** database, auth library, server actions hitting external services, Python, or MCP.
  A fake session object (`{ name: "Prashant Garg", role: "Partner", initials: "PG" }`) is
  hard-coded.
- **All data and all AI answers** live in a single editable file: `lib/demo-data.ts`.
- Simulated "streaming" is done client-side with `setInterval` over a canned string —
  no network calls.
- Must run with exactly: `npm install` then `npm run dev`, served on `http://localhost:3000`,
  with **zero runtime errors** in the console.
- Keep it to a *handful* of well-organised files. This is a demo, not the real product —
  favour clarity and visual polish over abstraction.

Generate a `package.json` with pinned, known-good versions and a `README.md` with the run
instructions at the top.

---

## 2. Brand & design tokens (use these verbatim)

Put these in `tailwind.config.ts` (as `theme.extend.colors`) and as CSS variables in
`globals.css`. Do **not** invent other brand colours.

```ts
const tokens = {
  eyBlack:    "#2E2E38", // page headers, user chat bubbles, dark bars
  navBg:      "#1A1A26", // left sidebar / top nav background
  eyYellow:   "#FFE600", // active nav, stat values, key borders, MVP badge
  epmTeal:    "#008B8B", // PRIMARY accent — buttons, links, active pills, citations
  tealLight:  "#00AAAA",
  tealGlass:  "rgba(0,139,139,0.12)", // citation chip background, highlight wash
  white:      "#FFFFFF",
  offWhite:   "#F5F5F7", // app canvas background, answer cards
  border:     "#E4E4ED", // hairline borders
  slate:      "#6B6B80", // secondary text
  slateLight: "#9898A8", // tertiary text / muted mono
  success:    "#00C48C", // approved / published
  warning:    "#FFB020", // pending / curator queue
  danger:     "#FF4D4D",
  blue:       "#2E75B6",
}
```

Fonts:
- Body / UI: `'Segoe UI', system-ui, sans-serif`
- Headings: `Georgia, serif` (use a `.font-heading` utility)
- Code / monospace (section anchors, IDs): `Consolas, Monaco, monospace`

Visual language: clean enterprise SaaS. Off-white canvas, white cards with hairline
`#E4E4ED` borders and small radii (6–8px), dark `#1A1A26` chrome, **teal** as the single
strong accent, **yellow** used sparingly for the active state and key numbers. Generous
whitespace. Subtle transitions. No heavy shadows.

---

## 3. App shell & navigation

A persistent shell wraps every route:

- **Left sidebar** (`#1A1A26`): a small "ey.ai · EPM Copilot" wordmark at top (text is
  fine — leave a `{/* drop real logo here */}` comment), then nav items with lucide icons:
  - **Projects** (`LayoutGrid`) → `/` (the Atlas workspace is the landing page)
  - **Knowledge** (`Library`) → `/knowledge`
  - **Admin** (`Settings`) → `/admin` (a single read-only placeholder screen is fine)
  - Active item gets a yellow left-border + teal-tinted background.
- **Top bar**: breadcrumb on the left; on the right a circular **PG** avatar ("Prashant
  Garg · Partner") and a **`?` "How it works"** button that opens the **intro modal**
  (section 4).
- **Toast system**: a minimal top-right toast for "Approved", "Exported", "KC published",
  "Reset" events. Build a tiny `useToast()` hook — no library.

Also add a discreet **"Reset demo"** control (e.g. in the top bar overflow or footer) that
restores all in-memory demo state to its initial values, so the demo can be re-run cleanly
between audiences. Keep all mutable demo state in a single React context
(`DemoStateProvider`) seeded from `lib/demo-data.ts`.

---

## 4. The "How it works" intro modal (the value narrative)

A modal (also auto-openable on first load via `localStorage('epm_demo_seen')`) that frames
the story before the click-through. Two panels:

**Panel A — "6 weeks → 1 week".** A two-column comparison table:

| Task | Traditional | With EPM Copilot |
|---|---|---|
| Requirements gathering | 2–3 weeks | 2–3 days |
| Design document | 1–2 weeks | 1–2 days |
| Test script creation | 1 week | Hours |
| SoW drafting | 3–5 days | Hours |
| **Total** | **5–6 weeks** | **~1 week** |

**Panel B — a Day 1 → Week 2 timeline** (4 steps, the first two marked "done", third
"active", fourth "future"):
1. **Day 1 — Workspace created.** KCs auto-suggested by software + industry + project type.
2. **Day 2 — Requirements drafted.** Questionnaire generated → FR/NFR document same day *(normally 2 weeks)*.
3. **Day 3–4 — Manager HOTL review.** Client receives DOCX for sign-off; design begins *(normally week 3)*.
4. **Week 2 — Build + Test.** KC-grounded build guidance; test scripts generated; senior consultants freed for advisory.

Close on backdrop click or "Get started". Keep it tight — this is the 60-second opener.

---

## 5. Mock data (`lib/demo-data.ts`) — single source of truth

Everything below is hard-coded here so the presenter can tweak copy in one place.

### 5.1 Project Atlas
```
id: "atlas"
name: "Project Atlas"
client: "Global Manufacturing Co." (a fictional client)
tenant: "EY India"
industry: "Financial Services"            // also show "Consolidation & Close" as project type
software: "OneStream" (version "9.x", vendor "OneStream Software")
lifecycleStage: "Requirements"            // canonical stages: Pre-Sales, SoW, Requirements, Design, Build, Test, Deploy, Run
region: "India"
team: [
  { name: "Prashant Garg",  role: "Engagement Partner",   initials: "PG" },
  { name: "Aarti Menon",    role: "EPM Lead",             initials: "AM" },
  { name: "David Okafor",   role: "Senior Consultant",    initials: "DO" },
]
attachedKCs: ["onestream"]                // OneStream v9.x is attached
```

### 5.2 Knowledge Cartridges (3)
Each KC: `slug, name, version, status: "Published", vendorColour, indexedChunks, mcpStatus: "running", sections[]`.

```
onestream → name "OneStream v9.x",   version "v9.2.0", colour "#B91C1C", indexedChunks 21
tagetik   → name "Tagetik GA 2026",  version "v1.4.0", colour "#1D4ED8", indexedChunks 20
fccs      → name "Oracle FCCS 25.04", version "v2.1.0", colour "#7F1D1D", indexedChunks 18
```

**Section tree** (same for all three; highlight the §3/§4/§4.12/§4.18 rows in teal):
```
§ 1     Overview & architecture
§ 2     Sizing & licensing
§ 3     Requirements catalogue          (highlight)
§ 4     Configurable components         (highlight)
§ 4.12    Currency Translation          (highlight, sub-item)
§ 4.18    ICP Matching                  (highlight, sub-item)
§ 5     Design patterns
§ 8     Testing patterns
§ 11    Security & compliance
```

**Scripted Copilot answers** (these are the canned grounded responses; keep the exact text):

- **OneStream — multi-currency** (citations resolve to §4.12, §4.18, §5.2):
  > "For a 45-entity, 12-currency OneStream deployment, use a Currency Base Entity pattern[^1].
  > Apply Current Rate for the Balance Sheet, Average Rate for P&L, and Historical Rate for
  > Equity — handled natively via CTRs in v9.x without custom Business Rules[^2]. Validate
  > with an ICP elimination pass before group close[^3]."
  > Citations: `[^1] Currency Translation §4.12`, `[^2] Configurable Components §4`, `[^3] ICP Matching §4.18`.

- **Tagetik — multi-entity close** (citations §1, §5.2):
  > "For a multi-entity close on Tagetik, model the COC calendar as Local Close → Group Close →
  > Reporting[^1], and enforce SmartLoad's mapping table as the single ERP→chart bridge.
  > Disclosure pulls only from Group Close cells[^2]."

- **Cite-or-abstain example** (trigger when the user asks something out of scope, e.g.
  "What's the right SAP S/4HANA migration sequence?"):
  > "I don't have grounded coverage for SAP S/4HANA migration in the cartridges attached to
  > this project (OneStream v9.x). I won't guess. Attach the SAP Group Reporting KC, or ask
  > me about OneStream consolidation, currency translation, or close." *(No citations — render
  > a muted "no grounding" state, not a fabricated answer.)*

Provide **3 suggested prompt chips** for the chat: the OneStream multi-currency one (primary),
the Tagetik close one, and the out-of-scope SAP one (to demo abstention).

### 5.3 Requirements deliverable (for Flow 2)
A pre-filled **questionnaire** (5–6 Q&A rows, e.g. "# legal entities? → 45", "# currencies?
→ 12", "Close calendar? → Local → Group → Reporting", "ICP eliminations? → Yes, monthly")
and a generated **FR/NFR register**. Include ~6 functional + 3 non-functional requirements,
each with an id, title, description, and a KC citation, e.g.:

```
FR-001  Multi-currency translation   "Translate BS at Current, P&L at Average, Equity at
                                       Historical via native CTRs."           cite §4.12
FR-002  Intercompany eliminations    "Monthly ICP matching + elimination before group close." cite §4.18
FR-003  Close calendar               "Local Close → Group Close → Reporting workflow."         cite §1
FR-004  Entity hierarchy             "45 legal entities, 3 consolidation tiers."               cite §4
FR-005  Cash flow                    "Indirect method, derived from movement accounts."        cite §4
FR-006  Audit trail                  "Full drill-back from group figures to source."           cite §11
NFR-001 Close performance            "Full consolidation < 8 minutes for 45 entities."         cite §9
NFR-002 Concurrent users             "60 concurrent close users, no degradation."              cite §2
NFR-003 Security                     "SSO + role-based cell security by entity."               cite §11
```
Deliverable status starts at `pending_hotl`.

### 5.4 Contribution / flywheel artefact (for Flow 3)
A source artefact from Project Atlas — e.g. **"OneStream Currency Translation — Atlas
Design Note"** — with a short body that contains **client identifiers** (e.g. "Global
Manufacturing Co.", an entity code like "GMC_EU_DE01", a consultant email). Provide BOTH:
- the **raw** text, and
- the **auto-redacted** version where identifiers are replaced with neutral tokens
  (`[CLIENT]`, `[ENTITY_CODE]`, `[EMAIL]`) — so the diff is visible side-by-side.

Curator: **"Aarti Menon (Curator)"**. On approval, OneStream KC bumps **v9.2.0 → v9.3.0**
and `indexedChunks` 21 → 22.

---

## 6. Flow 1 — Copilot chat + KC citations  (route: `/` , the Atlas workspace)

The workspace is the hero screen. Layout: a **project header bar** (Atlas name, client,
OneStream chip, lifecycle "Requirements" pill), then a two-column body:

- **Left (main): the chat panel.**
  - A welcome state with the 3 suggested-prompt chips.
  - User messages render as `#2E2E38` bubbles aligned right; Copilot messages as white cards
    aligned left.
  - When the user sends/clicks a prompt, the Copilot answer **streams in token-by-token**
    (`setInterval`, ~15–25ms/word) to feel live.
  - **Inline citation chips** (`[^1]`, `[^2]`…) render as small teal `tealGlass` pills with a
    `↗` and the section label (e.g. "↗ Currency Translation §4.12"). **Clicking a citation
    highlights the matching section** in the Sources rail (scroll + teal wash + brief pulse).
  - Below each completed answer: **thumbs-up / thumbs-down** buttons. A thumbs-down opens a
    one-line "what was missing?" input and shows a small note: *"Low ratings cluster into the
    Curator's quality queue."* (ties to the flywheel — no real persistence needed).
  - The **abstention** prompt produces the muted "no grounding" answer from §5.2 — make this
    visibly different (a `warning`-tinted left border, no citation chips). This is a
    deliberate "wow, it doesn't bluff" beat.

- **Right (rail): the Sources rail.**
  - Header "Grounding — OneStream v9.x · v9.2.0 · 21 chunks · MCP ● running" (green dot).
  - The KC section tree from §5.2. Sections referenced by the current answer are the highlight
    targets for citation clicks.

This screen alone should make the **cite-or-abstain** trust story obvious.

---

## 7. Flow 2 — Requirements accelerator + HOTL export  (the value headline)

Add a **Skills / Accelerators** strip to the Atlas workspace (a row of 7 pills:
**SoW, Requirements ★MVP, Design, Build, Test Script, Test Review, Architecture** — only
**Requirements** is wired; others open a tasteful "Coming in this build" tooltip). Clicking
**Requirements** opens the accelerator as a drawer or `/projects/atlas/requirements` route.

A **3-step shell**:

1. **Inputs** — a form pre-filled from project context: project = Atlas, software =
   OneStream v9.x, "AS-IS docs: client RFP.pdf (mock)", and the **questionnaire** from §5.3
   shown as already-answered rows (with a subtle "auto-generated from KC §3 Requirements
   catalogue" note). A single **"Generate requirements"** button. Show a banner:
   *"Traditionally ~2 weeks of workshops. Drafted here in seconds."*

2. **Generated deliverable** — a streaming/render of the **FR/NFR register** from §5.3 as a
   clean table, each requirement row showing its **KC citation** chip (reuse the citation
   component). A status badge reads **`pending_hotl`** (amber).

3. **HOTL gate + export** —
   - A callout: *"Human-on-the-loop: no client deliverable leaves without manager sign-off."*
   - An **Approve** button (visible because the session user is a Partner/manager). Clicking
     it flips status `pending_hotl → approved` (green), records a fake approver + timestamp,
     and toasts "Approved by Prashant Garg".
   - An **Export** button — **disabled until approved**. On click it generates a **real
     downloadable file** the audience can see land in the browser's downloads: build a Blob
     and trigger a download. Produce a **Markdown (`.md`)** export for certain, and if cheaply
     possible a **`.docx`** (a minimal valid DOCX or a `.doc`-flavoured HTML blob is fine) —
     filename `Atlas_Requirements_v1.docx`. Toast "Exported · 24 KB · sha256 …" (fake hash ok).

This flow is the money shot: **inputs → grounded draft → manager approves → client file**.

---

## 8. Flow 3 — KC catalogue + contribution flywheel  (the compounding-IP story)

**`/knowledge`** — a card grid of the 3 KCs. Each card: vendor colour swatch, name, version,
**Published** badge (green), indexed-chunk count, and an **MCP ● running** status. A small
"+ New cartridge" affordance (non-functional, tooltip only).

**`/knowledge/onestream`** — KC detail:
- Header: name, `v9.2.0 · Published`, "MCP server ● running · 21 chunks indexed".
- **Section browser** (the tree from §5.2) on the left; clicking a section shows a short mock
  excerpt of its content on the right.
- A **"Contributions" / flywheel** panel demonstrating the 4-step loop (mirror these stages):
  1. **Promote** — a button "Promote artefact to KC" on the Atlas design note (§5.4). Opens a
     modal showing the **raw** artefact.
  2. **Auto-redaction** — show the **side-by-side diff**: raw (with client identifiers
     highlighted in `danger`) vs redacted (neutral tokens in `success`). Caption:
     *"Client identifiers stripped automatically before any human sees it."*
  3. **Curator gate** — "Aarti Menon (Curator)" reviews; buttons **Approve** /
     **Request changes** / **Reject**. Approve advances the loop.
  4. **Version bump + propagation** — on approve: OneStream KC bumps **v9.2.0 → v9.3.0**,
     chunk count 21 → 22, a new contribution appears in the list (attributed to Aarti Menon),
     and a toast fires: **"v9.3.0 published — every project attached to OneStream now benefits,
     no re-attach needed."** If the detail header version is derived from demo state, it should
     update live.

Also include the small **feedback-loop explainer** (3 cards): "Consultants rate answers →
Low ratings auto-cluster (5+ → Curator queue) → Curator enriches the weak section & publishes."
This connects Flow 1's thumbs-down to Flow 3's curation.

---

## 9. The show-and-tell script (`DEMO_SCRIPT.md`)

Write this file at the repo root — a numbered ~10-minute walkthrough the presenter reads.
For each beat give: **the click**, **the one-liner to say**, and **the "wow"**. Cover:

0. **(0:30) Open** — "How it works" modal → the 6-weeks-to-1-week table. *Wow: "We start the
   engagement at minute sixty, not minute zero."*
1. **(2:00) Grounded answer** — Atlas workspace, click the OneStream multi-currency prompt;
   watch it stream; click a `[^1]` citation → rail highlights §4.12. *Wow: "Every sentence is
   traceable to EY's own IP."*
2. **(0:45) It won't bluff** — click the SAP prompt → abstention. *Wow: "When it doesn't know,
   it says so. No hallucinated client advice."*
3. **(3:00) Requirements → HOTL → export** — open Requirements accelerator, Generate, show the
   FR/NFR register with citations, **Approve**, **Export** the DOCX. *Wow: "Two weeks of
   workshops to a manager-approved client document in under a minute — and nothing ships
   without a human signing off."*
4. **(2:30) The flywheel** — Knowledge → OneStream → Promote the Atlas note → see auto-redaction
   diff → Curator approves → **v9.3.0 published**. *Wow: "Every project makes the next one
   better. The IP compounds."*
5. **(0:30) Close** — "Cite-or-abstain, human-on-the-loop, versioned knowledge, a compounding
   flywheel. That's the EPM Copilot." Mention **Reset demo** for the next run.

Add a short **"If something goes sideways"** note (refresh the page, click Reset demo) and a
**"What's mocked vs real"** disclaimer (this is a UX demo; the production system runs real
LLMs, per-KC MCP servers over LanceDB, Postgres with tenant isolation, and real export).

---

## 10. Acceptance checklist (the build is done when…)

- [ ] `npm install && npm run dev` works first try; opens on `http://localhost:3000`; **no
      console errors/warnings** during the full click-through.
- [ ] On-brand: EY Black/Yellow + EPM Teal, Georgia headings, off-white canvas, dark chrome.
- [ ] **Flow 1**: streaming answer, clickable citations that highlight the rail, thumbs
      up/down, and a visibly-different **abstention** answer.
- [ ] **Flow 2**: pre-filled inputs → generated FR/NFR register with citations →
      `pending_hotl` → **Approve** → **Export downloads a real file**.
- [ ] **Flow 3**: KC grid + detail + section browser, redaction diff, curator approve,
      **live version bump** to v9.3.0 with propagation toast.
- [ ] "How it works" modal with the 6→1 week table + timeline.
- [ ] **Reset demo** restores initial state; everything is deterministic and offline.
- [ ] `DEMO_SCRIPT.md` + a `README.md` (run instructions, "what's mocked" note) exist.
- [ ] Code is tidy and concentrated; all editable copy/data is in `lib/demo-data.ts`.

Build the complete app now. After building, run it once, click through all three flows
yourself to confirm the acceptance checklist, and fix anything that errors.
