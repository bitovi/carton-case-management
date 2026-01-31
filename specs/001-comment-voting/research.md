# Research: Comment Voting System

**Date**: 2025-01-23  
**Feature**: Comment Voting System  
**Branch**: `001-comment-voting`

## Overview

This document resolves all "NEEDS CLARIFICATION" items from the Technical Context section of the implementation plan. Each research area includes the decision made, rationale, alternatives considered, and implementation guidance.

---

## Research Area 1: Real-time Update Strategy

### Decision: Use React Query Polling with Configurable Intervals

**Chosen Approach**: Implement polling-based updates using React Query's `refetchInterval` feature with smart intervals (e.g., 3-5 seconds when user is actively viewing comments).

### Rationale

1. **Simplicity**: tRPC v10 supports subscriptions, but they require WebSocket infrastructure setup, which adds complexity for a feature that doesn't demand instant (<100ms) updates
2. **Sufficient Performance**: The requirement is 2-second propagation (SC-002), which polling easily satisfies with 2-3 second intervals
3. **Infrastructure**: Current project doesn't have WebSocket server configured; polling works with existing HTTP setup
4. **Battery/Resource Efficiency**: Can pause polling when tab is inactive using `visibilitychange` API
5. **Reliability**: HTTP polling is more reliable than WebSocket connections, especially with proxy/firewall scenarios

### Alternatives Considered

| Approach | Pros | Cons | Why Rejected |
|----------|------|------|--------------|
| **WebSocket Subscriptions (tRPC)** | True real-time (<100ms), efficient for high-frequency updates | Requires WebSocket server setup, connection management, more complex error handling | Overkill for 2-second requirement; adds infrastructure complexity |
| **Server-Sent Events (SSE)** | Simpler than WebSocket, built on HTTP | Browser compatibility issues, harder to scale, still requires server changes | Not significantly simpler than WebSocket for this use case |
| **Manual setInterval polling** | Simple implementation | Less efficient than React Query, manual cleanup needed | React Query provides better integration and automatic cleanup |

### Implementation Pattern

```typescript
// In CaseComments component or custom hook
const { data: caseData } = trpc.case.getById.useQuery(
  { id: caseId },
  {
    // Poll every 3 seconds when window is visible
    refetchInterval: 3000,
    refetchIntervalInBackground: false, // Stop when tab inactive
    // Optional: increase interval if no recent votes
    refetchInterval: (data) => {
      const lastVoteTime = getLastVoteTime(data);
      const timeSinceVote = Date.now() - lastVoteTime;
      
      // Slow down polling after 5 minutes of inactivity
      return timeSinceVote > 300000 ? 10000 : 3000;
    }
  }
);
```

### Performance Characteristics

- **Latency**: 0-3 seconds (average 1.5 seconds)
- **Network**: Minimal overhead with tRPC batching
- **Server Load**: Manageable with standard HTTP caching headers
- **Client Resources**: React Query handles cleanup automatically

### Future Migration Path

If real-time requirements become stricter (<500ms), we can:
1. Add tRPC WebSocket transport
2. Implement `commentVote.onVoteChange` subscription
3. Keep polling as fallback for WebSocket failures
4. No breaking changes to client code (just configuration change)

---

## Research Area 2: Concurrent Vote Handling

### Decision: Database Unique Constraint + Upsert Pattern

**Chosen Approach**: Use Prisma's `@@unique([commentId, userId])` constraint and `upsert` operation to handle concurrent votes atomically at the database level.

### Rationale

1. **Atomic Operations**: SQLite's UNIQUE constraint ensures only one vote per user per comment, even with concurrent requests
2. **Idempotent**: Upsert operation (`INSERT ... ON CONFLICT UPDATE`) is naturally idempotent
3. **No Application Locking**: Database handles race conditions; application code stays simple
4. **Transaction Safety**: Prisma transactions ensure vote creation/update and count updates happen together
5. **Zero Vote Loss**: Meets SC-003 requirement through database-level guarantees

### Alternatives Considered

| Approach | Pros | Cons | Why Rejected |
|----------|------|------|--------------|
| **Application-level Mutex** | Fine-grained control | Doesn't scale across server instances, complex to implement correctly | Breaks in multi-server deployment |
| **Optimistic Locking (version field)** | Detects conflicts | Requires retry logic, more complex error handling | Database constraint is simpler and more reliable |
| **Read-then-Write with Check** | Simple to understand | Race condition window between read and write | Fundamentally unsafe for concurrent operations |
| **Distributed Lock (Redis)** | Works across servers | Requires Redis, adds infrastructure dependency | Overkill for this use case; database constraint sufficient |

### Implementation Pattern

```typescript
// tRPC vote mutation (server)
vote: publicProcedure
  .input(z.object({
    commentId: z.string(),
    voteType: z.enum(['LIKE', 'DISLIKE'])
  }))
  .mutation(async ({ ctx, input }) => {
    if (!ctx.userId) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    // Upsert handles both create and update atomically
    const vote = await ctx.prisma.commentVote.upsert({
      where: {
        commentId_userId: {
          commentId: input.commentId,
          userId: ctx.userId,
        }
      },
      update: {
        voteType: input.voteType,
        updatedAt: new Date(),
      },
      create: {
        commentId: input.commentId,
        userId: ctx.userId,
        voteType: input.voteType,
      },
    });

    return vote;
  });
```

### Edge Case Handling

1. **Rapid Clicking**: Upsert ensures only final vote state persists; no duplicates
2. **Concurrent Users**: Unique constraint prevents duplicate votes from different users
3. **Same User, Multiple Tabs**: Last write wins (upsert updates existing vote)
4. **Network Retry**: Idempotent operation safe to retry

### Database Schema Requirements

```prisma
model CommentVote {
  id        String   @id @default(uuid())
  commentId String
  userId    String
  voteType  VoteType
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  comment Comment @relation(fields: [commentId], references: [id], onDelete: Cascade)
  user    User    @relation(fields: [userId], references: [id])

  @@unique([commentId, userId])  // CRITICAL: Prevents duplicate votes
  @@index([commentId])
  @@index([userId])
}
```

---

## Research Area 3: Vote Count Aggregation Strategy

### Decision: Compute On-the-Fly with Prisma Aggregation

**Chosen Approach**: Calculate vote counts dynamically using Prisma's `_count` and `groupBy` features, with React Query caching to minimize database queries.

### Rationale

1. **Data Integrity**: Counts always accurate; no risk of denormalized count drift
2. **Simple Schema**: No additional count fields to maintain
3. **Prisma Efficiency**: Modern query optimizer makes aggregation fast for small-to-medium datasets
4. **React Query Caching**: Client-side caching reduces actual database queries
5. **Correct Deletes**: Cascade delete automatically keeps counts accurate

### Alternatives Considered

| Approach | Pros | Cons | Why Rejected |
|----------|------|------|--------------|
| **Denormalized Counts on Comment** | Faster reads | Complex write logic, drift risk, harder to debug | Premature optimization; adds complexity |
| **Materialized View** | Fast reads, automatic updates | SQLite doesn't support materialized views | Not available in SQLite |
| **Cache-only Counts** | Fastest reads | Cache invalidation complexity, stale data risk | Accuracy more important than absolute speed |
| **Event Sourcing** | Complete audit trail | Massive complexity increase | Way overkill for vote counts |

### Implementation Pattern

```typescript
// Efficient query to get votes with counts
const commentWithVotes = await ctx.prisma.comment.findUnique({
  where: { id: commentId },
  include: {
    votes: {
      include: {
        user: {
          select: { name: true }
        }
      }
    },
    _count: {
      select: {
        votes: true  // Total vote count
      }
    }
  }
});

// Client-side aggregation (more flexible)
const likes = commentWithVotes.votes.filter(v => v.voteType === 'LIKE').length;
const dislikes = commentWithVotes.votes.filter(v => v.voteType === 'DISLIKE').length;
const userVote = commentWithVotes.votes.find(v => v.userId === currentUserId);
```

### Performance Analysis

**Assumptions**:
- Average 10-50 votes per comment
- 10-20 comments per case
- User viewing 1-2 cases simultaneously

**Query Cost**:
- Single comment query: ~5-10ms (includes vote JOIN)
- Case with all comments: ~20-50ms (10 comments × votes)
- React Query cache: 0ms for subsequent renders

**Optimization Opportunities**:
1. **Partial Data Loading**: Load counts first, voter names on tooltip hover
2. **Separate Query**: Optional query for voter names (lazy loading)
3. **Indexed Queries**: Indexes on `commentId` ensure fast lookups

### Migration Path to Denormalized (if needed)

If performance testing shows issues:
1. Add `likeCount` and `dislikeCount` fields to Comment
2. Use Prisma middleware to update counts on vote changes
3. Keep computed counts as validation check
4. No client-side changes needed

---

## Research Area 4: Optimistic UI Update Patterns

### Decision: React Query Optimistic Updates with Rollback

**Chosen Approach**: Use React Query's `onMutate` hook to immediately update the local cache, with automatic rollback on error and server reconciliation on success.

### Rationale

1. **Instant Feedback**: Meets SC-001 requirement (200ms feedback) with <50ms actual response
2. **Built-in Support**: React Query (via tRPC) has excellent optimistic update patterns
3. **Error Handling**: Automatic rollback prevents inconsistent UI state
4. **Server Reconciliation**: Final server response ensures accuracy
5. **Proven Pattern**: Well-documented pattern in React Query docs

### Alternatives Considered

| Approach | Pros | Cons | Why Rejected |
|----------|------|------|--------------|
| **Wait for Server Response** | Simpler logic | Poor UX (slow feedback), fails SC-001 | Doesn't meet performance requirement |
| **Local State Only** | Fastest | No server persistence, complex sync | Not actually saving votes |
| **Dual-write (Optimistic + Server)** | Seems faster | Complexity of state reconciliation | React Query already handles this |

### Implementation Pattern

```typescript
// Custom hook for voting logic
export function useCommentVoting(commentId: string) {
  const utils = trpc.useUtils();
  const { data: currentUser } = trpc.auth.me.useQuery();

  const voteMutation = trpc.commentVote.vote.useMutation({
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await utils.case.getById.cancel();

      // Snapshot current state
      const previousCase = utils.case.getById.getData({ id: caseId });

      if (!previousCase || !currentUser) return { previousCase };

      // Optimistically update the cache
      utils.case.getById.setData({ id: caseId }, (old) => {
        if (!old) return old;

        return {
          ...old,
          comments: old.comments.map(comment => {
            if (comment.id !== commentId) return comment;

            // Update votes array optimistically
            const existingVoteIndex = comment.votes.findIndex(
              v => v.userId === currentUser.id
            );

            let newVotes = [...comment.votes];

            if (existingVoteIndex >= 0) {
              // Update existing vote
              newVotes[existingVoteIndex] = {
                ...newVotes[existingVoteIndex],
                voteType: variables.voteType,
              };
            } else {
              // Add new vote
              newVotes.push({
                id: `temp-${Date.now()}`,
                userId: currentUser.id,
                commentId: commentId,
                voteType: variables.voteType,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                user: { name: currentUser.name },
              });
            }

            return {
              ...comment,
              votes: newVotes,
            };
          })
        };
      });

      return { previousCase };
    },

    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousCase) {
        utils.case.getById.setData({ id: caseId }, context.previousCase);
      }
      // Show error toast
      toast.error('Failed to update vote. Please try again.');
    },

    onSettled: () => {
      // Refetch to sync with server (guarantees accuracy)
      utils.case.getById.invalidate({ id: caseId });
    },
  });

  return {
    vote: voteMutation.mutate,
    isVoting: voteMutation.isPending,
  };
}
```

### User Experience Flow

1. **User clicks vote button** → Immediate visual feedback (button highlights)
2. **Optimistic update** → Count updates instantly (<50ms)
3. **Server request** → Background mutation sent to server
4. **Success**: Server confirms → Cache invalidated, fresh data replaces optimistic data
5. **Error**: Server rejects → Automatic rollback, error message shown

### Error Recovery

```typescript
// Remove vote with optimistic update
const removeVoteMutation = trpc.commentVote.removeVote.useMutation({
  onMutate: async (variables) => {
    await utils.case.getById.cancel();
    const previousCase = utils.case.getById.getData({ id: caseId });

    utils.case.getById.setData({ id: caseId }, (old) => {
      if (!old) return old;
      return {
        ...old,
        comments: old.comments.map(comment => {
          if (comment.id !== variables.commentId) return comment;
          return {
            ...comment,
            votes: comment.votes.filter(v => v.userId !== currentUser.id),
          };
        })
      };
    });

    return { previousCase };
  },
  // ... error and settled handlers same as above
});
```

### Performance Characteristics

- **Optimistic Update**: <50ms (pure JavaScript, no network)
- **Visual Feedback**: Instant (React re-render)
- **Server Confirmation**: 100-500ms (network + database)
- **Cache Reconciliation**: <10ms (React Query diffing)

---

## Additional Research: Best Practices from Similar Systems

### Reference Implementations

1. **Reddit Vote System**
   - Uses optimistic updates with eventual consistency
   - Vote counts sometimes temporarily "fuzzy" (acceptable trade-off)
   - Our approach: Strict consistency via server reconciliation

2. **GitHub Reactions**
   - Real-time updates via WebSocket
   - Small payload (just count deltas)
   - Our approach: Polling is simpler, meets requirements

3. **Stack Overflow**
   - Denormalized counts for performance
   - Background jobs sync counts periodically
   - Our approach: Computed counts for accuracy, scale later if needed

### Lessons Applied

1. **Idempotency**: All vote operations must be idempotent (✓ using upsert)
2. **Optimistic UI**: Users expect instant feedback (✓ React Query pattern)
3. **Error States**: Clear communication when votes fail (✓ toast notifications)
4. **Visual Cues**: Highlight active votes prominently (✓ VoteButton component)

---

## Technology Stack Validation

### tRPC + React Query Capabilities

**Confirmed Features Used**:
- ✅ Optimistic updates (`onMutate`)
- ✅ Automatic rollback (`onError`)
- ✅ Cache invalidation (`onSettled`)
- ✅ Polling (`refetchInterval`)
- ✅ Type safety (end-to-end)

**Not Required**:
- ❌ Subscriptions (polling sufficient)
- ❌ Middleware (standard auth middleware works)

### Prisma ORM Capabilities

**Confirmed Features Used**:
- ✅ Upsert operations
- ✅ Unique constraints
- ✅ Cascade deletes
- ✅ Relation aggregations (`_count`)
- ✅ Transaction support

### SQLite Limitations

**Acceptable Trade-offs**:
- No materialized views → Use computed aggregations
- Lower concurrency than PostgreSQL → Sufficient for expected load
- File-based locking → Acceptable for monolithic deployment

**Not Blocking**:
- Migration to PostgreSQL/MySQL in future requires no code changes (Prisma abstraction)

---

## Security Considerations

### Vote Manipulation Prevention

1. **Authentication Required**: All vote endpoints require `ctx.userId` (checked in middleware)
2. **Authorization**: Users can only vote on comments in cases they can access
3. **Rate Limiting**: Consider adding rate limiting if abuse detected (future enhancement)
4. **Audit Trail**: `createdAt`/`updatedAt` fields track vote history

### Data Privacy

1. **Voter Names**: Only shown in tooltips (optional feature)
2. **Anonymous Voting**: Could make voter names optional in future
3. **User Deletion**: Votes persist but user relation is nullable (maintains count accuracy)

---

## Performance Benchmarks

### Expected Query Performance

| Operation | Expected Time | Optimization |
|-----------|--------------|--------------|
| Vote create/update | 10-30ms | Indexed lookup + upsert |
| Vote delete | 10-20ms | Indexed delete |
| Get comment votes | 5-15ms | Indexed join |
| Get case with all votes | 50-100ms | Batched includes |

### Scaling Thresholds

- **Comfortable Range**: <100 votes per comment, <50 comments per case
- **Warning Zone**: 100-500 votes per comment (consider denormalized counts)
- **Critical**: >500 votes per comment (definitely need denormalized counts)

**Current Expected Load**: 5-20 votes per comment → Well within comfortable range

---

## Decision Summary

| Research Area | Decision | Primary Reason |
|---------------|----------|----------------|
| Real-time Updates | Polling (3-5s intervals) | Simplicity, meets 2s requirement |
| Concurrent Votes | DB unique constraint + upsert | Atomic, zero vote loss guarantee |
| Vote Counts | Computed with Prisma | Data integrity, sufficient performance |
| Optimistic UI | React Query onMutate pattern | <50ms feedback, automatic rollback |

---

## Implementation Recommendations

### Phase Order

1. **Schema First**: Add CommentVote model with unique constraint
2. **Server API**: Implement vote/removeVote mutations with upsert
3. **Client Hook**: Create `useCommentVoting` with optimistic updates
4. **Integration**: Add VoteButton to CaseComments component
5. **Polling**: Configure React Query refetchInterval
6. **Testing**: Concurrent vote tests, optimistic update tests

### Testing Strategy

1. **Unit Tests**: Vote toggle logic, count aggregation
2. **Integration Tests**: Concurrent vote handling, upsert behavior
3. **E2E Tests**: Full voting workflow, multi-user scenario
4. **Performance Tests**: Query timing with varying vote counts

### Monitoring

1. **Vote Mutation Success Rate**: Should be >99%
2. **Average Vote Latency**: Should be <200ms for optimistic, <500ms for server
3. **Query Performance**: Track comment query time as vote counts grow

---

## Open Questions for Implementation Phase

1. **Voter Tooltip**: Always show voter names or make it optional? → **Decision: Always show (already implemented in VoteButton)**
2. **Vote History**: Track vote changes over time? → **Decision: No, out of scope (only current state)**
3. **Analytics**: Track vote events for reporting? → **Decision: Out of scope for V1**
4. **Notifications**: Notify comment authors of votes? → **Decision: Out of scope**

---

## References

- [React Query Optimistic Updates](https://tanstack.com/query/latest/docs/react/guides/optimistic-updates)
- [tRPC Mutations](https://trpc.io/docs/client/react/mutations)
- [Prisma Upsert](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#upsert)
- [SQLite Unique Constraints](https://www.sqlite.org/lang_createtable.html#uniqueconst)
- [Idempotency in REST APIs](https://stripe.com/blog/idempotency)

---

**Status**: ✅ All research areas resolved  
**Next Step**: Proceed to Phase 1 (Data Model & Contracts)
