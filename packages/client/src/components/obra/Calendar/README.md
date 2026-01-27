# Calendar Component

A calendar component for date selection with support for single date, multiple dates, and date ranges. Based on the Obra design system using react-day-picker.

## Figma Source

**Design URL:** https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=288-119954&m=dev

**Node ID:** `288-119954`

## Design Specifications

### Dimensions
- Day cell: 32×32px
- Navigation buttons: 32×32px (14.75×14.75px icon, 7px padding)
- Default layout: 280px wide (single month)

### Typography
- Day numbers: 14px / 400 weight / 21px line-height / 0.07px letter-spacing
- Month/year header: 14px / 600 weight

### Colors
- Default day: `var(--foreground)` (#020617)
- Selected day background: `var(--primary)` 
- Selected day text: white
- Disabled day: `var(--muted-foreground)` (#64748b) at 50% opacity
- Navigation button border: `var(--border)` (#e2e8f0)
- Range middle background: `var(--accent)` / muted variant

## Variant Mapping

### Number of Months

| Figma Variant | React Prop | Value | Notes |
|---------------|------------|-------|-------|
| 1 Month | `numberOfMonths` | `1` | Single month view (default) |
| 2 months | `numberOfMonths` | `2` | Two months side by side |
| 3 months | `numberOfMonths` | `3` | Three months side by side |

### Selection Mode

| Figma Concept | React Prop | Value | Notes |
|---------------|------------|-------|-------|
| Single date | `mode` | `'single'` | Select one date |
| Multiple dates | `mode` | `'multiple'` | Select multiple dates |
| Date range | `mode` | `'range'` | Select start and end date |

### Day States

| Figma State | React/CSS | Implementation | Notes |
|-------------|-----------|----------------|-------|
| Default | Base styles | 32×32px, foreground color | Normal unselected day |
| Selected | `day-selected` | Primary background, white text | Currently selected date(s) |
| Active | `day-focused` | Focus-visible ring | Keyboard navigation |
| Disabled | `day-disabled` | 50% opacity, not clickable | Outside range or unavailable |

### Range Positions

| Figma Position | React/CSS | Implementation | Notes |
|----------------|-----------|----------------|-------|
| Single | `day-selected` (no range) | Full 8px border-radius | Single selected date |
| Left | `day-range-start` | Right side squared | Range start date |
| Middle | `day-range-middle` | Both sides squared, muted bg | Dates between start/end |
| Right | `day-range-end` | Left side squared | Range end date |

## Property Mappings

| Figma Property | Type | React Prop | Default | Notes |
|----------------|------|------------|---------|-------|
| Months | Enum | `numberOfMonths` | `1` | 1, 2, or 3 month display |
| - | String | `mode` | `'single'` | Selection mode: single/multiple/range |
| - | Date/Date[] | `selected` | `undefined` | Currently selected date(s) |
| - | Function | `onSelect` | - | Callback when date is selected |
| - | Matcher | `disabled` | - | Disable specific dates/ranges |
| - | Boolean | `showOutsideDays` | `true` | Show days from adjacent months |

## Excluded Properties (CSS/Internal)

| Figma Property | Handling | Reason |
|----------------|----------|--------|
| State: Active | CSS `focus-visible:` | Pseudo-state for keyboard nav |
| State: Selected | CSS `.day-selected` | Conditional styling |
| State: Disabled | CSS `.day-disabled` | Conditional styling |
| Position: Left/Middle/Right | CSS `.day-range-*` | Internal range styling |

## Usage

```tsx
import { Calendar } from '@/components/obra/Calendar';

// Single date selection
<Calendar
  mode="single"
  selected={selectedDate}
  onSelect={setSelectedDate}
/>

// Date range selection (2 months)
<Calendar
  mode="range"
  numberOfMonths={2}
  selected={dateRange}
  onSelect={setDateRange}
/>

// With disabled dates
<Calendar
  mode="single"
  selected={selectedDate}
  onSelect={setSelectedDate}
  disabled={{ before: new Date() }}
/>
```
