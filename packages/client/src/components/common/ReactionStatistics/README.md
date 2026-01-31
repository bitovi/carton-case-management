# ReactionStatistics

A voting display component that shows thumbs up and thumbs down buttons with vote counts. It displays the user's current vote state (None, Up, or Down) and provides visual feedback through colored icons and count displays.

## Figma Source

https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/Carton-Case-Management?node-id=3299-2958&t=3XuZBnUA9dL2i9Jv-4

## Accepted Design Differences

| Category | Figma | Implementation | File | Reason |
|----------|-------|----------------|------|--------|
| - | - | - | - | No accepted differences yet |

## Design-to-Code Mapping

### Variant Mappings

| Figma Variant | Figma Value | React Prop | React Value | Notes |
|---------------|-------------|------------|-------------|-------|
| UserVote | None | `userVote` | `'none'` | Both buttons inactive, no counts |
| UserVote | Up | `userVote` | `'up'` | Thumbs up active (teal), shows upvote count |
| UserVote | Down | `userVote` | `'down'` | Thumbs down active (red), shows downvote count |

### Property Mappings

| Figma Property | Type | React Prop | Notes |
|----------------|------|------------|-------|
| UserVote | Variant | `userVote?: 'none' \| 'up' \| 'down'` | Default 'none' - controls active button |
| - | - | `upvotes?: number` | Upvote count (shown when userVote='up') |
| - | - | `downvotes?: number` | Downvote count (shown when userVote='down') |
| - | - | `onUpvote?: () => void` | Upvote click handler |
| - | - | `onDownvote?: () => void` | Downvote click handler |

### Color Mapping

| State | Color | CSS Variable |
|-------|-------|-------------|
| Active Up | Teal #14b8a6 | `--teal/500` |
| Active Down | Red #ef4444 | `--red/500` |
| Inactive | Gray #334155 | `--unofficial/foreground-alt` |

### Layout Variations

- **userVote='none'**: Two inactive buttons, no counts
- **userVote='up'**: Active up button + count, inactive down button
- **userVote='down'**: Inactive up button, active down button + count
