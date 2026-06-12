# seeds/ — AI Console Seed Definitions

These files are the canonical examples for `pnpm seed:ai-console` (built in M4). The loader matches entities by `slug` and is idempotent — rerunning updates content and bumps versions only when content changed.

## Contents

| File | What it seeds |
|---|---|
| `agents.sample.json` | 5 agents simulating existing EPM Copilot outcomes (chat + 4 accelerators/composers) |
| `mcp-servers.sample.json` | The managed `knowledge-mcp` registration with its 4 expected tools |
| `tools.sample.json` | Internal (non-MCP) action records for console visibility |
| `skills/sow-writing.skill.md` | Full sample skill — frontmatter (knowledge_links) + markdown body |
| `skills/grounded-chat.skill.md` | Full sample skill for the chat agent |
| `skills/*` (to author in M4) | `requirements-elicitation`, `functional-design-writing`, `test-script-writing` — follow the two samples' structure exactly |

## Conventions

- **`USE_EXISTING_PROVIDER_SLUG` / `USE_CONFIGURED_MODEL`**: the seed loader must resolve these against the repo's existing `llm_providers` records at seed time (M0/GAP_MAP names them). Never hardcode a provider or introduce new credentials.
- **`knowledge_links` frontmatter**: `kc_slug` + `version` (`latest-active` resolves at run time; pin a version for reproducibility) + optional `section_anchors`/`tags` used as retrieval hints by the executor.
- **`{{skill:slug}}`** in agent system prompts is resolved to the active skill version's body at prompt-assembly time.
- **Output schemas** (`sow.v1`, `requirements.v1`, `design.v1`, `test_scripts.v1`) are seeded in M4 as Zod-mirrored JSON schemas; composers must emit valid instances; every section/item includes a `citations` slot.

## Golden fixtures (M4)

One saved Playground input per agent, with expected-behaviour notes, e.g.:

- **sow-composer** — input: a 12-line consolidation-scope brief (40 entities, IFRS + statutory, 3 source GLs, go-live in 9 months). Expect: bounded scope items, ≥6 out-of-scope exclusions, every estimate with a basis, ≥5 cited capability claims, all invented facts in assumptions.
- **copilot-chat** — input: "How does intercompany elimination configuration work and what are the common pitfalls?" Expect: direct answer, ≥2 KC anchor citations, a "watch out" note, weak-grounding admission if the KC lacks pitfall coverage.

Author the remaining three fixtures in the same style during M4.
