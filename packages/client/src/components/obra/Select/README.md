# Select

A comprehensive Select & Combobox system with enhanced variants for size, state, and item types.

## Figma Source

- **Design URL**: https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=281-104714
- **Documentation**: [shadcn/ui Select](https://ui.shadcn.com/docs/components/select)

## Components

This module provides enhanced versions of the Select components:

| Component | Description |
|-----------|-------------|
| `Select` | Root component (re-exported from Radix) |
| `SelectGroup` | Groups related items (re-exported from Radix) |
| `SelectValue` | Displays selected value (re-exported from Radix) |
| `SelectTrigger` | **Enhanced** - Trigger button with size/state variants |
| `SelectContent` | Dropdown container (re-exported from ui/select) |
| `SelectItem` | **Enhanced** - Selectable item with variant/size props |
| `SelectLabel` | **Enhanced** - Group label with size/indented props |
| `SelectSeparator` | Divider between items (re-exported from ui/select) |

## Figma Node IDs

### SelectTrigger
| Variant | Node ID |
|---------|---------|
| Size=Default, State=Default, Lines=1 Line | `16:1730` |
| Size=Default, State=Focus, Lines=1 Line | `16:1731` |
| Size=Default, State=Error, Lines=1 Line | `18:980` |
| Size=Default, State=Disabled, Lines=1 Line | `18:976` |
| Size=Large, State=Default, Lines=1 Line | `19:1478` |
| Size=Small, State=Default, Lines=1 Line | `19:1574` |
| Size=Mini, State=Default, Lines=1 Line | `281:105885` |
| Size=Default, State=Default, Lines=2 Lines | `68:17940` |

### SelectItem
| Variant | Node ID |
|---------|---------|
| Size=Regular, Type=Default, State=Default | `18:995` |
| Size=Regular, Type=Default, State=Hover | `65:4976` |
| Size=Regular, Type=Default, State=Selected | `18:996` |
| Size=Regular, Type=Destructive, State=Default | `68:17850` |
| Size=Large, Type=Default, State=Default | `176:26563` |

### SelectLabel
| Variant | Node ID |
|---------|---------|
| Type=Small, Indented?=False | `18:998` |
| Type=Small, Indented?=True | `80:10188` |
| Type=Regular, Indented?=False | `80:10194` |
| Type=Regular, Indented?=True | `80:10196` |

## Props

### SelectTrigger

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"default" \| "lg" \| "sm" \| "mini"` | `"default"` | Trigger height variant |
| `state` | `"default" \| "error"` | `"default"` | Visual state |
| `lines` | `"single" \| "double"` | `"single"` | Single or double line display |

### SelectItem

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"regular" \| "lg"` | `"regular"` | Item height variant |
| `variant` | `"default" \| "destructive"` | `"default"` | Item type |
| `description` | `string` | - | Secondary line of text |

### SelectLabel

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"sm" \| "default"` | `"default"` | Label text size |
| `indented` | `boolean` | `false` | Whether label is indented |

## Usage

### Basic Select

```tsx
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/obra/Select';

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select an item" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

### Size Variants

```tsx
// Default (36px)
<SelectTrigger size="default">...</SelectTrigger>

// Large (40px)
<SelectTrigger size="lg">...</SelectTrigger>

// Small (32px)
<SelectTrigger size="sm">...</SelectTrigger>

// Mini (32px with smaller text)
<SelectTrigger size="mini">...</SelectTrigger>
```

### Error State

```tsx
<SelectTrigger state="error">
  <SelectValue placeholder="Required field" />
</SelectTrigger>
```

### With Groups

```tsx
<SelectContent>
  <SelectGroup>
    <SelectLabel>Fruits</SelectLabel>
    <SelectItem value="apple">Apple</SelectItem>
    <SelectItem value="banana">Banana</SelectItem>
  </SelectGroup>
  <SelectSeparator />
  <SelectGroup>
    <SelectLabel size="sm" indented>More Options</SelectLabel>
    <SelectItem value="other">Other</SelectItem>
  </SelectGroup>
</SelectContent>
```

### Destructive Item

```tsx
<SelectContent>
  <SelectItem value="edit">Edit</SelectItem>
  <SelectItem value="duplicate">Duplicate</SelectItem>
  <SelectSeparator />
  <SelectItem value="delete" variant="destructive">Delete</SelectItem>
</SelectContent>
```

### With Description

```tsx
<SelectContent>
  <SelectItem value="free" description="Basic features included">
    Free Plan
  </SelectItem>
  <SelectItem value="pro" description="Everything in Free, plus more">
    Pro Plan
  </SelectItem>
</SelectContent>
```

## Design Token Mapping

| Figma Token | Tailwind | Value |
|-------------|----------|-------|
| Default height | `h-9` | 36px |
| Large height | `h-10` | 40px |
| Small/Mini height | `h-8` | 32px |
| Two-line height | `min-h-[52px]` | 52px |
| Border | `border-input` | Input border color |
| Error border | `border-destructive` | Red |
| Focus ring | `ring-ring` | Ring color |
