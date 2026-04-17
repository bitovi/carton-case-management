# Carton Case Management

Hello!

Ugh, as if your case management app should be boring.

This is a monorepo for a modern case management system built with React, Node.js, tRPC, and Prisma. It is giving type-safe, full-stack, absolutely organized energy.

## What This Is

- Client app in React + Vite
- Server app in Node + Express + tRPC
- Shared package for common types and utilities
- SQLite + Prisma for data
- Tests, Storybook, and linting so things stay cute and stable

## Monorepo Layout

- packages/client: Frontend app
- packages/server: Backend API
- packages/shared: Shared schema/types/helpers

## Stack Highlights

- React 18 + TypeScript
- Vite
- tRPC + React Query
- Tailwind + Shadcn UI
- Prisma + SQLite
- Storybook
- Vitest/Jest + Playwright

## Quick Start

### Option A: Dev Container (Recommended)

1. Open this repo in VS Code
2. Open Command Palette and run Dev Containers: Reopen in Container
3. Wait for build/install to finish
4. App should come up with:
- Client: http://localhost:5173
- Server: http://localhost:3001

### Option B: Local Development

Prereqs:

- Node.js 22+
- npm 10+

Run:

```bash
npm install
cp .env.example .env
npm run setup
npm run dev
```

Run apps separately if needed:

```bash
npm run dev:client
npm run dev:server
```

## Authentication (Dev Mode)

There is no production auth flow here yet. The app auto-logs in a seeded mock user.

- Default user: Alex Morgan (alex.morgan@carton.com)
- Switch user by setting MOCK_USER_EMAIL in packages/server/.env

Example:

```env
MOCK_USER_EMAIL=jordan.doe@carton.com
```

The server middleware sets/refreshes a userId cookie automatically, so the client just works.

## Most-Used Scripts

At repo root:

```bash
npm run dev
npm run dev:client
npm run dev:server
npm run setup
npm run build
npm run test
npm run lint
npm run format
npm run storybook
```

Server database helpers:

```bash
cd packages/server
npm run db:studio
npm run db:push
npm run db:generate
npm run db:seed
npm run db:setup
```

## Data + Caching Notes

The frontend uses tRPC + React Query caching.

- Stale time: 5 minutes
- GC time: 10 minutes
- Retries: 3
- Refetch on window focus: enabled

Translation: navigation feels fast, requests are deduped, and stale data refreshes quietly in the background.

## API Surface (High Level)

- health.query: service health
- user.list.query: list users
- user.getById.query: get user by id
- case.list.query: list/filter cases
- case.getById.query: fetch case details
- case.create.mutation: create case
- case.update.mutation: update case
- case.delete.mutation: delete case

## Testing

All tests:

```bash
npm run test
```

Client E2E:

```bash
cd packages/client
npm run test:e2e
```

## Storybook

```bash
npm run storybook
npm run build-storybook
```

## Contributing

1. Create a branch
2. Make changes
3. Run tests, lint, and formatting
4. Open a PR

## License

MIT
