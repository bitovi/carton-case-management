# FiltersList

A generic component that displays a list of filter dropdowns, accepting any kind and number of filters.

## Figma Design

[Figma: Filters List](https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/Carton-Case-Management?node-id=1033-19601)

## Usage

```tsx
import { FiltersList } from '@/components/common/FiltersList';
import type { FilterItem } from '@/components/common/FiltersList';

const filters: FilterItem[] = [
  {
    id: 'status',
    label: 'Status',
    value: statusValue,
    count: 5,
    options: [
      { value: 'none', label: 'None selected' },
      { value: 'todo', label: 'To Do' },
      { value: 'done', label: 'Done' },
    ],
    onChange: (value) => setStatusValue(value),
  },
  {
    id: 'priority',
    label: 'Priority',
    value: priorityValue,
    count: 2,
    options: [
      { value: 'none', label: 'None selected' },
      { value: 'high', label: 'High' },
      { value: 'low', label: 'Low' },
    ],
    onChange: (value) => setPriorityValue(value),
  },
];

<FiltersList filters={filters} title="Filters" />
```

## Props

### FiltersListProps

- `filters` - Array of filter configurations
- `title` - Title for the filters section (default: "Filters")
- `className` - Additional CSS classes

### FilterItem

Each filter in the array should have:

- `id` - Unique identifier
- `label` - Display label (e.g., "Status", "Priority")
- `value` - Current selected value
- `count` - Optional count shown in parentheses
- `options` - Array of `{ value, label }` for the dropdown
- `onChange` - Callback when filter value changes

## Features

- **Generic** - Accepts any number and type of filters
- **Dynamic counts** - Shows item count in parentheses after label
- **Flexible options** - Each filter can have its own set of options
- **Type-safe** - Full TypeScript support with generics
