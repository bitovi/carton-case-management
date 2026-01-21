# Skeleton

A placeholder loading state component that displays animated pulse effects while content is loading.

## Figma Source

https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=303-246601

## Design-to-Code Mapping

### Variant Mappings

| Figma Component | React Props | Notes |
|-----------------|-------------|-------|
| SkeletonPlaceholderLine | `variant="line"` | Thin bar for text placeholders |
| SkeletonPlaceholderObject | `variant="object"` | Rectangle for cards/images |
| SkeletonPlaceholderAvatar | `variant="avatar"` | Circle for user avatars |
| Skeleton (composite) | Compose with multiple `<Skeleton>` | Layout example, not a prop |

### Property Mappings

| Figma Property | React Prop | Values | Notes |
|----------------|------------|--------|-------|
| Component Type | `variant` | `'default'` \| `'line'` \| `'object'` \| `'avatar'` | Determines shape |
| Size (Avatar) | `size` | `'sm'` \| `'md'` \| `'lg'` | Only applies to avatar variant |

### Size Values

| Size | Dimensions | Use Case |
|------|-----------|----------|
| `sm` | 32×32px | Small avatars, icons |
| `md` | 48×48px | Standard avatars |
| `lg` | 64×64px | Large profile images |

### Excluded Properties (CSS/Internal)

| Figma Property | Handling | Reason |
|----------------|----------|--------|
| Background Color | Tailwind `bg-neutral-100` | Hardcoded to match design |
| Border Radius | Tailwind `rounded-lg` / `rounded-full` | Based on variant |
| Animation | Tailwind `animate-pulse` | Standard loading animation |

## Usage

### Basic Placeholders

```tsx
// Text line
<Skeleton variant="line" className="w-full" />

// Rectangle block
<Skeleton variant="object" className="h-32 w-full" />

// Avatar
<Skeleton variant="avatar" size="md" />
```

### Card Loading Pattern

```tsx
<div className="flex flex-col gap-4">
  <div className="flex items-center gap-4">
    <Skeleton variant="avatar" />
    <div className="space-y-2">
      <Skeleton variant="line" className="w-64" />
      <Skeleton variant="line" className="w-48" />
    </div>
  </div>
  <Skeleton variant="object" className="h-32 w-full" />
</div>
```

### Table Row Loading

```tsx
<div className="flex items-center gap-4 p-4">
  <Skeleton variant="avatar" size="sm" />
  <Skeleton variant="line" className="w-[200px]" />
  <Skeleton variant="line" className="w-[100px]" />
  <Skeleton variant="line" className="w-[80px]" />
</div>
```

## Accessibility

- All skeletons have `aria-hidden="true"` as they are purely decorative
- Wrap loading sections in `role="status"` with `aria-live="polite"` for screen reader announcements
- Provide accessible loading text for screen readers

```tsx
<div role="status" aria-live="polite">
  <span className="sr-only">Loading...</span>
  <Skeleton variant="line" className="w-full" />
</div>
```
