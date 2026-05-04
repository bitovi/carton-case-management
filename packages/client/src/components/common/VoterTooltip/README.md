# VoterTooltip

A tooltip-style card component that displays voter information. It wraps the HoverCard component from the Obra design system to show voter details when hovering over a trigger element. The component has two type variants (Up/Down) that control the text color of the displayed content.

## Architecture

VoterTooltip uses the **HoverCard** component from the Obra design system (based on Radix UI's Hover Card primitive) to provide the floating card behavior and styling. It adds semantic meaning and type-based color variants for voting contexts.

### Dependencies
- `HoverCard` from `@/components/obra/HoverCard` - Provides the card container and hover behavior
- Radix UI Hover Card (via HoverCard) - Handles accessibility and interaction

## Usage

```tsx
import { VoterTooltip } from '@/components/common/VoterTooltip';

// Basic usage with upvote
<VoterTooltip
  type="up"
  trigger={<button>10 upvotes</button>}
>
  <span>Alice, Bob, Charlie</span>
</VoterTooltip>

// With downvote styling
<VoterTooltip
  type="down"
  trigger={<button>2 downvotes</button>}
>
  <span>David, Eve</span>
</VoterTooltip>
```

## Props

See `types.ts` for full prop definitions.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'up' \| 'down'` | `'up'` | Voting type variant (affects text color) |
| `trigger` | `ReactNode` | required | Element that triggers the hover card |
| `children` | `ReactNode` | required | Content to display in the card |
| `className` | `string` | - | Additional CSS classes for content container |

## Related Components

- **HoverCard** (`@/components/obra/HoverCard`) - Base card component used internally
- **VoteButton** (`@/components/common/VoteButton`) - Often used as trigger element
- **ReactionStatistics** (`@/components/common/ReactionStatistics`) - Uses VoteButton which can trigger VoterTooltip
