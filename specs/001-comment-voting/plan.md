# Implementation Plan: Comment Voting System

**Branch**: `001-comment-voting` | **Date**: 2025-01-23 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-comment-voting/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement a like/dislike voting system for case comments with real-time updates, allowing authenticated users to express support or disagreement with comments through thumbs up/down buttons. The system will track vote counts, prevent duplicate votes, support vote changes, and propagate updates to all connected users via tRPC subscriptions or polling. This feature extends the existing Comment model with a new CommentVote entity and integrates with the existing CaseComments component.

## Technical Context

**Language/Version**: TypeScript 5.x with strict mode enabled  
**Primary Dependencies**: 
- Frontend: React 18+, tRPC client v10+, React Query (via tRPC), Lucide React (icons)
- Backend: Node.js 20+, tRPC server v10+, Prisma ORM 5.x
- Shared: Zod (validation), zod-prisma-types (schema generation)

**Storage**: SQLite database via Prisma ORM (schema in `packages/shared/prisma/schema.prisma`)  
**Testing**: 
- Unit/Integration: Vitest (for business logic, components, tRPC routes)
- E2E: Playwright (for user flows)
- Component Stories: Storybook

**Target Platform**: Web application (monorepo with client/server/shared packages)  
**Project Type**: Full-stack web application with monorepo structure  
**Performance Goals**: 
- Vote updates visible within 200ms (optimistic UI)
- Real-time propagation to other users within 2 seconds
- No impact on comment loading performance (within 10% variance)

**Constraints**: 
- Must maintain type safety end-to-end (Prisma → Zod → tRPC → Client)
- Real-time updates implementation: NEEDS CLARIFICATION (WebSocket subscription vs polling)
- All database operations through Prisma (no raw SQL)
- Vote counts must remain accurate during concurrent operations

**Scale/Scope**: 
- Expected usage: Multiple users voting simultaneously on shared comments
- Data volume: One vote record per user per comment (unique constraint required)
- UI Surface: Vote buttons integrated into existing CaseComments component

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Type Safety First ✅
- **Prisma Schema Extension**: Add CommentVote model to `packages/shared/prisma/schema.prisma`
- **Zod Generation**: Auto-generate validation schemas from Prisma using existing `zod-prisma-types` generator
- **Shared Types**: Create `packages/shared/src/vote-types.ts` for vote-related enums and types
- **tRPC Integration**: Type-safe vote endpoints ensuring compile-time contract verification
- **No Type Assertions**: Use Prisma-generated types throughout; avoid `as` casts

**Status**: COMPLIANT - Follows established pattern of schema → Zod → tRPC → Client type flow

### API Contract Integrity ✅
- **New tRPC Router**: Add `commentVote` router to `packages/server/src/router.ts`
- **Schema-First Design**: Define Zod input/output schemas for vote operations
- **Non-Breaking**: Extends existing Comment API without modifying current contracts
- **Shared Types Sync**: Vote-related types in separate `vote-types.ts` file per constitution

**Status**: COMPLIANT - Additive changes only, maintains backward compatibility

### Test-Informed Development ✅
- **Business Logic Tests**: Vitest tests for vote toggle logic, concurrent vote handling
- **Integration Tests**: tRPC router tests for all vote endpoints (create, remove, toggle)
- **Component Tests**: VoteButton component already has tests; extend for voting logic
- **E2E Tests**: Playwright test for complete voting workflow including real-time updates

**Status**: COMPLIANT - Comprehensive test coverage across all layers planned

### Component Development Standards ✅
- **Component Library Usage**: REUSE existing `VoteButton` component from `packages/client/src/components/common/VoteButton` (already built)
- **No New UI Components**: VoteButton already exists with proper Figma integration, stories, and tests
- **Storybook Verification**: Ensure existing VoteButton stories still work after integration
- **Integration Pattern**: Add vote functionality to existing `CaseComments` component

**Status**: COMPLIANT - Leverages existing component library; no custom UI needed

### E2E Testing for User Flows ✅
- **Feature E2E Test**: Create `tests/e2e/comment-voting.spec.ts` for voting workflow
- **Test Coverage**: Happy path (like/dislike/change vote) + concurrent user scenario
- **User-Centric**: Tests written from user perspective using accessible selectors
- **CI Integration**: Tests run with existing Playwright suite

**Status**: COMPLIANT - E2E coverage planned for critical voting flows

### Architecture Compliance ✅
- **Monorepo Structure**: Changes isolated to appropriate packages
  - Shared: Prisma schema, generated types, vote-types.ts
  - Server: tRPC vote router, Prisma vote operations
  - Client: Vote integration in CaseComments component
- **No Cross-Contamination**: Client imports only from shared package
- **Database Operations in Server**: All vote CRUD in server package
- **Shared Types Organization**: Vote types in dedicated `vote-types.ts` file

**Status**: COMPLIANT - Proper package separation maintained

### Gate Status: ✅ APPROVED

All constitutional requirements are met. No violations requiring justification.

**Re-check Required After Phase 1**: Verify real-time update implementation (WebSocket vs polling) maintains performance constraints and type safety.

## Project Structure

### Documentation (this feature)

```text
specs/001-comment-voting/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output: Real-time strategy, concurrent voting approach
├── data-model.md        # Phase 1 output: CommentVote entity, relationships, constraints
├── quickstart.md        # Phase 1 output: Developer guide for voting feature
├── contracts/           # Phase 1 output: API contracts for vote operations
│   └── vote-api.yaml    # OpenAPI/TypeScript definitions for vote endpoints
└── tasks.md             # Phase 2 output: NOT created by /speckit.plan
```

### Source Code (repository root)

```text
packages/
├── shared/
│   ├── prisma/
│   │   └── schema.prisma                    # [MODIFY] Add CommentVote model
│   └── src/
│       ├── generated/
│       │   └── index.ts                     # [AUTO-GENERATED] Zod schemas from Prisma
│       ├── vote-types.ts                    # [NEW] VoteType enum, vote-related types
│       └── index.ts                         # [MODIFY] Export vote types
│
├── server/
│   ├── src/
│   │   ├── router.ts                        # [MODIFY] Add commentVote router
│   │   └── router.test.ts                   # [MODIFY] Add vote router integration tests
│   └── db/
│       └── seed.ts                          # [MODIFY] Add sample vote data
│
└── client/
    └── src/
        ├── components/
        │   ├── common/
        │   │   └── VoteButton/              # [EXISTING] Reuse existing component
        │   │       ├── VoteButton.tsx
        │   │       ├── VoteButton.test.tsx  # [MODIFY] Extend tests
        │   │       └── VoteButton.stories.tsx
        │   └── CaseDetails/
        │       └── components/
        │           └── CaseComments/
        │               ├── CaseComments.tsx      # [MODIFY] Add voting UI
        │               ├── CaseComments.test.tsx # [MODIFY] Add vote interaction tests
        │               └── hooks/
        │                   └── useCommentVoting.ts  # [NEW] Custom hook for vote logic
        └── lib/
            └── trpc.ts                      # [NO CHANGE] Auto-typed from router

tests/
└── e2e/
    └── comment-voting.spec.ts              # [NEW] E2E voting workflow test
```

**Structure Decision**: Monorepo web application pattern
- **Shared Package**: Source of truth for data model (Prisma schema) and shared types
- **Server Package**: API layer (tRPC router) and database operations
- **Client Package**: UI integration with existing components
- **Tests**: E2E tests at root level covering full stack

**Key Principles Applied**:
1. Data model defined in shared (`schema.prisma`)
2. Prisma Client imported from shared by server
3. Zod schemas auto-generated from Prisma
4. Shared types in dedicated file (`vote-types.ts`)
5. Client imports only from shared (not server)

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No constitutional violations identified. All planned changes follow established patterns and comply with project principles.

---

## Phase 0: Research & Technical Decisions

**Objective**: Resolve all "NEEDS CLARIFICATION" items from Technical Context

### Research Tasks

1. **Real-time Update Strategy** (NEEDS CLARIFICATION)
   - **Question**: WebSocket subscriptions vs polling for vote propagation?
   - **Research Focus**: 
     - tRPC subscription support and patterns
     - Polling strategies with React Query
     - Performance implications for both approaches
     - Complexity vs benefit tradeoff
   - **Decision Needed**: Choose implementation approach for SC-002 (2-second update requirement)

2. **Concurrent Vote Handling**
   - **Question**: How to prevent race conditions when multiple users vote simultaneously?
   - **Research Focus**:
     - Prisma unique constraint behavior
     - Database-level vs application-level locking
     - Optimistic locking patterns with Prisma
     - Transaction isolation levels in SQLite
   - **Decision Needed**: Ensure SC-003 (zero vote loss during concurrent operations)

3. **Vote Count Aggregation Strategy**
   - **Question**: Compute counts on-the-fly or maintain denormalized counts?
   - **Research Focus**:
     - Performance of `COUNT()` queries in Prisma
     - Denormalized count fields with triggers/application logic
     - Cache invalidation strategies
     - Read vs write performance tradeoffs
   - **Decision Needed**: Optimize for SC-008 (no performance impact on comment loading)

4. **Optimistic UI Update Patterns**
   - **Question**: Best practices for optimistic mutations with tRPC/React Query?
   - **Research Focus**:
     - React Query optimistic update patterns
     - Rollback strategies on error
     - tRPC mutation patterns with cache updates
     - Temporary ID generation for optimistic updates
   - **Decision Needed**: Achieve SC-001 (200ms feedback) and SC-007 (immediate reflection)

### Research Output Location

`specs/001-comment-voting/research.md` will contain:
- Decision matrix for each research task
- Rationale for chosen approach
- Alternatives considered and why rejected
- Code examples/patterns to follow
- Performance benchmarks if applicable

---

## Phase 1: Design & Contracts

**Prerequisites**: Phase 0 research completed with all decisions documented

### 1.1 Data Model Design

**Output**: `specs/001-comment-voting/data-model.md`

**Entities to Define**:

```prisma
// CommentVote entity (to be added to schema.prisma)
model CommentVote {
  id         String   @id @default(uuid())
  commentId  String
  userId     String
  voteType   VoteType  // LIKE or DISLIKE (enum)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  comment Comment @relation(fields: [commentId], references: [id], onDelete: Cascade)
  user    User    @relation(fields: [userId], references: [id])

  @@unique([commentId, userId])  // One vote per user per comment
  @@index([commentId])           // Fast lookup of votes for a comment
  @@index([userId])              // Fast lookup of user's votes
}

enum VoteType {
  LIKE
  DISLIKE
}

// Update to Comment model
model Comment {
  // ... existing fields ...
  votes CommentVote[]  // One-to-many relationship
}

// Update to User model  
model User {
  // ... existing fields ...
  commentVotes CommentVote[]  // Track user's votes
}
```

**Validation Rules**:
- `commentId` and `userId` must reference existing records
- `voteType` must be LIKE or DISLIKE
- Unique constraint prevents duplicate votes
- Cascade delete when comment is deleted
- Vote remains if user is deleted (maintains count accuracy per edge case)

**State Transitions**:
- No vote → LIKE: Create vote record
- No vote → DISLIKE: Create vote record  
- LIKE → No vote: Delete vote record
- DISLIKE → No vote: Delete vote record
- LIKE → DISLIKE: Update voteType field
- DISLIKE → LIKE: Update voteType field

### 1.2 API Contract Design

**Output**: `specs/001-comment-voting/contracts/vote-api.yaml`

**Endpoints** (tRPC procedures):

```typescript
// commentVote router
{
  // Get votes for a comment (includes user's vote if any)
  getByCommentId: {
    input: { commentId: string }
    output: {
      likes: number
      dislikes: number
      userVote: 'LIKE' | 'DISLIKE' | null
      voters?: { likes: string[], dislikes: string[] }  // Optional voter names
    }
  }

  // Cast or update a vote
  vote: {
    input: { 
      commentId: string
      voteType: 'LIKE' | 'DISLIKE'
    }
    output: CommentVote  // Created or updated vote
  }

  // Remove a vote
  removeVote: {
    input: { commentId: string }
    output: { success: boolean }
  }

  // Subscribe to vote changes for a comment (if WebSocket chosen)
  onVoteChange?: {
    input: { commentId: string }
    output: Stream<{
      likes: number
      dislikes: number
      timestamp: Date
    }>
  }
}
```

**Error Handling**:
- `UNAUTHORIZED`: User not authenticated
- `NOT_FOUND`: Comment doesn't exist
- `BAD_REQUEST`: Invalid vote type
- `CONFLICT`: Concurrent vote update race condition

### 1.3 Integration Points

**Existing API Updates**:

```typescript
// Update case.getById to include vote counts
case.getById: {
  // ... existing fields ...
  comments: {
    // ... existing comment fields ...
    _count: {
      votes: number  // Total votes (optional, depends on research)
    }
    votes: CommentVote[]  // Can be filtered/aggregated client-side
  }
}
```

### 1.4 Developer Quickstart

**Output**: `specs/001-comment-voting/quickstart.md`

Will contain:
- How to add votes to comments programmatically
- How to query vote data via tRPC
- How to integrate VoteButton component
- Testing vote functionality
- Troubleshooting common issues

### 1.5 Agent Context Update

**Action**: Run `.specify/scripts/bash/update-agent-context.sh copilot`

**Updates**:
- Add VoteType enum to technology context
- Add CommentVote entity to data model knowledge
- Add vote router to API surface documentation
- Preserve existing manual additions

---

## Phase 2: Implementation Planning (NOT EXECUTED BY THIS COMMAND)

**Note**: Phase 2 (task generation) is handled by the `/speckit.tasks` command, which is separate from `/speckit.plan`. This plan document concludes after Phase 1.

**Expected Phase 2 Output** (for reference):
- `specs/001-comment-voting/tasks.md`
- Dependency-ordered implementation tasks
- Estimated effort per task
- Testing checkpoints
- Integration milestones

**Suggested Task Sequence** (informational):
1. Schema & types (shared package)
2. Database migration & seed data
3. tRPC vote router (server package)
4. Vote router integration tests
5. Custom hook for vote logic (client)
6. CaseComments integration
7. Component tests
8. E2E tests
9. Real-time update implementation
10. Performance validation

---

## Success Criteria Mapping

| Success Criterion | Implementation Strategy | Validation Method |
|------------------|------------------------|-------------------|
| SC-001: 200ms feedback | Optimistic UI updates via React Query | Performance test in E2E |
| SC-002: 2-second propagation | Real-time updates (research decision) | Multi-user E2E test |
| SC-003: Zero vote loss | Unique constraint + transactions | Concurrent vote integration test |
| SC-004: 1-second visual ID | Active state on VoteButton | Component test |
| SC-005: 95% intuitive | Thumbs up/down icons (existing UX) | Manual usability observation |
| SC-006: Accurate counts | Aggregation strategy (research decision) | Integration tests |
| SC-007: 2-click change | Toggle logic in custom hook | Unit + E2E tests |
| SC-008: No perf impact | Efficient query design | Performance benchmark |

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Real-time updates complex | Medium | Medium | Start with polling, upgrade to WS if needed |
| Concurrent vote race conditions | Medium | High | Unique constraint + proper error handling |
| Performance degradation | Low | Medium | Research phase will benchmark approaches |
| UI integration complexity | Low | Low | VoteButton component already exists |
| Type safety breaks | Very Low | High | Automated Zod generation from Prisma |

---

## Dependencies

**External Dependencies**: None (all tooling already in place)

**Internal Dependencies**:
- Existing VoteButton component (already implemented)
- Current Comment model and tRPC router
- Prisma + zod-prisma-types setup
- React Query via tRPC client

**Blocking Decisions**:
- Phase 0 research must complete before Phase 1 design finalization
- Real-time strategy impacts API contract design

---

## Timeline Estimate

**Phase 0 (Research)**: 4-8 hours
- Real-time strategy research: 2-3 hours
- Concurrent handling patterns: 1-2 hours  
- Performance benchmarking: 1-2 hours
- Documentation: 1 hour

**Phase 1 (Design)**: 4-6 hours
- Data model design: 1 hour
- API contract design: 2-3 hours
- Documentation (quickstart, contracts): 1-2 hours

**Phase 2 (Implementation)**: 16-24 hours (estimated, not executed by this command)
- Backend (schema, router, tests): 6-8 hours
- Frontend (integration, tests): 6-8 hours
- E2E tests: 2-4 hours
- Real-time updates: 2-4 hours

**Total Estimate**: 24-38 hours (design through implementation)

---

## Notes

- **VoteButton Component**: Already exists and matches Figma design. No custom UI work needed.
- **Type Safety**: Entire flow is type-safe via Prisma → Zod → tRPC → Client
- **Backward Compatibility**: All changes are additive; no breaking changes to existing APIs
- **Real-time Implementation**: Flexible approach based on research findings
- **Testing Strategy**: Comprehensive coverage at unit, integration, and E2E levels

---

**Next Command**: Run `/speckit.plan` to execute Phase 0 and Phase 1, generating research.md, data-model.md, contracts/, and quickstart.md files.
