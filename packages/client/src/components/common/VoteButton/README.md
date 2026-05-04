# VoteButton

A voting interaction component that allows users to upvote or downvote content. It displays a thumbs-up or thumbs-down icon, optionally shows the vote count, and automatically displays voter names in a tooltip when provided. The component can be in active (voted) or default (not voted) states with appropriate color coding.

## Features

- **Automatic Tooltip Integration**: When `voters` array is provided along with a `count`, the component automatically wraps itself with `VoterTooltip` to show voter names on hover
- **Smart Truncation**: Displays up to 3 voter names, then shows "+X more" for additional voters
- **Type-aware Styling**: Tooltip inherits the color scheme based on vote type (teal for up, red for down)
- **Accessibility**: Full keyboard navigation and screen reader support

## Usage Examples

### Basic Usage
```tsx
<VoteButton type="up" count={10} />
```

### With Voter Tooltip
```tsx
<VoteButton
  type="up"
  active={true}
  count={5}
  voters={['Alice', 'Bob', 'Charlie', 'David', 'Eve']}
/>
```
When hovering, this will show:
- Alice
- Bob
- Charlie
- +2 more

### Active State
```tsx
<VoteButton type="up" active={true} count={42} />
```

### Click Handler
```tsx
<VoteButton
  type="down"
  count={3}
  onClick={() => handleVote('down')}
/>
```

## Architecture

The VoteButton internally uses:
- **lucide-react icons**: ThumbsUp / ThumbsDown
- **VoterTooltip**: Automatically integrated when `voters` prop is provided
- **HoverCard**: (via VoterTooltip) for the hover interaction

When `voters` and `count` are provided, the component conditionally wraps itself with VoterTooltip, maintaining a clean API while providing rich functionality.

### Spacing & Dimensions

- Icon size: 24x24px
- Gap between icon and count: 8px
- Font: Inter Regular 14px
- Line height: 21px
