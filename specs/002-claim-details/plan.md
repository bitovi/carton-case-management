# Implementation Plan: Claim Details Component

**Branch**: `002-claim-details` | **Date**: December 24, 2025 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-claim-details/spec.md`

## Summary

Implement a comprehensive claim details view component that displays insurance claim information including header details, case description, essential metadata, and a comment system with history. The component will fetch data from a Prisma-backed database via tRPC and render according to the Figma design specifications. This is a read-heavy feature with one write operation (adding comments).

## Technical Context

**Language/Version**: TypeScript 5.7+, Node.js (via monorepo setup)  
**Primary Dependencies**: 
- Frontend: React 18+, tRPC client, TanStack Query (React Query), Vite
- Backend: tRPC server, Prisma ORM, Zod validation
- Shared: Zod schemas, TypeScript types
- UI: Existing component library (Button, Card components detected in codebase)

**Storage**: SQLite (Prisma) - development database reset supported  
**Testing**: 
- Unit: Vitest (for utilities, business logic)
- Integration: tRPC router tests (Vitest)
- E2E: Playwright (for user flows)
- Component: Storybook stories required

**Target Platform**: Web (desktop-focused responsive design)  
**Project Type**: Monorepo with separate client, server, and shared packages  
**Performance Goals**: 
- Page load <2 seconds for claims with up to 50 comments
- tRPC query response <500ms for claim details
- Status identification <2 seconds (per success criteria)

**Constraints**: 
- Must maintain tRPC type safety end-to-end
- No direct database access from client
- All types must originate from Prisma schema
- Development mode allows database reset/re-seed

**Scale/Scope**: 
- Single page component
- 3 new tRPC procedures (getClaim, getClaimsList, addComment)
- Prisma schema updates (Comment model, Case model extensions)
- 8 new React components with Storybook stories

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ Type Safety First - PASS
- Prisma schema as source of truth for data models
- All types flow through packages/shared/src/types.ts
- tRPC ensures end-to-end type safety
- Zod schemas for runtime validation
- No any types permitted

### ✅ API Contract Integrity (NON-NEGOTIABLE) - PASS
- All new endpoints defined in packages/server/src/router.ts
- Zod schemas define contracts before implementation
- Shared types updated simultaneously with API changes
- Integration tests for all new tRPC procedures

### ✅ Test-Informed Development (NON-NEGOTIABLE) - PASS
- Unit tests for utility functions (date formatting, initials generation)
- Integration tests for tRPC procedures
- E2E test for viewing claim details page (minimum 1 test)
- Storybook stories for all new components

### ✅ Component Development Standards - PASS
- All components will have .stories.tsx files
- Stories demonstrate all variants (loading, empty, error, populated states)
- Components designed for isolation with prop-based data

### ✅ E2E Testing for User Flows - PASS
- Minimum 1 E2E test covering the happy path
- Test location: tests/e2e/claim-details.spec.ts

### ✅ Architecture Compliance - PASS
- Monorepo structure maintained
- Client imports only from shared, never from server
- All data models in Prisma schema
- Development database reset strategy (acceptable per user requirements)

**Final Gate Result**: ✅ PASS - All constitutional requirements satisfied

## Project Structure

### Documentation (this feature)

```
specs/002-claim-details/
├── spec.md              # Feature specification (COMPLETE)
├── plan.md              # This file (IN PROGRESS)
├── research.md          # Phase 0 output (PENDING)
├── data-model.md        # Phase 1 output (PENDING)
├── quickstart.md        # Phase 1 output (PENDING)
└── contracts/           # Phase 1 output (PENDING)
```

### Source Code (repository root)

```
packages/
├── shared/src/
│   ├── types.ts         # [MODIFY] Add Claim, Comment, ClaimStatus types
│   └── schemas.ts       # [NEW] Zod schemas for API validation
├── server/
│   ├── prisma/
│   │   ├── schema.prisma # [MODIFY] Add Comment model, update Case
│   │   └── seed.ts       # [MODIFY] Add seed data
│   └── src/
│       ├── router.ts     # [MODIFY] Add claim procedures
│       └── services/
│           └── claim.service.ts # [NEW] Business logic
└── client/src/
    ├── pages/
    │   ├── ClaimDetailsPage.tsx
    │   ├── ClaimDetailsPage.stories.tsx
    │   └── ClaimDetailsPage.test.tsx
    ├── components/claim/
    │   ├── ClaimHeader.tsx (+ .stories.tsx)
    │   ├── StatusBadge.tsx (+ .stories.tsx)
    │   ├── ClaimDescription.tsx (+ .stories.tsx)
    │   ├── CommentList.tsx (+ .stories.tsx)
    │   ├── CommentItem.tsx (+ .stories.tsx)
    │   ├── CommentInput.tsx (+ .stories.tsx)
    │   ├── EssentialDetails.tsx (+ .stories.tsx)
    │   └── ClaimSidebar.tsx (+ .stories.tsx)
    └── lib/utils/
        ├── date.ts (+ .test.ts)
        └── avatar.ts (+ .test.ts)

tests/e2e/
└── claim-details.spec.ts # [NEW] E2E test
```

**Structure Decision**: Using existing monorepo structure. All new components follow the established pattern of co-locating components with tests and stories. Shared types in shared package maintain type safety across the stack.

## Complexity Tracking

No constitutional violations detected. No complexity justifications required.
