# FiltersTrigger

A button component that triggers the display of filters, showing active filter count and selection state.

## Usage

```tsx
import { FiltersTrigger } from '@/components/common/FiltersTrigger';

// Basic usage
<FiltersTrigger onClick={() => console.log('Open filters')} />

// With active filters
<FiltersTrigger activeCount={3} onClick={() => console.log('Open filters')} />

// Selected state
<FiltersTrigger selected={true} onClick={() => console.log('Open filters')} />
```

## Props

- `activeCount` - Number of active filters (shows badge when > 0)
- `selected` - Whether the trigger is in selected/active state
- `onClick` - Click handler function
- `className` - Additional CSS classes

## States

- **Rest** - Default state (gray background)
- **Applied** - Shows badge with count when filters are active
- **Selected** - Darker background when filters panel is open
