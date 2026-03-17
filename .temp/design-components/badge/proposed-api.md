# Proposed API: Badge

## Figma Source
https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=19-6979&m=dev

## Summary
A Badge component for displaying compact status labels, tags, or notification counts. Supports five visual variants (primary, secondary, outline, ghost, destructive) and two border radius options (default, round). The component is purely presentational with no interactive behavior.

## Recommended Component Structure

**Single component:** `Badge`

All variants share the same DOM structure and props interface. The variants only affect visual styling (background, border, text color) without changing layout, structure, or behavior.

---

## Component: Badge

### Props Interface

```typescript
interface BadgeProps {
  // Mapped from Figma variant "Variant"
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  
  // Mapped from Figma variant "Roundness"
  roundness?: 'default' | 'round';
  
  // Text content to display in the badge
  children: React.ReactNode;
  
  // Optional additional CSS classes
  className?: string;
}
```

### Prop Details

| Prop | Type | Default | Figma Source | Notes |
|------|------|---------|--------------|-------|
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'destructive'` | `'primary'` | Variant: Variant | Controls background, border, and text color |
| `roundness` | `'default' \| 'round'` | `'default'` | Variant: Roundness | Default has subtle rounding, Round is fully rounded (pill shape) |
| `children` | `React.ReactNode` | required | Text: Label | The badge content (typically text or numbers) |
| `className` | `string` | `undefined` | - | For additional styling customization |

### Variant Descriptions

| Variant | Use Case | Visual Style |
|---------|----------|--------------|
| `primary` | Main status indicator, default emphasis | Dark background, light text |
| `secondary` | Less prominent status, neutral information | Light gray background, dark text |
| `outline` | Minimal style with border, subtle emphasis | Transparent background, border, colored text |
| `ghost` | Very subtle, low-emphasis information | Minimal styling, subtle hover effect |
| `destructive` | Error states, warnings, deletions | Red/danger colors |

### Roundness Options

| Option | Visual | Use Case |
|--------|--------|----------|
| `default` | Slightly rounded corners | Standard badges on buttons, forms, tables |
| `round` | Fully rounded/pill shape | Notification counts, tags, status dots |

### Excluded from Props (Handled by CSS)

| Figma Property | Reason |
|----------------|--------|
| State: Focus | CSS `:focus-visible` pseudo-class handles focus styling automatically. The focus ring is applied via box-shadow when the badge receives keyboard focus. This is not exposed as a prop because it's an interaction state. |

**Note on Focus State:** The Figma design shows a Focus state variant, but this should be implemented using CSS focus styles (`:focus-visible`) rather than a prop. When a badge is focusable (e.g., when used as a button or link), the browser will automatically apply focus styles on keyboard interaction.

### Typography

Based on Figma design tokens:
- **Font:** Body font family (Inter)
- **Size:** Mini (12px)
- **Weight:** Bold (600)
- **Letter spacing:** 1.5px
- **Line height:** Mini line height

These should be implemented using the project's existing Tailwind typography utilities or CSS variables.

### Example Usage

```tsx
// Primary badge (default)
<Badge>New</Badge>

// Secondary badge with round corners
<Badge variant="secondary" roundness="round">
  Beta
</Badge>

// Destructive badge for error states
<Badge variant="destructive">
  Error
</Badge>

// Outline badge for tags
<Badge variant="outline" roundness="round">
  Design
</Badge>

// Ghost badge for subtle status
<Badge variant="ghost">
  Draft
</Badge>

// Notification count badge
<Badge variant="primary" roundness="round">
  5
</Badge>

// With custom className for positioning
<Badge className="absolute top-2 right-2" variant="destructive" roundness="round">
  3
</Badge>
```

### Implementation Notes

1. **Focus Styles:** If the badge is used within an interactive element (button, link), ensure focus styles are properly implemented with `:focus-visible` for keyboard accessibility.

2. **Typography:** Use the `paragraph mini/bold` text style from the design system (12px, 600 weight, 1.5px letter spacing).

3. **Color Tokens:** Map variant colors to the project's CSS variables:
   - Primary: `--primary` background, `--primary-foreground` text
   - Secondary: `--secondary` background, `--secondary-foreground` text
   - Outline: `--border` border, variant-specific text color
   - Ghost: Minimal styling, `--ghost` background, `--ghost-foreground` text
   - Destructive: `--destructive` background, `--destructive-foreground` text

4. **Responsive:** Badge size is fixed and works at all viewport sizes (inline element).

5. **Accessibility:** 
   - Badges are typically non-interactive (not focusable by default)
   - If used for notification counts, consider adding `aria-label` for screen readers
   - Example: `<Badge aria-label="5 unread notifications">5</Badge>`

### Component Composition Note

Unlike some components with nested child components, the Badge is a simple leaf component with no configurable child instances. The only content is text/numbers passed as `children`.

---

## Design Fidelity Checklist

When implementing, ensure:
- ✅ All 5 variants render with correct colors
- ✅ Both roundness options produce visually distinct border radii
- ✅ Focus state shows ring on `:focus-visible` (3px spread box-shadow)
- ✅ Typography matches: 12px, 600 weight, 1.5px letter spacing
- ✅ Padding and spacing match Figma measurements
- ✅ Component works with both text and numeric content

## Related Skills

- **create-react-modlet**: Use this to scaffold the Badge modlet structure
- **figma-implement-component**: Use this to implement the Badge component from this analysis
- **figma-connect-component**: After implementation, create Code Connect mapping back to Figma
