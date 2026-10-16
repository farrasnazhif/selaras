# Product Backlog

Status: Not generated — complete the product decisions in [PRD.md](PRD.md) and
[DESIGN.md](DESIGN.md), then use [the planning prompt](docs/team-workflow.md#generate-the-backlog).

No product implementation tickets are defined yet. Do not treat the format below as a Ready
ticket or invent product requirements to fill it.

## Current authorized preview

The user directly requested a complete UI-only Selaras preview (`UI-01`, `DES-17`): class-based
navigation, level/rubric content and nested session screens from four supplied screenshots
(`UI-02`, `DES-18`), using shared controls and local fictional data. This supersedes the earlier
guided-flow placeholders; unspecified content remains unresolved. This does not create Ready backend/domain tickets or resolve
the open product contracts. The latest visual refinement (`UI-03`, `DES-19`) removes app card
shadows and uses a demo avatar/email dropdown in the sidebar footer. Tests are not run at the user's request; lint/typecheck/build remain
applicable. The student-tab refinement (`UI-04`, `DES-20`) adds independent local name search,
group filters, and five-row pagination to each class card using existing shared controls.
The header class selector (`UI-05`, `DES-21`) navigates directly between available classrooms
while keeping the active detail tab.
The account dropdown contains only disabled Settings and Sign out actions in this public demo
(`UI-07`, `DES-19`); enabling them awaits resolution of `Q-03`.
Product URLs now use Bahasa Indonesia without an application prefix (`UI-06`, `DES-22`);
all preview navigation and setup links follow the renamed routes.
`UI-10`/`DES-24` authorizes the simpler teacher interface: header navigation for Kelas and overall
Jadwal, rounded typography, 2 px outlines, coded dropdowns, 12 px minimum type, class member
avatars, ten-row Level pagination, observation history, and simpler session copy/controls.
`UI-11`/`DES-25` refines spacing to 15/30/60 px, fixes the shared search field, restores
direct Observasi entry only in Level, and combines full saved schedules by date on Jadwal.
`UI-14`/`DES-28` accepts six exact literacy/numeracy levels and criteria, keeps three groups,
and makes independent-task guidance follow each member’s subject level: non-reading at 1–2,
level practice at 3–5, and class-phase guidance at 6. Phase content remains pending review.
`UI-15`/`DES-29` accepts automatic Biru 1–2 / Hijau 3–5 / Oranye 6 assignment per subject,
member-level labels, a shared Siswa subject selector, and subject-specific manual adjustments.
Panduan kelompok beside the subject selector explains the accepted rules in the shared Dialog
pattern (`UI-15-AC-06`). Saved session rosters preserve their subject’s grouping. No backend integration is authorized.
The observation action moves from Progres to the Level table between Tingkat Numerasi and
Status (`UI-09`, `DES-18`); read-only history stays available on Progres.
Implementation modules are split across `src/features/kelas`, `progres`, and `sesi`, with
cross-page preview state/shell in `src/features/shared`; App Router pages live directly under
`src/app/kelas`, `src/app/progres`, and `src/app/sesi` with no Selaras route-group directory.

UI-18/DES-32 directly authorizes pure schedule types/generation/V1–V5 validation under sesi,
draft task templates, teacher-provided phase content, identity-free A4/board output, variable
whole-minute duration and 10/15/20-minute blocks. Update builder, rotation, tasks, detail/Jadwal,
provider/types, print CSS, README and contract tests. Preserve subject context and manual groups.
No backend, AI, dependencies or persistence. Tests are written but unrun; typecheck/lint/build apply.

UI-19/DES-33 authorizes the mapel Select/custom-name input; block and task editor components,
pure edit helpers/content validations; local saved-session Ubah route/action; provider updates
that validate and save the submitted plan/snapshot without regeneration. Preserve V1–V5,
same-phase first shared block, student-safe projection, local-only storage and shared UI. Update
callers, README and contract tests; tests stay unrun, typecheck/lint/build apply. Confirm destructive
regeneration, keep cancel non-mutating, and preserve other in-memory sessions and roster history.

UI-20/DES-34 adds seeded independent 1/2 class cards, pure fixed-pair validation/merge helpers,
floating selection/next flow and constituent-card composition. Adapt provider/single-class tabs,
presentation and session guards; preserve existing 2+3 and identity/history. UI-21/DES-35 adds
shared optional photo input in task editing, local data URL snapshots, content validation and
teacher/student/print rendering. Reuse Dropzone/file validation; abort pending reads and keep
old content on errors/cancel. Write affected contracts without running tests; typecheck/lint/build
apply. No backend, permanent upload, AI/OCR or browser persistence.

UI-22/DES-36 authorizes the public Selaras landing page at `/`, implemented under
`src/features/landing/components` with a thin route and page-specific metadata. Reuse Button,
Lucide and existing tokens. Include a teacher-oriented introduction, illustrative workflow,
print/board outputs, `/kelas` CTA and `/sandbox` footer access. Keep white/pastel solid surfaces,
no card shadows or gradients, and explicit fictional-data/reload notice. No backend or new
dependencies. Tests stay unrun; typecheck/lint/build apply.

## Working agreement

Current direct implementation scope (`UI-17`, `DES-31`): separate teacher-entered subject/topic
from literacy/numeracy focus in the local session builder; use neutral existing 70-minute rotation
blocks for all subjects and carry that context through validation, session snapshots, cards,
Jadwal, detail, board and print. Reuse shared Input/Select and existing grouping/task guidance.
Update affected fixtures/contracts; do not add curriculum content, other-subject assessments,
backend, dependencies, or persistence. Keep Q-01/Q-13 production decisions open. Tests remain
unrun at the user's request; typecheck/lint/build apply.

- This file owns ticket scope, acceptance criteria, dependencies, and implementation prompts.
- Use one branch and PR per ticket, based on current main after dependencies merge.
- Keep stable ticket IDs; separate independently reviewable slices of a large feature.
- Assign one owner and an independent reviewer before work begins.
- Every Ready ticket contains a specific, standalone prompt with no placeholders or open decisions.
- The team lead maintains this file; teammates claim/progress tickets on the shared issue board.
- Mirror each ticket to an issue for discussion and link the issue/PR here; do not diverge its scope.
- Feature PRs reference their ticket without rewriting other teammates' tickets.
- Product/design changes go through a planning change first; regenerate only affected prompts.
- Use separate checkouts/worktrees for concurrent agents and coordinate shared-file changes.

## Ticket index

Populate this table when actual tickets exist. Do not add fictional owners or issue links.

| ID and title | PRD/design references | Dependencies | Owner/reviewer | Planning status | Issue/PR |
| --- | --- | --- | --- | --- | --- |

Board progress: Backlog → Ready → In progress → In review → Done.
If a dependency or decision blocks work, record why instead of marking the ticket Ready.

## Ticket format

Replace this reference format with generated, concrete tickets under headings such as
`## FEAT-001 — Descriptive outcome`. Put each ticket's complete implementation prompt directly
inside its section, not only in a separate prompt file.

Each ticket must contain:

- Requirement IDs and DESIGN.md sections.
- User-visible outcome and prerequisites.
- Concrete acceptance criteria and relevant failure/cancellation/permission states.
- Existing callers, expected file paths, and shared controls to reuse.
- Data/interface contracts: fields, validation, ownership, API signatures, query/cache behavior.
- Explicit exclusions and any shared-file conflicts with other tickets.
- Verification commands, meaningful tests, manual checks, and environment requirements.
- A specific implementation prompt stating the actual outcome, contract, criteria, and exclusions.
- Completion evidence, reviewer decision, and linked PR after implementation.

The prompt must read like a task specification, not "build the feature" or "follow the PRD".
Paths for proposed new files must be identified as new; do not invent existing functions.
A teammate must be able to paste the prompt into a fresh agent session and begin without
making product decisions.

## Definition of Done

1. Acceptance criteria are satisfied and the change matches PRD.md, DESIGN.md, and AGENTS.md.
2. Required checks pass; blocked checks are listed with reasons and a named follow-up owner.
3. Relevant UI, security, and integration behavior has evidence; missing evidence is not a pass.
4. AI findings have been evaluated and valid issues resolved.
5. An independent teammate has approved and merged the PR.
6. The merged behavior has been checked in the team's demo environment.

Related: [team workflow and prompts](docs/team-workflow.md).
