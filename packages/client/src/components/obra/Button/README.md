# Button

A versatile button component supporting multiple visual variants, sizes, and optional icon slots. Based on the Obra shadcn-ui design system.

## Figma Source

https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=273-30945&m=dev

## Design-to-Code Mapping

### Variant Mappings

| Figma Variant | Figma Value | React Prop | React Value | Notes |
|---------------|-------------|------------|-------------|-------|
| Variant | Primary | `variant` | `'default'` | Solid primary background |
| Variant | Secondary | `variant` | `'secondary'` | Muted background |
| Variant | Outline | `variant` | `'outline'` | Border with transparent bg |
| Variant | Ghost | `variant` | `'ghost'` | No background |
| Variant | Destructive | `variant` | `'destructive'` | Red/danger style |
| Size | Default | `size` | `'default'` | Height 36px (h-9) |
| Size | Large | `size` | `'lg'` | Height 40px (h-10) |
| Size | Small | `size` | `'sm'` | Height 32px (h-8) |
| Size | Mini | `size` | `'xs'` | Height 24px (h-6) |
| Roundness | Default | `roundness` | `'default'` | Standard radius (rounded-md) |
| Roundness | Round | `roundness` | `'round'` | Pill shape (rounded-full) |

### Property Mappings

| Figma Property | Type | React Prop | Notes |
|----------------|------|------------|-------|
| showLeftIcon | Boolean | `leftIcon?: ReactNode` | Renders when prop provided |
| Left icon | Instance | `leftIcon` | Accepts any ReactNode |
| showRightIcon | Boolean | `rightIcon?: ReactNode` | Renders when prop provided |
| Right icon | Instance | `rightIcon` | Accepts any ReactNode |
| Label | Text | `children` | Button content |

### Excluded Properties (CSS/Internal)

| Figma Property | Handling | Reason |
|----------------|----------|--------|
| State: Hover & Active | Tailwind `hover:` | Pseudo-state |
| State: Focus | Tailwind `focus-visible:` | Pseudo-state |
| State: Disabled | `disabled` prop + CSS | Standard HTML attribute |

## Usage

```tsx
import { Button } from '@/components/obra/Button';
import { Plus, ChevronRight, Trash2 } from 'lucide-react';

// Basic
<Button>Click me</Button>

// Variants
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>

// Sizes
<Button size="lg">Large</Button>
<Button size="sm">Small</Button>
<Button size="xs">Mini</Button>

// Rounded (pill)
<Button roundness="round">Rounded</Button>

// With icons
<Button leftIcon={<Plus />}>Add Item</Button>
<Button rightIcon={<ChevronRight />}>Continue</Button>

// Loading state
<Button loading>Saving...</Button>

// Disabled
<Button disabled>Disabled</Button>
```
