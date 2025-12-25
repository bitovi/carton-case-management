# Research: Case Details View

**Date**: December 24, 2025  
**Feature**: Case Details View  
**Branch**: `002-case-details`

## Research Summary

This document resolves technical unknowns and documents technology choices for implementing the case details view feature.

## Technology Stack Validation

### Decision: React 19 + tRPC + Prisma Stack
**Rationale**: 
- Project is already using React 19, tRPC 11, and Prisma
- Type safety end-to-end from database to UI
- tRPC provides zero-overhead API layer with automatic TypeScript types
- Prisma generates type-safe database client from schema

**Alternatives considered**: 
- REST API with OpenAPI: More verbose, loses TypeScript integration
- GraphQL: Adds complexity, tRPC simpler for TypeScript monorepos
- Direct database access from client: Violates security, not web-safe

**Status**: ✅ Confirmed - Existing stack matches requirements

## Data Model Requirements

### Decision: Extend Prisma Schema with Comments
**Rationale**:
- Current schema has Case and User models but missing Comment model
- Comments need author relationship to User
- Comments need relationship to parent Case
- Need createdAt timestamp for chronological ordering

**Required Schema Changes**:
```prisma
model Comment {
  id        String   @id @default(uuid())
  content   String
  caseId    String
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  case   Case @relation(fields: [caseId], references: [id], onDelete: Cascade)
  author User @relation(fields: [authorId], references: [id])
}

// Add to Case model:
model Case {
  // ... existing fields
  comments Comment[]
}

// Add to User model:
model User {
  // ... existing fields
  comments Comment[]
}
```

**Alternatives considered**:
- Store comments as JSON in Case table: Loses queryability and relationships
- Separate comment service: Over-engineering for MVP

**Status**: ✅ Approved - Standard relational design

## API Design Patterns

### Decision: tRPC Procedures with Zod Validation
**Rationale**:
- tRPC procedures provide type-safe RPC-style API
- Zod schemas validate input at runtime
- React Query integration for caching and optimistic updates
- Follows project constitution requirements

**Required Endpoints**:
```typescript
// Query procedures (read)
- cases.list() -> Case[]
- cases.getById(id: string) -> Case with comments
- cases.getComments(caseId: string) -> Comment[]

// Mutation procedures (write)
- cases.addComment({ caseId: string, content: string }) -> Comment
```

**Alternatives considered**:
- REST endpoints: More boilerplate, loses type safety
- GraphQL mutations: Unnecessary complexity for simple CRUD

**Status**: ✅ Approved - Aligns with constitution

## Component Architecture

### Decision: Atomic Design with Storybook Isolation
**Rationale**:
- Break UI into composable components (atoms, molecules, organisms)
- Each component testable in Storybook isolation
- Follows Shadcn UI patterns for consistency
- Enables incremental development and testing

**Component Hierarchy**:
```text
CaseDetailsPage (page/template)
├── CaseSidebar (organism)
│   └── CaseListItem (molecule) × N
├── CaseDetailsView (organism)
    ├── CaseHeader (molecule)
    ├── CaseDescription (molecule)
    ├── CommentsList (organism)
    │   └── CommentItem (molecule) × N
    ├── AddCommentForm (molecule)
    └── EssentialDetailsPanel (molecule)
```

**Alternatives considered**:
- Single monolithic component: Hard to test and maintain
- Over-segmentation into atoms: Premature abstraction

**Status**: ✅ Approved - Balances reusability and complexity

## Data Seeding Strategy

### Decision: Prisma Seed Script with Realistic Data
**Rationale**:
- Prisma seed.ts provides database-agnostic seeding
- Create 5-10 cases with varied data for manual testing
- Include 2-5 comments per case for realistic timelines
- Use faker or realistic manual data

**Seed Data Structure**:
- 2 Users (case worker profiles)
- 5 Cases (various statuses and types matching Figma)
- 15-20 Comments (distributed across cases)

**Alternatives considered**:
- Fixtures in tests only: Makes manual dev testing harder
- Mock service worker: Disconnects from real database behavior

**Status**: ✅ Approved - Standard Prisma pattern

## State Management

### Decision: TanStack Query (React Query) via tRPC
**Rationale**:
- Already integrated in project via tRPC
- Automatic caching, refetching, and background updates
- Optimistic updates for comment submission
- No additional state library needed

**Query Keys Strategy**:
- `cases.list` - cached list of all cases
- `cases.getById` - individual case details with comments
- Invalidate `cases.getById` after adding comment

**Alternatives considered**:
- Context API: Manual cache management, more boilerplate
- Redux Toolkit: Over-engineering for this feature
- Zustand: Unnecessary when React Query handles server state

**Status**: ✅ Approved - Leverages existing integration

## Routing Strategy

### Decision: Base Route (/) for Case Details
**Rationale**:
- Requirement specifies "load on the base route"
- Use URL query params for selected case: `/?caseId=123`
- Default to first case if no caseId provided
- Enables deep linking and browser history

**Route Structure**:
```
/ - Case details page (default to first case)
/?caseId={id} - Specific case details
```

**Alternatives considered**:
- Separate route /cases/:id: Contradicts "base route" requirement
- Client-only routing without URL: Breaks browser back button

**Status**: ✅ Approved - Meets requirements

## Accessibility Considerations

### Decision: WCAG 2.1 AA Compliance
**Rationale**:
- Constitution requires accessibility standards
- Semantic HTML elements (article, section, aside)
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus management for sidebar navigation

**Key Requirements**:
- Comments list has role="feed" for screen readers
- Sidebar navigation keyboard accessible
- Form inputs properly labeled
- Color contrast meets AA standards

**Alternatives considered**:
- AAA compliance: More stringent, not required
- No accessibility: Violates constitution

**Status**: ✅ Approved - Constitutional requirement

## Performance Optimization

### Decision: Progressive Enhancement with React Query
**Rationale**:
- Load case list immediately (lightweight)
- Lazy load case details on selection
- Prefetch adjacent cases on hover
- Optimistic UI updates for comments

**Optimization Strategy**:
- Use `staleTime` to prevent excessive refetching
- Paginate comments if count exceeds 50
- Virtualize sidebar list if cases exceed 100

**Alternatives considered**:
- Load all data upfront: Slower initial load
- Server-side rendering: Unnecessary complexity for MVP

**Status**: ✅ Approved - Balances performance and complexity

## Testing Strategy

### Decision: Three-Level Testing Pyramid
**Rationale**:
- Unit tests: Component logic, utilities (Vitest)
- Integration tests: tRPC router, API contracts (Vitest)
- E2E tests: Full user flow (Playwright)

**Test Coverage**:
1. **Unit**: Comment formatting, date utilities
2. **Integration**: tRPC procedures (cases.list, cases.getById, cases.addComment)
3. **Storybook**: Visual regression testing via Chromatic (optional)
4. **E2E**: Navigate to case, view details, add comment

**Alternatives considered**:
- Only E2E tests: Slow feedback, hard to debug
- Only unit tests: Misses integration issues

**Status**: ✅ Approved - Follows constitution

## Open Questions

None - all technical unknowns resolved.

## Summary

All technology choices validated against existing stack. No NEEDS CLARIFICATION items remain. Ready to proceed to Phase 1 (Data Model & Contracts).
