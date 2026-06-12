---
slug: sow-writing
name: SoW Writing
serves: sow
knowledge_links:
  - kc_slug: onestream-v9
    version: latest-active
    section_anchors: ["platform-architecture", "implementation-approach", "environment-management"]
    tags: ["scoping", "estimation"]
status: active
---

# Skill: Writing a Statement of Work for an EPM Implementation

## Document intent
A SoW converts a client's scope brief into a contractual definition of WHAT will be delivered, by WHOM, in WHAT phases, under WHICH assumptions. It must be defensible in a commercial dispute: precise scope-in language, explicit scope-out language, and assumptions that shift risk transparently.

## Mandatory structure
1. **Engagement background & objectives** — restate the client's drivers in their language; 1 short paragraph each.
2. **Scope of services** — numbered scope items grouped by workstream. Each item: deliverable noun + verb + boundary (e.g., "Configure consolidation rules for statutory consolidation of up to 40 entities"). Quantified boundaries wherever the brief or knowledge supports them.
3. **Out of scope** — explicit exclusions for every adjacent area a client could plausibly assume is included (data quality remediation, historical data migration beyond N periods, integrations beyond the named systems, training beyond train-the-trainer).
4. **Approach & phases** — phase table: phase, objective, key activities, entry/exit criteria, indicative duration.
5. **Deliverables register** — deliverable, description, format, acceptance mechanism (HOTL review applies).
6. **Assumptions** — every unstated client fact used in scoping appears here. Never silently assume.
7. **Dependencies & client responsibilities** — environment provisioning, SME availability (named roles, % allocation), data readiness, decision turnaround SLAs.
8. **Team & effort summary** — roles, indicative allocation; estimation rationale grounded in delivery knowledge.
9. **Commercial & change control** — pricing structure reference, change request mechanism.

## Writing rules
- Scope items use bounded, testable language; ban open verbs ("support", "assist", "help") in scope-in items.
- Software capability claims must be grounded in the Knowledge Cartridge and cited; if the KC does not confirm a capability, the related scope item carries an assumption.
- Estimates reference the basis (count of entities/forms/integrations/reports) — never bare numbers.
- Tone: confident, plain, contract-grade; no marketing language.

## Quality self-check before emitting
- Every scope-in item bounded and testable? Every adjacent area covered in scope-out? Every invented fact in assumptions? Every capability claim cited? Phase exit criteria objective?
