# Project Guidelines

## Skills

Use the following skills in the `.github/skills/` directory when needed:

- `.github/skills/performance-review/SKILL.md` — Perform a thorough performance review of the codebase, identifying bottlenecks, inefficiencies, and optimization opportunities across all layers.

- `.github/skills/security-review/SKILL.md` — Perform a thorough security review of the codebase using the OWASP Top 10 (2021) as the primary framework.

## Architecture

npm workspaces monorepo with three packages:

- `packages/client` – React 18 + Vite + Tailwind + Shadcn UI (Radix primitives). Components live under `src/components/obra/` (design system) and `src/components/common/` (app-level).
- `packages/server` – Node.js + Express + tRPC (`src/router.ts`). All API endpoints are tRPC procedures; there are no REST routes.
- `packages/shared` – Prisma schema (`prisma/schema.prisma`), Zod types auto-generated into `src/generated/` via `zod-prisma-types`, and shared utilities. **Do not hand-write types that Prisma/Zod generation covers.**

The database is SQLite in development (configured via `DATABASE_URL`).

## Code Style

- TypeScript throughout; use `"type": "module"` ESM imports (`.js` extensions required in server imports).
- Zod is the validation library for both client and server; reuse schemas from `@carton/shared` before defining new ones.
- Tailwind + `clsx`/`tailwind-merge` for styling; follow patterns in existing `obra/` components.
- No CSS files; no inline styles.

## Build and Test

### Setup
```bash
npm install                 # install all workspace dependencies
npm run setup               # runs db:push + db:seed (run once after install)
```

### Test
```bash
npm run test                # vitest (all packages)
npm run test:client         # vitest (client only)
npm run test:server         # vitest (server only)
npm run test:shared         # vitest (shared only)
npm run test:coverage       # vitest with coverage (all packages)
npm run test:e2e            # Playwright – auto-installs Chromium
npm run test:e2e:watch      # Playwright UI mode
```


## Conventions

- New tRPC procedures go in `packages/server/src/router.ts`; group related procedures under a sub-router.
- Shared Prisma/Zod types are generated — run `npm run generate` in `packages/shared` after schema changes before using new types.
- Each component in `packages/client/src/components/` has its own `README.md` documenting props and usage; maintain this pattern for new components.
- Storybook (`npm run storybook` in client) is used for component development; add stories alongside new components.
