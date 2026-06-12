# CLAUDE.md — EPM Copilot "AI Console" Module: Standing Rules & Context

This repository is the **existing EPM Copilot codebase** (`gargpr25/epm-copilot`; pnpm 9 + Turborepo 2; `packages/shared-types`, `packages/db` [23-table Drizzle schema], `apps/api` [71 Fastify endpoints, JWT + role guards]; design tokens approved: EY Black `#2E2E38`, EY Yellow `#FFE600`, EPM Teal `#008B8B`, Nav `#1A1A26`, Georgia headings / Segoe UI body).

**Mission of this module:** add a single embedded **AI Console** — one admin surface to create/update/delete/version **Agents, FastMCP Servers, Tools, and Skills**, all linked to the existing Knowledge Cartridges — plus a **Playground** to test outputs against real knowledge with real LLM calls. Seed initial agents/MCP/tools/skills that **simulate the existing EPM Copilot outcomes** (Copilot chat with citations; SoW, Requirements, Design, Test-Script accelerators). **Nothing existing may break.**

Milestones live in `milestones/M0.md` … `milestones/M4.md`. Sample seed definitions live in `seeds/`. Never execute a milestone not explicitly requested this session.

---

## 1. PRIME DIRECTIVES

1. **Audit before assuming (M0).** The repo's current state decides everything: whether `apps/web` exists, whether Ph-4 (orchestrator) / Ph-5 (kc-server) were ever built, where the admin area lives. `GAP_MAP.md` from M0 is binding; if it contradicts this file, follow the repo and record the deviation.
2. **Do not break anything.** Additive migrations only (new tables / nullable columns; never drop or alter destructively). All new API routes under a new prefix (`/api/v1/ai-console/*`). All new UI under one nav entry ("AI Console") behind a feature flag (`AI_CONSOLE_ENABLED`, default on in dev). Every existing endpoint and screen must behave identically after every milestone — regression-check each time.
3. **Reuse, don't reinvent:** existing auth/JWT/role guards (console mutations require Admin; Playground allows Admin + a "Builder" capability), existing tenant scoping (`tenant_id` on every query), append-only `audit_logs`, existing LLM provider records and **existing AI keys via the established credential-reference pattern** (secrets-store refs, never keys in DB, region allow-list respected), approved design tokens and the 5-screen UI patterns.
4. **No fake functionality.** Playground runs call real LLMs through the existing provider layer and real MCP tools. No canned responses. Anything incomplete is honestly disabled + `KNOWN_GAPS.md`.
5. **Config is data.** Agents, skills, tools, MCP registrations are DB rows with immutable versions, draft→active lifecycle, and audit entries — never hardcoded. Hot-reload: editing an active config changes the next run without redeploy.
6. **Knowledge-linked by construction.** Every Skill declares which knowledge it grounds on (KC ids / sections / tags). Every Agent references Skills + allowed MCP tools. The Playground must show, per run, exactly which KC chunks were retrieved and cited.

## 2. SESSION WORKFLOW

Read this file → `GAP_MAP.md` (after M0) → `ARCHITECTURE.md`/`KNOWN_GAPS.md` if present → ONLY the requested milestone. Post a short plan (reuse vs new, files touched, risks). Execute; commit incrementally; run the milestone's Acceptance Checks and print results verbatim; update `GAP_MAP.md`, `ARCHITECTURE.md`, `KNOWN_GAPS.md`, `CHANGELOG.md`, `docs/ai-console-admin-guide.md`. **STOP — never start the next milestone.**

## 3. TARGET DATA MODEL (additive)

- `agent_configs` — id, tenant_id, name, slug, description, purpose ∈ chat|accelerator|composer|qa|custom, system_prompt (may embed `{{skill:slug}}` includes), model_routing (provider_id ref → existing llm provider records, model, temperature, max_tokens, max_steps), skill_ids[], allowed_mcp_tools[] (`server_slug.tool_name`), output_schema_id (nullable), status ∈ draft|active|archived, version, created_by, timestamps.
- `agent_config_versions` — immutable snapshots; active pointer on parent.
- `skills` — id, tenant_id, name, slug, doc/output type it serves (sow|requirements|design|test_scripts|chat|generic), content (markdown how-to-write instructions), knowledge_links jsonb (kc_id, version, section_anchors[], tags[]), provenance jsonb (if derived: source chunk refs), status, version (+ `skill_versions`).
- `mcp_servers` — id, tenant_id, name, slug, base_url, transport ∈ http|sse|stdio, auth_ref (secrets-store reference), status ∈ registered|healthy|unhealthy|disabled, last_health_at, discovered_tools jsonb (name, description, input_schema), managed boolean (true = lifecycle controlled by this app, e.g. the bundled knowledge server).
- `tools` — id, tenant_id, mcp_server_id (nullable for internal actions), name, description, input_schema jsonb, output_notes, enabled, tags[].
- `output_schemas` — id, name, json_schema (Zod-mirrored), doc_type.
- `playground_runs` — id, tenant_id, user_id, agent_config_version_id, skill_version_ids[], input jsonb (prompt + uploaded context + selected KC binding), status, steps jsonb (ordered trace: retrievals, tool calls, LLM calls), output jsonb, citations jsonb, tokens_in/out, cost_usd, latency_ms, error, created_at.
- Reuse existing: `knowledge_cartridges`(+versions/components), `llm_providers`, `llm_call_records`, `audit_logs`, `users`, `tenants`.

## 4. RUNTIME (minimum honest runtime so the console manages something real)

1. **`knowledge-mcp` (managed FastMCP server, Python — per the original Ph-5 design):** wraps existing KC content with hybrid search. Tools: `kc.list`, `kc.search(query, kc_ids?, tags?, top_k)`, `kc.get_section(kc_id, anchor)`, `kc.get_component(kc_id, component_id)`. Vector index per KC (LanceDB per original design, or pgvector if GAP_MAP shows embeddings already live in Postgres — GAP_MAP decides; do not run both). Containerised; health endpoint; auto-registered in `mcp_servers` as managed.
2. **Agent Executor (TypeScript service inside `apps/api` or a thin sibling service — GAP_MAP decides):** loads an active `agent_config_version` → composes system prompt (config prompt + included skill contents + KC grounding rules) → tool loop via MCP client restricted to `allowed_mcp_tools` → LLM call through the **existing provider layer/keys with region allow-list** → if `output_schema_id` set, validate JSON output with bounded retry → extract citations (KC anchors) → persist full step trace + telemetry to `playground_runs` and `llm_call_records`.
3. **Prompt assembly order (inherited from the original orchestrator design):** system prompt → project/tenant context block → skill block(s) → KC grounding block (retrieved chunks with anchors) → conversation/input → output schema instructions. Citation discipline: every factual claim cites a KC anchor; weak grounding must be stated; never fabricate.
4. Uploaded playground context is untrusted data: delimited, active content stripped, agents instructed to ignore embedded instructions.

## 5. AI CONSOLE UI (single console, embedded)

One nav entry → tabbed console in the existing design language: **Dashboard** (counts, health, recent runs) · **Agents** · **Skills** · **MCP Servers** · **Tools** · **Output Schemas** · **Playground** · **Runs** (history). Shared patterns: list → detail/editor → version history with diff → activate/rollback; status chips (EPM Teal accents, EY Yellow active states); every editor has a "Test in Playground" shortcut that opens the Playground pre-loaded.

## 6. THE BAR

Existing flows regression-pass every milestone; server-side role enforcement on every console route; additive migrations only; audit entry for every console mutation; tests for: config versioning/activation, allow-list enforcement, schema-validated outputs with retry, citation extraction, knowledge-link resolution; CI green; `docs/ai-console-admin-guide.md` kept current.
