# Implementation Plan: Case Details View

All technology choices validated against existing stack. No NEEDS CLARIFICATION items remain. Ready to proceed to Phase 1 (Data Model & Contracts).## SummaryNone - all technical unknowns resolved.## Open Questions**Status**: ✅ Approved - Follows constitution- Only unit tests: Misses integration issues- Only E2E tests: Slow feedback, hard to debug**Alternatives considered**:4. **E2E**: Navigate to case, view details, add comment3. **Storybook**: Visual regression testing via Chromatic (optional)2. **Integration**: tRPC procedures (cases.list, cases.getById, cases.addComment)1. **Unit**: Comment formatting, date utilities**Test Coverage**:- E2E tests: Full user flow (Playwright)- Integration tests: tRPC router, API contracts (Vitest)- Unit tests: Component logic, utilities (Vitest)**Rationale**:### Decision: Three-Level Testing Pyramid## Testing Strategy**Status**: ✅ Approved - Balances performance and complexity- Server-side rendering: Unnecessary complexity for MVP- Load all data upfront: Slower initial load**Alternatives considered**:- Virtualize sidebar list if cases exceed 100- Paginate comments if count exceeds 50- Use `staleTime` to prevent excessive refetching**Optimization Strategy**:- Optimistic UI updates for comments- Prefetch adjacent cases on hover- Lazy load case details on selection- Load case list immediately (lightweight)**Rationale**:### Decision: Progressive Enhancement with React Query## Performance Optimization**Status**: ✅ Approved - Constitutional requirement- No accessibility: Violates constitution- AAA compliance: More stringent, not required**Alternatives considered**:- Color contrast meets AA standards- Form inputs properly labeled- Sidebar navigation keyboard accessible- Comments list has role="feed" for screen readers**Key Requirements**:- Focus management for sidebar navigation- Keyboard navigation support- ARIA labels for interactive elements- Semantic HTML elements (article, section, aside)- Constitution requires accessibility standards**Rationale**:### Decision: WCAG 2.1 AA Compliance## Accessibility Considerations**Status**: ✅ Approved - Meets requirements- Client-only routing without URL: Breaks browser back button- Separate route /cases/:id: Contradicts "base route" requirement**Alternatives considered**:`/?caseId={id} - Specific case details/ - Case details page (default to first case)`**Route Structure**:- Enables deep linking and browser history- Default to first case if no caseId provided- Use URL query params for selected case: `/?caseId=123`- Requirement specifies "load on the base route"**Rationale**:### Decision: Base Route (/) for Case Details## Routing Strategy**Status**: ✅ Approved - Leverages existing integration- Zustand: Unnecessary when React Query handles server state- Redux Toolkit: Over-engineering for this feature- Context API: Manual cache management, more boilerplate**Alternatives considered**:- Invalidate `cases.getById` after adding comment- `cases.getById` - individual case details with comments- `cases.list` - cached list of all cases**Query Keys Strategy**:- No additional state library needed- Optimistic updates for comment submission- Automatic caching, refetching, and background updates- Already integrated in project via tRPC**Rationale**:### Decision: TanStack Query (React Query) via tRPC## State Management**Status**: ✅ Approved - Standard Prisma pattern- Mock service worker: Disconnects from real database behavior- Fixtures in tests only: Makes manual dev testing harder**Alternatives considered**:- 15-20 Comments (distributed across cases)- 5 Cases (various statuses and types matching Figma)- 2 Users (case worker profiles)**Seed Data Structure**:- Use faker or realistic manual data- Include 2-5 comments per case for realistic timelines- Create 5-10 cases with varied data for manual testing- Prisma seed.ts provides database-agnostic seeding**Rationale**:### Decision: Prisma Seed Script with Realistic Data## Data Seeding Strategy**Status**: ✅ Approved - Balances reusability and complexity- Over-segmentation into atoms: Premature abstraction- Single monolithic component: Hard to test and maintain**Alternatives considered**:`    └── EssentialDetailsPanel (molecule)    ├── AddCommentForm (molecule)    │   └── CommentItem (molecule) × N    ├── CommentsList (organism)    ├── CaseDescription (molecule)    ├── CaseHeader (molecule)├── CaseDetailsView (organism)│   └── CaseListItem (molecule) × N├── CaseSidebar (organism)CaseDetailsPage (page/template)`text**Component Hierarchy**:- Enables incremental development and testing- Follows Shadcn UI patterns for consistency- Each component testable in Storybook isolation- Break UI into composable components (atoms, molecules, organisms)**Rationale**:### Decision: Atomic Design with Storybook Isolation## Component Architecture**Status**: ✅ Approved - Aligns with constitution- GraphQL mutations: Unnecessary complexity for simple CRUD- REST endpoints: More boilerplate, loses type safety**Alternatives considered**:`- cases.addComment({ caseId: string, content: string }) -> Comment// Mutation procedures (write)- cases.getComments(caseId: string) -> Comment[]- cases.getById(id: string) -> Case with comments- cases.list() -> Case[]// Query procedures (read)`typescript**Required Endpoints**:- Follows project constitution requirements- React Query integration for caching and optimistic updates- Zod schemas validate input at runtime- tRPC procedures provide type-safe RPC-style API**Rationale**:### Decision: tRPC Procedures with Zod Validation## API Design Patterns**Status**: ✅ Approved - Standard relational design- Separate comment service: Over-engineering for MVP- Store comments as JSON in Case table: Loses queryability and relationships**Alternatives considered**:`}  comments Comment[]  // ... existing fieldsmodel User {// Add to User model:}  comments Comment[]  // ... existing fieldsmodel Case {// Add to Case model:}  author User @relation(fields: [authorId], references: [id])  case   Case @relation(fields: [caseId], references: [id], onDelete: Cascade)  updatedAt DateTime @updatedAt  createdAt DateTime @default(now())  authorId  String  caseId    String  content   String  id        String   @id @default(uuid())model Comment {`prisma**Required Schema Changes**:- Need createdAt timestamp for chronological ordering- Comments need relationship to parent Case- Comments need author relationship to User- Current schema has Case and User models but missing Comment model**Rationale**:### Decision: Extend Prisma Schema with Comments## Data Model Requirements**Status**: ✅ Confirmed - Existing stack matches requirements- Direct database access from client: Violates security, not web-safe- GraphQL: Adds complexity, tRPC simpler for TypeScript monorepos- REST API with OpenAPI: More verbose, loses TypeScript integration**Alternatives considered**: - Prisma generates type-safe database client from schema- tRPC provides zero-overhead API layer with automatic TypeScript types- Type safety end-to-end from database to UI- Project is already using React 19, tRPC 11, and Prisma**Rationale**: ### Decision: React 19 + tRPC + Prisma Stack## Technology Stack ValidationThis document resolves technical unknowns and documents technology choices for implementing the case details view feature.## Research Summary**Branch**: `001-case-details`**Feature**: Case Details View **Date**: December 24, 2025 **Branch**: `001-case-details` | **Date**: December 24, 2025 | **Spec**: [spec.md](spec.md)  
**Input**: Feature specification from `/specs/001-case-details/spec.md`

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
specs/001-case-details/
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

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |
