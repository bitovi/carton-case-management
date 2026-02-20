# FiltersDialog

A dialog component that displays filters with Clear and Apply actions, accepting any kind and number of filters.

## Figma Design

[Figma: Filters Dialog](https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/Carton-Case-Management?node-id=2941-9234)

## Usage

```tsx
import { FiltersDialog } from '@/components/common/FiltersDialog';
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
  // ... more filters
];

<FiltersDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  filters={filters}
  title="Filter Cases"
  description="Filter cases by customer, status, priority, and last updated date."
  onApply={() => {
    // Apply filters and close dialog
    applyFilters();
    setIsOpen(false);
  }}
  onClear={() => {
    // Clear all filter values
    clearFilters();
  }}
/>
```

## Props

- `open` - Whether the dialog is open
- `onOpenChange` - Callback when dialog state changes
- `filters` - Array of filter configurations (see FiltersList)
- `title` - Title for the filters section (default: "Filters")
- `description` - Description text for accessibility and context (optional)
- `onApply` - Callback when Apply button is clicked
- `onClear` - Callback when Clear button is clicked
- `className` - Additional CSS classes

## Features

- **Generic** - Accepts any number and type of filters via FiltersList
- **Modal dialog** - Uses Dialog component with header and footer
- **Action buttons** - Clear and Apply buttons for filter management
- **Close on apply** - Typically closed after applying filters
- **Scrollable** - Content scrolls while header and footer remain fixed
