# Design Context: Badge

## Figma Source

https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=19-6979&m=dev

## Component Overview

A Badge component for displaying status labels, tags, or notifications. Supports multiple visual styles (variants), two border radius options (roundness), and focus states.

## Visual Reference

The component shows a 4x5 grid layout displaying all variant combinations:

- **Row Layout**: Default roundness (top), Round roundness (bottom for each variant group)
- **Column Layout**: Primary, Secondary, Outline, Ghost, Destructive (left to right)
- **Text Content**: All badges display "Label"
- **Size**: Compact inline element with horizontal padding

## Raw Design Data

### TypeScript Interface from Figma

```typescript
type BadgeProps = {
  className?: string;
  roundness?: 'Default' | 'Round';
  state?: 'Default' | 'Focus';
  variant?: 'Primary' | 'Secondary' | 'Outline' | 'Ghost' | 'Destructive';
};
```

### Variant Combinations

The component has 20 total variant combinations:

- 5 Variants (Primary, Secondary, Outline, Ghost, Destructive)
- 2 Roundness options (Default, Round)
- 2 States (Default, Focus)

**Full Variant Matrix:**

| Variant     | Roundness | State   | Node ID    |
| ----------- | --------- | ------- | ---------- |
| Primary     | Default   | Default | 19:7020    |
| Primary     | Round     | Default | 757:121927 |
| Secondary   | Default   | Default | 19:7012    |
| Secondary   | Round     | Default | 757:121935 |
| Outline     | Default   | Default | 19:7092    |
| Outline     | Round     | Default | 757:121943 |
| Ghost       | Default   | Default | 19:7068    |
| Ghost       | Round     | Default | 757:121951 |
| Destructive | Default   | Default | 19:7044    |
| Destructive | Round     | Default | 757:121959 |
| Primary     | Default   | Focus   | 162:17776  |
| Primary     | Round     | Focus   | 757:121967 |
| Secondary   | Default   | Focus   | 162:17768  |
| Secondary   | Round     | Focus   | 757:121975 |
| Outline     | Default   | Focus   | 162:17752  |
| Outline     | Round     | Focus   | 757:121983 |
| Ghost       | Default   | Focus   | 162:17760  |
| Ghost       | Round     | Focus   | 757:121991 |
| Destructive | Default   | Focus   | 162:17784  |
| Destructive | Round     | Focus   | 757:121999 |

### Code Connect Mappings

All variants show the same pattern:

```tsx
<Badge variant="[variant]" roundness="[roundness]">
  Label
</Badge>
```

Where:

- `variant`: "primary" | "secondary" | "outline" | "ghost" | "destructive"
- `roundness`: "default" | "round"

### Typography & Styling

**Text Style:** paragraph mini/bold

- Font family: "font definitions/font-family-body"
- Font weight: 600 (Semibold)
- Font size: paragraph/mini/font size
- Line height: paragraph/mini/line height
- Letter spacing: 1.5

**Focus Ring Effects:**

- focus ring: DROP_SHADOW with color focus/ring, spread: 3px
- focus ring error: DROP_SHADOW with color focus/ring error, spread: 3px

### Structural Notes

- **No nested components**: Badge is a simple text container
- **No boolean properties**: All configuration through variants
- **No instance swaps**: No icon slots or customizable children beyond text
- **No text layer properties**: Text content should be passed as children
- **State=Focus is CSS-only**: Should be handled by `:focus-visible` pseudo-class, not as a prop

### Default Variant

The default variant combination is:

- Roundness: Default
- Variant: Primary
- State: Default
