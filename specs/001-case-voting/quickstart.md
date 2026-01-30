# Quickstart Guide: Like and Dislike Buttons

**Feature**: 001-case-voting  
**Date**: 2025-01-30  
**For**: Developers implementing the voting feature

## Overview

This guide provides a step-by-step walkthrough for implementing the like and dislike voting functionality. Follow these steps in order to build the feature according to the specification and design documents.

---

## Prerequisites

- [ ] Feature specification reviewed (`spec.md`)
- [ ] Data model understood (`data-model.md`)
- [ ] API contracts reviewed (`contracts/vote-api.md`)
- [ ] Development environment set up (Node.js, npm installed)
- [ ] Repository cloned and dependencies installed (`npm install`)

---

## Implementation Phases

### Phase 1: Database Schema (30 min)

**Goal**: Add CaseVote model and VoteType enum to Prisma schema

**Files**:
- `packages/shared/prisma/schema.prisma`

**Steps**:

1. **Add VoteType enum** to schema:
```prisma
enum VoteType {
  LIKE
  DISLIKE
}
```

2. **Add CaseVote model** to schema:
```prisma
model CaseVote {
  id        String   @id @default(uuid())
  userId    String
  caseId    String
  voteType  VoteType
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user User @relation(fields: [userId], references: [id])
  case Case @relation(fields: [caseId], references: [id], onDelete: Cascade)

  @@unique([userId, caseId], name: "user_case_vote")
  @@index([caseId])
  @@index([userId])
}
```

3. **Add votes relation** to existing User model:
```prisma
model User {
  // ... existing fields ...
  votes CaseVote[]
}
```

4. **Add votes relation** to existing Case model:
```prisma
model Case {
  // ... existing fields ...
  votes CaseVote[]
}
```

5. **Generate Prisma Client and Zod schemas**:
```bash
npm run db:generate
```

6. **Push schema to database**:
```bash
npm run db:push
```

7. **Verify** schema applied:
```bash
npm run db:studio
# Check that CaseVote table exists
```

**Verification**:
- [ ] CaseVote table visible in Prisma Studio
- [ ] VoteType enum has LIKE and DISLIKE values
- [ ] Unique constraint on (userId, caseId) exists
- [ ] Generated types in `packages/shared/src/generated/`

---

### Phase 2: Shared Types (15 min)

**Goal**: Export vote types and constants from shared package

**Files**:
- `packages/shared/src/types.ts`
- `packages/shared/src/index.ts`

**Steps**:

1. **Add to `packages/shared/src/types.ts`**:
```typescript
// Re-export enum schema from generated
export { VoteTypeSchema } from './generated/index.js';
export type { VoteType } from './generated/index.js';

// Lowercase alias for consistency
export const voteTypeSchema = VoteTypeSchema;

// Helper constants for UI
export const VOTE_TYPE_OPTIONS = [
  { 
    value: 'LIKE' as const, 
    label: 'Like', 
    icon: 'ThumbsUp',
    description: 'Like this case'
  },
  { 
    value: 'DISLIKE' as const, 
    label: 'Dislike', 
    icon: 'ThumbsDown',
    description: 'Dislike this case'
  },
] as const;

export type VoteTypeOption = typeof VOTE_TYPE_OPTIONS[number];

// Vote summary type for client
export type VoteSummary = {
  likes: number;
  dislikes: number;
  userVote: VoteType | null;
};

// Vote mutation response type
export type VoteAction = 'created' | 'removed' | 'changed';

export type VoteResponse = {
  action: VoteAction;
  vote: any | null; // Use proper Prisma type when available
};
```

2. **Update `packages/shared/src/index.ts`** to export new types:
```typescript
export type { VoteType, VoteSummary, VoteResponse, VoteAction } from './types.js';
export { voteTypeSchema, VOTE_TYPE_OPTIONS } from './types.js';
```

3. **Verify types are exported**:
```bash
cd packages/shared
npm run build
# Check for TypeScript errors
```

**Verification**:
- [ ] Types exported from @carton/shared
- [ ] No TypeScript compilation errors
- [ ] Constants available for import

---

### Phase 3: tRPC API Endpoints (45 min)

**Goal**: Add voting endpoints to tRPC router

**Files**:
- `packages/server/src/router.ts`
- `packages/server/src/router.test.ts`

**Steps**:

1. **Import vote types** at top of `router.ts`:
```typescript
import { voteTypeSchema } from '@carton/shared';
```

2. **Add vote procedure** to `case` router:
```typescript
case: router({
  // ... existing procedures ...
  
  vote: publicProcedure
    .input(
      z.object({
        caseId: z.string().uuid(),
        voteType: voteTypeSchema
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check authentication
      if (!ctx.userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Not authenticated',
        });
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
    }),
}),
```

3. **Modify `case.getById`** to include vote data:
```typescript
getById: publicProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ ctx, input }) => {
    const caseData = await ctx.prisma.case.findUnique({
      where: { id: input.id },
      include: {
        // ... existing includes ...
        votes: {
          select: {
            voteType: true,
            userId: true
          }
        }
      },
    });

    if (!caseData) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Case not found',
      });
    }

    // Calculate vote summary
    const likes = caseData.votes.filter(v => v.voteType === 'LIKE').length;
    const dislikes = caseData.votes.filter(v => v.voteType === 'DISLIKE').length;
    const userVote = caseData.votes.find(v => v.userId === ctx.userId)?.voteType || null;

    const { votes, ...caseWithoutVotes } = caseData;

    return {
      ...caseWithoutVotes,
      voteSummary: {
        likes,
        dislikes,
        userVote
      }
    };
  }),
```

4. **Modify `case.list`** to include vote counts:
```typescript
list: publicProcedure
  .input(/* ... */)
  .query(async ({ ctx, input }) => {
    const cases = await ctx.prisma.case.findMany({
      // ... existing query ...
      include: {
        // ... existing includes ...
        votes: {
          select: {
            voteType: true,
            userId: true
          }
        }
      }
    });

    // Add vote summary to each case
    return cases.map(caseData => {
      const likes = caseData.votes.filter(v => v.voteType === 'LIKE').length;
      const dislikes = caseData.votes.filter(v => v.voteType === 'DISLIKE').length;
      const { votes, ...caseWithoutVotes } = caseData;

      return {
        ...caseWithoutVotes,
        voteSummary: {
          likes,
          dislikes
        }
      };
    });
  }),
```

5. **Add tests** in `router.test.ts`:
```typescript
describe('case.vote', () => {
  it('should create a vote', async () => {
    const result = await caller.case.vote({
      caseId: testCase.id,
      voteType: 'LIKE'
    });
    
    expect(result.action).toBe('created');
    expect(result.vote).toMatchObject({
      voteType: 'LIKE'
    });
  });

  it('should remove vote when clicking same button', async () => {
    await caller.case.vote({ caseId: testCase.id, voteType: 'LIKE' });
    const result = await caller.case.vote({ caseId: testCase.id, voteType: 'LIKE' });
    
    expect(result.action).toBe('removed');
    expect(result.vote).toBeNull();
  });

  it('should change vote when clicking opposite button', async () => {
    await caller.case.vote({ caseId: testCase.id, voteType: 'LIKE' });
    const result = await caller.case.vote({ caseId: testCase.id, voteType: 'DISLIKE' });
    
    expect(result.action).toBe('changed');
    expect(result.vote?.voteType).toBe('DISLIKE');
  });
});
```

6. **Run tests**:
```bash
npm run test:server
```

**Verification**:
- [ ] `case.vote` mutation exists
- [ ] `case.getById` returns voteSummary
- [ ] `case.list` returns voteSummary for each case
- [ ] All tests pass
- [ ] No TypeScript errors

---

### Phase 4: VoteButtons Component (60 min)

**Goal**: Create reusable VoteButtons component with Storybook stories

**Files**:
- `packages/client/src/components/VoteButtons/index.ts`
- `packages/client/src/components/VoteButtons/VoteButtons.tsx`
- `packages/client/src/components/VoteButtons/VoteButtons.test.tsx`
- `packages/client/src/components/VoteButtons/VoteButtons.stories.tsx`

**Steps**:

1. **Create component directory**:
```bash
mkdir -p packages/client/src/components/VoteButtons
```

2. **Create `VoteButtons.tsx`**:
```typescript
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import type { VoteSummary } from '@carton/shared';

export type VoteButtonsProps = {
  caseId: string;
  voteSummary: VoteSummary;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onVoteChange?: (vote: 'LIKE' | 'DISLIKE' | null) => void;
};

export function VoteButtons({
  caseId,
  voteSummary,
  disabled = false,
  size = 'md',
  onVoteChange
}: VoteButtonsProps) {
  const utils = trpc.useContext();

  const voteMutation = trpc.case.vote.useMutation({
    onMutate: async (newVote) => {
      await utils.case.getById.cancel({ id: caseId });
      const previousCase = utils.case.getById.getData({ id: caseId });
      
      utils.case.getById.setData({ id: caseId }, (old) => {
        if (!old) return old;
        
        const currentVote = old.voteSummary.userVote;
        let likes = old.voteSummary.likes;
        let dislikes = old.voteSummary.dislikes;
        
        if (currentVote === 'LIKE') likes--;
        if (currentVote === 'DISLIKE') dislikes--;
        
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
      if (context?.previousCase) {
        utils.case.getById.setData({ id: caseId }, context.previousCase);
      }
    },
    onSettled: () => {
      utils.case.getById.invalidate({ id: caseId });
    },
    onSuccess: (result) => {
      onVoteChange?.(result.vote?.voteType || null);
    }
  });

  const handleVote = (voteType: 'LIKE' | 'DISLIKE') => {
    voteMutation.mutate({ caseId, voteType });
  };

  const { likes, dislikes, userVote } = voteSummary;

  return (
    <div className="flex gap-2">
      <Button
        variant={userVote === 'LIKE' ? 'default' : 'outline'}
        size={size}
        onClick={() => handleVote('LIKE')}
        disabled={disabled || voteMutation.isPending}
        aria-label={`Like this case (${likes} likes)`}
        aria-pressed={userVote === 'LIKE'}
      >
        <ThumbsUp className="h-4 w-4 mr-1" />
        <span>{likes}</span>
      </Button>

      <Button
        variant={userVote === 'DISLIKE' ? 'default' : 'outline'}
        size={size}
        onClick={() => handleVote('DISLIKE')}
        disabled={disabled || voteMutation.isPending}
        aria-label={`Dislike this case (${dislikes} dislikes)`}
        aria-pressed={userVote === 'DISLIKE'}
      >
        <ThumbsDown className="h-4 w-4 mr-1" />
        <span>{dislikes}</span>
      </Button>
    </div>
  );
}
```

3. **Create `index.ts`**:
```typescript
export { VoteButtons } from './VoteButtons';
export type { VoteButtonsProps } from './VoteButtons';
```

4. **Create `VoteButtons.stories.tsx`**:
```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { VoteButtons } from './VoteButtons';

const meta: Meta<typeof VoteButtons> = {
  title: 'Components/VoteButtons',
  component: VoteButtons,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof VoteButtons>;

export const NotVoted: Story = {
  args: {
    caseId: 'case-1',
    voteSummary: {
      likes: 5,
      dislikes: 2,
      userVote: null
    }
  }
};

export const Liked: Story = {
  args: {
    caseId: 'case-1',
    voteSummary: {
      likes: 5,
      dislikes: 2,
      userVote: 'LIKE'
    }
  }
};

export const Disliked: Story = {
  args: {
    caseId: 'case-1',
    voteSummary: {
      likes: 5,
      dislikes: 2,
      userVote: 'DISLIKE'
    }
  }
};

export const Disabled: Story = {
  args: {
    caseId: 'case-1',
    voteSummary: {
      likes: 5,
      dislikes: 2,
      userVote: null
    },
    disabled: true
  }
};

export const NoVotes: Story = {
  args: {
    caseId: 'case-1',
    voteSummary: {
      likes: 0,
      dislikes: 0,
      userVote: null
    }
  }
};
```

5. **Create `VoteButtons.test.tsx`**:
```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VoteButtons } from './VoteButtons';

// Mock tRPC
vi.mock('@/lib/trpc', () => ({
  trpc: {
    useContext: vi.fn(() => ({
      case: {
        getById: {
          cancel: vi.fn(),
          getData: vi.fn(),
          setData: vi.fn(),
          invalidate: vi.fn()
        }
      }
    })),
    case: {
      vote: {
        useMutation: vi.fn(() => ({
          mutate: vi.fn(),
          isPending: false
        }))
      }
    }
  }
}));

describe('VoteButtons', () => {
  it('renders like and dislike buttons', () => {
    render(
      <VoteButtons
        caseId="case-1"
        voteSummary={{ likes: 5, dislikes: 2, userVote: null }}
      />
    );

    expect(screen.getByLabelText(/Like this case/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Dislike this case/)).toBeInTheDocument();
  });

  it('displays vote counts', () => {
    render(
      <VoteButtons
        caseId="case-1"
        voteSummary={{ likes: 5, dislikes: 2, userVote: null }}
      />
    );

    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('highlights liked button when user has liked', () => {
    render(
      <VoteButtons
        caseId="case-1"
        voteSummary={{ likes: 5, dislikes: 2, userVote: 'LIKE' }}
      />
    );

    const likeButton = screen.getByLabelText(/Like this case/);
    expect(likeButton).toHaveAttribute('aria-pressed', 'true');
  });
});
```

6. **Run Storybook** to verify:
```bash
npm run storybook
```

**Verification**:
- [ ] Component renders in Storybook
- [ ] All 5 stories display correctly
- [ ] No console errors in Storybook
- [ ] Component tests pass

---

### Phase 5: Integrate into Pages (30 min)

**Goal**: Add VoteButtons to CaseDetails and vote counts to CaseList

**Files**:
- `packages/client/src/components/CaseDetails/CaseDetails.tsx`
- `packages/client/src/components/CaseList/CaseListItem.tsx` (if exists)

**Steps**:

1. **Import VoteButtons** in CaseDetails:
```typescript
import { VoteButtons } from '@/components/VoteButtons';
```

2. **Add VoteButtons** to case details view:
```typescript
export function CaseDetails() {
  const { id } = useParams();
  const { data: caseData } = trpc.case.getById.useQuery({ id });

  if (!caseData) return <div>Loading...</div>;

  return (
    <div>
      <h1>{caseData.title}</h1>
      <p>{caseData.description}</p>
      
      {/* Add VoteButtons */}
      <VoteButtons
        caseId={caseData.id}
        voteSummary={caseData.voteSummary}
      />

      {/* Rest of component */}
    </div>
  );
}
```

3. **Add vote counts** to case list items:
```typescript
export function CaseListItem({ caseItem }) {
  return (
    <div>
      <h3>{caseItem.title}</h3>
      
      {/* Add vote counts */}
      <div className="text-sm text-gray-500">
        👍 {caseItem.voteSummary.likes} · 👎 {caseItem.voteSummary.dislikes}
      </div>
    </div>
  );
}
```

4. **Test in browser**:
```bash
npm run dev
```

**Verification**:
- [ ] VoteButtons appear on case details page
- [ ] Vote counts appear on case list
- [ ] Clicking buttons updates counts immediately
- [ ] Counts persist after page refresh

---

### Phase 6: E2E Tests (45 min)

**Goal**: Add Playwright E2E tests for voting flows

**Files**:
- `tests/e2e/voting.spec.ts`

**Steps**:

1. **Create test file**:
```typescript
import { test, expect } from '@playwright/test';

test.describe('Voting', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a case
    await page.goto('/cases');
    await page.waitForSelector('[data-testid="case-list"]');
  });

  test('should allow user to like a case', async ({ page }) => {
    // Get initial like count
    const likeButton = page.getByLabel(/Like this case/);
    const initialCount = await likeButton.textContent();
    
    // Click like
    await likeButton.click();
    
    // Verify count increased
    await expect(likeButton).toContainText(String(Number(initialCount) + 1));
    
    // Verify button is highlighted
    await expect(likeButton).toHaveAttribute('aria-pressed', 'true');
  });

  test('should allow user to change vote', async ({ page }) => {
    const likeButton = page.getByLabel(/Like this case/);
    const dislikeButton = page.getByLabel(/Dislike this case/);
    
    // Like first
    await likeButton.click();
    await expect(likeButton).toHaveAttribute('aria-pressed', 'true');
    
    // Change to dislike
    await dislikeButton.click();
    await expect(dislikeButton).toHaveAttribute('aria-pressed', 'true');
    await expect(likeButton).toHaveAttribute('aria-pressed', 'false');
  });

  test('should allow user to remove vote', async ({ page }) => {
    const likeButton = page.getByLabel(/Like this case/);
    
    // Like
    await likeButton.click();
    await expect(likeButton).toHaveAttribute('aria-pressed', 'true');
    
    // Click again to remove
    await likeButton.click();
    await expect(likeButton).toHaveAttribute('aria-pressed', 'false');
  });

  test('should persist vote after page refresh', async ({ page }) => {
    const likeButton = page.getByLabel(/Like this case/);
    
    // Vote
    await likeButton.click();
    await expect(likeButton).toHaveAttribute('aria-pressed', 'true');
    
    // Refresh
    await page.reload();
    
    // Verify vote persisted
    await expect(likeButton).toHaveAttribute('aria-pressed', 'true');
  });
});
```

2. **Run E2E tests**:
```bash
npm run test:e2e
```

**Verification**:
- [ ] All E2E tests pass
- [ ] Tests run in CI pipeline
- [ ] No flaky tests

---

### Phase 7: Seed Data (15 min)

**Goal**: Add sample votes to seed script

**Files**:
- `packages/server/db/seed.ts`

**Steps**:

1. **Add votes** after seeding cases:
```typescript
// After creating users and cases
const votes = await prisma.caseVote.createMany({
  data: [
    { userId: alice.id, caseId: case1.id, voteType: 'LIKE' },
    { userId: bob.id, caseId: case1.id, voteType: 'LIKE' },
    { userId: charlie.id, caseId: case1.id, voteType: 'DISLIKE' },
    { userId: alice.id, caseId: case2.id, voteType: 'DISLIKE' },
    { userId: bob.id, caseId: case2.id, voteType: 'LIKE' },
  ]
});

console.log(`✅ Seeded ${votes.count} votes`);
```

2. **Run seed**:
```bash
npm run db:seed
```

**Verification**:
- [ ] Seed script runs without errors
- [ ] Votes visible in Prisma Studio
- [ ] Case details show vote counts from seed data

---

## Testing Checklist

- [ ] **Unit Tests**: All tRPC procedures tested
- [ ] **Component Tests**: VoteButtons component tested
- [ ] **Integration Tests**: Concurrent voting scenarios tested
- [ ] **E2E Tests**: All user stories from spec tested
- [ ] **Storybook**: All component states visible and error-free
- [ ] **Manual Testing**: Voting works in dev environment

---

## Deployment Checklist

- [ ] All tests passing (unit, integration, E2E)
- [ ] TypeScript compilation successful
- [ ] ESLint checks pass
- [ ] Prettier formatting applied
- [ ] Storybook builds without errors
- [ ] Database migration applied
- [ ] Feature branch merged to main
- [ ] Production build tested

---

## Troubleshooting

### Prisma Client not found
```bash
npm run db:generate
```

### Vote not persisting
- Check authentication (ctx.userId)
- Verify database write permissions
- Check browser console for errors

### Optimistic update not working
- Verify React Query cache keys match
- Check onMutate callback implementation
- Ensure invalidation on onSettled

### Type errors
- Re-run `npm run db:generate`
- Restart TypeScript server in IDE
- Check import paths

---

## Next Steps

After implementation complete:
1. Create task breakdown (`/speckit.tasks`)
2. Update documentation
3. Submit PR for code review
4. Deploy to staging
5. User acceptance testing
6. Production deployment

---

## Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [tRPC Documentation](https://trpc.io/docs)
- [React Query Optimistic Updates](https://tanstack.com/query/latest/docs/react/guides/optimistic-updates)
- [Shadcn UI Components](https://ui.shadcn.com/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Estimated Total Time**: 4-5 hours  
**Complexity**: Medium  
**Dependencies**: None (all prerequisites in existing codebase)
