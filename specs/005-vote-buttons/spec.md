# Feature Specification: Vote Buttons (Like & Dislike)

**Feature Branch**: `005-vote-buttons`  
**Created**: 2026-04-02  
**Status**: Specified  
**Input**: Figma design — "Like & Dislike Buttons" page + Common Components / Comments

---

## Overview

Implement a vote button system that allows authenticated users to upvote or downvote comments on a case. The system renders a `VoteButton` (thumbs-up or thumbs-down) and a `ReactionStatistics` composite component (both buttons together) within the `Comment` component. A `VoterTooltip` appears on hover (desktop) or long press (mobile) to show who voted.

---

## Design References

| Component | Figma Link | Node ID |
|-----------|------------|---------|
| VoteButton | [Figma](https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj?node-id=3299-2779) | 3299:2779 |
| Reaction Statistics | [Figma](https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj?node-id=3299-2958) | 3299:2958 |
| Voter Tooltip | [Figma](https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj?node-id=3311-8265) | 3311:8265 |
| Comment (host component) | [Figma](https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj?node-id=3299-2768) | 3299:2768 |
| Desktop design page | [Figma](https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj?node-id=1106-9254) | 1106:9254 |
| Mobile design page | [Figma](https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj?node-id=1106-9259) | 1106:9259 |

---

## Component Architecture

Three React components are required, composing into the existing `Comment` component:

```
Comment
└── ReactionStatistics          ← composite row (up + down)
    ├── VoteButton (type=up)    ← single vote button + count
    │   └── VoterTooltip        ← hover/long-press voter list
    └── VoteButton (type=down)  ← single vote button + count
        └── VoterTooltip
```

### Figma → Code Naming

| Figma Name | Code Name | Notes |
|------------|-----------|-------|
| VoteButton | `VoteButton` | Single thumbs-up or thumbs-down button with count |
| Reaction Statistics | `ReactionStatistics` | Composite row of both VoteButtons |
| Voter Tooltip | `VoterTooltip` | Overlay listing user names who voted |
| Comment | `Comment` | Existing host component; embeds ReactionStatistics |

---

## Component Variants & States

### VoteButton — 4 Figma variant properties → 12 variants

| Property | Values | Notes |
|----------|--------|-------|
| `Type` | `up` \| `down` | Thumbs-up or thumbs-down |
| `State` | `default` \| `active` | Whether the current user has cast this vote |
| `Count` | `visible` \| `hidden` | Hidden when zero voters; visible otherwise |
| `Tooltip` | `hidden` \| `visible` | Whether the VoterTooltip is currently shown |

Tooltip=Visible only exists in Figma when Count=Visible (i.e., there must be at least one voter before the tooltip can show).

### ReactionStatistics — 3 variants

| Figma Variant | Meaning |
|---------------|---------|
| `User Vote=None` | Current user has not voted |
| `User Vote=Up` | Current user has upvoted |
| `User Vote=Down` | Current user has downvoted |

ReactionStatistics passes the user's current vote to each child VoteButton to derive its `State`.

### VoterTooltip — 2 variants

| Figma Variant | Meaning |
|---------------|---------|
| `Type=Up` | Shows list of users who upvoted |
| `Type=Down` | Shows list of users who downvoted |

---

## Visual Specifications (from Figma)

### VoteButton

- **Icon**: Lucide `thumbs-up` (Type=Up) or `thumbs-down` (Type=Down)
- **Icon size**: 16px
- **State=Default**: ghost/muted appearance; icon in gray
- **State=Active (upvote)**: icon and count rendered in a highlighted/filled style (teal/brand color — matches active state in design)
- **State=Active (downvote)**: icon and count rendered in **red** (distinct from the teal/brand active upvote color)
- **Count**: numeric text displayed to the right of the icon when Count=Visible
- **Count=Hidden**: when zero votes exist, no count label is rendered
- **Layout**: horizontal flex; icon + optional count; minimal padding

### ReactionStatistics

- **Layout**: horizontal flex row; VoteButton(up) then VoteButton(down), with a small gap between them
- **Both counts show independently**: if a comment has 3 upvotes and 2 downvotes, both numbers display simultaneously (confirmed by Justin Meyer: "Numbers are shown for both")

### VoterTooltip

- **Desktop**: appears on hover over the VoteButton (icon or count area); hover only (click is reserved for casting the vote)
- **Mobile**: appears on long press (minimum **500ms**) of the icon or count number; same tooltip presentation as desktop
- **Mobile dismissal**: tap outside the tooltip
- **Content**: list of user full names who cast that vote type (e.g., "Alex Morgan", "Greg Miller", "Andrew Smith")
- **Ordering**: current user's name appears first (if they voted), followed by remaining voters in reverse-chronological order (most recent first)
- **Truncation**: show a maximum of **3 names**; if more voters exist, append "and X others" (e.g., "and 4 others")
- **Applies to both Up and Down**: tooltip is available for both vote types
- **Zero-count behaviour**: tooltip does NOT appear when Count=Hidden (no voters exist)

---

## Behaviour

### Voting

1. A user clicks (desktop) or taps (mobile) the VoteButton to cast a vote.
2. If the user has **no existing vote** → their vote is recorded; the button transitions to `State=Active`.
3. If the user clicks their **already-active** vote type → the vote is removed (toggle off); button returns to `State=Default`.
4. If the user clicks the **opposite** vote type while already having voted → their vote is switched in a single action (no two-click requirement). Confirmed: *"A user can change their vote."*
5. **No role restrictions**: any authenticated user may vote on any comment. Confirmed: *"There are no restrictions on who can vote."*
6. **Self-voting**: users may vote on their own comments. Confirmed: *"they can vote on their own comment"*

### Vote Counts

- Counts reflect the total number of users who have cast that vote type.
- When count is 0, the count label is hidden (`Count=Hidden`).
- Both upvote and downvote counts are shown simultaneously and independently.
- **Large numbers**: counts ≥ 1000 are formatted using abbreviated notation (e.g., "1.2K", "2.4M").

### Vote Deletion Cascade

When a comment is deleted, all associated votes are also deleted. Confirmed: *"Yes, associated votes are removed."*

### Voter Tooltip — Desktop

- Triggered on **hover** over the VoteButton (icon or count); hover only — click is reserved for casting a vote.
- Shows the list of users who cast that vote type (current user first, then most recent; max 3 names then "and X others").
- Does not show if zero voters exist for that direction.

### Voter Tooltip — Mobile

- Triggered by **long press (≥ 500ms)** on the upvote/downvote icon or count number.
- Presents the same tooltip as desktop (same content and ordering rules).
- Dismissed by **tapping outside** the tooltip.
- Does not show if zero voters exist for that direction.

---

## User Scenarios & Testing

### User Story 1 — Cast a Vote (Priority: P1)

As a case worker reading comments on a case, I want to upvote or downvote a comment, so that I can signal my agreement or disagreement with the comment.

**Why this priority**: Core functionality of the feature; all other behaviour depends on it.

**Independent Test**: Click a thumbs-up button on a comment with no existing vote; verify the button transitions to active state and the count increments by 1.

**Acceptance Scenarios**:

1. **Given** a comment with no votes, **When** I click the upvote button, **Then** the upvote button enters Active state and the count changes from hidden to "1"
2. **Given** a comment where I have upvoted, **When** I click the upvote button again, **Then** my vote is removed, the button returns to Default state, and the count decrements (hidden if back to 0)
3. **Given** a comment where I have upvoted, **When** I click the downvote button, **Then** my vote is switched: upvote returns to Default and downvote becomes Active in a single action
4. **Given** a comment with 3 upvotes and 2 downvotes, **When** I view the comment, **Then** I see "3" next to thumbs-up and "2" next to thumbs-down simultaneously

---

### User Story 2 — View Who Voted (Priority: P2)

As a case worker, I want to see which users upvoted or downvoted a comment, so I can understand which colleagues agree or disagree.

**Why this priority**: Important contextual information, but the core voting action works independently.

**Independent Test**: Hover over a vote button that has at least one vote; verify the tooltip appears listing voter names.

**Acceptance Scenarios**:

1. **Given** a VoteButton with Count=Visible, **When** I hover over it (desktop), **Then** a tooltip appears listing the names of users who cast that vote
2. **Given** a VoteButton with Count=Hidden (zero votes), **When** I hover over it, **Then** no tooltip appears
3. **Given** a vote button with voters on mobile, **When** I long press the icon or count number, **Then** the voter list is presented
4. **Given** a downvote button with voters, **When** I hover over it, **Then** a voter tooltip appears for the downvote (tooltip applies to both directions)

---

### User Story 3 — Vote on Own Comment (Priority: P2)

As a case worker who authored a comment, I want to be able to vote on my own comment, so that there is no confusing disabled state to explain.

**Acceptance Scenarios**:

1. **Given** I am the author of a comment, **When** I view that comment, **Then** the vote buttons are enabled and functional

---

### User Story 4 — Vote Error Handling (Priority: P2)

As a user submitting a vote, I want the UI to revert cleanly if an error occurs, so that I am not left with an incorrect button state.

**Why this priority**: Important for data trust, but core voting must work first.

**Acceptance Scenarios**:

1. **Given** a vote action is in progress, **When** the server returns an error, **Then** the vote button silently reverts to its previous state (no error message shown to the user)
2. **Given** a vote action succeeds, **When** the response returns, **Then** the button reflects the confirmed server state

---

### Edge Cases

- **Zero votes**: count label is hidden, no tooltip shown on hover or long press
- **Own comment**: voting is permitted (no restriction)
- **Comment deleted**: all votes for that comment are deleted
- **Vote toggle**: clicking an active vote removes it; clicking the opposite switches in one action
- **Large vote counts**: counts ≥ 1000 use abbreviated format (e.g., "1.2K", "2.4M")
- **Real-time sync**: vote counts do not update live; counts reflect server state at page load
- **Vote submission loading state**: a spinner is shown on the button while the vote is in flight; button is not disabled

---

## Requirements

### Functional Requirements

- **FR-001**: System MUST provide a `VoteButton` component accepting `type` (up|down), `voteCount`, `isActive`, and `voters` props
- **FR-002**: System MUST provide a `ReactionStatistics` component that renders one Up and one Down `VoteButton`
- **FR-003**: System MUST provide a `VoterTooltip` component that renders a list of voter names
- **FR-004**: Clicking an inactive VoteButton MUST cast a vote of the corresponding type for the current user
- **FR-005**: Clicking an active VoteButton MUST remove the current user's vote (toggle off)
- **FR-006**: Clicking the opposite VoteButton while already voted MUST switch the vote in a single interaction (no double-click required)
- **FR-007**: System MUST allow any authenticated user to vote, with no role or assignment restrictions
- **FR-008**: System MUST allow users to vote on their own comments
- **FR-009**: Count label MUST be hidden when zero votes exist for that direction
- **FR-010**: Both upvote and downvote counts MUST display simultaneously and independently
- **FR-011**: VoterTooltip MUST be triggered by hover on desktop
- **FR-012**: VoterTooltip MUST be triggered by long press on mobile (on the icon or the count number)
- **FR-013**: VoterTooltip MUST NOT appear when count is zero
- **FR-014**: VoterTooltip MUST display for both upvote and downvote directions
- **FR-015**: When a comment is deleted, all its votes MUST also be deleted

### Visual Requirements (from Figma)

- **FR-016**: Upvote button MUST use Lucide `thumbs-up` icon (16px)
- **FR-017**: Downvote button MUST use Lucide `thumbs-down` icon (16px)
- **FR-018**: Active state MUST visually distinguish the voted button from the default state
- **FR-019**: Count MUST render as a numeric text label to the right of the icon
- **FR-020**: ReactionStatistics MUST lay out both VoteButtons in a horizontal flex row

### Data Requirements

- **FR-021**: Vote data MUST record: comment ID, user ID, vote type (up/down), and timestamp
- **FR-022**: A user MUST have at most one vote per comment (enforced at data layer)
- **FR-023**: API MUST expose: cast vote, remove vote, list voters per comment per direction
- **FR-024**: VoterTooltip MUST display a maximum of 3 voter names; additional voters MUST be summarised as "and X others"
- **FR-025**: Voters in the tooltip MUST be ordered with the current user first (if they voted), followed by remaining voters in reverse-chronological order
- **FR-026**: VoterTooltip on mobile MUST require a minimum long press of 500ms to trigger
- **FR-027**: VoterTooltip on mobile MUST be dismissed by tapping outside the tooltip
- **FR-028**: Desktop tooltip MUST be triggered by hover only; click on the VoteButton MUST cast/remove a vote (not open the tooltip)
- **FR-029**: VoteButton MUST display a spinner loading indicator while a vote submission is in flight
- **FR-030**: If a vote submission fails, the VoteButton MUST silently revert to its previous state (no error message shown)
- **FR-031**: Active downvote state MUST use red styling (distinct from the teal/brand active upvote color)
- **FR-032**: Vote counts ≥ 1000 MUST be displayed in abbreviated format (e.g., "1.2K", "2.4M")

---

## Key Entities

- **VoteButton**: A single directional vote button (up or down) with optional count and tooltip
- **ReactionStatistics**: Composite row embedding both VoteButtons for a single comment
- **VoterTooltip**: An overlay (tooltip/popover) listing the names of users who voted in a given direction
- **Vote**: A data record linking a user to a comment with a direction (up/down)

---

## Open Questions — Resolved

All questions raised in Figma comments have been answered:

| # | Question | Answer |
|---|----------|--------|
| OQ-1 | How many voter names show before truncating to "and X others"? | **3 names**, then "and X others" |
| OQ-2 | How are voters ordered in the tooltip? | **Current user first**, then remaining voters in reverse-chronological order (most recent first) |
| OQ-3 | What is the exact presentation of the voter list on mobile? | **Same tooltip as desktop** |
| OQ-4 | How is the mobile voter tooltip dismissed? | **Tap outside** the tooltip |
| OQ-5 | What is the minimum long press duration on mobile? | **500ms** |
| OQ-6 | What visual loading state is shown while a vote is being submitted? | **Spinner on the button** (button remains enabled) |
| OQ-7 | How are vote errors communicated? | **Silent failure** — button reverts to previous state; no error message shown |
| OQ-8 | Is the active downvote color distinct from the active upvote? | **Yes — red** (upvote uses teal/brand; downvote uses red) |
| OQ-9 | How should vote counts ≥ 1000 be formatted? | **Abbreviated notation** (e.g., "1.2K", "2.4M") |
| OQ-10 | Do vote counts update in real-time for other users? | **No** — page-load only; no live sync |
| OQ-11 | Is the tooltip triggered on hover only or also on click (desktop)? | **Hover only** — click is reserved for casting the vote |
| OQ-12 | Should a "No votes yet" message show when zero voters exist? | **Suppress tooltip entirely** — no count shown, no tooltip shown |

---

## Success Criteria

- **SC-001**: Any authenticated user can upvote or downvote a comment with a single click/tap
- **SC-002**: Toggling and switching votes updates the UI immediately (optimistic update) and is confirmed by the server
- **SC-003**: Upvote and downvote counts display independently and accurately on every comment
- **SC-004**: Voter tooltip appears on hover (desktop) for any VoteButton with at least one vote
- **SC-005**: Voter tooltip appears on long press (mobile) for any VoteButton with at least one vote
- **SC-006**: Vote buttons are keyboard accessible with appropriate ARIA labels for screen readers

---

## Out of Scope

- Real-time live sync of vote counts across sessions (page-load fetch only, per OQ-10)
- Rate limiting or abuse prevention on votes
- Anonymous voting (votes are always attributed to a specific user)
- Sorting or filtering comments by vote count
- Audit logging of vote history
- Notifications to comment authors when their comment receives a vote
 vote history
- Notifications to comment authors when their comment receives a vote
omment authors when their comment receives a vote
mment receives a vote
authors when their comment receives a vote
omment authors when their comment receives a vote
mment receives a vote
 vote history
- Notifications to comment authors when their comment receives a vote
omment authors when their comment receives a vote
mment receives a vote
