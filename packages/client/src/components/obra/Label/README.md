# Label

An accessible form label component that supports both inline and block layout modes. Matches the Obra design system from Figma.

## Figma Source

https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=103-9453&m=dev

## Overview

The Label component provides semantic HTML labels with configurable layout behavior. It supports inline layout (for labels next to form elements) and block layout (for labels above form elements), enabling flexible form design patterns.

## Accepted Design Differences

| Category | Figma | Implementation | File | Reason |
|----------|-------|----------------|------|--------|
| Element | Generic frame | `<label>` | Label.tsx | Semantic HTML for accessibility |
| Props | Layout prop | `layout` prop | Label.tsx | Explicit layout control |

## Design-to-Code Mapping

### Variant Mappings

| Figma Variant | Figma Value | React Prop | React Value | Notes |
|---------------|-------------|------------|-------------|-------|
| Layout | Inline | `layout` | `'inline'` | Inline display (default) |
| Layout | Block | `layout` | `'block'` | Block display |

### Property Mappings

| Figma Property | Type | React Prop | Notes |
|----------------|------|------------|-------|
| Label | Text | `children` | Label text content |
| - | - | `htmlFor` | Standard HTML label attribute for accessibility |
| - | - | `className` | Custom styling support |

### Excluded Properties (CSS/Internal State)

| Figma Property | Handling | Reason |
|----------------|----------|--------|
| Text color | CSS/Tailwind | Theme-based color system |
| Font styles | CSS/Tailwind | Typography system using CSS variables |
| Disabled state | CSS `:has()` selector | Inherited from associated input's disabled state |

## Typography

Based on Figma design tokens:
- **Font Family**: Inter (var(--font-definitions/font-family-body))
- **Font Size**: Small paragraph (12-14px)
- **Font Weight**: 500 (Medium)
- **Line Height**: paragraph/small/line height
- **Letter Spacing**: 0.5px

## Usage

See [proposed-api.md](/.temp/design-components/label/proposed-api.md) for comprehensive usage examples and API documentation.

### Basic Label
```tsx
<Label>Email address</Label>
```

### With Form Input (Inline)
```tsx
<div className="flex items-center gap-2">
  <Label htmlFor="email" layout="inline">Email:</Label>
  <Input id="email" type="email" />
</div>
```

### With Form Input (Block)
```tsx
<div className="space-y-2">
  <Label htmlFor="username" layout="block">Username</Label>
  <Input id="username" type="text" />
</div>
```
