# Use this starter with your team

Follow this workflow:

```text
Starter → product PRD → updated AGENTS.md → DESIGN.md → specific backlog prompts
        → teammate branches → pull requests → CI + AI review → merge → demo check
```

| File | Purpose |
| --- | --- |
| [PRD.md](PRD.md) | What the product does, for whom, and what is in scope |
| [AGENTS.md](AGENTS.md) | How agents must implement this product in this repository |
| [DESIGN.md](DESIGN.md) | How the product looks using the existing shared UI |
| [BACKLOG.md](BACKLOG.md) | Tickets, dependencies, acceptance criteria, and exact implementation prompts |

The product documents start as templates. Fill in real decisions before asking AI to implement
features. TODOs identify unanswered questions; they are not implementation requirements.

## 1. Create your team's project from this starter

Use this starter as the base of your team's GitHub repository and invite your teammates.
Keep one shared `main` branch and use separate branches for ticket work.

Follow [local setup](docs/setup.md) to install and run the starter. Open `/sandbox` to see the
existing controls before planning replacements or new components. The landing page and sandbox
work without Supabase; authentication and project data need the setup described there.

**Result:** everyone can run the same starter from the shared repository.

## 2. Write your product PRD

Replace the template content in [PRD.md](PRD.md) with your actual product requirements.
You can write it yourself or give AI your product brief and ask it to organize the document.

Specify target users, MVP journeys, screens, data, permissions, relevant failure states, and
explicit exclusions. Give requirements stable IDs such as `REQ-001`.
State which starter features to keep, adapt, replace, or remove.

Use this prompt with your product brief:

```text
Read PRD.md and inspect the starter. Use my product brief to fill in PRD.md.

Describe the MVP, users, journeys, screens, data ownership, acceptance criteria,
out-of-scope work, and explicit decisions about the starter's example features.
Give requirements stable IDs.

Do not invent missing product decisions. List unresolved questions and their
affected requirements. Update only the PRD; do not implement features.
```

Resolve questions that affect the MVP before assigning implementation work.

**Result:** the team agrees on what it is building.

## 3. Update AGENTS.md for that product

Ask AI to align the starter's agent rules with your completed PRD:

```text
Read docs/team-workflow.md and follow its "Align agent instructions" prompt.

Use PRD.md and the actual repository to update AGENTS.md for this product.
DESIGN.md may still be a template; do not interpret its TODOs as decisions.
Preserve the existing architecture, tooling, security, and shared UI conventions
unless an explicit accepted requirement changes them.

Update documentation only. Report conflicts and remaining decisions.
```

Read the resulting changes. Check that AI describes planned features as planned and does not
claim they already exist. Keep the existing build commands and feature-folder conventions.

**Result:** every teammate's coding agent has the same implementation rules.

## 4. Define the design using the existing UI

Fill in [DESIGN.md](DESIGN.md) with the visual direction for your product.
Supply reference screenshots, documents, or links and explain which qualities to borrow.

Specify layouts, content hierarchy, density, spacing, surfaces, token changes, responsive
behavior, and component states. Map each product screen to existing `src/components/ui/`
controls. A different design does not require a second component library.

Use this prompt with your references:

```text
Read PRD.md, AGENTS.md, DESIGN.md, and the existing UI components and token files.

Use my supplied design references to fill in DESIGN.md for this product.
Map product screens to existing components and specify concrete layout, spacing,
density, typography hierarchy, surfaces, and light-only behavior.

Reuse the current UI library, Base UI behavior, shared Button, and Lucide icons.
Identify justified component gaps instead of replacing the library.
Preserve accessibility, read-only palette presentation, and semantic destructive states.

Do not guess missing design decisions or copy a reference's branding.
Record unresolved questions. Update documentation only; do not change the UI yet.
```

If the accepted design changes a convention in AGENTS.md, repeat step 3 to align the rules.
The foundation remains unchanged until the relevant implementation ticket is assigned.

**Result:** the team has one concrete design specification and reusable-component map.

## 5. Ask AI to generate the backlog and ticket prompts

Once product and design decisions are concrete, run:

```text
Read docs/team-workflow.md and execute its "Generate the backlog" prompt.

Use PRD.md, DESIGN.md, AGENTS.md, BACKLOG.md, and the actual source/tests.
Write the generated tickets directly in BACKLOG.md.
Do not implement application code.

Every Ready ticket must contain a complete, specific implementation prompt
inside its ticket section. Do not leave placeholders or unresolved product/design
choices in Ready prompts. Block affected tickets when information is missing.
```

Review [BACKLOG.md](BACKLOG.md) before assigning tickets. Each Ready ticket must state its actual
outcome, requirement/design references, dependencies, file paths, interfaces, acceptance criteria,
exclusions, and verification. The implementation prompt must repeat the concrete task so a
teammate can paste it into a fresh agent session.

A prompt such as "build the dashboard" is not ready. It must identify the dashboard's decided
data, layout, components, interactions, permissions, and failure states.

**Result:** a dependency-ordered backlog with a copyable prompt for every Ready ticket.

## 6. Assign tickets to teammates

Create an issue for each generated ticket using the existing feature issue template.
Link the canonical BACKLOG.md section and copy its complete implementation prompt into the issue.

Assign one owner and an independent reviewer. Track progress on the team's issue board:

```text
Backlog → Ready → In progress → In review → Done
```

Start dependent tickets after their prerequisites merge. Independent tickets can run in parallel.
Coordinate shared CSS, controls, providers, configuration, and migrations before overlapping edits.

The team lead maintains BACKLOG.md and batches assignment updates. Teammates use issues for daily
progress instead of all rewriting the same backlog file.

**Result:** everyone knows their ticket, its dependencies, and who will review it.

## 7. Implement one ticket on one branch

Each teammate starts from current `main` after the ticket's dependencies merge.
Use separate clones/worktrees for simultaneous agents.

For example, replacing the sample branch name with the assigned ticket:

```sh
git switch main
git pull --ff-only
git switch -c feat/FEAT-001-descriptive-change
```

Paste the **complete implementation prompt from the ticket** into the coding agent in that
checkout. Do not replace it with a vague request. Keep changes within the agreed scope;
resolve product/design changes through the planning documents first.

Run the required checks and the ticket's additional verification:

```sh
pnpm run typecheck
pnpm run lint
pnpm test
pnpm run build
```

Check affected UI in light mode and palette labels, with keyboard navigation and at 360 px.
Ownership/schema changes also need the live isolation check against a confirmed disposable
environment. Report blocked checks accurately.

**Result:** a complete ticket implementation with reviewable verification evidence.

## 8. Open a PR and request AI review

Push the ticket branch and open a PR against `main` using the existing PR template.
Include the issue link, BACKLOG.md ticket ID, PRD/design references, acceptance evidence,
actual check results, and remaining limitations.

GitHub Actions already runs typecheck, lint, tests, and build for PRs.
AI review requires a configured GitHub integration or a separate review agent session.
To run a separate review, provide the PR URL/diff and ticket ID with this prompt:

```text
Read docs/team-workflow.md and follow its "Review and merge" review prompt.

Review the supplied PR against its BACKLOG.md ticket, PRD.md, DESIGN.md, and AGENTS.md.
Inspect the diff and relevant surrounding code. Report actionable findings,
unmet acceptance criteria, and missing verification evidence.

Do not modify files or merge the PR.
```

The author fixes valid findings and explains rejected suggestions. Rerun affected checks and
request another review after fixes.

**Result:** the PR has passing required checks and evaluated AI review findings.

## 9. Approve, merge, and verify

Configure the shared repository to require PRs into `main`, the existing `validate` check,
and teammate approval. These remote settings must be configured separately.

The independent teammate checks acceptance criteria and the user flow, then approves the PR.
Merge, delete the completed branch, and verify the merged behavior in the shared demo environment.
Only then move the issue to Done and have the lead update the backlog.

AI review supports the decision; it does not replace the product acceptance check.

**Result:** a verified feature is available to the whole team.

## When requirements or design change

Update PRD.md or DESIGN.md first, align AGENTS.md, then regenerate only affected backlog tickets
and prompts. Preserve ticket IDs and completed work. The team lead communicates changes to
owners of affected in-progress work before implementation continues.

Detailed planning/review prompts: [team workflow](docs/team-workflow.md).
Installation, Supabase, commands, UI files, and deployment: [setup guide](docs/setup.md).
