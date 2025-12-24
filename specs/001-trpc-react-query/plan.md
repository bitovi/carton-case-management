# Implementation Plan: tRPC React Query Integration

**Branch**: `001-trpc-react-query` | **Date**: 2025-12-24 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-trpc-react-query/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

**Current State**: The project already has `@tanstack/react-query` v5.62.14 and `@trpc/react-query` v11.0.0 installed and fully integrated. The tRPC client uses React Query for state management, caching, and query orchestration.

**Primary Requirement**: Ensure the existing tRPC + React Query integration provides automatic request caching, clear loading/error feedback, and comprehensive developer documentation with test examples.

**Technical Approach**: Audit existing implementation to verify it meets all functional requirements, enhance documentation with concrete examples, update tests to demonstrate best practices, and add React Query DevTools for development debugging.

## Technical Context

**Language/Version**: TypeScript 5.x / Node.js 22+  
**Primary Dependencies**: React 18, tRPC 11, @tanstack/react-query 5, Vite 6, Prisma (ORM)  
**Storage**: SQLite (via Prisma ORM)  
**Testing**: Vitest (unit/integration), Playwright (E2E), Testing Library (React components), MSW (API mocking)  
**Target Platform**: Web application (browser), Devcontainer (Linux/Debian)
**Project Type**: Web monorepo (client + server packages)  
**Performance Goals**: <100ms cache retrieval, <50ms loading indicator display, <200ms API response p95  
**Constraints**: Type-safe end-to-end (Prisma -> tRPC -> React), no `any` types, all tests must pass  
**Scale/Scope**: Small-to-medium case management application, 10-50 screens, multi-user collaboration

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Type Safety First ✅

- TypeScript strict mode enabled across all packages
- tRPC provides end-to-end type safety from Prisma schema to React components
- React Query hooks maintain full type inference through tRPC
- No violations detected

### API Contract Integrity ✅

- tRPC router is source of truth for API contracts
- Changes to router automatically propagate types to client
- Existing implementation maintains contract integrity
- No violations detected

### Test-Informed Development ⚠️

- **ACTION REQUIRED**: Current tests need enhancement to demonstrate React Query patterns
- Unit tests exist but may need updates to show best practices for testing cached queries
- E2E tests exist but may need verification for cache behavior
- **Minor Gap**: Test documentation/examples needed

### Component Development Standards ✅

- Storybook configured and in use
- TrpcProvider wrapper exists for component isolation
- No violations detected

### E2E Testing for User Flows ✅

- Playwright configured for E2E tests
- Test structure in place
- No violations detected

**Overall Status**: ✅ PASS with minor documentation enhancement needed  
**Blockers**: None - existing implementation is constitution-compliant  
**Action Items**: Enhance test examples and documentation (non-blocking)

## Project Structure

### Documentation (this feature)

```text
specs/001-trpc-react-query/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (created below)
├── data-model.md        # Phase 1 output (created below)
├── quickstart.md        # Phase 1 output (created below)
├── contracts/           # Phase 1 output (created below)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
packages/
├── client/              # React frontend
│   ├── src/
│   │   ├── lib/
│   │   │   └── trpc.tsx           # tRPC + React Query setup (EXISTING)
│   │   ├── pages/
│   │   │   ├── HomePage.tsx       # Example using trpc.*.useQuery() (EXISTING)
│   │   │   ├── HomePage.test.tsx  # Unit tests (TO UPDATE)
│   │   │   └── HomePage.stories.tsx # Storybook stories (EXISTING)
│   │   └── components/
│   │       └── ui/                # Shadcn UI components
│   ├── package.json               # Dependencies already include react-query
│   └── vite.config.ts
│
├── server/              # Node.js backend
│   ├── src/
│   │   ├── router.ts              # tRPC router definitions (EXISTING)
│   │   ├── router.test.ts         # API contract tests (EXISTING)
│   │   └── trpc.ts                # tRPC server setup (EXISTING)
│   └── prisma/
│       └── schema.prisma          # Data model source of truth
│
├── shared/              # Shared types
│   └── src/
│       └── types.ts               # Shared type definitions
│
tests/
└── e2e/
    └── home.spec.ts              # Playwright E2E tests (TO UPDATE)

README.md                         # Main documentation (TO UPDATE)
```

**Structure Decision**: Web monorepo with three packages (client, server, shared) using npm workspaces. This structure is already established and follows the constitution's architecture compliance requirements. No structural changes needed - only documentation and test enhancements.

## Phase 0: Research ✅ Complete

See [research.md](research.md) for complete findings.

**Summary**: The project already has tRPC + React Query fully integrated. Research identified:

- Packages installed and working
- Test patterns need improvement (use QueryClient wrapper instead of direct mocking)
- Documentation gaps in README
- React Query DevTools not yet added
- All technical decisions documented with rationales

**Outcome**: No blockers found. All "NEEDS CLARIFICATION" items resolved.

---

## Phase 1: Design & Contracts ✅ Complete

Deliverables created:

1. **[data-model.md](data-model.md)**: Test infrastructure entities, component patterns, cache configuration
2. **[contracts/](contracts/)**: Code examples for queries, mutations, and testing
   - [query-example.tsx](contracts/query-example.tsx) - Query patterns
   - [mutation-example.tsx](contracts/mutation-example.tsx) - Mutation patterns
   - [test-example.test.tsx](contracts/test-example.test.tsx) - Testing patterns
3. **[quickstart.md](quickstart.md)**: Developer onboarding guide

**Constitution Re-check**: ✅ PASS - All implementation designs follow type safety, testing, and API contract requirements.

---

## Phase 2: Task Breakdown

**NOT CREATED BY THIS COMMAND**. Run `/speckit.tasks` to generate task breakdown based on this plan.

The next step is to create implementation tasks from the research and design artifacts.
