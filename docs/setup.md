# Starter setup and reference

For the product/team process, follow [the README](../README.md).

## Start locally

Use Node 22.18+ (Node 22 LTS recommended) and pnpm 10.13.1.

```sh
nvm use
pnpm install
pnpm run dev
```

Open http://localhost:3000/sandbox. No environment variables or Supabase account are needed for the landing page and sandbox. Browse one searchable sidebar containing all 81 component demos, with a shared preview and variant/replay controls. Direct previews: [Accordion](http://localhost:3000/sandbox?component=accordion) and [Dropdown](http://localhost:3000/sandbox?component=dropdown-menu). Component search stays visible while the sidebar list scrolls. The UI is light-only. Only the Colors demo shows the five supplied swatches and hex labels without a picker or live color changes. The sandbox makes no Supabase requests.

Dependencies and `pnpm-lock.yaml` are installed. Use `pnpm install --frozen-lockfile` for reproducible team and CI installs.

## Selaras UI preview

Open [Kelas](http://localhost:3000/kelas), or use **Open app** in the sandbox. The public
preview follows the supplied screenshot hierarchy: class list, Siswa/Level/Progres/Sesi tabs,
a session builder, and a read-only saved session. The example class is
[kelas-rangkap-2-3](http://localhost:3000/kelas/kelas-rangkap-2-3).

Fictional student levels, observations, classes, group moves, and session snapshots use local
state only. Reloading resets the preview. The screenshot's literacy content and 70/15-minute
timing are fixtures, not a scheduling engine. Print/Save PDF opens the browser's print dialog;
other unprovided teaching content remains unavailable. No Supabase configuration is needed.
The starter authentication and private project routes remain separate.

## Connect Supabase

```sh
cp .env.example .env.local
```

Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` from your project’s Connect dialog. These are public browser credentials. Never use a service-role/secret key here.

Choose one database setup:

- **Hosted project:** create a development Supabase project, run `supabase login`, `supabase link --project-ref YOUR_PROJECT_REF`, and `supabase db push`. Confirm the linked project before pushing. Alternatively apply the migration from `supabase/migrations/` through the SQL editor.
- **Local project:** install the Supabase CLI and Docker, run `supabase start`, then `supabase db reset` against the disposable local database. Read the local URL and publishable/anon key using `supabase status`, and put them in `.env.local`. Local email messages are available at http://localhost:54324.

Regenerate the bootstrapped database types after applying the migration:

```sh
# Local database
pnpm run db:types

# Hosted development database
supabase gen types typescript --linked > src/types/database.ts
```

Restart `pnpm run dev` after environment changes. Public environment variables are baked into the browser bundle; set them before building deployments.

In Supabase Auth URL Configuration, set the Site URL to `http://localhost:3000` and add `http://localhost:3000/auth/callback` to allowed redirect URLs. Keep email confirmation enabled and test it early.

The callback supports PKCE `code` exchange. To make confirmation work across devices, set the **Confirm signup** email template’s link to:

```html
<a href="{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=email"
  >Confirm email</a
>
```

For deployments, update the Site URL and allowed callback origins to the deployed URL. Invalid/expired links offer a new confirmation email from `/auth/confirm`. The cross-device template uses the Site URL, so use a designated development origin for previews.

## Commands

| Command                         | Purpose                                                    |
| ------------------------------- | ---------------------------------------------------------- |
| `pnpm run dev`                  | Local app and sandbox                                      |
| `pnpm run build` / `pnpm start` | Production build / server                                  |
| `pnpm run typecheck`            | Strict TypeScript check                                    |
| `pnpm run lint`                 | ESLint                                                     |
| `pnpm test`                     | Node tests for contracts, palette display and color contrast, chart scaling |
| `pnpm run test:rls`             | Real two-user database isolation check                     |
| `pnpm run db:types`             | Generate types from the local Supabase schema              |

The RLS check needs two different, disposable, confirmed users and the `RLS_TEST_*` values in `.env.local`. It creates temporary rows, verifies direct SDK read/write/delete isolation, constraints, owner CRUD, and timestamps, and attempts cleanup. Never run against production. Register test users through the app; no passwords are seeded or committed.

## UI components and styles

All reusable components live in `src/components/ui/`. The button demo shows standard variants in extra-small and small sizes, and disabled/loading states. Use `loading` for async actions, `variant="primary"` for affirmative actions, and `variant="danger"` for destructive actions.

- `src/components/ui/globals.css`: Beautiful UI light-mode design tokens, keyframes, and catalog component CSS.
- `src/app/globals.css`: app token aliases and matching styles for the rest of the app.
- `src/components/ui/`: one flat component library containing the 21 catalog components, shared controls and feedback, tokens, and source license; see [design rules](../DESIGN.md).
- `src/app/sandbox/page.tsx`: thin public gallery route.
- `src/features/sandbox/`: gallery demos in `components/`, catalog data in `constants/`, and component-selection checks in `validations/`.
- `src/features/projects/components/`: feature forms and cards; the sandbox reuses the project form.

Change shared colors and radii in the design token files. The sandbox contains component previews, a read-only Colors demo without a sidebar palette. It has no customization page or radius controls. The UI defaults to #7173FF with 10 px button corners and white preview cards. Dark mode and its cookie-based provider/toggle are removed; old theme cookies are ignored. All Button/IconButton variants support extra-small (32 px) and small (40 px, default), with legacy md/lg size props falling back to small, and primary #7173FF/destructive #FF3C7F Buttons use white labels. Keep focus styles, labels, error associations, and Base UI’s keyboard behavior intact. There is no Storybook or separate app to maintain.

## Architecture and reuse

See [architecture and conventions](../AGENTS.md), [product requirements](../PRD.md), and
[team workflow](../docs/team-workflow.md). Replace the example projects feature with your product's
agreed scope. Keep the shared clients, providers, UI, and ownership boundaries unless an explicit
requirement changes them.

Group feature files by purpose: `components/`, `hooks/`, `api/`, `validations/`, `constants/`, and `types/`. Create only the folders a feature needs; import their files directly.

Axios is installed and a shared client is provided in `src/lib/axios.ts` for future Route Handler integrations. Ordinary CRUD uses Supabase directly. The optional AI flow has no placeholder endpoint; specify authorization, quota, origin validation, provider behavior, and failures in the product PRD before implementing it.

## Deploy

Import this repository into Vercel, choose Node 22, configure public Supabase environment variables, apply reviewed migrations to the intended database, and deploy. Use an isolated development database for previews. Update Supabase Auth URLs and complete the backlog's Definition of Done before calling it ready.

Deployment and live Supabase flows require your infrastructure configuration; neither was provisioned by this source implementation.
