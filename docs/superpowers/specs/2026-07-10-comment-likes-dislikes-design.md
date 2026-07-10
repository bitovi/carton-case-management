# Design: Like & Dislike Buttons for Case Comments

**Date:** 2026-07-10  
**Issue:** [#430 — Feature: Add Like & Dislike buttons to Case Comments](https://github.com/bitovi/carton-case-management/issues/430)  
**Scope:** Frontend only — local component state, no backend API changes

---

## Overview

Add thumbs-up (like) and thumbs-down (dislike) vote buttons to each comment on the Case Details view. Each button shows a running count. Hovering a count > 0 shows a HoverCard listing voter names. The current user's active vote is visually highlighted with teal styling. All vote state is local to the component — no persistence, no global store.

---

## Decisions Made

| Question | Answer |
|---|---|
| Can a user switch from like to dislike directly? | Yes — one click moves the vote; no need to un-vote first |
| Is a zero count hoverable? | No — the HoverCard is not rendered when count = 0 |
| Where does vote state live? | Inside each `CommentItem` instance via `useState` |

---

## Component Structure

```
CaseDetails/components/CaseComments/
  CaseComments.tsx              ← existing; updated to render CommentItem
  types.ts                      ← existing; updated to pass currentUserName
  index.ts                      ← existing; unchanged
  components/
    CommentItem/
      CommentItem.tsx           ← NEW: avatar + name + timestamp + text + vote row
      CommentItem.test.tsx      ← NEW
      CommentItem.stories.tsx   ← NEW
      types.ts                  ← NEW
      index.ts                  ← NEW
      components/
        VoteButton/
          VoteButton.tsx        ← NEW: icon + count + optional HoverCard
          VoteButton.test.tsx   ← NEW
          VoteButton.stories.tsx← NEW
          types.ts              ← NEW
          index.ts              ← NEW
```

`CaseComments` maps over comments and renders `<CommentItem>` for each, passing `comment` and `currentUserName`. The existing inline comment render block is removed.

---

## State & Data Flow

### Vote state shape (inside `CommentItem`)

```ts
type VoteType = 'like' | 'dislike' | null;

interface VoteState {
  likeVoters: string[];    // display names of users who liked
  dislikeVoters: string[]; // display names of users who disliked
  currentVote: VoteType;   // the current user's active vote
}
```

Initial state: `{ likeVoters: [], dislikeVoters: [], currentVote: null }`.

### Vote logic on button click

| Current vote | Clicked | Result |
|---|---|---|
| `null` | like | Add user to `likeVoters`, set `currentVote = 'like'` |
| `null` | dislike | Add user to `dislikeVoters`, set `currentVote = 'dislike'` |
| `'like'` | like | Remove user from `likeVoters`, set `currentVote = null` |
| `'dislike'` | dislike | Remove user from `dislikeVoters`, set `currentVote = null` |
| `'like'` | dislike | Remove from `likeVoters`, add to `dislikeVoters`, set `currentVote = 'dislike'` |
| `'dislike'` | like | Remove from `dislikeVoters`, add to `likeVoters`, set `currentVote = 'like'` |

### Current user identity

`CaseComments` already fetches `trpc.user.list.useQuery()` and uses `users?.[0]` as the current user. It passes `currentUserName` (first + last name string) as a prop to each `CommentItem`. No new API calls needed.

---

## VoteButton Component

### Props

```ts
interface VoteButtonProps {
  type: 'like' | 'dislike';
  count: number;
  voters: string[];       // names for the HoverCard tooltip
  isActive: boolean;      // whether the current user cast this vote
  onClick: () => void;
  disabled?: boolean;     // true while current user is loading
}
```

### Visual states

| State | Icon | Count color |
|---|---|---|
| Unselected | Lucide `ThumbsUp`/`ThumbsDown`, `text-gray-400` | `text-gray-500` |
| Selected/active | Same icon, `text-teal-600` | `text-teal-600` |

- The icon button itself is always clickable (when not `disabled`).
- When `count === 0`: render the count as plain text — no `HoverCard` wrapper.
- When `count > 0`: wrap the count in a `HoverCard` trigger; the card content lists voter names joined by `", "`.

### Layout

Below each comment text:

```
[👍 2] [👎 0]
```

Implemented as:

```tsx
<div className="flex items-center gap-3 mt-2">
  <VoteButton type="like" ... />
  <VoteButton type="dislike" ... />
</div>
```

Each `VoteButton` is `flex items-center gap-1` (icon + count side by side).

---

## CommentItem Component

Extracts the existing inline comment render from `CaseComments` (avatar initials block, author name, timestamp, content `<p>`) and appends the vote row beneath the content.

### Props

```ts
interface CommentItemProps {
  comment: {
    id: string;
    content: string;
    createdAt: string;
    author: { id: string; firstName: string; lastName: string; email: string };
  };
  currentUserName: string | null; // null while users are loading
}
```

---

## Testing Plan

### `VoteButton` unit tests
- Renders with thumbs-up icon and correct count
- Renders with thumbs-down icon and correct count
- Applies teal active styles when `isActive=true`
- Does not render a HoverCard when `count === 0`
- Renders a HoverCard with voter names when `count > 0`
- Calls `onClick` when the button is clicked

### `CommentItem` unit tests
- Renders author name, formatted timestamp, and comment text
- Clicking like increments count and marks like as active
- Clicking like again (toggle) decrements count and clears active state
- Clicking dislike after liking switches the vote (like decrements, dislike increments)
- Current user's name appears in the like voter list after clicking like

### `CaseComments` update
- Existing test updated: verify vote buttons are present on each rendered comment

---

## Out of Scope

- Backend API endpoints or data model for votes
- Persisting vote state across navigation or page refresh
- Pre-seeded mock vote data
- Role-based restrictions on tooltip visibility
