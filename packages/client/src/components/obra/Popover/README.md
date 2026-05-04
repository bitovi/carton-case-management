# Popover

A popover displays rich content in a floating container anchored to a trigger element. This component provides a flexible and accessible way to show additional content without navigating away from the current context.

## Features

- **Flexible positioning**: Can be positioned on any side (top, right, bottom, left) relative to the trigger
- **Alignment options**: Content can be aligned to start, center, or end relative to the trigger
- **Controlled or uncontrolled**: Can be used with internal state or controlled externally
- **Accessible**: Built on Radix UI primitives with proper ARIA attributes
- **Responsive**: Automatically adjusts position to stay within viewport
- **Customizable**: Supports custom styling and content
- **Built-in header**: Optional header with title and description
- **Menu variant**: Compact styling for menu-like content

## Components

1. **Popover** - Root component that manages state and context
2. **PopoverTrigger** - Element that triggers the popover (button, link, etc.)
3. **PopoverContent** - The actual popover container with positioning and built-in header
4. **PopoverHeader** - Optional header component (automatically managed by PopoverContent)

## Content Variants

- **Default (Form)**: 16px padding, shows header when headerTitle/headerDescription provided
- **Menu**: 8px padding, header is automatically hidden, optimized for menu items

## Design Specs

| Property | Value | Tailwind Class | Location | Notes |
|----------|-------|----------------|----------|-------|
| Background | White | `bg-white` | PopoverContent | Solid background |
| Border | Light gray | `border-slate-200` | PopoverContent | Subtle border |
| Border radius | 8px | `rounded-lg` | PopoverContent | Modern rounded corners |
| Shadow | Large | `shadow-lg` | PopoverContent | Elevation effect |
| Min width | 200px | `min-w-[200px]` | PopoverContent | Minimum usable width |
| Max width | 400px | `max-w-[400px]` | PopoverContent | Prevents overly wide content |
| Z-index | 50 | `z-50` | PopoverContent | Appears above other content |
| Padding (Default) | 16px | `p-[16px]` | PopoverContent | Standard form content |
| Padding (Menu) | 8px | `p-[8px]` | PopoverContent | Compact menu content |

## Usage

### Basic Form Popover (with Header)

```tsx
import { Popover, PopoverTrigger, PopoverContent } from '@/components/obra/Popover';
import { Button } from '@/components/obra/Button';

function FormExample() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open settings</Button>
      </PopoverTrigger>
      <PopoverContent
        headerTitle="Settings"
        headerDescription="Configure your preferences below."
      >
        <div className="space-y-3">
          <input placeholder="Name" className="w-full px-3 py-2 border rounded" />
          <Button size="small">Save</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
```

### Menu Popover (No Header)

```tsx
import { Popover, PopoverTrigger, PopoverContent } from '@/components/obra/Popover';
import { Button } from '@/components/obra/Button';

function MenuExample() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">More options</Button>
      </PopoverTrigger>
      <PopoverContent content="Menu">
        <div className="flex flex-col gap-1">
          <Button variant="ghost" size="small">Edit</Button>
          <Button variant="ghost" size="small">Delete</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
```

### Controlled Example

```tsx
import { useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/obra/Popover';

function ControlledExample() {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button onClick={() => setOpen(!open)}>
          {open ? 'Close' : 'Open'} popover
        </Button>
      </PopoverTrigger>
      <PopoverContent
        headerTitle="Status"
        headerDescription={`Popover is ${open ? 'open' : 'closed'}`}
      >
        <div>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
```

### Positioning Example

```tsx
<Popover>
  <PopoverTrigger asChild>
    <Button>Trigger</Button>
  </PopoverTrigger>
  <PopoverContent
    side="top"
    align="start"
    sideOffset={10}
    headerTitle="Positioned Popover"
  >
    <div>Positioned above trigger, aligned to start</div>
  </PopoverContent>
</Popover>
```

## API Reference

### PopoverContent Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Content to display in the popover |
| `content` | `"Menu"` \| `undefined` | `undefined` | Variant style - "Menu" for compact menus |
| `headerTitle` | `string` | - | Title text for header (shown for non-Menu variants) |
| `headerDescription` | `string` | - | Description text for header (optional) |
| `side` | `"top" \| "right" \| "bottom" \| "left"` | `"bottom"` | Which side to position relative to trigger |
| `align` | `"start" \| "center" \| "end"` | `"center"` | How to align relative to trigger |
| `sideOffset` | `number` | `8` | Distance from trigger in pixels |
| `alignOffset` | `number` | `0` | Offset along the alignment axis |
| `className` | `string` | - | Additional CSS classes |

### Header Behavior

- **Default variant**: Header is shown when `headerTitle` or `headerDescription` is provided
- **Menu variant**: Header is automatically hidden regardless of props
- Header uses semantic HTML (`<h3>` for title, `<p>` for description)
- Proper spacing and typography automatically applied

### Form Example

```tsx
import { Input } from '@/components/obra/Input';
import { Label } from '@/components/obra/Label';

function FormExample() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Edit Settings</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="p-4 space-y-4">
          <h3 className="text-sm font-medium">Settings</h3>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Enter name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter email" />
          </div>
          <div className="flex gap-2">
            <Button size="small">Save</Button>
            <Button size="small" variant="outline">Cancel</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
```

## Props

### Popover Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `undefined` | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | `undefined` | Callback when open state changes |
| `modal` | `boolean` | `true` | Whether clicking outside closes the popover |
| `children` | `React.ReactNode` | - | PopoverTrigger and PopoverContent components |

### PopoverTrigger Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | Render as child component |
| `className` | `string` | - | Additional CSS classes |
| `children` | `React.ReactNode` | - | Trigger content |

### PopoverContent Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `align` | `'start' \| 'center' \| 'end'` | `'center'` | Alignment relative to trigger |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | Side to position relative to trigger |
| `sideOffset` | `number` | `8` | Distance from trigger |
| `alignOffset` | `number` | `0` | Alignment offset |
| `className` | `string` | - | Additional CSS classes |
| `children` | `React.ReactNode` | - | Popover content |

## Accessibility

- Uses Radix UI primitives for full keyboard navigation support
- Proper ARIA attributes for screen readers
- Focus management when opening/closing
- Escape key closes the popover
- Clicking outside closes the popover (when modal=true)

## Common Patterns

### Date Picker Popover

```tsx
<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline" className="gap-2">
      <CalendarIcon className="h-4 w-4" />
      {date ? format(date, 'MMM d, yyyy') : 'Select date'}
    </Button>
  </PopoverTrigger>
  <PopoverContent align="start" className="w-auto p-0">
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
    />
  </PopoverContent>
</Popover>
```

### Menu Popover

```tsx
<Popover>
  <PopoverTrigger asChild>
    <Button variant="ghost" size="small">
      <MoreHorizontal className="h-4 w-4" />
    </Button>
  </PopoverTrigger>
  <PopoverContent align="start" className="w-48">
    <div className="p-1">
      <button className="w-full text-left px-2 py-1 text-sm hover:bg-slate-100 rounded">
        Edit
      </button>
      <button className="w-full text-left px-2 py-1 text-sm hover:bg-slate-100 rounded">
        Delete
      </button>
    </div>
  </PopoverContent>
</Popover>
```
