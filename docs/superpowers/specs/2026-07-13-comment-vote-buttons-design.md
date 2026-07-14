# Design: Like & Dislike buttons on Case Comments

**Source:** [GitHub issue #430](https://github.com/bitovi/carton-case-management/issues/430) — "Feature: Add Like & Dislike buttons to Case Comments"

## Summary

Add thumbs-up/thumbs-down voting controls to each comment on the Case Details view (desktop and mobile), with vote counts and a tooltip listing who voted. Frontend-only: local component state, no backend calls, no persistence.

## Scope

- Frontend UI/UX only. No Prisma schema changes, no tRPC procedures, no server-side validation. Confirmed no vote-related backend exists on this branch today.
- All vote counts start at zero on every render; no seeded/mock vote data.
- Vote state lives inside the component that renders each comment row and is discarded when that row unmounts — e.g. navigating to a different case and back. This is expected per the issue, not a bug to fix later.
- Voter identity reuses the same mock/seed user list and "current user" convention already used elsewhere in `CaseComments` (`trpc.user.list.useQuery()`, first user in the list) — no new user list is introduced.

## Existing components discovered (component-reuse audit)

All three UI pieces this feature needs already exist in `packages/client/src/components/common/`, each with a Code Connect mapping (`.figma.ts`) to the exact Figma frames referenced by this issue. None are currently used anywhere in the app.

| Figma node-id | Component | Location | Action |
|---|---|---|---|
| 3299-2958 | Reaction Statistics | `common/ReactionStatistics/` | Reuse, with one bug fix (below) |
| 3299-2779 | Vote Button | `common/VoteButton/` | Reuse as-is |
| 3311-8265 | Voter Tooltip | `common/VoterTooltip/` | Reuse as-is |

No new common/generic components are needed. The only new code is a domain wrapper (`CommentItem`, below) that supplies local vote state to `ReactionStatistics`.

## Component architecture

- **New:** `CommentItem` modlet at `packages/client/src/components/CaseDetails/components/CaseComments/components/CommentItem/`. Owns rendering of a single comment: author initials, name, timestamp, body (moved out of `CaseComments.tsx`), plus a `ReactionStatistics` row underneath.
- **Modified:** `CaseComments.tsx` keeps the comment-creation form and list-level concerns (loading/empty states, the `currentUser` fetch via `trpc.user.list`), and maps `comments` to `<CommentItem key={comment.id} comment={comment} currentUser={currentUser} />`.
- Reuses `ReactionStatistics` → `VoteButton` → `VoterTooltip` unchanged in shape/props (aside from the bug fix below).

## Vote state & interaction behavior

- `CommentItem` holds one `useState<'none' | 'up' | 'down'>('none')` for `userVote`.
- Clicking thumbs-up: if `userVote !== 'up'`, set to `'up'` (this also clears a prior `'down'`); if already `'up'`, clear to `'none'`. Thumbs-down is symmetric.
- Because this is unpersisted, single-viewer local state (no simulated other users), each side's count is derived directly from `userVote`, not stored independently:
  - `upvotes = userVote === 'up' ? 1 : 0`, `upvoters = userVote === 'up' ? [currentUser fullName] : []`
  - `downvotes` / `downvoters` mirror this for `'down'`.
  - Consequence: counts will only ever be 0 or 1 in the running app (no multi-user vote simulation), even though the Figma screenshots show fabricated example counts like 3 or 5 as static mockup data. This was confirmed as expected, not a shortfall.
- Voting is a no-op until `currentUser` has loaded, mirroring the existing guard on posting comments (`!currentUser` check).
- Behavior is identical on desktop and mobile — `ReactionStatistics` and its children use fixed-size, non-responsive classes already, so no additional mobile-specific styling is needed.

## Bug fix: `ReactionStatistics` count visibility

**Current behavior:** `ReactionStatistics.tsx` passes `showCount={userVote === 'up'}` to the upvote `VoteButton` and `showCount={userVote === 'down'}` to the downvote button — so a nonzero count on the side you *didn't* vote is hidden, and if you haven't voted at all, neither count shows.

**Required behavior:** both counts are always visible, including "0" when a side has no votes — regardless of which way the viewer voted.

> **Note — intentional deviation from Figma:** the screenshots show a bare icon with no numeral when a count is zero. Product direction (confirmed 2026-07-13) is to show "0" explicitly instead, so this implementation will look slightly different from the screenshots on that specific point.

**Fix:** remove the `showCount={...}` overrides entirely so `VoteButton`'s own default (`showCount = true`) applies unconditionally to both buttons — counts, including "0", always render. Update the existing test assertions in `ReactionStatistics.test.tsx` that encode the old hide-unless-voted behavior, and correct the "Layout Variations" section of `ReactionStatistics/README.md`.

## Testing & Storybook

- `CommentItem.test.tsx` (new): zero-vote initial state renders "0" on both sides; upvote click increments/selects; clicking the same button again clears the vote back to "0"; switching from up to down clears up and sets down; voter tooltip appears only for the side with an active vote (never on a "0" count) and shows the current user's name.
- `CommentItem.stories.tsx` (new): default (no votes), upvoted, downvoted.
- `CaseComments.stories.tsx` (modified): update for the new per-comment rows. While doing so, also fix the mock user shape (`{ name: '...' }` → `{ firstName, lastName }`) — it is currently stale relative to what the real component reads (`comment.author.firstName`/`lastName`), and must be correct for voter names to render properly in these stories.
- `ReactionStatistics.test.tsx` (modified): update the 3 assertions tied to the count-visibility fix.

## Out of scope

- No backend/Prisma/tRPC changes.
- No cross-session or multi-user vote simulation.
- No changes to `VoteButton.tsx` or `VoterTooltip.tsx` — both already behave correctly and need no modification.
