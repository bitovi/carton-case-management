# Comment Like/Dislike Vote Buttons Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire the already-built `VoteButton`/`VoterTooltip`/`ReactionStatistics` components into `CaseComments` so every comment on the Case Details view has working thumbs-up/thumbs-down voting (GitHub issue #430).

**Architecture:** Extract each comment row into a new `CommentItem` sub-component that owns one `useState` for its own vote (`'none' | 'up' | 'down'`) and renders `ReactionStatistics` beneath the comment body. `CaseComments.tsx` keeps the create-comment form and list-level concerns, mapping each comment to a `CommentItem`. A pre-existing display bug in `ReactionStatistics` (hides a vote count unless it matches your own vote) gets fixed first, since `CommentItem` depends on the corrected behavior.

**Tech Stack:** React 18, TypeScript 5, Vitest + Testing Library, Storybook 8, Tailwind CSS, tRPC 11 (read-only `user.list` query only — no new procedures).

**Spec:** `docs/superpowers/specs/2026-07-13-comment-vote-buttons-design.md`

## Global Constraints

- Frontend-only: no Prisma schema changes, no new tRPC procedures, no server-side validation. (Confirmed no vote-related backend exists on this branch.)
- All vote counts start at zero on every render; no seeded/mock vote data anywhere.
- Vote state lives inside the component that renders each comment row and is discarded when that row unmounts (e.g. navigating to a different case and back). Not a global store, not persisted.
- Voter identity reuses the existing mock/seed user list and "current user" convention already used in `CaseComments` (`trpc.user.list.useQuery()`, first user in the list) — no new user list.
- Vote counts always display a numeral, including `"0"` when a side has no votes. This is an intentional, confirmed deviation from the Figma screenshots (which show a bare icon with no numeral at zero).
- No changes to `VoteButton.tsx` or `VoterTooltip.tsx` — both already behave correctly.

---

### Task 1: Fix `ReactionStatistics` count-visibility bug

**Files:**
- Modify: `packages/client/src/components/common/ReactionStatistics/ReactionStatistics.tsx`
- Modify: `packages/client/src/components/common/ReactionStatistics/ReactionStatistics.test.tsx`
- Modify: `packages/client/src/components/common/ReactionStatistics/README.md`

**Interfaces:**
- Consumes: `VoteButton` from `../VoteButton` (unchanged) — specifically relies on its existing `showCount?: boolean` prop, which **defaults to `true`** (see `VoteButton/types.ts`).
- Produces: `ReactionStatistics` keeps its existing public props (`ReactionStatisticsProps` in `types.ts` — unchanged), but now always renders both `upvotes` and `downvotes` as visible numerals (including `0`), regardless of `userVote`. Task 2 (`CommentItem`) depends on this corrected behavior.

- [ ] **Step 1: Update the failing test assertions**

Open `packages/client/src/components/common/ReactionStatistics/ReactionStatistics.test.tsx`. Replace the `describe('UserVote variant behavior', ...)` block's first three tests and the `describe('Default prop values', ...)` block's two tests with the following (test names and bodies both change):

```tsx
  describe('UserVote variant behavior', () => {
    it('shows both counts when userVote="none"', () => {
      render(<ReactionStatistics userVote="none" upvotes={5} downvotes={3} />);
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('shows both counts when userVote="up"', () => {
      render(<ReactionStatistics userVote="up" upvotes={5} downvotes={3} />);
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('shows both counts when userVote="down"', () => {
      render(<ReactionStatistics userVote="down" upvotes={5} downvotes={3} />);
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('makes upvote button active when userVote="up"', () => {
      render(<ReactionStatistics userVote="up" />);
      const upvoteButton = screen.getByLabelText('Upvote');
      expect(upvoteButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('makes downvote button active when userVote="down"', () => {
      render(<ReactionStatistics userVote="down" />);
      const downvoteButton = screen.getByLabelText('Downvote');
      expect(downvoteButton).toHaveAttribute('aria-pressed', 'true');
    });
  });
```

(Only the first three `it` blocks change — the two `aria-pressed` tests are shown for context/location and stay as-is.)

Then replace the `describe('Default prop values', ...)` block with:

```tsx
  describe('Default prop values', () => {
    it('shows both counts by default', () => {
      render(<ReactionStatistics upvotes={5} downvotes={3} />);
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('defaults upvotes and downvotes to 0, showing "0" on both sides', () => {
      render(<ReactionStatistics userVote="up" />);
      const counts = screen.getAllByText('0');
      expect(counts).toHaveLength(2);
    });
  });
```

- [ ] **Step 2: Run the tests to verify they fail against the current (buggy) component**

Run: `npm run test:client -- src/components/common/ReactionStatistics/ReactionStatistics.test.tsx`
Expected: FAIL — the 4 renamed/rewritten tests fail because the current component still hides counts based on `userVote`.

- [ ] **Step 3: Fix the component**

In `packages/client/src/components/common/ReactionStatistics/ReactionStatistics.tsx`, remove the two `showCount` overrides so `VoteButton`'s own default (`showCount = true`) applies unconditionally:

```tsx
      <VoteButton
        type="up"
        active={userVote === 'up'}
        count={upvotes}
        voters={upvoters}
        isPending={isPending}
        onClick={onUpvote}
      />
      <VoteButton
        type="down"
        active={userVote === 'down'}
        count={downvotes}
        voters={downvoters}
        isPending={isPending}
        onClick={onDownvote}
      />
```

(This replaces the two `<VoteButton .../>` elements that previously included a `showCount={userVote === 'up'}` / `showCount={userVote === 'down'}` line each.)

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm run test:client -- src/components/common/ReactionStatistics/ReactionStatistics.test.tsx`
Expected: PASS (all tests in the file, including the ones just rewritten)

- [ ] **Step 5: Update the README to match**

In `packages/client/src/components/common/ReactionStatistics/README.md`, replace the "Layout Variations" section:

```markdown
### Layout Variations

- **userVote='none'**: Two inactive buttons, both counts always shown (including "0")
- **userVote='up'**: Active up button + count, inactive down button + count
- **userVote='down'**: Inactive up button + count, active down button + count
```

And in the "Variant Mappings" table, replace the three `UserVote` rows' Notes column:

```markdown
| UserVote | None | `userVote` | `'none'` | Both buttons inactive; both counts always shown |
| UserVote | Up | `userVote` | `'up'` | Thumbs up active (teal); both counts always shown |
| UserVote | Down | `userVote` | `'down'` | Thumbs down active (red); both counts always shown |
```

And in the "Property Mappings" table, replace the `upvotes`/`downvotes` Notes:

```markdown
| - | - | `upvotes?: number` | Upvote count (always shown, including 0) |
| - | - | `downvotes?: number` | Downvote count (always shown, including 0) |
```

- [ ] **Step 6: Commit**

```bash
git add packages/client/src/components/common/ReactionStatistics/ReactionStatistics.tsx packages/client/src/components/common/ReactionStatistics/ReactionStatistics.test.tsx packages/client/src/components/common/ReactionStatistics/README.md
git commit -m "fix: always show ReactionStatistics vote counts, including 0"
```

---

### Task 2: Create the `CommentItem` component

**Files:**
- Create: `packages/client/src/components/CaseDetails/components/CaseComments/components/CommentItem/CommentItem.tsx`
- Create: `packages/client/src/components/CaseDetails/components/CaseComments/components/CommentItem/types.ts`
- Create: `packages/client/src/components/CaseDetails/components/CaseComments/components/CommentItem/index.ts`
- Create: `packages/client/src/components/CaseDetails/components/CaseComments/components/CommentItem/CommentItem.test.tsx`
- Create: `packages/client/src/components/CaseDetails/components/CaseComments/components/CommentItem/CommentItem.stories.tsx`

**Interfaces:**
- Consumes: `ReactionStatistics` from `@/components/common/ReactionStatistics`, props `{ userVote: 'none' | 'up' | 'down'; upvotes?: number; upvoters?: string[]; downvotes?: number; downvoters?: string[]; onUpvote?: () => void; onDownvote?: () => void }` — now fixed by Task 1 to always show both counts.
- Produces: `CommentItem` component and `CommentItemProps` type, exported via `index.ts`. Task 3 imports `{ CommentItem }` from `./components/CommentItem` and passes it `comment` (existing comment shape already used in `CaseComments.tsx`) and `currentUser` (existing `{ id, firstName, lastName, email } | undefined` already computed in `CaseComments.tsx` from `trpc.user.list.useQuery()`).

- [ ] **Step 1: Write the types file**

```ts
// packages/client/src/components/CaseDetails/components/CaseComments/components/CommentItem/types.ts
export interface CommentItemProps {
  comment: {
    id: string;
    content: string;
    createdAt: string;
    author: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
  };
  currentUser?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}
```

- [ ] **Step 2: Write the failing test**

```tsx
// packages/client/src/components/CaseDetails/components/CaseComments/components/CommentItem/CommentItem.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CommentItem } from './CommentItem';

const mockComment = {
  id: 'c1',
  content: 'Great point.',
  createdAt: '2024-01-15T10:00:00Z',
  author: { id: 'u1', firstName: 'Alex', lastName: 'Morgan', email: 'alex@example.com' },
};

const mockCurrentUser = {
  id: 'u2',
  firstName: 'Jamie',
  lastName: 'Lee',
  email: 'jamie@example.com',
};

describe('CommentItem', () => {
  it('renders comment author, timestamp, and content', () => {
    render(<CommentItem comment={mockComment} currentUser={mockCurrentUser} />);
    expect(screen.getByText('Alex Morgan')).toBeInTheDocument();
    expect(screen.getByText('Great point.')).toBeInTheDocument();
  });

  it('shows "0" on both sides when there are no votes', () => {
    render(<CommentItem comment={mockComment} currentUser={mockCurrentUser} />);
    expect(screen.getByLabelText('Upvote')).toHaveTextContent('0');
    expect(screen.getByLabelText('Downvote')).toHaveTextContent('0');
  });

  it('clicking upvote selects it and increments the count to 1', async () => {
    const user = userEvent.setup();
    render(<CommentItem comment={mockComment} currentUser={mockCurrentUser} />);

    await user.click(screen.getByLabelText('Upvote'));

    expect(screen.getByLabelText('Upvote')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByLabelText('Upvote')).toHaveTextContent('1');
    expect(screen.getByLabelText('Downvote')).toHaveTextContent('0');
  });

  it('clicking an active upvote again clears it back to 0', async () => {
    const user = userEvent.setup();
    render(<CommentItem comment={mockComment} currentUser={mockCurrentUser} />);

    await user.click(screen.getByLabelText('Upvote'));
    await user.click(screen.getByLabelText('Upvote'));

    expect(screen.getByLabelText('Upvote')).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByLabelText('Upvote')).toHaveTextContent('0');
  });

  it('clicking downvote while upvoted switches the vote to downvote', async () => {
    const user = userEvent.setup();
    render(<CommentItem comment={mockComment} currentUser={mockCurrentUser} />);

    await user.click(screen.getByLabelText('Upvote'));
    await user.click(screen.getByLabelText('Downvote'));

    expect(screen.getByLabelText('Upvote')).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByLabelText('Upvote')).toHaveTextContent('0');
    expect(screen.getByLabelText('Downvote')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByLabelText('Downvote')).toHaveTextContent('1');
  });

  it("shows the current user's name in the voter tooltip after upvoting", async () => {
    const user = userEvent.setup();
    render(<CommentItem comment={mockComment} currentUser={mockCurrentUser} />);

    await user.click(screen.getByLabelText('Upvote'));
    await user.hover(screen.getByLabelText('Upvote'));

    expect(await screen.findByText('Jamie Lee')).toBeInTheDocument();
  });

  it('does not record a vote when currentUser has not loaded yet', async () => {
    const user = userEvent.setup();
    render(<CommentItem comment={mockComment} currentUser={undefined} />);

    await user.click(screen.getByLabelText('Upvote'));

    expect(screen.getByLabelText('Upvote')).toHaveAttribute('aria-pressed', 'false');
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npm run test:client -- src/components/CaseDetails/components/CaseComments/components/CommentItem/CommentItem.test.tsx`
Expected: FAIL with a module-resolution error (`CommentItem.tsx` does not exist yet)

- [ ] **Step 4: Write the component**

```tsx
// packages/client/src/components/CaseDetails/components/CaseComments/components/CommentItem/CommentItem.tsx
import { useState } from 'react';
import { ReactionStatistics } from '@/components/common/ReactionStatistics';
import type { CommentItemProps } from './types';

export function CommentItem({ comment, currentUser }: CommentItemProps) {
  const [userVote, setUserVote] = useState<'none' | 'up' | 'down'>('none');

  const handleVote = (direction: 'up' | 'down') => {
    if (!currentUser) return;
    setUserVote((prev) => (prev === direction ? 'none' : direction));
  };

  const currentUserName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : '';
  const upvotes = userVote === 'up' ? 1 : 0;
  const downvotes = userVote === 'down' ? 1 : 0;
  const upvoters = userVote === 'up' ? [currentUserName] : [];
  const downvoters = userVote === 'down' ? [currentUserName] : [];

  return (
    <div className="flex flex-col gap-2 py-2">
      <div className="flex gap-2 items-center">
        <div className="w-10 flex items-center justify-center text-sm font-semibold text-gray-900">
          {comment.author.firstName[0]}
          {comment.author.lastName[0]}
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
      <ReactionStatistics
        userVote={userVote}
        upvotes={upvotes}
        upvoters={upvoters}
        downvotes={downvotes}
        downvoters={downvoters}
        onUpvote={() => handleVote('up')}
        onDownvote={() => handleVote('down')}
      />
    </div>
  );
}
```

- [ ] **Step 5: Write the index export**

```ts
// packages/client/src/components/CaseDetails/components/CaseComments/components/CommentItem/index.ts
export { CommentItem } from './CommentItem';
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `npm run test:client -- src/components/CaseDetails/components/CaseComments/components/CommentItem/CommentItem.test.tsx`
Expected: PASS (all 7 tests)

- [ ] **Step 7: Write the Storybook story**

`ReactionStatistics.stories.tsx` already covers every visual vote-state variant (None/Up/Down/voters/etc.) at the presentational level, and this codebase doesn't use Storybook `play` functions anywhere else — so `CommentItem`'s story only needs to show it in context (comment metadata + reaction row together), not re-demonstrate every vote state:

```tsx
// packages/client/src/components/CaseDetails/components/CaseComments/components/CommentItem/CommentItem.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { CommentItem } from './CommentItem';

const mockComment = {
  id: '1',
  content: 'This is a sample comment used to demonstrate the reaction row.',
  createdAt: new Date('2024-01-15T10:00:00Z').toISOString(),
  author: {
    id: '1',
    firstName: 'Alex',
    lastName: 'Morgan',
    email: 'alex@example.com',
  },
};

const mockCurrentUser = {
  id: '2',
  firstName: 'Jamie',
  lastName: 'Lee',
  email: 'jamie@example.com',
};

const meta: Meta<typeof CommentItem> = {
  title: 'Components/CaseDetails/CaseComments/CommentItem',
  component: CommentItem,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof CommentItem>;

export const Default: Story = {
  args: {
    comment: mockComment,
    currentUser: mockCurrentUser,
  },
};
```

- [ ] **Step 8: Commit**

```bash
git add packages/client/src/components/CaseDetails/components/CaseComments/components/CommentItem
git commit -m "feat: add CommentItem with local vote state"
```

---

### Task 3: Wire `CommentItem` into `CaseComments`

**Files:**
- Modify: `packages/client/src/components/CaseDetails/components/CaseComments/CaseComments.tsx:1-127`
- Modify: `packages/client/src/components/CaseDetails/components/CaseComments/CaseComments.test.tsx`
- Modify: `packages/client/src/components/CaseDetails/components/CaseComments/CaseComments.stories.tsx`

**Interfaces:**
- Consumes: `CommentItem` from `./components/CommentItem`, props `{ comment, currentUser }` (from Task 2). Consumes the existing `currentUser` already computed in `CaseComments.tsx` via `trpc.user.list.useQuery()`.
- Produces: `CaseComments` renders one `CommentItem` per comment. Public `CaseCommentsProps` (in `types.ts`) is unchanged — no consumers of `CaseComments` need to change.

- [ ] **Step 1: Write the failing integration test**

Add this test to the existing `packages/client/src/components/CaseDetails/components/CaseComments/CaseComments.test.tsx` (keep the existing `'renders without crashing'` test as-is, add a new one alongside it):

```tsx
  it('renders a reaction row with zero counts for each comment', () => {
    const mockCaseData = {
      id: '1',
      comments: [
        {
          id: 'c1',
          content: 'First comment',
          createdAt: '2024-01-15T10:00:00Z',
          author: { id: 'u1', firstName: 'Alex', lastName: 'Morgan', email: 'alex@example.com' },
        },
      ],
    };

    renderWithTrpc(<CaseComments caseData={mockCaseData} />);

    expect(screen.getByText('First comment')).toBeInTheDocument();
    expect(screen.getByLabelText('Upvote')).toHaveTextContent('0');
    expect(screen.getByLabelText('Downvote')).toHaveTextContent('0');
  });
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test:client -- src/components/CaseDetails/components/CaseComments/CaseComments.test.tsx`
Expected: FAIL — no reaction row exists yet (comments still render as plain `<div>`s with no `ReactionStatistics`)

- [ ] **Step 3: Update `CaseComments.tsx` to render `CommentItem`**

Add the import (after the existing `Textarea` import, before the `types` import):

```tsx
import { CommentItem } from './components/CommentItem';
```

Replace the per-comment `.map()` block (originally lines 96-120: the `caseData.comments.map((comment) => (...))` block rendering a raw `<div>` per comment) with:

```tsx
          caseData.comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} currentUser={currentUser} />
          ))
```

The full comments-list block should now read:

```tsx
      <div className="flex flex-col gap-4">
        {caseData.comments && caseData.comments.length > 0 ? (
          caseData.comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} currentUser={currentUser} />
          ))
        ) : (
          <div className="text-sm text-gray-500">No comments yet</div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test:client -- src/components/CaseDetails/components/CaseComments/CaseComments.test.tsx`
Expected: PASS (both tests)

- [ ] **Step 5: Fix the stale mock user shape in `CaseComments.stories.tsx`**

The existing story mocks use `{ id, name, email, ... }` for both the `user.list` MSW handler and each comment's `author`, but the real component (and now `CommentItem`) reads `firstName`/`lastName` — this was already stale before this feature (it would throw `Cannot read properties of undefined` if opened in Storybook) and must be fixed for the new per-comment rows to render voter names correctly. Replace the entire file:

```tsx
// packages/client/src/components/CaseDetails/components/CaseComments/CaseComments.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { TrpcProvider } from '@/lib/trpc';
import { CaseComments } from './CaseComments';

const mockUsers = [
  {
    id: '1',
    firstName: 'Alex',
    lastName: 'Morgan',
    email: 'alex@example.com',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

const mockCaseData = {
  id: '1',
  title: 'Test Case',
  description: 'Test description',
  status: 'IN_PROGRESS',
  comments: [
    {
      id: '1',
      content: 'This is the first comment on the case.',
      createdAt: new Date('2024-01-15T10:00:00Z').toISOString(),
      author: {
        id: '1',
        firstName: 'Alex',
        lastName: 'Morgan',
        email: 'alex@example.com',
      },
    },
    {
      id: '2',
      content: 'Here is a follow-up comment with more details.',
      createdAt: new Date('2024-01-16T14:30:00Z').toISOString(),
      author: {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
      },
    },
  ],
};

const meta: Meta<typeof CaseComments> = {
  title: 'Components/CaseDetails/CaseComments',
  component: CaseComments,
  parameters: {
    layout: 'padded',
    msw: {
      handlers: [
        http.get('/trpc/user.list', () => {
          return HttpResponse.json({
            result: {
              data: mockUsers,
            },
          });
        }),
        http.post('/trpc/user.list', () => {
          return HttpResponse.json({
            result: {
              data: mockUsers,
            },
          });
        }),
      ],
    },
  },
  decorators: [
    (Story) => (
      <TrpcProvider>
        <MemoryRouter>
          <div className="max-w-2xl">
            <Story />
          </div>
        </MemoryRouter>
      </TrpcProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    caseData: mockCaseData,
  },
};

export const NoComments: Story = {
  args: {
    caseData: {
      ...mockCaseData,
      comments: [],
    },
  },
};

export const ManyComments: Story = {
  args: {
    caseData: {
      ...mockCaseData,
      comments: [
        ...mockCaseData.comments,
        {
          id: '3',
          content: 'Adding another update to this case.',
          createdAt: new Date('2024-01-17T09:15:00Z').toISOString(),
          author: {
            id: '1',
            firstName: 'Alex',
            lastName: 'Morgan',
            email: 'alex@example.com',
          },
        },
        {
          id: '4',
          content: 'This is getting resolved now.',
          createdAt: new Date('2024-01-17T15:45:00Z').toISOString(),
          author: {
            id: '3',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
          },
        },
        {
          id: '5',
          content: 'Final comment before closing.',
          createdAt: new Date('2024-01-18T11:20:00Z').toISOString(),
          author: {
            id: '2',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane@example.com',
          },
        },
      ],
    },
  },
};
```

- [ ] **Step 6: Commit**

```bash
git add packages/client/src/components/CaseDetails/components/CaseComments/CaseComments.tsx packages/client/src/components/CaseDetails/components/CaseComments/CaseComments.test.tsx packages/client/src/components/CaseDetails/components/CaseComments/CaseComments.stories.tsx
git commit -m "feat: render CommentItem with voting for each case comment"
```

---

### Task 4: Full verification

**Files:** none (verification only)

**Interfaces:** none

- [ ] **Step 1: Run the full client test suite**

Run: `npm run test:client`
Expected: PASS — all suites green, including `ReactionStatistics.test.tsx`, `VoteButton.test.tsx`, `VoterTooltip.test.tsx`, `CommentItem.test.tsx`, and `CaseComments.test.tsx`

- [ ] **Step 2: Run typecheck**

Run: `npm run typecheck`
Expected: PASS — no type errors across workspaces

- [ ] **Step 3: Run lint**

Run: `npm run lint`
Expected: PASS — no lint errors across workspaces

- [ ] **Step 4: Manually verify in the running app**

Run: `npm run dev` (from repo root), open a case's detail page, add a comment if none exist, then:
- Click thumbs-up on a comment: icon fills teal, count goes from "0" to "1", thumbs-down stays "0".
- Hover/focus the thumbs-up count: tooltip shows the current user's name.
- Click thumbs-up again: clears back to "0", icon un-fills.
- Click thumbs-down while thumbs-up is active: thumbs-up clears to "0", thumbs-down fills red and shows "1".
- Resize the browser to ~331px wide (or use device toolbar): confirm the reaction row behaves identically (same click/toggle/tooltip behavior).
- Navigate to a different case and back: votes reset to "0" on both sides.

No commit for this task — it's verification only. If any step fails, return to the relevant task above and fix before proceeding.
