# Implementation Plan: Like and Dislike Buttons

**Branch**: `001-case-voting` | **Date**: 2025-01-30 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-case-voting/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Add like and dislike voting functionality to cases in the case management system. Users can vote on cases with a single click, see aggregated vote counts, change their votes, and remove votes. The feature uses optimistic UI updates for immediate feedback, with Prisma for database operations, tRPC for type-safe API contracts, and React Query for cache management. Vote data is stored in a new `CaseVote` table with a unique constraint ensuring one vote per user per case.

## Technical Context

**Language/Version**: TypeScript 5.7.2, Node.js (server), React (client)  
**Primary Dependencies**: 
  - tRPC (JSON-RPC 2.0) for type-safe API layer
  - Prisma 6.1.0 ORM with SQLite database
  - React Query (@tanstack/react-query) for state management and caching
  - Zod 3.23.8 for validation schemas
  - Shadcn UI for component library
  - Vite for client build tooling
  
**Storage**: SQLite database via Prisma ORM  
**Testing**: Vitest (unit/integration), Playwright (E2E), MSW for API mocking  
**Target Platform**: Web application (monorepo with client/server/shared packages)  
**Project Type**: Web (Full-stack TypeScript monorepo with npm workspaces)  
**Performance Goals**: <200ms UI response time (optimistic updates), support for concurrent voting without data loss  
**Constraints**: 
  - Type safety end-to-end (no `any` types)
  - One vote per user per case (enforced via unique constraint)
  - Optimistic UI updates for perceived immediacy
  - API contract integrity via tRPC
  
**Scale/Scope**: Small to medium case management system, hundreds of concurrent users, thousands of cases with voting

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Type Safety First ✓
- **Status**: PASS
- **Validation**: 
  - Prisma schema defines `CaseVote` model with proper types
  - Zod schemas auto-generated from Prisma via `zod-prisma-types`
  - tRPC ensures compile-time type safety between client and server
  - No `any` types required for this feature
  - Vote type will be a Prisma enum (`LIKE`, `DISLIKE`)

### II. API Contract Integrity ✓
- **Status**: PASS
- **Validation**: 
  - New tRPC routes in `packages/server/src/router.ts` under `case.vote` namespace
  - Zod input schemas for vote operations (create, remove, toggle)
  - Shared types exported from `packages/shared/src/types.ts`
  - Breaking change protocol: This is a new feature, no breaking changes to existing APIs

### III. Test-Informed Development ✓
- **Status**: PASS (REQUIRED)
- **Validation**: 
  - Unit tests for tRPC vote procedures (Vitest)
  - Integration tests for concurrent voting scenarios
  - E2E tests for voting interactions (Playwright)
  - Component tests for VoteButtons component with MSW mocking
  - Business logic tests for vote toggle behavior

### IV. Component Development Standards ✓
- **Status**: PASS (REQUIRED)
- **Validation**: 
  - Use existing Shadcn UI Button component from `packages/client/src/ui/`
  - Check for ThumbsUp/ThumbsDown icons in existing icon library
  - Create VoteButtons component with Storybook stories
  - Stories demonstrate all states: unvoted, liked, disliked, loading, disabled
  - WCAG 2.1 AA compliance (keyboard navigation, aria-labels)

### V. E2E Testing for User Flows ✓
- **Status**: PASS (REQUIRED)
- **Validation**: 
  - Happy path: User logs in, views case, clicks like, sees count increase
  - Vote change flow: User likes, then clicks dislike, sees counts update
  - Vote removal: User likes, clicks like again, sees count decrease
  - Persistence: User votes, refreshes page, sees vote persisted
  - Unauthenticated: User not logged in sees disabled/hidden buttons

### Architecture Compliance ✓
- **Status**: PASS
- **Validation**: 
  - Data model in `packages/shared/prisma/schema.prisma` (STRICTLY ENFORCED)
  - Vote types (VoteType enum) in shared types
  - Server imports Prisma Client from `@carton/shared`
  - Client imports tRPC types from shared
  - No cross-package contamination (client doesn't import from server)

### Code Quality ✓
- **Status**: PASS
- **Validation**: 
  - ESLint compliance with project configuration
  - Prettier formatting enforced
  - TypeScript strict mode enabled
  - Absolute imports for better refactoring

### Performance & Security ✓
- **Status**: PASS
- **Validation**: 
  - All inputs validated with Zod schemas
  - Prisma ORM prevents SQL injection
  - Authentication required for voting (ctx.userId check)
  - Unique constraint prevents duplicate votes
  - Optimistic updates for perceived <200ms response time

**Overall Gate Status**: ✅ PASS - All constitutional requirements met, no violations to justify

## Project Structure

### Documentation (this feature)

```text
specs/001-case-voting/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   ├── vote-api.md      # tRPC API contract documentation
│   └── vote-types.md    # Type definitions and schemas
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Monorepo structure with npm workspaces
packages/
├── shared/
│   ├── prisma/
│   │   └── schema.prisma           # ADD: CaseVote model, VoteType enum
│   └── src/
│       ├── generated/              # AUTO-GENERATED: Zod schemas from Prisma
│       │   └── index.ts            # MODIFIED: New vote-related schemas
│       ├── types.ts                # ADD: Vote type exports, helper constants
│       └── index.ts                # MODIFIED: Export vote types
│
├── server/
│   ├── src/
│   │   ├── router.ts               # MODIFY: Add case.vote routes
│   │   └── router.test.ts          # ADD: Vote endpoint tests
│   └── db/
│       └── seed.ts                 # MODIFY: Add sample vote data
│
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── VoteButtons/        # NEW COMPONENT
    │   │   │   ├── index.ts
    │   │   │   ├── VoteButtons.tsx
    │   │   │   ├── VoteButtons.test.tsx
    │   │   │   └── VoteButtons.stories.tsx
    │   │   ├── CaseDetails/
    │   │   │   └── CaseDetails.tsx # MODIFY: Add VoteButtons
    │   │   └── CaseList/
    │   │       └── CaseListItem.tsx # MODIFY: Display vote counts
    │   └── ui/                      # USE EXISTING: Button, icons
    │
    └── tests/
        └── e2e/
            └── voting.spec.ts       # NEW: E2E tests for voting flows

tests/
└── e2e/
    └── voting.spec.ts               # NEW: E2E voting integration tests
```

**Structure Decision**: This is a web application monorepo following the existing npm workspaces pattern. The voting feature integrates into the existing `Case` entity and adds a new `CaseVote` relation. All new data models are defined in the shared Prisma schema, API contracts in the server router, and UI components in the client package. The structure maintains strict package boundaries (client → shared ← server) as required by the constitution.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**No violations identified** - All constitutional requirements are met without exceptions. This feature aligns perfectly with existing architectural patterns and development standards.
