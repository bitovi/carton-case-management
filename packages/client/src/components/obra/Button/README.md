# Button

A versatile button component supporting multiple visual variants, sizes, roundness options, and optional icons. Matches the Obra shadcn-ui design system from Figma.

## Figma Source

https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=9-1071&m=dev

## Overview

The Button component provides 6 visual variants, 4 sizes, and 2 roundness options, creating 48 possible visual combinations. It supports optional left/right icons and handles all interaction states (hover, active, focus, disabled) through CSS.

## Accepted Design Differences

| Category | Figma | Implementation | File | Reason |
|----------|-------|----------------|------|--------|
| Element | `<div>` | `<button>` | Button.tsx | Semantic HTML for accessibility |
| Icon slot | Fixed IconSquareDashed | React.ReactNode prop | Button.tsx | Flexible icon support |
| State props | Separate State variant | CSS pseudo-classes | Button.tsx | Standard React/HTML pattern |

## Design-to-Code Mapping

### Variant Mappings

| Figma Variant | Figma Value | React Prop | React Value | Notes |
|---------------|-------------|------------|-------------|-------|
| Variant | Primary | `variant` | `'primary'` | Dark blue solid background (default) |
| Variant | Secondary | `variant` | `'secondary'` | Light gray solid background |
| Variant | Outline | `variant` | `'outline'` | Transparent with border |
| Variant | Ghost | `variant` | `'ghost'` | Transparent, subtle hover |
| Variant | Ghost Muted | `variant` | `'ghost-muted'` | Lighter ghost variant |
| Variant | Destructive | `variant` | `'destructive'` | Red for dangerous actions |
| Size | Large | `size` | `'large'` | Height 40px, font 14px |
| Size | Regular | `size` | `'regular'` | Height 36px, font 14px (default) |
| Size | Small | `size` | `'small'` | Height 32px, font 14px |
| Size | Mini | `size` | `'mini'` | Height 24px, font 12px |
| Roundness | Default | `roundness` | `'default'` | 8px border radius (default) |
| Roundness | Round | `roundness` | `'round'` | Fully rounded / pill shape (9999px) |

### Property Mappings

| Figma Property | Type | React Prop | Notes |
|----------------|------|------------|-------|
| Label | Text | `children` | Button content (text or elements) |
| Left icon wrapper | Instance | `leftIcon?: React.ReactNode` | Optional icon before text |
| Right icon wrapper | Instance | `rightIcon?: React.ReactNode` | Optional icon after text |
| - | - | `disabled?: boolean` | Standard HTML button disabled state |
| - | - | `className?: string` | Custom styling support |

### Excluded Properties (CSS/Internal State)

| Figma Property | Handling | Reason |
|----------------|----------|--------|
| State: Default | Default component styling | Initial render state |
| State: Hover & Active | CSS `:hover` and `:active` pseudo-classes | User interaction feedback |
| State: Focus | CSS `:focus-visible` pseudo-class | Keyboard navigation support |
| State: Disabled | `disabled` prop + CSS `:disabled` | Standard HTML behavior |
| showLeftIcon | Derived from `leftIcon` presence | If `leftIcon` provided, show it |
| showRightIcon | Derived from `rightIcon` presence | If `rightIcon` provided, show it |

## Color Variables

The Button component uses Tailwind's semantic color system with CSS variables defined in `index.css`, mapped to Figma's design tokens:

| Tailwind Class | CSS Variable | Figma Token | Hex Value | Usage |
|----------------|--------------|-------------|-----------|-------|
| `bg-primary` | `--primary` | general/primary | #0f172a | Primary button background |
| `text-primary-foreground` | `--primary-foreground` | general/primary foreground | #f8fafc | Primary button text |
| `bg-secondary` | `--secondary` | general/secondary | #f1f5f9 | Secondary button background |
| `text-secondary-foreground` | `--secondary-foreground` | general/secondary foreground | #0f172a | Secondary button text |
| `bg-destructive` | `--destructive` | general/destructive | #dc2626 | Destructive button color |
| `text-destructive-foreground` | `--destructive-foreground` | - | #fafafa | Destructive button text |
| `border-border` | `--border` | unofficial/border 3 | #cbd5e1 | Outline border |
| `bg-accent` | `--accent` | - | #f1f5f9 | Hover background for ghost/outline |
| `text-muted-foreground` | `--muted-foreground` | unofficial/ghost foreground | #334155 | Ghost muted text color |
| `ring-ring` | `--ring` | focus/ring | #cbd5e1 | Focus ring color |

These colors automatically adapt to dark mode when the `.dark` class is applied to the root element.

## Typography

| Size | Font Size | Line Height | Letter Spacing | Font Weight |
|------|-----------|-------------|----------------|-------------|
| Large/Regular/Small | 14px | 21px | 0.5px | 600 (Semibold) |
| Mini | 12px | 16px | 1.5px | 600 (Semibold) |

Font Family: Inter (var(--font-definitions/font-family-body))

## Spacing

- Icon gap: 8px (semantic/xs) between icon and text
- Border radius (default): 8px (semantic/rounded-lg)
- Border radius (round): 9999px (semantic/rounded-full)

## Usage

See [proposed-api.md](/.temp/design-components/button/proposed-api.md) for comprehensive usage examples and API documentation.
