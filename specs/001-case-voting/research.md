# Research: Like and Dislike Buttons

**Feature**: 001-case-voting  
**Date**: 2025-01-30  
**Status**: Complete

## Overview

This document consolidates research findings for implementing like/dislike voting functionality in the case management system. All technical unknowns from the planning phase have been investigated and resolved.

## Research Tasks

### 1. Optimistic UI Updates with tRPC and React Query

**Decision**: Use React Query's `useMutation` with `onMutate` for optimistic updates

**Rationale**: 
- React Query is already integrated with tRPC in the project
- `onMutate` callback allows updating cache before server response
- Automatic rollback on error via `onError` with previous state
- Built-in retry logic and error handling
- Aligns with existing architecture (5 min stale time, 10 min garbage collection)

**Implementation Pattern**:
```typescript
const voteMutation = trpc.case.vote.useMutation({
  onMutate: async (newVote) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries(['case', caseId]);
    
    // Snapshot current state
    const previousCase = queryClient.getQueryData(['case', caseId]);
    
    // Optimistically update cache
    queryClient.setQueryData(['case', caseId], (old) => ({
      ...old,
      likes: newVote.type === 'LIKE' ? old.likes + 1 : old.likes,
      dislikes: newVote.type === 'DISLIKE' ? old.dislikes + 1 : old.dislikes,
      userVote: newVote.type
    }));
    
    return { previousCase };
  },
  onError: (err, newVote, context) => {
    // Rollback on error
    queryClient.setQueryData(['case', caseId], context.previousCase);
  },
  onSettled: () => {
    // Refetch to ensure sync
    queryClient.invalidateQueries(['case', caseId]);
  }
});
```

**Alternatives Considered**:
- Manual state management: Rejected due to complexity and lack of cache invalidation
- Custom optimistic update library: Rejected as React Query already provides this
- Server-side only updates: Rejected due to >200ms requirement

**Resources**:
- React Query Optimistic Updates: https://tanstack.com/query/latest/docs/react/guides/optimistic-updates
- tRPC with React Query: https://trpc.io/docs/client/react/useQuery

---

### 2. Concurrent Vote Handling with Prisma

**Decision**: Use Prisma `upsert` with unique constraint for atomic operations

**Rationale**:
- Prisma's `upsert` is atomic at the database level
- Unique constraint on `(userId, caseId)` prevents duplicate votes
- SQLite supports UPSERT via `INSERT OR REPLACE`
- No need for transaction isolation level changes
- Handles race conditions automatically

**Implementation Pattern**:
```typescript
// Unique constraint in schema
@@unique([userId, caseId], name: "user_case_vote")

// Upsert operation
await prisma.caseVote.upsert({
  where: {
    user_case_vote: {
      userId: ctx.userId,
      caseId: input.caseId
    }
  },
  update: {
    voteType: input.voteType,
    updatedAt: new Date()
  },
  create: {
    userId: ctx.userId,
    caseId: input.caseId,
    voteType: input.voteType
  }
});
```

**Alternatives Considered**:
- Manual transaction with locks: Rejected as overly complex for SQLite
- findFirst + create/update: Rejected due to race condition window
- Database-level triggers: Rejected to keep business logic in application layer

**Edge Case Handling**:
- Rapid clicks: Debounce on client side (300ms), upsert handles server side
- Simultaneous votes from multiple users: Each upsert is independent and atomic
- Network failure: React Query retry logic + optimistic rollback

**Resources**:
- Prisma Upsert: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#upsert
- SQLite UPSERT: https://www.sqlite.org/lang_upsert.html

---

### 3. Vote Count Aggregation Strategy

**Decision**: Use Prisma aggregation with `_count` for real-time accuracy

**Rationale**:
- Prisma provides `_count` aggregation on relations
- No need for denormalized counters in Case table
- Always accurate (source of truth is CaseVote table)
- Acceptable performance for expected scale (thousands of cases)
- Simpler data model without eventual consistency concerns

**Implementation Pattern**:
```typescript
const caseWithVotes = await prisma.case.findUnique({
  where: { id: caseId },
  include: {
    votes: {
      select: {
        voteType: true,
        userId: true
      }
    }
  }
});

// Calculate counts in application layer
const likes = caseWithVotes.votes.filter(v => v.voteType === 'LIKE').length;
const dislikes = caseWithVotes.votes.filter(v => v.voteType === 'DISLIKE').length;
const userVote = caseWithVotes.votes.find(v => v.userId === ctx.userId)?.voteType;
```

**Performance Consideration**:
- For list views with many cases, use `_count` in separate query:
```typescript
const votes = await prisma.caseVote.groupBy({
  by: ['caseId', 'voteType'],
  _count: true,
  where: {
    caseId: { in: caseIds }
  }
});
```

**Alternatives Considered**:
- Denormalized counters in Case table: Rejected due to eventual consistency complexity
- Database views: Rejected as SQLite view support is limited
- Cached aggregates with Redis: Rejected as over-engineering for current scale

**Resources**:
- Prisma Aggregation: https://www.prisma.io/docs/concepts/components/prisma-client/aggregation-grouping-summarizing

---

### 4. Vote Removal vs. Vote Change Logic

**Decision**: Delete record for removal, upsert for change

**Rationale**:
- Simpler data model (only active votes stored)
- Clear intent: presence of record = active vote
- Easier to query (no "removed" state to filter)
- Matches user mental model (clicking again removes vote)

**Implementation Pattern**:
```typescript
// Remove vote (same button clicked)
if (existingVote?.voteType === input.voteType) {
  await prisma.caseVote.delete({
    where: {
      user_case_vote: {
        userId: ctx.userId,
        caseId: input.caseId
      }
    }
  });
  return { action: 'removed' };
}

// Change vote (opposite button clicked)
await prisma.caseVote.upsert({
  where: {
    user_case_vote: {
      userId: ctx.userId,
      caseId: input.caseId
    }
  },
  update: { voteType: input.voteType },
  create: {
    userId: ctx.userId,
    caseId: input.caseId,
    voteType: input.voteType
  }
});
return { action: 'changed' };
```

**Alternatives Considered**:
- Soft delete with `isActive` flag: Rejected as adds complexity without benefit for current requirements
- Separate remove endpoint: Rejected as toggle pattern is simpler for UI
- Store vote history: Deferred to future analytics feature if needed

---

### 5. Icon and UI Component Selection

**Decision**: Use Lucide React icons (thumbs-up, thumbs-down) with Shadcn Button

**Rationale**:
- Lucide React already used in project (check existing imports)
- Thumbs up/down are universally recognized voting symbols
- Shadcn Button provides variant system for active/inactive states
- Accessible by default with proper ARIA labels

**Implementation Pattern**:
```typescript
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

<Button
  variant={userVote === 'LIKE' ? 'default' : 'outline'}
  size="sm"
  onClick={() => vote('LIKE')}
  aria-label={`Like this case (${likeCount} likes)`}
  aria-pressed={userVote === 'LIKE'}
>
  <ThumbsUp className="h-4 w-4" />
  <span>{likeCount}</span>
</Button>
```

**Accessibility Requirements**:
- `aria-label` for screen readers
- `aria-pressed` to indicate toggle state
- Keyboard navigation support (inherited from Button)
- Focus visible styles
- Color contrast WCAG AA compliant

**Alternatives Considered**:
- Custom SVG icons: Rejected as Lucide provides consistent design system
- Plus/minus icons: Rejected as less intuitive than thumbs
- Heart/star icons: Rejected as those imply different semantics (favorites)

**Resources**:
- Lucide Icons: https://lucide.dev/
- WCAG 2.1 AA Guidelines: https://www.w3.org/WAI/WCAG21/quickref/

---

## Implementation Dependencies

### Required Prisma Schema Changes
1. Add `VoteType` enum: `LIKE`, `DISLIKE`
2. Add `CaseVote` model with unique constraint
3. Add `votes` relation to `Case` model

### Required tRPC Procedures
1. `case.vote` - Toggle/change vote (mutation)
2. `case.getVotes` - Get aggregated votes for case(s) (query)
3. Modified `case.getById` - Include vote counts and user vote

### Required Client Components
1. `VoteButtons` - Like/dislike button group
2. `VoteCount` - Display vote counts (optional separate component)
3. Modify `CaseDetails` - Integrate VoteButtons
4. Modify `CaseListItem` - Display vote counts

### Testing Requirements
1. Unit: Vote toggle logic (like → dislike → remove)
2. Integration: Concurrent voting from multiple users
3. E2E: Full voting flow with authentication
4. Component: VoteButtons with MSW mocked API

## Best Practices Applied

### Type Safety
- Prisma enum for VoteType ensures type safety from database to UI
- Zod schemas auto-generated from Prisma
- tRPC provides end-to-end type inference
- No manual type duplication

### Performance
- Optimistic updates for <200ms perceived latency
- React Query caching reduces server requests
- Efficient Prisma queries with proper indexing
- Debouncing prevents excessive API calls

### Security
- Authentication required (ctx.userId check)
- Input validation via Zod schemas
- Prisma prevents SQL injection
- Unique constraint prevents data corruption

### Maintainability
- Single source of truth: Prisma schema
- Clear separation of concerns (data/API/UI)
- Comprehensive test coverage
- Well-documented component props

## Open Questions

**None** - All technical decisions have been made based on existing architecture and best practices.

## Next Steps

Proceed to **Phase 1: Design & Contracts**:
1. Create detailed data model (data-model.md)
2. Define API contracts (contracts/)
3. Generate quickstart guide (quickstart.md)
4. Update agent context with new technology decisions
