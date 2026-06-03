---
applyTo: packages/server/**
---

# Server Package Instructions

## Stack
- **Runtime:** Node.js with Express
- **API layer:** tRPC only — no REST routes (except `/health` for infrastructure checks)
- **Database access:** Prisma client imported from `@carton/shared`
- **Language:** TypeScript with ESM (`"type": "module"`); use `.js` extensions on all local imports

## Structure
```
packages/server/src/
??? index.ts          # Express app setup, middleware registration, server bootstrap
??? router.ts         # All tRPC procedures and sub-routers (single entry point for API)
??? trpc.ts           # tRPC instance, exports `router` and `publicProcedure`
??? context.ts        # Request context factory — exposes `req`, `res`, `prisma`, `userId`
??? middleware/
    ??? autoLogin.ts  # Dev-only auto-login: sets `userId` cookie from MOCK_USER_EMAIL env var
```

## Adding Procedures
- All tRPC procedures belong in `packages/server/src/router.ts`
- Group related procedures under a named sub-router (e.g., `user: router({ ... })`)
- Use `publicProcedure` from `./trpc.js` for all procedures (no auth middleware currently)
- Validate inputs with Zod; reuse schemas from `@carton/shared` before defining new ones
- Access the database via `ctx.prisma` (Prisma client)
- Access the authenticated user via `ctx.userId` (string | undefined)
- Throw `TRPCError` for error cases with appropriate codes (`UNAUTHORIZED`, `NOT_FOUND`, etc.)

## Context
The request context (`packages/server/src/context.ts`) provides:
- `req` / `res` — Express request/response objects
- `prisma` — Prisma client instance (from `@carton/shared`)
- `userId` — extracted from the `userId` cookie set by `autoLoginMiddleware`

## Authentication
- Development uses `autoLoginMiddleware` (`middleware/autoLogin.ts`) to auto-set a `userId` cookie
- The mock user email is controlled by the `MOCK_USER_EMAIL` environment variable; falls back to `FIRST_USER_EMAIL` constant from `db/constants.js`
- Always guard procedures that require authentication by checking `ctx.userId` and throwing `TRPCError({ code: 'UNAUTHORIZED' })` if absent

## Environment Variables
| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `3001` | HTTP server port |
| `HOST` | `0.0.0.0` | HTTP server host |
| `NODE_ENV` | — | Set to `production` to serve client static files |
| `CLIENT_URL` | `http://localhost:5173` | CORS allowed origin |
| `MOCK_USER_EMAIL` | `FIRST_USER_EMAIL` constant | Auto-login user in development |

## Production
- When `NODE_ENV=production`, the server serves the built client from `packages/client/dist` as static files with a SPA fallback to `index.html`

## Conventions
- Import `.js` extensions on all relative imports (ESM requirement)
- Do not add REST routes; expose all functionality through tRPC procedures in `router.ts`
- Do not instantiate Prisma directly; always use the shared instance from `@carton/shared`
