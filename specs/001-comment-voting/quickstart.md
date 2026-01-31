# Quickstart: Comment Voting System

**Feature**: Comment Voting System  
**Date**: 2025-01-23  
**Audience**: Developers implementing or extending the voting feature

## Overview

This guide provides practical instructions for working with the comment voting feature, including setup, usage examples, and troubleshooting.

---

## Table of Contents

1. [Setup & Installation](#setup--installation)
2. [Using the Vote API](#using-the-vote-api)
3. [Integrating Vote UI](#integrating-vote-ui)
4. [Testing](#testing)
5. [Common Patterns](#common-patterns)
6. [Troubleshooting](#troubleshooting)

---

## Setup & Installation

### 1. Database Migration

Run the Prisma migration to add the CommentVote table:

```bash
# From project root
npm run db:generate --workspace=packages/shared  # Generate Prisma client
cd packages/server
npx prisma migrate dev --name add-comment-voting  # Apply migration
```

**Expected Output**:
```
✔ Generated Prisma Client
✔ The migration has been created
✔ Applied migration add-comment-voting
```

**Verification**:
```bash
npx prisma studio  # Open Prisma Studio and verify CommentVote table exists
```

### 2. Generate TypeScript Types

The Zod schemas and types are auto-generated from the Prisma schema:

```bash
npm run db:generate --workspace=packages/shared
```

**Generated Files**:
- `packages/shared/src/generated/index.ts` (Zod schemas)
- `node_modules/.prisma/client/index.d.ts` (Prisma types)

### 3. Seed Sample Data (Optional)

Add sample votes for testing:

```bash
cd packages/server
npm run db:seed
```

**Sample votes will be created** for existing comments in the seed data.

---

## Using the Vote API

### Server-Side: Implementing Vote Endpoints

**File**: `packages/server/src/router.ts`

```typescript
import { router, publicProcedure } from './trpc.js';
import { voteInputSchema, removeVoteInputSchema } from '@carton/shared';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const appRouter = router({
  // ... existing routers ...

  commentVote: router({
    // Get vote counts for a comment
    getByCommentId: publicProcedure
      .input(z.object({ commentId: z.string().uuid() }))
      .query(async ({ ctx, input }) => {
        if (!ctx.userId) {
          throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
        }

        const votes = await ctx.prisma.commentVote.findMany({
          where: { commentId: input.commentId },
          include: { user: { select: { name: true } } }
        });

        const likes = votes.filter(v => v.voteType === 'LIKE');
        const dislikes = votes.filter(v => v.voteType === 'DISLIKE');
        const userVote = votes.find(v => v.userId === ctx.userId)?.voteType || null;

        return {
          likes: likes.length,
          dislikes: dislikes.length,
          userVote,
          voters: {
            likes: likes.map(v => v.user.name),
            dislikes: dislikes.map(v => v.user.name),
          }
        };
      }),

    // Cast or update a vote
    vote: publicProcedure
      .input(voteInputSchema)
      .mutation(async ({ ctx, input }) => {
        if (!ctx.userId) {
          throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
        }

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
      }),

    // Remove a vote
    removeVote: publicProcedure
      .input(removeVoteInputSchema)
      .mutation(async ({ ctx, input }) => {
        if (!ctx.userId) {
          throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
        }

        await ctx.prisma.commentVote.deleteMany({
          where: {
            commentId: input.commentId,
            userId: ctx.userId,
          }
        });

        return { success: true };
      }),
  }),
});
```

### Client-Side: Querying Vote Data

**Example**: Get vote counts for a comment

```typescript
import { trpc } from '@/lib/trpc';

function CommentVoteCounts({ commentId }: { commentId: string }) {
  const { data, isLoading } = trpc.commentVote.getByCommentId.useQuery({
    commentId
  });

  if (isLoading) return <div>Loading votes...</div>;

  return (
    <div>
      <p>Likes: {data?.likes}</p>
      <p>Dislikes: {data?.dislikes}</p>
      <p>Your vote: {data?.userVote || 'None'}</p>
    </div>
  );
}
```

### Client-Side: Casting a Vote

**Example**: Vote mutation with optimistic updates

```typescript
import { trpc } from '@/lib/trpc';

function VoteButtons({ commentId, caseId }: Props) {
  const utils = trpc.useUtils();
  
  const voteMutation = trpc.commentVote.vote.useMutation({
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await utils.case.getById.cancel({ id: caseId });

      // Snapshot previous state
      const previousCase = utils.case.getById.getData({ id: caseId });

      // Optimistically update cache
      // (see Optimistic Updates section below for full implementation)

      return { previousCase };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousCase) {
        utils.case.getById.setData({ id: caseId }, context.previousCase);
      }
      toast.error('Failed to vote');
    },
    onSettled: () => {
      // Refetch to sync with server
      utils.case.getById.invalidate({ id: caseId });
    },
  });

  const handleVote = (voteType: 'LIKE' | 'DISLIKE') => {
    voteMutation.mutate({ commentId, voteType });
  };

  return (
    <>
      <button onClick={() => handleVote('LIKE')}>👍 Like</button>
      <button onClick={() => handleVote('DISLIKE')}>👎 Dislike</button>
    </>
  );
}
```

---

## Integrating Vote UI

### Using the VoteButton Component

**File**: `packages/client/src/components/CaseDetails/components/CaseComments/CaseComments.tsx`

```typescript
import { VoteButton } from '@/components/common/VoteButton';
import { useCommentVoting } from './hooks/useCommentVoting';

function CommentItem({ comment, caseId }: Props) {
  const { vote, removeVote, currentVote, counts, voters } = useCommentVoting(
    comment.id,
    caseId
  );

  return (
    <div className="comment">
      <p>{comment.content}</p>
      <div className="vote-buttons flex gap-4">
        <VoteButton
          type="up"
          active={currentVote === 'LIKE'}
          count={counts.likes}
          voters={voters.likes}
          onClick={() => {
            if (currentVote === 'LIKE') {
              removeVote();
            } else {
              vote('LIKE');
            }
          }}
        />
        <VoteButton
          type="down"
          active={currentVote === 'DISLIKE'}
          count={counts.dislikes}
          voters={voters.dislikes}
          onClick={() => {
            if (currentVote === 'DISLIKE') {
              removeVote();
            } else {
              vote('DISLIKE');
            }
          }}
        />
      </div>
    </div>
  );
}
```

### Creating the useCommentVoting Hook

**File**: `packages/client/src/components/CaseDetails/components/CaseComments/hooks/useCommentVoting.ts`

```typescript
import { trpc } from '@/lib/trpc';
import { useMemo } from 'react';
import { toast } from 'sonner';

export function useCommentVoting(commentId: string, caseId: string) {
  const utils = trpc.useUtils();
  const { data: currentUser } = trpc.auth.me.useQuery();

  // Get case data which includes comments with votes
  const { data: caseData } = trpc.case.getById.useQuery({ id: caseId });

  // Extract vote data for this comment
  const comment = useMemo(
    () => caseData?.comments.find(c => c.id === commentId),
    [caseData, commentId]
  );

  const votes = comment?.votes || [];
  const likes = votes.filter(v => v.voteType === 'LIKE');
  const dislikes = votes.filter(v => v.voteType === 'DISLIKE');
  const currentVote = votes.find(v => v.userId === currentUser?.id)?.voteType || null;

  // Vote mutation
  const voteMutation = trpc.commentVote.vote.useMutation({
    onMutate: async (variables) => {
      await utils.case.getById.cancel({ id: caseId });
      const previousCase = utils.case.getById.getData({ id: caseId });

      if (!previousCase || !currentUser) return { previousCase };

      // Optimistically update votes
      utils.case.getById.setData({ id: caseId }, (old) => {
        if (!old) return old;

        return {
          ...old,
          comments: old.comments.map(c => {
            if (c.id !== commentId) return c;

            // Remove old vote if exists
            let newVotes = c.votes.filter(v => v.userId !== currentUser.id);

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

            return { ...c, votes: newVotes };
          })
        };
      });

      return { previousCase };
    },
    onError: (err, variables, context) => {
      if (context?.previousCase) {
        utils.case.getById.setData({ id: caseId }, context.previousCase);
      }
      toast.error('Failed to vote. Please try again.');
    },
    onSettled: () => {
      utils.case.getById.invalidate({ id: caseId });
    },
  });

  // Remove vote mutation
  const removeVoteMutation = trpc.commentVote.removeVote.useMutation({
    onMutate: async () => {
      await utils.case.getById.cancel({ id: caseId });
      const previousCase = utils.case.getById.getData({ id: caseId });

      if (!previousCase || !currentUser) return { previousCase };

      utils.case.getById.setData({ id: caseId }, (old) => {
        if (!old) return old;

        return {
          ...old,
          comments: old.comments.map(c => {
            if (c.id !== commentId) return c;
            return {
              ...c,
              votes: c.votes.filter(v => v.userId !== currentUser.id),
            };
          })
        };
      });

      return { previousCase };
    },
    onError: (err, variables, context) => {
      if (context?.previousCase) {
        utils.case.getById.setData({ id: caseId }, context.previousCase);
      }
      toast.error('Failed to remove vote. Please try again.');
    },
    onSettled: () => {
      utils.case.getById.invalidate({ id: caseId });
    },
  });

  return {
    vote: voteMutation.mutate,
    removeVote: () => removeVoteMutation.mutate({ commentId }),
    isVoting: voteMutation.isPending || removeVoteMutation.isPending,
    currentVote,
    counts: {
      likes: likes.length,
      dislikes: dislikes.length,
    },
    voters: {
      likes: likes.map(v => v.user.name),
      dislikes: dislikes.map(v => v.user.name),
    },
  };
}
```

---

## Testing

### Unit Tests: Vote Router

**File**: `packages/server/src/router.test.ts`

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { createTestCaller } from './test-utils';

describe('commentVote router', () => {
  describe('vote mutation', () => {
    it('creates a new vote', async () => {
      const { caller, prisma } = await createTestCaller({ userId: 'user-1' });

      const result = await caller.commentVote.vote({
        commentId: 'comment-1',
        voteType: 'LIKE'
      });

      expect(result.voteType).toBe('LIKE');
      expect(result.userId).toBe('user-1');
      expect(result.commentId).toBe('comment-1');
    });

    it('updates existing vote', async () => {
      const { caller, prisma } = await createTestCaller({ userId: 'user-1' });

      // First vote
      await caller.commentVote.vote({
        commentId: 'comment-1',
        voteType: 'LIKE'
      });

      // Change vote
      const result = await caller.commentVote.vote({
        commentId: 'comment-1',
        voteType: 'DISLIKE'
      });

      expect(result.voteType).toBe('DISLIKE');

      // Verify only one vote exists
      const votes = await prisma.commentVote.findMany({
        where: { commentId: 'comment-1', userId: 'user-1' }
      });
      expect(votes).toHaveLength(1);
    });
  });

  describe('removeVote mutation', () => {
    it('removes existing vote', async () => {
      const { caller, prisma } = await createTestCaller({ userId: 'user-1' });

      // Create vote
      await caller.commentVote.vote({
        commentId: 'comment-1',
        voteType: 'LIKE'
      });

      // Remove vote
      const result = await caller.commentVote.removeVote({
        commentId: 'comment-1'
      });

      expect(result.success).toBe(true);

      // Verify vote is gone
      const votes = await prisma.commentVote.findMany({
        where: { commentId: 'comment-1', userId: 'user-1' }
      });
      expect(votes).toHaveLength(0);
    });
  });
});
```

### Component Tests: VoteButton Integration

**File**: `packages/client/src/components/CaseDetails/components/CaseComments/CaseComments.test.tsx`

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CaseComments } from './CaseComments';

describe('CaseComments with voting', () => {
  it('displays vote counts', () => {
    const caseData = {
      id: 'case-1',
      comments: [
        {
          id: 'comment-1',
          content: 'Test comment',
          votes: [
            { userId: 'user-1', voteType: 'LIKE', user: { name: 'Alice' } },
            { userId: 'user-2', voteType: 'LIKE', user: { name: 'Bob' } },
            { userId: 'user-3', voteType: 'DISLIKE', user: { name: 'Charlie' } },
          ]
        }
      ]
    };

    render(<CaseComments caseData={caseData} />);

    // Should show 2 likes and 1 dislike
    expect(screen.getByText('2')).toBeInTheDocument(); // Like count
    expect(screen.getByText('1')).toBeInTheDocument(); // Dislike count
  });

  it('highlights active vote button', () => {
    // Test that current user's vote is highlighted
  });

  it('calls vote mutation on button click', async () => {
    // Test vote interaction
  });
});
```

### E2E Tests: Full Voting Workflow

**File**: `tests/e2e/comment-voting.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Comment Voting', () => {
  test('user can like a comment', async ({ page }) => {
    // Navigate to case with comments
    await page.goto('/cases/test-case-id');

    // Find first comment and like button
    const likeButton = page.getByRole('button', { name: /upvote/i }).first();
    const initialCount = await likeButton.textContent();

    // Click like button
    await likeButton.click();

    // Verify count increased
    await expect(likeButton).toContainText(String(Number(initialCount) + 1));

    // Verify button is highlighted (active state)
    await expect(likeButton).toHaveClass(/teal-500/);
  });

  test('user can change vote from like to dislike', async ({ page }) => {
    await page.goto('/cases/test-case-id');

    const likeButton = page.getByRole('button', { name: /upvote/i }).first();
    const dislikeButton = page.getByRole('button', { name: /downvote/i }).first();

    // Like the comment
    await likeButton.click();
    await expect(likeButton).toHaveClass(/teal-500/);

    // Change to dislike
    await dislikeButton.click();

    // Verify like is no longer active, dislike is active
    await expect(likeButton).not.toHaveClass(/teal-500/);
    await expect(dislikeButton).toHaveClass(/red-500/);
  });

  test('multiple users see updated vote counts', async ({ browser }) => {
    // Open two browser contexts (two users)
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();

    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    // Both navigate to same case
    await page1.goto('/cases/test-case-id');
    await page2.goto('/cases/test-case-id');

    // User 1 likes comment
    await page1.getByRole('button', { name: /upvote/i }).first().click();

    // Wait a bit for polling
    await page2.waitForTimeout(3000);

    // User 2 should see updated count
    const likeCount = await page2.getByRole('button', { name: /upvote/i }).first().textContent();
    expect(Number(likeCount)).toBeGreaterThan(0);
  });
});
```

---

## Common Patterns

### Pattern 1: Vote Toggle Logic

```typescript
// Simplified vote toggle
function handleVoteClick(commentId: string, clickedType: 'LIKE' | 'DISLIKE') {
  if (currentVote === clickedType) {
    // Remove vote if clicking same button
    removeVote(commentId);
  } else {
    // Add or change vote
    vote(commentId, clickedType);
  }
}
```

### Pattern 2: Real-time Updates with Polling

```typescript
// Poll for updates every 3 seconds
const { data } = trpc.case.getById.useQuery(
  { id: caseId },
  {
    refetchInterval: 3000,
    refetchIntervalInBackground: false, // Pause when tab not active
  }
);
```

### Pattern 3: Lazy Loading Voter Names

```typescript
// Only fetch voter names on tooltip hover
function VoterTooltip({ commentId }: Props) {
  const [open, setOpen] = useState(false);
  
  const { data: voters } = trpc.commentVote.getByCommentId.useQuery(
    { commentId },
    { enabled: open } // Only fetch when tooltip opens
  );

  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      {/* Trigger */}
      {/* Content shows voters */}
    </Tooltip>
  );
}
```

---

## Troubleshooting

### Issue: Vote counts are wrong

**Symptoms**: Displayed vote counts don't match actual votes

**Causes**:
- Optimistic update not rolled back after error
- Stale cache data

**Solutions**:
```typescript
// Force refetch to sync with server
utils.case.getById.invalidate({ id: caseId });

// Or reset cache completely
utils.case.getById.reset();
```

### Issue: Votes not appearing for other users

**Symptoms**: User A votes, but User B doesn't see the update

**Causes**:
- Polling disabled or interval too long
- Cache not invalidating

**Solutions**:
```typescript
// Ensure polling is enabled
const { data } = trpc.case.getById.useQuery(
  { id: caseId },
  { refetchInterval: 3000 } // 3 second polling
);

// Manually trigger refetch
await utils.case.getById.refetch({ id: caseId });
```

### Issue: Duplicate vote error

**Symptoms**: Database constraint error when voting

**Causes**:
- Not using upsert operation
- Trying to insert instead of update

**Solutions**:
```typescript
// Always use upsert, not create
await prisma.commentVote.upsert({
  where: {
    commentId_userId: { commentId, userId }
  },
  update: { voteType },
  create: { commentId, userId, voteType }
});
```

### Issue: Optimistic update jumps back

**Symptoms**: Vote count increases, then decreases, then increases again

**Causes**:
- Not canceling outgoing queries before optimistic update
- Refetch happening before mutation completes

**Solutions**:
```typescript
onMutate: async (variables) => {
  // IMPORTANT: Cancel outgoing queries
  await utils.case.getById.cancel({ id: caseId });
  
  // Then do optimistic update
  // ...
}
```

### Issue: Type errors with vote data

**Symptoms**: TypeScript errors when accessing vote fields

**Causes**:
- Generated types not up to date
- Prisma schema changes not reflected

**Solutions**:
```bash
# Regenerate Prisma client and Zod schemas
npm run db:generate --workspace=packages/shared

# Restart TypeScript server in your editor
# VS Code: Cmd+Shift+P -> "Restart TypeScript Server"
```

---

## Performance Tips

### Tip 1: Batch Vote Queries

Instead of querying votes separately for each comment, include them in the case query:

```typescript
// Good: Include votes in case query
const caseData = await prisma.case.findUnique({
  where: { id: caseId },
  include: {
    comments: {
      include: {
        votes: {
          include: { user: { select: { name: true } } }
        }
      }
    }
  }
});

// Bad: N+1 query problem
const comments = await prisma.comment.findMany({ where: { caseId } });
for (const comment of comments) {
  const votes = await prisma.commentVote.findMany({ where: { commentId: comment.id } });
}
```

### Tip 2: Throttle Vote Mutations

Prevent rapid clicking spam:

```typescript
import { debounce } from 'lodash';

const debouncedVote = debounce((commentId, voteType) => {
  voteMutation.mutate({ commentId, voteType });
}, 300); // 300ms debounce
```

### Tip 3: Virtual Scrolling for Long Comment Lists

For cases with 100+ comments, use virtual scrolling to render only visible comments:

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

// Only render visible comments
const virtualizer = useVirtualizer({
  count: comments.length,
  getScrollElement: () => scrollRef.current,
  estimateSize: () => 100, // Estimated comment height
});
```

---

## Next Steps

1. ✅ Database migration applied
2. ✅ Vote router implemented
3. ✅ UI integrated with VoteButton component
4. ✅ Tests written (unit, integration, E2E)
5. 🚀 Deploy and monitor performance

**Further Reading**:
- [data-model.md](./data-model.md) - Complete data model documentation
- [contracts/vote-api.yaml](./contracts/vote-api.yaml) - Full API specification
- [research.md](./research.md) - Technical decisions and rationale

---

**Questions or Issues?**
- Check troubleshooting section above
- Review test files for usage examples
- Consult the API contract documentation

**Happy Coding! 🎉**
