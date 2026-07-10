# Comment Like & Dislike Buttons Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add thumbs-up/thumbs-down vote buttons with voter tooltips to each comment in the Case Details view, using local component state only.

**Architecture:** Extract the existing inline comment render in `CaseComments` into a new `CommentItem` modlet. `CommentItem` owns vote state via `useState`. It uses the already-existing `VoteButton` component from `common/` — no new presentational components needed.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Lucide icons, Vitest + Testing Library, Storybook

## Global Constraints

- No backend changes — vote state is local to `CommentItem`, not persisted anywhere
- All vote counts start at zero; no pre-seeded mock vote data
- One vote per user per comment; switching vote type is allowed in one click
- Count of 0 must not show a HoverCard (already handled by existing `VoteButton`)
- `VoteButton` is imported from `@/components/common/VoteButton` — do NOT recreate it
- `VoterTooltip` is already composed inside `VoteButton` — do not use it directly
- Active like state: `text-teal-500`; active dislike state: `text-red-500` (already in `VoteButton`)
- Current user is always `users?.[0]` from `trpc.user.list.useQuery()` (first user in list)
- Follow the modlet pattern: every component folder has `index.ts`, `ComponentName.tsx`, `types.ts`, `ComponentName.test.tsx`, `ComponentName.stories.tsx`
- No inline comments in `.ts` or `.tsx` files

---

## File Map

| Action | File | Responsibility |
|---|---|---|
| **Create** | `packages/client/src/components/CaseDetails/components/CaseComments/components/CommentItem/types.ts` | Props type for `CommentItem` |
| **Create** | `packages/client/src/components/CaseDetails/components/CaseComments/components/CommentItem/CommentItem.tsx` | Avatar + name + timestamp + text + vote row with local vote state |
| **Create** | `packages/client/src/components/CaseDetails/components/CaseComments/components/CommentItem/CommentItem.test.tsx` | Unit tests for vote interactions |
| **Create** | `packages/client/src/components/CaseDetails/components/CaseComments/components/CommentItem/CommentItem.stories.tsx` | Storybook stories for visual states |
| **Create** | `packages/client/src/components/CaseDetails/components/CaseComments/components/CommentItem/index.ts` | Re-export |
| **Modify** | `packages/client/src/components/CaseDetails/components/CaseComments/CaseComments.tsx` | Replace inline comment render with `<CommentItem>`; pass `currentUserName` |
| **Modify** | `packages/client/src/components/CaseDetails/components/CaseComments/CaseComments.test.tsx` | Add test verifying vote buttons render per comment |

---

## Task 1: Create the `CommentItem` types and component

**Files:**
- Create: `packages/client/src/components/CaseDetails/components/CaseComments/components/CommentItem/types.ts`
- Create: `packages/client/src/components/CaseDetails/components/CaseComments/components/CommentItem/CommentItem.tsx`
- Create: `packages/client/src/components/CaseDetails/components/CaseComments/components/CommentItem/index.ts`

**Interfaces:**
- Consumes: `VoteButton` from `@/components/common/VoteButton`
- Produces: `CommentItem` component and `CommentItemProps` type used by Task 2 and Task 3

---

- [ ] **Step 1: Create the types file**

Create `packages/client/src/components/CaseDetails/components/CaseComments/components/CommentItem/types.ts`:

```ts
export type CommentItemComment = {
  id: string;
  content: string;
  createdAt: string;
  author: { id: string; firstName: string; lastName: string; email: string };
};

export type CommentItemProps = {
  comment: CommentItemComment;
  currentUserName: string | null;
};
```

- [ ] **Step 2: Create the `CommentItem` component**

Create `packages/client/src/components/CaseDetails/components/CaseComments/components/CommentItem/CommentItem.tsx`:

```tsx
import { useState } from 'react';
import { VoteButton } from '@/components/common/VoteButton';
import type { CommentItemProps } from './types';

type VoteType = 'like' | 'dislike' | null;

type VoteState = {
  likeVoters: string[];
  dislikeVoters: string[];
  currentVote: VoteType;
};

export function CommentItem({ comment, currentUserName }: CommentItemProps) {
  const [voteState, setVoteState] = useState<VoteState>({
    likeVoters: [],
    dislikeVoters: [],
    currentVote: null,
  });

  const handleVote = (type: 'like' | 'dislike') => {
    if (!currentUserName) return;

    setVoteState((prev) => {
      const sameType = prev.currentVote === type;

      if (sameType) {
        const key = type === 'like' ? 'likeVoters' : 'dislikeVoters';
        return {
          ...prev,
          [key]: prev[key].filter((name) => name !== currentUserName),
          currentVote: null,
        };
      }

      const addKey = type === 'like' ? 'likeVoters' : 'dislikeVoters';
      const removeKey = type === 'like' ? 'dislikeVoters' : 'likeVoters';

      return {
        likeVoters: addKey === 'likeVoters'
          ? [...prev.likeVoters, currentUserName]
          : prev.likeVoters.filter((name) => name !== currentUserName),
        dislikeVoters: removeKey === 'dislikeVoters'
          ? prev.dislikeVoters.filter((name) => name !== currentUserName)
          : [...prev.dislikeVoters, currentUserName],
        currentVote: type,
      };
    });
  };

  return (
    <div className="flex flex-col gap-2 py-2">
      <div className="flex gap-2 items-center">
        <div className="w-10 flex items-center justify-center text-sm font-semibold text-gray-900">
          {comment.author.firstName[0]}{comment.author.lastName[0]}
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-medium">
            {comment.author.firstName} {comment.author.lastName}
          </p>
          <p className="text-xs text-gray-500">
            {new Date(comment.createdAt).toLocaleString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            })}
          </p>
        </div>
      </div>
      <p className="text-sm text-gray-700">{comment.content}</p>
      <div className="flex items-center gap-3 mt-1">
        <VoteButton
          type="up"
          count={voteState.likeVoters.length}
          voters={voteState.likeVoters}
          active={voteState.currentVote === 'like'}
          onClick={() => handleVote('like')}
          disabled={!currentUserName}
        />
        <VoteButton
          type="down"
          count={voteState.dislikeVoters.length}
          voters={voteState.dislikeVoters}
          active={voteState.currentVote === 'dislike'}
          onClick={() => handleVote('dislike')}
          disabled={!currentUserName}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create the index file**

Create `packages/client/src/components/CaseDetails/components/CaseComments/components/CommentItem/index.ts`:

```ts
export { CommentItem } from './CommentItem';
export type { CommentItemProps } from './types';
```

- [ ] **Step 4: Verify it type-checks**

```bash
cd /Users/kyle/projects/bitovi/carton-case-management
npm run typecheck 2>&1 | grep -i "CommentItem\|VoteButton\|error" | head -20
```

Expected: No errors referencing `CommentItem` or `VoteButton`.

- [ ] **Step 5: Commit**

```bash
git add packages/client/src/components/CaseDetails/components/CaseComments/components/
git commit -m "feat: add CommentItem modlet with vote state (#430)"
```

---

## Task 2: Write and pass `CommentItem` tests

**Files:**
- Create: `packages/client/src/components/CaseDetails/components/CaseComments/components/CommentItem/CommentItem.test.tsx`

**Interfaces:**
- Consumes: `CommentItem` from Task 1

---

- [ ] **Step 1: Create the test file with all failing tests**

Create `packages/client/src/components/CaseDetails/components/CaseComments/components/CommentItem/CommentItem.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CommentItem } from './CommentItem';

const mockComment = {
  id: '1',
  content: 'This is a test comment.',
  createdAt: new Date('2024-01-15T10:00:00Z').toISOString(),
  author: {
    id: '42',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
  },
};

describe('CommentItem', () => {
  it('renders author name', () => {
    render(<CommentItem comment={mockComment} currentUserName="Alex Morgan" />);
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('renders comment content', () => {
    render(<CommentItem comment={mockComment} currentUserName="Alex Morgan" />);
    expect(screen.getByText('This is a test comment.')).toBeInTheDocument();
  });

  it('renders upvote and downvote buttons', () => {
    render(<CommentItem comment={mockComment} currentUserName="Alex Morgan" />);
    expect(screen.getByLabelText('Upvote')).toBeInTheDocument();
    expect(screen.getByLabelText('Downvote')).toBeInTheDocument();
  });

  it('starts with zero like and dislike counts', () => {
    render(<CommentItem comment={mockComment} currentUserName="Alex Morgan" />);
    const counts = screen.getAllByText('0');
    expect(counts).toHaveLength(2);
  });

  it('clicking like increments the like count', async () => {
    const user = userEvent.setup();
    render(<CommentItem comment={mockComment} currentUserName="Alex Morgan" />);
    await user.click(screen.getByLabelText('Upvote'));
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('clicking like marks the like button as active', async () => {
    const user = userEvent.setup();
    render(<CommentItem comment={mockComment} currentUserName="Alex Morgan" />);
    await user.click(screen.getByLabelText('Upvote'));
    expect(screen.getByLabelText('Upvote')).toHaveAttribute('aria-pressed', 'true');
  });

  it('clicking like again toggles it off and decrements count', async () => {
    const user = userEvent.setup();
    render(<CommentItem comment={mockComment} currentUserName="Alex Morgan" />);
    await user.click(screen.getByLabelText('Upvote'));
    await user.click(screen.getByLabelText('Upvote'));
    expect(screen.getByLabelText('Upvote')).toHaveAttribute('aria-pressed', 'false');
    const counts = screen.getAllByText('0');
    expect(counts).toHaveLength(2);
  });

  it('clicking dislike after liking switches the vote', async () => {
    const user = userEvent.setup();
    render(<CommentItem comment={mockComment} currentUserName="Alex Morgan" />);
    await user.click(screen.getByLabelText('Upvote'));
    await user.click(screen.getByLabelText('Downvote'));
    expect(screen.getByLabelText('Upvote')).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByLabelText('Downvote')).toHaveAttribute('aria-pressed', 'true');
    const zeros = screen.getAllByText('0');
    expect(zeros).toHaveLength(1);
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail first**

```bash
cd /Users/kyle/projects/bitovi/carton-case-management
npx vitest run packages/client/src/components/CaseDetails/components/CaseComments/components/CommentItem/CommentItem.test.tsx 2>&1 | tail -20
```

Expected: Tests fail because `CommentItem` is newly created and may have issues, OR they pass if Task 1 is correct. If they pass immediately, that's fine — skip to Step 4.

- [ ] **Step 3: Fix any failures**

If tests fail, read the error and fix the relevant code in `CommentItem.tsx`. Common issues:
- `disabled` prop not accepted by `VoteButton` — check `VoteButton`'s `types.ts`. If `disabled` is not in the interface, remove it from the `CommentItem` render and handle the guard only in `handleVote`.
- Count not showing — ensure `showCount` defaults to `true` in `VoteButton` (it does per the existing code).

- [ ] **Step 4: Run the tests and confirm all pass**

```bash
cd /Users/kyle/projects/bitovi/carton-case-management
npx vitest run packages/client/src/components/CaseDetails/components/CaseComments/components/CommentItem/CommentItem.test.tsx 2>&1 | tail -20
```

Expected: All tests pass.

- [ ] **Step 5: Commit**

```bash
git add packages/client/src/components/CaseDetails/components/CaseComments/components/CommentItem/CommentItem.test.tsx
git commit -m "test: add CommentItem unit tests (#430)"
```

---

## Task 3: Create `CommentItem` Storybook stories

**Files:**
- Create: `packages/client/src/components/CaseDetails/components/CaseComments/components/CommentItem/CommentItem.stories.tsx`

**Interfaces:**
- Consumes: `CommentItem` from Task 1

---

- [ ] **Step 1: Create the stories file**

Create `packages/client/src/components/CaseDetails/components/CaseComments/components/CommentItem/CommentItem.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { CommentItem } from './CommentItem';

const mockComment = {
  id: '1',
  content: 'Started investigating the issue. Checked login logs.',
  createdAt: new Date('2024-01-15T11:00:00Z').toISOString(),
  author: {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
  },
};

const meta: Meta<typeof CommentItem> = {
  title: 'Components/CaseDetails/CommentItem',
  component: CommentItem,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    comment: mockComment,
    currentUserName: 'Alex Morgan',
  },
};

export const NoCurrentUser: Story = {
  args: {
    comment: mockComment,
    currentUserName: null,
  },
};

export const LongComment: Story = {
  args: {
    comment: {
      ...mockComment,
      content:
        'This is a longer comment that describes the full investigation in detail. We checked all logs, contacted the customer, and found the root cause in the password reset service. The customer has been notified and the issue is resolved.',
    },
    currentUserName: 'Alex Morgan',
  },
};
```

- [ ] **Step 2: Commit**

```bash
git add packages/client/src/components/CaseDetails/components/CaseComments/components/CommentItem/CommentItem.stories.tsx
git commit -m "docs: add CommentItem Storybook stories (#430)"
```

---

## Task 4: Wire `CommentItem` into `CaseComments`

**Files:**
- Modify: `packages/client/src/components/CaseDetails/components/CaseComments/CaseComments.tsx`
- Modify: `packages/client/src/components/CaseDetails/components/CaseComments/CaseComments.test.tsx`

**Interfaces:**
- Consumes: `CommentItem` from Task 1

---

- [ ] **Step 1: Write the new failing test in `CaseComments.test.tsx`**

Replace the contents of `packages/client/src/components/CaseDetails/components/CaseComments/CaseComments.test.tsx` with:

```tsx
import { describe, it, expect } from 'vitest';
import { renderWithTrpc } from '@/test/utils';
import { screen } from '@testing-library/react';
import { CaseComments } from './CaseComments';

const mockCaseData = {
  id: '1',
  comments: [
    {
      id: '1',
      content: 'First comment.',
      createdAt: new Date('2024-01-15T10:00:00Z').toISOString(),
      author: {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
      },
    },
  ],
};

describe('CaseComments', () => {
  it('renders without crashing', () => {
    renderWithTrpc(<CaseComments caseData={{ id: '1', comments: [] }} />);
    expect(screen.getByText('Comments')).toBeInTheDocument();
  });

  it('renders vote buttons for each comment', () => {
    renderWithTrpc(<CaseComments caseData={mockCaseData} />);
    expect(screen.getByLabelText('Upvote')).toBeInTheDocument();
    expect(screen.getByLabelText('Downvote')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to confirm it fails**

```bash
cd /Users/kyle/projects/bitovi/carton-case-management
npx vitest run packages/client/src/components/CaseDetails/components/CaseComments/CaseComments.test.tsx 2>&1 | tail -20
```

Expected: The "renders vote buttons" test fails because `CaseComments` doesn't use `CommentItem` yet.

- [ ] **Step 3: Update `CaseComments.tsx` to use `CommentItem`**

Replace the contents of `packages/client/src/components/CaseDetails/components/CaseComments/CaseComments.tsx` with:

```tsx
import { useState } from 'react';
import type { FormEvent } from 'react';
import { trpc } from '@/lib/trpc';
import { Textarea } from '@/components/obra';
import { CommentItem } from './components/CommentItem';
import type { CaseCommentsProps } from './types';

export function CaseComments({ caseData }: CaseCommentsProps) {
  const [newComment, setNewComment] = useState('');
  const utils = trpc.useUtils();

  const { data: users } = trpc.user.list.useQuery();
  const currentUser = users?.[0];
  const currentUserName = currentUser
    ? `${currentUser.firstName} ${currentUser.lastName}`
    : null;

  const createCommentMutation = trpc.comment.create.useMutation({
    onMutate: async (variables) => {
      await utils.case.getById.cancel({ id: caseData.id });

      const previousCase = utils.case.getById.getData({ id: caseData.id });

      if (previousCase && currentUser) {
        const optimisticComment = {
          id: `temp-${Date.now()}`,
          content: variables.content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          caseId: caseData.id,
          authorId: currentUser.id,
          author: {
            id: currentUser.id,
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            email: currentUser.email,
          },
        };

        utils.case.getById.setData(
          { id: caseData.id },
          {
            ...previousCase,
            comments: [optimisticComment, ...(previousCase.comments || [])],
          }
        );
      }

      return { previousCase };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousCase) {
        utils.case.getById.setData({ id: caseData.id }, context.previousCase);
      }
    },
    onSuccess: () => {
      setNewComment('');
    },
    onSettled: () => {
      utils.case.getById.invalidate({ id: caseData.id });
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;

    createCommentMutation.mutate({
      caseId: caseData.id,
      content: newComment.trim(),
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-base font-semibold">Comments</h2>
      <form onSubmit={handleSubmit}>
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[80px] resize-none"
          placeholder="Add a comment..."
          disabled={createCommentMutation.isPending}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
      </form>
      <div className="flex flex-col gap-4">
        {caseData.comments && caseData.comments.length > 0 ? (
          caseData.comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserName={currentUserName}
            />
          ))
        ) : (
          <div className="text-sm text-gray-500">No comments yet</div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run the tests and confirm all pass**

```bash
cd /Users/kyle/projects/bitovi/carton-case-management
npx vitest run packages/client/src/components/CaseDetails/components/CaseComments/ 2>&1 | tail -30
```

Expected: All tests pass (both `CaseComments.test.tsx` and `CommentItem.test.tsx`).

- [ ] **Step 5: Run the full test suite**

```bash
cd /Users/kyle/projects/bitovi/carton-case-management
npm test 2>&1 | tail -30
```

Expected: All tests pass; no regressions.

- [ ] **Step 6: Run typecheck and lint**

```bash
cd /Users/kyle/projects/bitovi/carton-case-management
npm run typecheck && npm run lint 2>&1 | tail -20
```

Expected: No errors.

- [ ] **Step 7: Commit**

```bash
git add packages/client/src/components/CaseDetails/components/CaseComments/CaseComments.tsx \
        packages/client/src/components/CaseDetails/components/CaseComments/CaseComments.test.tsx
git commit -m "feat: wire CommentItem into CaseComments with vote buttons (#430)"
```
