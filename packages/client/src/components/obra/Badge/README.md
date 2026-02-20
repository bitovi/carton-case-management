# Badge

A presentational label component for displaying status, categories, tags, or metadata with multiple visual variants.

## Figma Source

https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=19-6979&t=CBcDIsffOarS4ySr-4

## Accepted Design Differences

| Category | Figma | Implementation | File | Reason |
|----------|-------|----------------|------|--------|
| Icons | Fixed SVG assets | ReactNode props | Badge.tsx | Icon flexibility - users provide their own icon components |
| Focus state | Variant property | CSS :focus-visible | Badge.tsx | Focus is a browser behavior, not user-controlled prop |

## Design-to-Code Mapping

### Variant Mappings

| Figma Variant | Figma Value | React Prop | React Value | Notes |
|---------------|-------------|------------|-------------|-------|
| Variant | Primary | `variant` | `'primary'` | Black background, white text (default) |
| Variant | Secondary | `variant` | `'secondary'` | Light gray background, dark text |
| Variant | Outline | `variant` | `'outline'` | Transparent with border |
| Variant | Ghost | `variant` | `'ghost'` | Fully transparent |
| Variant | Destructive | `variant` | `'destructive'` | Red background, white text |
| Roundness | Default | `roundness` | `'default'` | 8px border radius (default) |
| Roundness | Round | `roundness` | `'round'` | 9999px border radius (pill-shaped) |

### Property Mappings

| Figma Property | Type | React Prop | Notes |
|----------------|------|------------|-------|
| Show Icon Left | Boolean | `iconLeft?: ReactNode` | Renders icon before text when provided |
| Show Icon Right | Boolean | `iconRight?: ReactNode` | Renders icon after text when provided |
| Label | Text | `children` | Badge text content |

### Excluded Properties (CSS/Internal)

| Figma Property | Handling | Reason |
|----------------|----------|--------|
| State: Default | Default CSS | Normal visual state |
| State: Focus | CSS :focus-visible | Browser pseudo-state with ring styling |

## Typography Specifications

- Font: Inter Semibold
- Size: 12px
- Line height: 16px
- Letter spacing: 0.18px (1.5%)
- Font weight: 600

## Layout Specifications

- Gap: 6px between elements
- Padding: 3px vertical, 8px horizontal
- Min height: 24px
- Alignment: Center (both vertical and horizontal)

## Color Tokens

- **Primary**: `bg-primary` / `text-primary-foreground`
- **Secondary**: `bg-secondary` / `text-secondary-foreground`
- **Outline**: `bg-transparent` / `border-border` / `text-foreground`
- **Ghost**: `bg-transparent` / `text-foreground`
- **Destructive**: `bg-destructive` / `text-white`
- **Focus ring (standard)**: `var(--focus-ring, #CBD5E1)`
- **Focus ring (error)**: `var(--focus-ring-error, #FCA5A5)`
