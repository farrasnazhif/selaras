# Product Backlog

## UI-24 — Authorized teacher integration

Metadata refactor: centralize all existing route/layout metadata in `src/constants/metadata.ts`.
Route exports reference PAGE_METADATA entries; preserve current values and inheritance.

DES-40: replace the Selaras icon/text branding in PreviewShell and LandingPage with
`/main-logo.png` using next/image, intrinsic proportions and responsive sizing.

UI-24-AC-06: remove CreateClassDialog's trigger from ClassroomsView and its unused import.
Keep the existing data, search and combine flow.

UI-26/DES-39: add `src/components/ui/selaras-loading-state.tsx` using only LoaderCircle with
a configurable accessible label and reduced-motion support. Register it in the sandbox catalog
and SharedDemo. UI-26-AC-02 additionally uses it in root/Kelas/Jadwal loading boundaries,
initial workspace fetch, and auth redirect loading; preserve route protection and error states.

DES-37 button refinement: style only Buat variasi AI with a primary-color gradient and sweeping shine
through a scoped CSS class. Keep shared Button behavior and disable motion for reduced-motion,
loading and disabled states.

UI-25/DES-38: add independent ten-student pagination per class in
`src/features/progres/components/progress-view.tsx`, using shared Pagination for desktop
tables and mobile cards. Keep subject selection, ordering, columns and observation behavior.

UI-24-AC-05: remove the seeded-account fictional-data callout, update the confirmed seed
login via the admin API, and combine existing 1A + 2B with the shared helper and revision
check. Preserve other data, student IDs/history, and keep credentials in `.env.local` only.

Implement UI-24/DES-37 using existing Supabase SSR email/password auth, Indonesian AuthForm,
verified product layouts/proxy routes, real profile/sign-out and user-scoped query cache.
Persist the existing workspace as one RLS-protected teacher JSON record with revision-checked
mutations and awaited error-aware callers; validate nested session/history/group references.
Keep photos local. Add authenticated GPT mini task variations, strict schema/level checks,
teacher preview/approval and template fallback; configure an atomic daily request limit.
Prepare a no-overwrite development seed for one teacher and 12 sectioned classes with fictional
students. Do not apply migrations or seed until environment configuration, per latest user reply.
Preserve starter auth/projects and public landing/sandbox. Verify contracts, typecheck, lint,
build, and report live checks as unavailable until credentials exist.

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

UI-20/DES-34 adds seeded independent 1–6 class cards (32 fictional pupils each), pure same/neighboring-grade
validation/merge helpers (distinct classes, including 3A+3B, either order),
floating selection/next flow and constituent-card composition. Adapt provider/single-class tabs,
presentation and session guards; preserve existing 2+3 and identity/history. UI-21/DES-35 adds
shared optional photo input in task editing, local data URL snapshots, content validation and
teacher/student/print rendering. Reuse Dropzone/file validation; abort pending reads and keep
old content on errors/cancel. Write affected contracts without running tests; typecheck/lint/build
apply. No backend, permanent upload, AI/OCR or browser persistence.
The card refinement restores main's banner/title/metadata-footer layout while retaining this
branch's AvatarGroup/count, passing each classroom's last-session date to both constituent cards.
Match main's responsive 1/2/3-column card widths and 20 px gaps, plus its card typography,
banner height and body/footer spacing; keep the current combined-card interaction.
UI-20-AC-05 separates the class list into combined first and independent below, with headings,
empty messages and shared search; preserve the independent-only combine selection mode.
Combined pairs use a two-column span and equal inner columns with 20 px gaps at sm and above;
the plus is absolutely centered, preserving individual widths without squeezing either card.

UI-22/DES-36 authorizes the public Selaras landing page at `/`, implemented under
`src/features/landing/components` with a thin route and page-specific metadata. Reuse Button,
Lucide and existing tokens. Include a teacher-oriented introduction, illustrative workflow,
print/board outputs, `/kelas` CTA and `/sandbox` footer access. Keep white/pastel solid surfaces,
no card shadows or gradients, and explicit fictional-data/reload notice. No backend or new
dependencies. Tests stay unrun; typecheck/lint/build apply.

UI-23 keeps student tables at five 52 px rows and group-member lists at five 64 px rows, filling
unused slots with same-height blanks and one empty message for an empty list. Group cards paginate five actual members per page, by
class/group/subject. Always show shared Pagination, disabled at five or fewer; reduce row padding, hide the level dot,
and do not fix card height.

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
