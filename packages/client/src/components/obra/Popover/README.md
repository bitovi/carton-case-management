# Popover

Displays rich content in a portal, triggered by a button.

## Note

This component is adapted from shadcn/ui as the Obra design system does not include a specific Popover component. It uses Obra styling conventions (rounded-lg borders, consistent spacing) while maintaining full Radix UI functionality.

## Installation

The Popover component requires `@radix-ui/react-popover`:

```bash
npm install @radix-ui/react-popover
```

## Usage

```tsx
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/obra/Popover';
import { Button } from '@/components/obra/Button';

<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">Open Popover</Button>
  </PopoverTrigger>
  <PopoverContent>
    Place content for the popover here.
  </PopoverContent>
</Popover>
```

## Components

### Popover

The root component that manages the popover state.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Controlled open state |
| `defaultOpen` | `boolean` | `false` | Default open state |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when open state changes |
| `modal` | `boolean` | `false` | Whether the popover is modal |

### PopoverTrigger

The button that toggles the popover. Use `asChild` to compose with your own button.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | Merge props onto child element |

### PopoverContent

The content that appears in the popover.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | Preferred side to position |
| `align` | `'start' \| 'center' \| 'end'` | `'center'` | Alignment along the side |
| `sideOffset` | `number` | `4` | Distance from trigger |
| `alignOffset` | `number` | `0` | Offset from alignment |

### PopoverAnchor

An optional element to anchor the popover to instead of the trigger.

### PopoverClose

A button that closes the popover.

## Examples

### Basic Popover

```tsx
<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">Click me</Button>
  </PopoverTrigger>
  <PopoverContent>
    <div className="grid gap-4">
      <div className="space-y-2">
        <h4 className="font-medium leading-none">Dimensions</h4>
        <p className="text-sm text-muted-foreground">
          Set the dimensions for the layer.
        </p>
      </div>
    </div>
  </PopoverContent>
</Popover>
```

### Controlled Popover

```tsx
const [open, setOpen] = useState(false);

<Popover open={open} onOpenChange={setOpen}>
  <PopoverTrigger asChild>
    <Button variant="outline">Controlled</Button>
  </PopoverTrigger>
  <PopoverContent>
    <p>This popover is controlled.</p>
    <PopoverClose asChild>
      <Button variant="outline" size="sm">Close</Button>
    </PopoverClose>
  </PopoverContent>
</Popover>
```

### With Form

```tsx
<Popover>
  <PopoverTrigger asChild>
    <Button>Update settings</Button>
  </PopoverTrigger>
  <PopoverContent className="w-80">
    <div className="grid gap-4">
      <div className="space-y-2">
        <h4 className="font-medium leading-none">Settings</h4>
        <p className="text-sm text-muted-foreground">
          Configure your preferences.
        </p>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="width">Width</Label>
        <Input id="width" defaultValue="100%" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="height">Height</Label>
        <Input id="height" defaultValue="auto" />
      </div>
    </div>
  </PopoverContent>
</Popover>
```

### Different Positions

```tsx
// Top
<PopoverContent side="top">Above the trigger</PopoverContent>

// Right
<PopoverContent side="right">To the right</PopoverContent>

// Left aligned at start
<PopoverContent side="bottom" align="start">
  Aligned to start
</PopoverContent>
```

## Accessibility

- Full keyboard navigation support
- Escape closes the popover
- Focus is trapped within the popover when open
- When modal, prevents interaction with content outside
- Screen reader announcements for open/close state
