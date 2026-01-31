# VoteButton

A voting interaction component that allows users to upvote or downvote content. It displays a thumbs-up or thumbs-down icon, optionally shows the vote count, and automatically displays voter names in a tooltip when provided. The component can be in active (voted) or default (not voted) states with appropriate color coding.

## Features

- **Automatic Tooltip Integration**: When `voters` array is provided along with a `count`, the component automatically wraps itself with `VoterTooltip` to show voter names on hover
- **Smart Truncation**: Displays up to 3 voter names, then shows "+X more" for additional voters
- **Type-aware Styling**: Tooltip inherits the color scheme based on vote type (teal for up, red for down)
- **Accessibility**: Full keyboard navigation and screen reader support

## Figma Source

https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/Carton-Case-Management?node-id=3299-2779&t=3XuZBnUA9dL2i9Jv-4

## Accepted Design Differences

| Category | Figma | Implementation | File | Reason |
|----------|-------|----------------|------|--------|
| - | - | - | - | No accepted differences yet |

## Design-to-Code Mapping

### Variant Mappings

| Figma Variant | Figma Value | React Prop | React Value | Notes |
|---------------|-------------|------------|-------------|-------|
| Type | Up | `type` | `'up'` | Thumbs up icon, teal when active |
| Type | Down | `type` | `'down'` | Thumbs down icon, red when active |
| State | Default | `active` | `false` | Gray color (not voted) |
| State | Active | `active` | `true` | Colored (voted) |
| Count | true | `showCount` | `true` | Display vote count number |
| Count | false | `showCount` | `false` | Icon only |

### Property Mappings

| Figma Property | Type | React Prop | Notes |
|----------------|------|------------|-------|
| Type | Variant | `type: 'up' \| 'down'` | Required: vote direction |
| State | Variant | `active?: boolean` | Default false - voted state |
| Count | Boolean | `showCount?: boolean` | Default true - display count |
| - | - | `count?: number` | Vote count value (Figma shows "1") |
| - | - | `voters?: string[]` | Array of voter names for tooltip (shows first 3) |
| - | - | `onClick?: () => void` | Vote interaction handler |

### Excluded Properties (Handled Separately)

| Figma Property | Handling | Reason |
|----------------|----------|--------|
| Tooltip | Integrated via `voters` prop | VoterTooltip automatically wraps component when voters array is provided |

### Color Mapping

| Type | State | Color | CSS Variable |
|------|-------|-------|--------------|
| Up | Active | Teal #14b8a6 | `--teal/500` |
| Down | Active | Red #ef4444 | `--red/500` |
| Any | Default | Gray #334155 | `--unofficial/foreground-alt` |

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
