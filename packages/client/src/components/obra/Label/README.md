# Label

Renders an accessible label associated with form controls.

## Figma Source

- **Design URL**: https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=279-98209
- **Documentation**: [shadcn/ui Label](https://ui.shadcn.com/docs/components/label)

## Figma Node IDs

| Variant | Node ID | Description |
|---------|---------|-------------|
| Block | `16:1663` | Default block-level label |
| Inline | `103:9452` | Inline label for checkboxes/radios |

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `layout` | `"block" \| "inline"` | `"block"` | Layout variant for the label |
| `htmlFor` | `string` | - | ID of the associated form control |
| `children` | `ReactNode` | - | Label text content |
| `className` | `string` | - | Additional CSS classes |

## Usage

### Basic Usage

```tsx
import { Label } from '@/components/obra/Label';

// Block layout (default)
<Label htmlFor="email">Email address</Label>

// Inline layout
<Label htmlFor="terms" layout="inline">
  I agree to the terms
</Label>
```

### With Form Input

```tsx
<div className="grid gap-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="Enter your email" />
</div>
```

### With Checkbox (inline)

```tsx
<div className="flex items-center gap-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms" layout="inline">
    Accept terms and conditions
  </Label>
</div>
```

## Design Token Mapping

| Figma Token | Tailwind Class | Value |
|-------------|----------------|-------|
| `general/foreground` | `text-foreground` | #0a0a0a |
| `paragraph/small/font-size` | `text-sm` | 14px |
| `font-weight: medium` | `font-medium` | 500 |
| `paragraph/small/line-height` | `leading-none` | 1 |

## Accessibility

- Uses native `<label>` element via Radix UI primitive
- Associate with form controls via `htmlFor` attribute
- Automatically handles `peer-disabled` styling when associated control is disabled
