# Calendar

A styled date picker calendar component built on react-day-picker v9, following the Obra design system. Supports single date selection, range selection, and multiple date selection.

## Figma Source

**Design URL:** [Obra shadcn/ui - Date Picker & Calendar](https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=288-117149&m=dev)

**Node IDs:**
- Calendar (1 Month): `190:27724`
- Calendar (2 Months): `190:27722`
- Calendar (3 Months): `190:27721`
- Calendar Day: `781:40922`
- Calendar Header: `264:29273`

## Accepted Design Differences

| Category | Figma | Implementation | File | Reason |
|----------|-------|----------------|------|--------|
| Cell container | 48px with 8px padding | 40px (h-10) | Calendar.tsx | Standard calendar cell sizing |
| Navigation buttons | Custom icon buttons | Styled divs with Lucide icons | Calendar.tsx | Simpler implementation |
| Today indicator | None specified | Subtle ring | Calendar.tsx | Improved UX |

## Design-to-Code Mapping

### Variant Mappings

| Figma Variant | Figma Value | React Prop | React Value | Notes |
|---------------|-------------|------------|-------------|-------|
| Months | 1 Month | `numberOfMonths` | `1` | Default |
| Months | 2 months | `numberOfMonths` | `2` | Side by side on md+ |
| Months | 3 months | `numberOfMonths` | `3` | Side by side on md+ |

### Day State Mappings

| Figma State | React Handling | CSS Classes |
|-------------|----------------|-------------|
| Default | Default state | `bg-background text-foreground` |
| Selected | `modifiers.selected` | `bg-primary text-primary-foreground` |
| Active | `modifiers.range_middle` | `bg-accent text-accent-foreground` |
| Disabled | `modifiers.disabled` | `opacity-50` |
| Outside | `modifiers.outside` | `text-muted-foreground opacity-50` |

### Day Position Mappings (Range Selection)

| Figma Position | React Handling | CSS Classes |
|----------------|----------------|-------------|
| Single | Isolated selection | `rounded-sm` |
| Left | `modifiers.range_start` | `rounded-l-sm rounded-r-none` |
| Middle | `modifiers.range_middle` | `rounded-none` |
| Right | `modifiers.range_end` | `rounded-r-sm rounded-l-none` |

### Property Mappings

| Figma Property | Type | React Prop | Notes |
|----------------|------|------------|-------|
| - | Mode | `mode` | 'single' \| 'range' \| 'multiple' |
| - | Selection | `selected` | Date \| DateRange \| Date[] |
| - | Disabled dates | `disabled` | Matcher[] |
| - | Show outside days | `showOutsideDays` | Default: true |

### Excluded Properties (CSS/Internal)

| Figma Property | Handling | Reason |
|----------------|----------|--------|
| State: Hover | Tailwind `hover:` | Pseudo-state |
| State: Focus | Tailwind `focus-visible:` | Pseudo-state |
| Cell padding | Tailwind spacing | Internal layout |

## Usage

### Basic Single Selection

```tsx
import { Calendar } from '@/components/obra/Calendar';

function DatePicker() {
  const [date, setDate] = React.useState<Date | undefined>();

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
    />
  );
}
```

### Date Range Selection

```tsx
import { Calendar } from '@/components/obra/Calendar';
import type { DateRange } from 'react-day-picker';

function DateRangePicker() {
  const [range, setRange] = React.useState<DateRange | undefined>();

  return (
    <Calendar
      mode="range"
      selected={range}
      onSelect={setRange}
      numberOfMonths={2}
    />
  );
}
```

### With Disabled Dates

```tsx
import { Calendar } from '@/components/obra/Calendar';
import { isPast, isWeekend } from 'date-fns';

function BookingCalendar() {
  const [date, setDate] = React.useState<Date | undefined>();

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      disabled={[isPast, isWeekend]}
    />
  );
}
```

## Dependencies

- `react-day-picker` v9.x - Core calendar functionality
- `date-fns` - Date manipulation (peer dependency of react-day-picker)
- `lucide-react` - Navigation icons
- `class-variance-authority` - Variant styling
- `@/components/obra/Button` - Day button styling

## Accessibility

- Full keyboard navigation (Arrow keys, Tab, Enter/Space)
- ARIA labels on navigation buttons
- Proper `role="grid"` for calendar table
- Day cells announced with date labels
- Focus management on month navigation
