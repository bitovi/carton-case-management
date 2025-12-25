# Implementation Plan: Case Details View

**Branch**: `002-case-details` | **Date**: December 24, 2025 | **Spec**: [spec.md](spec.md)  
**Input**: Feature specification from `/specs/002-case-details/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a case details view component that displays complete case information including header (case type and ID), description, comments timeline, and essential metadata (customer name, date opened, assigned user, last updated). The view will be accessible on the base route with a sidebar for case navigation. Data will be seeded in Prisma database, served through tRPC endpoints in the server package, and consumed by the client via tRPC React Query integration.

## Technical Context

**Language/Version**: TypeScript 5.7.2, Node.js 24  
**Primary Dependencies**: React 19, tRPC 11, Prisma ORM, Vite, TanStack Query, Tailwind CSS, Shadcn UI  
**Storage**: SQLite via Prisma (dev), Prisma schema is source of truth  
**Testing**: Vitest (unit/integration), Playwright (E2E), Storybook (component isolation)  
**Target Platform**: Web application (monorepo: client + server packages)  
**Project Type**: Web application with separate frontend/backend packages  
**Performance Goals**: <1s initial case load, <2s comment submission, smooth navigation between cases  
**Constraints**: Type-safe end-to-end (Prisma → tRPC → React Query), strict TypeScript, no `any` types  
**Scale/Scope**: Initial MVP with ~5-10 seed cases, designed to scale to 100+ cases per user

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

✅ **Type Safety First**: All code will use strict TypeScript, Prisma-generated types, tRPC for API contracts, Zod for validation  
✅ **API Contract Integrity**: tRPC router as source of truth, shared types in packages/shared, Zod schemas define contracts  
✅ **Test-Informed Development**: Unit tests for utilities/services, tRPC integration tests, Playwright E2E for case details page  
✅ **Component Development Standards**: Storybook stories required for all new components, Shadcn UI patterns, accessibility compliance  
✅ **Architecture Compliance**: Monorepo structure maintained, client imports only from shared, Prisma as data model authority

**Status**: ✅ ALL GATES PASSED - No violations, all requirements align with constitution

## Project Structure

### Documentation (this feature)

```text
specs/002-case-details/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── case-api.yaml    # tRPC endpoint contracts
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
packages/
├── client/
│   └── src/
│       ├── components/
│       │   └── case-details/
│       │       ├── CaseDetailsView.tsx
│       │       ├── CaseDetailsView.stories.tsx
│       │       ├── CaseHeader.tsx
│       │       ├── CaseHeader.stories.tsx
│       │       ├── CaseDescription.tsx
│       │       ├── CaseDescription.stories.tsx
│       │       ├── CommentsList.tsx
│       │       ├── CommentsList.stories.tsx
│       │       ├── CommentItem.tsx
│       │       ├── CommentItem.stories.tsx
│       │       ├── AddCommentForm.tsx
│       │       ├── AddCommentForm.stories.tsx
│       │       ├── EssentialDetailsPanel.tsx
│       │       ├── EssentialDetailsPanel.stories.tsx
│       │       ├── CaseSidebar.tsx
│       │       └── CaseSidebar.stories.tsx
│       └── pages/
│           └── CaseDetailsPage.tsx
│           └── CaseDetailsPage.stories.tsx
│
├── server/
│   ├── prisma/
│   │   ├── schema.prisma        # Updated with Case, Comment models
│   │   └── seed.ts              # Seed data for cases and comments
│   └── src/
│       ├── router.ts            # tRPC router with case endpoints
│       └── router.test.ts       # Integration tests for case API
│
└── shared/
    └── src/
        └── types.ts             # Case, Comment, CaseType types

tests/
└── e2e/
    └── case-details.spec.ts     # E2E test for case details page
```

**Structure Decision**: Web application monorepo structure with three packages (client, server, shared). Client contains React components and pages, server contains Prisma schema and tRPC router, shared contains type definitions and validation schemas. This follows the established project architecture.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed    | Simpler Alternative Rejected Because |
| --------- | ------------- | ------------------------------------ |
| N/A       | No violations | N/A                                  |

---

## Phase 0: Research

See [research.md](research.md) for complete technology research and decisions.

**Key Decisions**:

- ✅ React 19 + tRPC + Prisma stack confirmed
- ✅ Extend Prisma schema with Comment model
- ✅ tRPC procedures with Zod validation
- ✅ Atomic design pattern with Storybook
- ✅ Prisma seed script for test data
- ✅ React Query (via tRPC) for state management
- ✅ Base route (/) with query params for routing
- ✅ WCAG 2.1 AA accessibility compliance
- ✅ Three-level testing pyramid (unit, integration, E2E)

**Status**: ✅ All technical unknowns resolved

---

## Phase 1: Design & Contracts

### Data Model

See [data-model.md](data-model.md) for complete entity definitions and Prisma schema.

**Changes**:

- ✅ New Comment model with caseId, authorId, content, timestamps
- ✅ Updated Case model with caseType, customerName, comments relation
- ✅ Updated User model with comments relation
- ✅ Shared TypeScript interfaces in packages/shared
- ✅ Zod validation schemas for API inputs

### API Contracts

See [contracts/case-api.md](contracts/case-api.md) for complete API documentation.

**Endpoints**:

- ✅ `cases.list` - Query: List all cases
- ✅ `cases.getById` - Query: Get case with comments and relationships
- ✅ `cases.addComment` - Mutation: Add comment to case

**Status**: ✅ All contracts defined with type safety end-to-end

### Implementation Guide

See [quickstart.md](quickstart.md) for step-by-step implementation instructions.

---

## Re-evaluated Constitution Check

_Post-design validation_

✅ **Type Safety First**: Data model uses Prisma types, API uses tRPC, all validated with Zod  
✅ **API Contract Integrity**: tRPC contracts defined, shared types synchronized  
✅ **Test-Informed Development**: Test strategy defined (unit, integration, E2E)  
✅ **Component Development Standards**: Component structure defined with Storybook requirements  
✅ **Architecture Compliance**: Monorepo structure maintained, no violations

**Status**: ✅ ALL GATES STILL PASSED - Design maintains constitutional compliance

---

## Summary

**Planning Complete** - Ready for Phase 2 (Task Breakdown)

**Next Command**: `@speckit.tasks` to generate actionable task list

**Artifacts Generated**:

- ✅ [research.md](research.md) - Technology decisions and rationale
- ✅ [data-model.md](data-model.md) - Database schema and type definitions
- ✅ [contracts/case-api.md](contracts/case-api.md) - API endpoint specifications
- ✅ [quickstart.md](quickstart.md) - Implementation guide

**Branch**: `002-case-details`  
**Spec Directory**: `specs/002-case-details/`
