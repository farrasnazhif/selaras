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

## Working agreement

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
