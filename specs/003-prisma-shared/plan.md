# Implementation Plan: Prisma Shared Package Migration

**Branch**: `003-prisma-shared` | **Date**: January 14, 2026 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-prisma-shared/spec.md`

## Summary

Move Prisma schema and configuration from `packages/server` to `packages/shared` to establish the data model as a shared concern. Add `zod-prisma-types` generator to auto-generate Zod validation schemas from the Prisma schema, eliminating manual type duplication and ensuring consistency across client and server packages.

## Technical Context

**Language/Version**: TypeScript 5.x / Node.js 22+  
**Primary Dependencies**: Prisma 6.1.0, zod-prisma-types, Zod 3.23.8, tRPC 11  
**Storage**: SQLite (via Prisma ORM)  
**Testing**: Vitest (unit/integration), Playwright (E2E)  
**Target Platform**: Node.js server, Vite React client  
**Project Type**: Monorepo (npm workspaces)  
**Performance Goals**: N/A (infrastructure change, no runtime impact)  
**Constraints**: Must maintain backward compatibility - all existing tests must pass  
**Scale/Scope**: 3 packages (client, server, shared), ~50 source files affected

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

✅ **Type Safety First**: Prisma schema remains single source of truth, now in shared  
✅ **Zod Generation from Prisma**: Adding zod-prisma-types generator (aligns with constitution v1.1.0)  
✅ **Data Model in Shared**: Constitution updated to require `packages/shared/prisma/schema.prisma`  
✅ **Prisma Client from Shared**: Server will import from `@carton/shared`  
✅ **No Cross-Contamination**: Client imports types only, not Prisma Client runtime  
✅ **Test Requirements**: Existing test suite validates migration (no new tests needed)

## Project Structure

### Documentation (this feature)

```text
specs/003-prisma-shared/
├── spec.md              # Feature specification
├── plan.md              # This file
├── tasks.md             # Task breakdown
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code (repository root)

```text
packages/
├── shared/
│   ├── prisma/
│   │   └── schema.prisma    # Data model (MOVED from server/prisma)
│   ├── src/
│   │   ├── index.ts         # Main exports (UPDATE)
│   │   ├── prisma.ts        # Prisma client export (NEW)
│   │   ├── types.ts         # Re-export generated types (UPDATE)
│   │   ├── utils.ts         # Utility functions (UNCHANGED)
│   │   └── generated/       # Auto-generated Zod schemas (NEW)
│   │       └── index.ts
│   └── package.json         # Add Prisma dependencies (UPDATE)
├── server/
│   ├── db/
│   │   ├── dev.db           # SQLite database file (MOVED from prisma/prisma/)
│   │   ├── seed.ts          # Database seed script (MOVED from prisma/)
│   │   └── constants.ts     # Seed constants (MOVED from prisma/)
│   ├── src/
│   │   ├── context.ts       # Update imports (UPDATE)
│   │   └── middleware/
│   │       └── autoLogin.ts # Update imports (UPDATE)
│   └── package.json         # Keep Prisma CLI, update scripts (UPDATE)
└── client/
    └── src/                 # No changes - imports from @carton/shared unchanged
```

**Structure Decision**: Monorepo with npm workspaces. Prisma schema moves to shared package (data model is shared concern). Database operations (seed, migrations, db file) stay in server under `db/` folder. Server imports Prisma Client from shared. Client continues importing types from shared (no change to client imports).

## Complexity Tracking

> No constitution violations - this change aligns with updated constitution v1.1.0

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| Prisma location | `packages/shared/prisma/` | Data model is shared concern affecting all packages |
| Generated output | `packages/shared/src/generated/` | Keeps generated code separate from manual code |
| Zod generator | `zod-prisma-types` | Well-maintained, generates complete Zod schemas for models and enums |
