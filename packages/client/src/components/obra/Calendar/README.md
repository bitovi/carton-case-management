# Calendar Component

A calendar component for date selection with support for single date, multiple dates, and date ranges. Based on the Obra design system using react-day-picker.

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

| React Prop | Value | Notes |
|------------|-------|-------|
| `numberOfMonths` | `1` | Single month view (default) |
| `numberOfMonths` | `2` | Two months side by side |
| `numberOfMonths` | `3` | Three months side by side |

### Selection Mode

| React Prop | Value | Notes |
|------------|-------|-------|
| `mode` | `'single'` | Select one date |
| `mode` | `'multiple'` | Select multiple dates |
| `mode` | `'range'` | Select start and end date |

### Day States

| React/CSS | Implementation | Notes |
|-----------|----------------|-------|
| Base styles | 32×32px, foreground color | Normal unselected day |
| `day-selected` | Primary background, white text | Currently selected date(s) |
| `day-focused` | Focus-visible ring | Keyboard navigation |
| `day-disabled` | 50% opacity, not clickable | Outside range or unavailable |

### Range Positions

| React/CSS | Implementation | Notes |
|-----------|----------------|-------|
| `day-selected` (no range) | Full 8px border-radius | Single selected date |
| `day-range-start` | Right side squared | Range start date |
| `day-range-middle` | Both sides squared, muted bg | Dates between start/end |
| `day-range-end` | Left side squared | Range end date |

## Property Mappings

| Type | React Prop | Default | Notes |
|------|------------|---------|-------|
| Enum | `numberOfMonths` | `1` | 1, 2, or 3 month display |
| String | `mode` | `'single'` | Selection mode: single/multiple/range |
| Date/Date[] | `selected` | `undefined` | Currently selected date(s) |
| Function | `onSelect` | - | Callback when date is selected |
| Matcher | `disabled` | - | Disable specific dates/ranges |
| Boolean | `showOutsideDays` | `true` | Show days from adjacent months |

## Excluded Properties (CSS/Internal)

| Handling | Reason |
|----------|--------|
| CSS `focus-visible:` | Pseudo-state for keyboard nav |
| CSS `.day-selected` | Conditional styling |
| CSS `.day-disabled` | Conditional styling |
| CSS `.day-range-*` | Internal range styling |

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
