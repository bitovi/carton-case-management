# VoterTooltip

A tooltip-style card component that displays voter information. It wraps the HoverCard component from the Obra design system to show voter details when hovering over a trigger element. The component has two type variants (Up/Down) that control the text color of the displayed content.

## Figma Source

https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/Carton-Case-Management?node-id=3311-8265&t=3XuZBnUA9dL2i9Jv-4

## Architecture

VoterTooltip uses the **HoverCard** component from the Obra design system (based on Radix UI's Hover Card primitive) to provide the floating card behavior and styling. It adds semantic meaning and type-based color variants for voting contexts.

### Dependencies
- `HoverCard` from `@/components/obra/HoverCard` - Provides the card container and hover behavior
- Radix UI Hover Card (via HoverCard) - Handles accessibility and interaction

## Accepted Design Differences

| Category | Figma | Implementation | File | Reason |
|----------|-------|----------------|------|--------|
| Trigger element | Not specified in Figma | Required `trigger` prop | types.ts | HoverCard requires explicit trigger element |

## Design-to-Code Mapping

### Variant Mappings

| Figma Variant | Figma Value | React Prop | React Value | Notes |
|---------------|-------------|------------|-------------|-------|
| Type | Up | `type` | `'up'` | Teal/green text color (text-teal-500) |
| Type | Down | `type` | `'down'` | Red text color (text-red-500) |

### Property Mappings

| Figma Property | Type | React Prop | Notes |
|----------------|------|------------|-------|
| Type | Variant | `type?: 'up' \| 'down'` | Default 'up' - controls text color theme |
| .Slot | Slot | `children: React.ReactNode` | Content to display in tooltip card |
| - | - | `trigger: React.ReactNode` | Element that triggers hover (required) |
| - | - | `className?: string` | Optional content container override |

### Structural Properties (from HoverCard)

| Property | Value | Notes |
|----------|-------|-------|
| Width | 200px | Fixed width via HoverCard |
| Content height | 48px | h-12 class on content container |
| Padding | 8px | Inherited from HoverCard (p-2) |
| Border radius | 8px | Inherited from HoverCard (rounded-lg) |
| Shadow | shadow-md | Inherited from HoverCard |
| Background | white | Inherited from HoverCard (bg-card) |
| Border | border-border | Inherited from HoverCard |

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
