# Tooltip

A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.

## Figma Source

**Frame:** `Tooltip`  
**Node ID:** `274:57607`  
**File:** Obra Design System

## Installation

The Tooltip component requires `@radix-ui/react-tooltip`:

```bash
npm install @radix-ui/react-tooltip
```

## Usage

```tsx
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/obra/Tooltip';

// Wrap your app (or a section) with TooltipProvider
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>Hover me</TooltipTrigger>
    <TooltipContent>
      Tooltip content here
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

## API

### TooltipProvider

Wraps your app to provide global tooltip functionality. Should be placed at the root of your app or around a section that uses tooltips.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `delayDuration` | `number` | `700` | Delay before tooltip opens (ms) |
| `skipDelayDuration` | `number` | `300` | Time to skip delay when moving between tooltips |
| `disableHoverableContent` | `boolean` | `false` | Prevents tooltip from staying open when hovering content |

### Tooltip

The root component that manages the tooltip state.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Controlled open state |
| `defaultOpen` | `boolean` | `false` | Default open state |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when open state changes |
| `delayDuration` | `number` | - | Override provider delay |

### TooltipTrigger

The element that triggers the tooltip. Renders as a `button` by default.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | Merge props onto child element |

### TooltipContent

The content that appears in the tooltip popup.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'` | Preferred side to position tooltip |
| `align` | `'start' \| 'center' \| 'end'` | `'center'` | Alignment along the side |
| `sideOffset` | `number` | `4` | Distance from trigger |
| `showArrow` | `boolean` | `true` | Whether to show the arrow pointer |
| `className` | `string` | - | Additional CSS classes |

## Side Mapping (Figma → Code)

| Figma Value | Code Value |
|-------------|------------|
| Top | `side="top"` |
| Right | `side="right"` |
| Bottom | `side="bottom"` |
| Left | `side="left"` |

## Examples

### Basic Tooltip

```tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>
      <Button variant="outline">Hover me</Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>This is helpful information</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

### Tooltip with Different Sides

```tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button>Top</Button>
    </TooltipTrigger>
    <TooltipContent side="top">Top tooltip</TooltipContent>
  </Tooltip>
  
  <Tooltip>
    <TooltipTrigger asChild>
      <Button>Right</Button>
    </TooltipTrigger>
    <TooltipContent side="right">Right tooltip</TooltipContent>
  </Tooltip>
  
  <Tooltip>
    <TooltipTrigger asChild>
      <Button>Bottom</Button>
    </TooltipTrigger>
    <TooltipContent side="bottom">Bottom tooltip</TooltipContent>
  </Tooltip>
  
  <Tooltip>
    <TooltipTrigger asChild>
      <Button>Left</Button>
    </TooltipTrigger>
    <TooltipContent side="left">Left tooltip</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

### Without Arrow

```tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>No arrow</TooltipTrigger>
    <TooltipContent showArrow={false}>
      Tooltip without arrow pointer
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

### Controlled Tooltip

```tsx
const [open, setOpen] = useState(false);

<TooltipProvider>
  <Tooltip open={open} onOpenChange={setOpen}>
    <TooltipTrigger>Controlled</TooltipTrigger>
    <TooltipContent>
      This tooltip is controlled
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

## Accessibility

- Tooltip content is announced by screen readers when the trigger receives focus
- Keyboard users can trigger tooltips by focusing the trigger element
- The tooltip automatically hides when pressing Escape
- Uses `role="tooltip"` for proper ARIA semantics
- Arrow keys can be used to navigate when tooltip content is focusable

## Design Tokens

The component uses the following design tokens:

- `bg-popover` - Background color
- `text-popover-foreground` - Text color
- `border` - Border color
- `rounded-lg` - Border radius
- `shadow-md` - Shadow

## Animation

The tooltip includes smooth fade and scale animations:

- **Enter:** Fades in and scales up from the side it appears from
- **Exit:** Fades out and scales down

Animation classes used:
- `animate-in` / `animate-out`
- `fade-in-0` / `fade-out-0`
- `zoom-in-95` / `zoom-out-95`
- `slide-in-from-*` variants based on side
