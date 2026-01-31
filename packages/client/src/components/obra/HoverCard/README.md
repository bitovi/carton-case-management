# HoverCard Component

A reusable hover card component from the Obra design system, built on Radix UI's Hover Card primitive.

## Overview

The HoverCard component provides a floating card that appears when hovering over a trigger element. It's built on [@radix-ui/react-hover-card](https://www.radix-ui.com/primitives/docs/components/hover-card) and follows the Obra design system specifications.

## Design Reference

- **Figma**: https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=303-246487
- **Component Type**: Obra design system component
- **Radix Primitive**: [@radix-ui/react-hover-card](https://www.radix-ui.com/primitives/docs/components/hover-card)

## Design-to-Code Mapping

| Figma Property | Code Prop | Notes |
|---------------|-----------|-------|
| Container (200px width) | `className` | Fixed 200px width via `w-[200px]` class |
| Border | `className` | Applied via `border border-border` |
| Background | `className` | Applied via `bg-card` |
| Shadow | `className` | Applied via `shadow-md` |
| Padding (8px) | `className` | Applied via `p-2` (8px) |
| Border Radius (8px) | `className` | Applied via `rounded-lg` |
| .Slot (48px height) | `children` | Content slot, 48px height |

## Usage

```tsx
import { HoverCard } from '@/components/obra/HoverCard';

function Example() {
  return (
    <HoverCard trigger={<button>Hover me</button>}>
      <div>Card content goes here</div>
    </HoverCard>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `trigger` | `ReactNode` | required | Element that triggers the hover card |
| `children` | `ReactNode` | required | Content to display in the hover card |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | Preferred side to render against |
| `sideOffset` | `number` | `5` | Distance in pixels from trigger |
| `align` | `'start' \| 'center' \| 'end'` | `'center'` | Alignment against trigger |
| `openDelay` | `number` | `700` | Delay before opening (ms) |
| `closeDelay` | `number` | `300` | Delay before closing (ms) |
| `className` | `string` | - | Additional CSS classes for content |

## Examples

### Basic Usage
```tsx
<HoverCard trigger={<span>Hover me</span>}>
  <p>This is a hover card</p>
</HoverCard>
```

### Custom Positioning
```tsx
<HoverCard 
  trigger={<button>Info</button>}
  side="top"
  align="start"
>
  <div>Top-aligned card</div>
</HoverCard>
```

### Custom Delays
```tsx
<HoverCard 
  trigger={<span>Quick hover</span>}
  openDelay={200}
  closeDelay={100}
>
  <div>Opens quickly</div>
</HoverCard>
```

### With Custom Styling
```tsx
<HoverCard 
  trigger={<button>Styled card</button>}
  className="bg-blue-50"
>
  <div>Custom background</div>
</HoverCard>
```

## Accessibility

- Automatically manages focus and keyboard navigation
- Supports escape key to close
- Provides proper ARIA attributes
- Works with screen readers

## Related Components

- **VoterTooltip**: Uses HoverCard internally to display voter information
- **Tooltip**: For simpler text-only tooltips from Obra system
- **Popover**: For click-triggered content

## Technical Notes

- Built on Radix UI's Hover Card primitive for robust accessibility
- Uses Radix Portal for proper z-index and positioning
- Includes animations via Tailwind classes
- 200px fixed width matches Figma design specifications
- Supports all standard Tailwind utility classes via `className` prop
