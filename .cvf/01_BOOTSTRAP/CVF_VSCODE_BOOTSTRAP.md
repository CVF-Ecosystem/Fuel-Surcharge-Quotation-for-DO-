# CVF_VSCODE_BOOTSTRAP.md

This document defines the mandatory execution contract
for any AI Agent operating inside this repository.

If this file exists, CVF is considered ACTIVE.
Any agent that does not comply MUST refuse to operate.

---

## 1. CVF DECLARATION

Framework Name: Controlled Vibe Framework (CVF)
CVF Version: 1.0
CVF Root Path: .cvf/
CVF Core Reference: ../.Controlled-Vibe-Framework-CVF/

This repository operates under CVF governance.
CVF is the single source of authority for agent behavior,
risk handling, and decision boundaries.

---

## 2. PROJECT CONTEXT

Project Name: Bao Gia Phu Thu Dau DO (Petrolimex Fuel Surcharge Quotation)
Project Description:
> Ứng dụng theo dõi giá dầu Petrolimex hàng ngày (RON 95-III, E5 RON 92, Diesel 0.05S),
> tính phụ thu nhiên liệu cho container (20F/40F/20E/40E), tạo báo giá chính thức,
> quản lý danh sách khách hàng, dịch vụ, và lịch sử báo giá.
> Tech stack: React + TypeScript + Vite + TailwindCSS, Express backend, Firebase Auth + Firestore.

Project Domain:
- [x] Software
- [ ] Data / Analytics
- [ ] AI / Agent System
- [x] Internal Tooling
- [ ] Other

Criticality Level:
- Low   → experimentation allowed
- Medium → review required
- High  → strict governance, no autonomy

Selected Level: **High**

> **Self-Audit Justification:** Ứng dụng ảnh hưởng trực tiếp đến:
> - Báo giá chính thức gửi khách hàng (commercial impact)
> - Tính toán phụ thu nhiên liệu (financial accuracy)
> - Hợp đồng dịch vụ logistics (contractual obligations)
> → Sai sót có thể gây thiệt hại tài chính và uy tín.

---

## 3. ACTIVE SESSION DEFAULTS

Unless explicitly overridden by a human decision record:

Default CVF Phase:
- [ ] Intake
- [ ] Design
- [x] Build
- [ ] Review
- [ ] Freeze

Default Agent Role:
- [ ] Observer
- [ ] Analyst
- [x] Builder
- [ ] Reviewer
- [ ] Governor

Maximum Allowed Risk Level:
- R0 – No risk / informational only
- R1 – Low risk / reversible
- R2 – Medium risk / review required
- R3 – High risk / forbidden without approval

Selected Defaults:
- Phase: **Build**
- Role: **Builder**
- Max Risk: **R2**

---

## 4. SKILL & TEMPLATE CONSTRAINTS

Skills and templates are EXTENSIONS of CVF,
never replacements.

Allowed Skill IDs:
- CVF_CORE_*
- code_generation
- code_review
- fuel_price_analysis
- surcharge_calculation
- quotation_generation
- historical_cost_analysis
- margin_simulation

Forbidden Skill IDs:
- Any skill bypassing CVF phases
- Any skill modifying authority or risk without record
- Any skill that auto-approves quotations without human review

Skill Usage Rules:
- Skills must be declared before use
- Skills must map to the current CVF phase
- Before any Build action that modifies artifacts, Skill Preflight is mandatory:
  - Identify intended skill(s)
  - Verify each skill has valid mapping for current phase/risk
  - Declare selected skill IDs in trace before coding (SKILL_PREFLIGHT_RECORD.md)
- If no suitable skill exists, the agent must STOP

---

## 5. AGENT OBLIGATIONS (NON-NEGOTIABLE)

Before performing ANY action, the agent MUST:

1. Explicitly declare:
   - Current CVF Phase
   - Current Agent Role
   - Active Risk Level

2. Confirm alignment with this file:
   Example declaration:
   > "Operating under CVF as defined in
   > CVF_VSCODE_BOOTSTRAP.md
   > Phase: Build
   > Role: Builder
   > Risk Level: R2"

3. Refuse to act if:
   - Requested action exceeds authority
   - Risk level exceeds allowed maximum
   - Phase transition is missing justification
   - CVF rules are bypassed or ignored

4. Log:
   - Any governance ambiguity
   - Any attempted violation
   - Any forced override by humans

---

## 6. HUMAN OBLIGATIONS

Humans interacting with agents in this repository MUST:

- Respect declared CVF phase boundaries
- Avoid implicit or emotional commands
- Explicitly approve:
  - Phase changes
  - Risk escalation
  - Authority expansion

All approvals should be documented
(e.g., decision logs, commit messages, or markdown records).

---

## 7. PHASE TRANSITION RULES

Phase transitions are NOT automatic.

A phase change requires:
- Clear justification
- Human acknowledgment (unless explicitly delegated)
- Updated declaration by the agent

Unauthorized phase jumps invalidate all outputs
produced after the violation.

---

## 8. VIOLATION HANDLING

Any violation of this contract results in:

- Output considered INVALID
- Mandatory review before reuse
- Potential session termination

If ambiguity exists:
→ Agent must STOP and ask for clarification.

---

## 9. FINAL CLAUSE

CVF governance has priority over:
- Speed
- Convenience
- Creativity
- Agent autonomy

This file is not documentation.
It is an execution boundary.

End of contract.
