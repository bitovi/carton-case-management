# API Contract: Vote Endpoints

**Feature**: 001-case-voting  
**Date**: 2025-01-30  
**Protocol**: tRPC (JSON-RPC 2.0)

## Overview

This document defines the tRPC API contracts for the voting feature. All endpoints follow the existing patterns in `packages/server/src/router.ts` and maintain type safety through Zod schemas and tRPC inference.

---

## Namespace: `case.vote`

All voting-related procedures are nested under the existing `case` router as `case.vote.*`

### Router Location
```typescript
// packages/server/src/router.ts
case: router({
  // ... existing procedures ...
  vote: publicProcedure.input(...).mutation(...),
})
```

---

## Endpoints

### 1. Toggle Vote

**Purpose**: Cast, change, or remove a vote on a case. This is the primary voting interaction.

**Method**: `case.vote` (mutation)

**Authentication**: Required (`ctx.userId` must exist)

**Input Schema**:
```typescript
z.object({
  caseId: z.string().uuid(),
  voteType: z.enum(['LIKE', 'DISLIKE'])
})
```

**Input Example**:
```json
{
  "caseId": "550e8400-e29b-41d4-a716-446655440000",
  "voteType": "LIKE"
}
```

**Business Logic**:
1. Check if user is authenticated (throw UNAUTHORIZED if not)
2. Find existing vote for this user on this case
3. If no existing vote → Create new vote
4. If existing vote is same type → Delete vote (removal)
5. If existing vote is different type → Update vote (change)

**Response Schema**:
```typescript
z.object({
  action: z.enum(['created', 'removed', 'changed']),
  vote: z.object({
    id: z.string(),
    userId: z.string(),
    caseId: z.string(),
    voteType: z.enum(['LIKE', 'DISLIKE']),
    createdAt: z.date(),
    updatedAt: z.date()
  }).nullable() // null when removed
})
```

**Response Examples**:

Vote created:
```json
{
  "action": "created",
  "vote": {
    "id": "abc-123",
    "userId": "user-1",
    "caseId": "case-1",
    "voteType": "LIKE",
    "createdAt": "2025-01-30T10:00:00Z",
    "updatedAt": "2025-01-30T10:00:00Z"
  }
}
```

Vote removed:
```json
{
  "action": "removed",
  "vote": null
}
```

Vote changed:
```json
{
  "action": "changed",
  "vote": {
    "id": "abc-123",
    "userId": "user-1",
    "caseId": "case-1",
    "voteType": "DISLIKE",
    "createdAt": "2025-01-30T10:00:00Z",
    "updatedAt": "2025-01-30T10:05:00Z"
  }
}
```

**Errors**:
- `UNAUTHORIZED` (401): User not authenticated
- `NOT_FOUND` (404): Case does not exist
- `BAD_REQUEST` (400): Invalid input (malformed caseId or voteType)

**Implementation Pseudocode**:
```typescript
const vote = publicProcedure
  .input(z.object({
    caseId: z.string().uuid(),
    voteType: z.enum(['LIKE', 'DISLIKE'])
  }))
  .mutation(async ({ ctx, input }) => {
    // Check authentication
    if (!ctx.userId) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
    }

    // Find existing vote
    const existingVote = await ctx.prisma.caseVote.findUnique({
      where: {
        user_case_vote: {
          userId: ctx.userId,
          caseId: input.caseId
        }
      }
    });

    // Same vote → Remove
    if (existingVote?.voteType === input.voteType) {
      await ctx.prisma.caseVote.delete({
        where: {
          user_case_vote: {
            userId: ctx.userId,
            caseId: input.caseId
          }
        }
      });
      return { action: 'removed' as const, vote: null };
    }

    // Different vote or no vote → Upsert
    const vote = await ctx.prisma.caseVote.upsert({
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

    const action = existingVote ? 'changed' : 'created';
    return { action: action as const, vote };
  });
```

**Rate Limiting**: Consider adding debouncing on client side (300ms) to prevent spam

**Concurrency**: Atomic upsert/delete ensures safe concurrent operations

---

### 2. Get Vote Counts (Optional - Can use modified case.getById)

**Purpose**: Get aggregated vote counts for one or more cases

**Method**: `case.getVoteCounts` (query) - OPTIONAL

**Authentication**: Not required (public data)

**Note**: This can be integrated into existing `case.list` and `case.getById` instead of separate endpoint

**Input Schema**:
```typescript
z.object({
  caseIds: z.array(z.string().uuid())
})
```

**Response Schema**:
```typescript
z.array(
  z.object({
    caseId: z.string(),
    likes: z.number(),
    dislikes: z.number()
  })
)
```

**Alternative**: Modify existing endpoints instead (recommended)

---

## Modified Existing Endpoints

### Modified: `case.getById`

**Changes**: Add vote counts and current user's vote to response

**New Include**:
```typescript
include: {
  // ... existing includes ...
  votes: {
    select: {
      voteType: true,
      userId: true
    }
  }
}
```

**Response Processing**:
```typescript
const likes = caseData.votes.filter(v => v.voteType === 'LIKE').length;
const dislikes = caseData.votes.filter(v => v.voteType === 'DISLIKE').length;
const userVote = caseData.votes.find(v => v.userId === ctx.userId)?.voteType || null;

return {
  ...caseData,
  voteSummary: {
    likes,
    dislikes,
    userVote
  }
};
```

**Response Example**:
```json
{
  "id": "case-1",
  "title": "Example Case",
  "description": "...",
  "voteSummary": {
    "likes": 15,
    "dislikes": 3,
    "userVote": "LIKE"
  },
  "customer": { ... },
  "comments": [ ... ]
}
```

---

### Modified: `case.list`

**Changes**: Add vote counts to each case in the list

**Option A**: Include full vote data and calculate in application
```typescript
include: {
  // ... existing includes ...
  votes: {
    select: {
      voteType: true,
      userId: true
    }
  }
}
```

**Option B**: Use Prisma aggregation (more efficient for large lists)
```typescript
// After fetching cases, fetch votes separately
const caseIds = cases.map(c => c.id);
const voteCounts = await ctx.prisma.caseVote.groupBy({
  by: ['caseId', 'voteType'],
  _count: true,
  where: {
    caseId: { in: caseIds }
  }
});

// Merge vote counts into cases
const casesWithVotes = cases.map(c => {
  const likes = voteCounts.find(v => v.caseId === c.id && v.voteType === 'LIKE')?._count || 0;
  const dislikes = voteCounts.find(v => v.caseId === c.id && v.voteType === 'DISLIKE')?._count || 0;
  return { ...c, voteSummary: { likes, dislikes } };
});
```

**Response Example**:
```json
[
  {
    "id": "case-1",
    "title": "Example Case",
    "voteSummary": {
      "likes": 15,
      "dislikes": 3
    },
    "customer": { ... }
  },
  {
    "id": "case-2",
    "title": "Another Case",
    "voteSummary": {
      "likes": 8,
      "dislikes": 12
    },
    "customer": { ... }
  }
]
```

---

## Type Definitions

### Shared Types (packages/shared/src/types.ts)

```typescript
// Re-export from generated
export { VoteTypeSchema } from './generated/index.js';
export type { VoteType } from './generated/index.js';

// Lowercase alias for consistency with existing patterns
export const voteTypeSchema = VoteTypeSchema;

// Helper constants for UI
export const VOTE_TYPE_OPTIONS = [
  { value: 'LIKE' as const, label: 'Like', icon: 'ThumbsUp' },
  { value: 'DISLIKE' as const, label: 'Dislike', icon: 'ThumbsDown' },
] as const;

// Client-side vote summary type
export type VoteSummary = {
  likes: number;
  dislikes: number;
  userVote: VoteType | null;
};
```

---

## Client Usage Examples

### Voting Mutation

```typescript
import { trpc } from '@/lib/trpc';

function VoteButtons({ caseId }: { caseId: string }) {
  const utils = trpc.useContext();
  
  const voteMutation = trpc.case.vote.useMutation({
    onMutate: async (newVote) => {
      // Cancel outgoing refetches
      await utils.case.getById.cancel({ id: caseId });
      
      // Snapshot previous value
      const previousCase = utils.case.getById.getData({ id: caseId });
      
      // Optimistically update
      utils.case.getById.setData({ id: caseId }, (old) => {
        if (!old) return old;
        
        const currentVote = old.voteSummary.userVote;
        let likes = old.voteSummary.likes;
        let dislikes = old.voteSummary.dislikes;
        
        // Remove current vote counts
        if (currentVote === 'LIKE') likes--;
        if (currentVote === 'DISLIKE') dislikes--;
        
        // Add new vote or remove if same
        if (currentVote !== newVote.voteType) {
          if (newVote.voteType === 'LIKE') likes++;
          if (newVote.voteType === 'DISLIKE') dislikes++;
        }
        
        return {
          ...old,
          voteSummary: {
            likes,
            dislikes,
            userVote: currentVote === newVote.voteType ? null : newVote.voteType
          }
        };
      });
      
      return { previousCase };
    },
    onError: (err, newVote, context) => {
      // Rollback on error
      if (context?.previousCase) {
        utils.case.getById.setData({ id: caseId }, context.previousCase);
      }
    },
    onSettled: () => {
      // Refetch to ensure sync
      utils.case.getById.invalidate({ id: caseId });
    }
  });

  const handleVote = (voteType: 'LIKE' | 'DISLIKE') => {
    voteMutation.mutate({ caseId, voteType });
  };

  return (
    <div>
      <button onClick={() => handleVote('LIKE')}>Like</button>
      <button onClick={() => handleVote('DISLIKE')}>Dislike</button>
    </div>
  );
}
```

### Query Case with Votes

```typescript
const { data: caseData } = trpc.case.getById.useQuery({ id: caseId });

if (caseData) {
  console.log(`Likes: ${caseData.voteSummary.likes}`);
  console.log(`Dislikes: ${caseData.voteSummary.dislikes}`);
  console.log(`User voted: ${caseData.voteSummary.userVote || 'not voted'}`);
}
```

---

## Testing Contracts

### Integration Tests (packages/server/src/router.test.ts)

```typescript
describe('case.vote', () => {
  it('should create a vote', async () => {
    const result = await caller.case.vote({
      caseId: testCase.id,
      voteType: 'LIKE'
    });
    
    expect(result.action).toBe('created');
    expect(result.vote).toMatchObject({
      userId: testUser.id,
      caseId: testCase.id,
      voteType: 'LIKE'
    });
  });

  it('should remove a vote when clicking same button', async () => {
    // First vote
    await caller.case.vote({ caseId: testCase.id, voteType: 'LIKE' });
    
    // Second vote (same)
    const result = await caller.case.vote({ caseId: testCase.id, voteType: 'LIKE' });
    
    expect(result.action).toBe('removed');
    expect(result.vote).toBeNull();
  });

  it('should change vote when clicking opposite button', async () => {
    // First vote
    await caller.case.vote({ caseId: testCase.id, voteType: 'LIKE' });
    
    // Change vote
    const result = await caller.case.vote({ caseId: testCase.id, voteType: 'DISLIKE' });
    
    expect(result.action).toBe('changed');
    expect(result.vote?.voteType).toBe('DISLIKE');
  });

  it('should throw UNAUTHORIZED for unauthenticated users', async () => {
    const unauthCaller = createCaller({ userId: null, prisma });
    
    await expect(
      unauthCaller.case.vote({ caseId: testCase.id, voteType: 'LIKE' })
    ).rejects.toThrow('UNAUTHORIZED');
  });
});
```

---

## Performance Considerations

### Request Optimization
- Debounce votes on client side (300ms) to prevent spam
- Use optimistic updates to minimize perceived latency
- Batch vote count queries for list views

### Response Size
- Only include necessary vote data in responses
- Use `select` to limit fields returned
- Consider pagination for cases with excessive votes (future)

### Caching Strategy
- React Query cache: 5 min stale time (existing config)
- Invalidate on vote mutation (per-case)
- Background refetch on window focus

---

## Security

### Authentication
- All voting operations require `ctx.userId`
- Check userId before any database operation
- Return UNAUTHORIZED if not authenticated

### Input Validation
- Zod schemas validate all inputs
- UUID validation for caseId
- Enum validation for voteType

### Authorization
- No special permissions needed (all authenticated users can vote)
- Users can only vote as themselves (userId from context, not input)
- Future: Consider preventing votes on closed/archived cases

### Rate Limiting
- Consider adding rate limiting if abuse detected
- SQLite transaction limits provide some protection
- Application-level debouncing reduces load

---

## Summary

**New Endpoints**: 1 (`case.vote`)  
**Modified Endpoints**: 2 (`case.getById`, `case.list`)  
**Authentication Required**: Yes (for voting)  
**Input Validation**: Zod schemas  
**Output Type Safety**: tRPC inference  
**Error Handling**: Standard tRPC error codes  
**Optimistic Updates**: Supported via React Query  
**Concurrency Safe**: Yes (atomic operations)

This API contract maintains consistency with existing patterns while providing type-safe, performant voting functionality.
