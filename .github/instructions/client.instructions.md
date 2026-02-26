---
applyTo: packages/client/**
---

# @carton/client Package Instructions

This package contains the React frontend application.

## Package Purpose

- **React Components**: UI components following modlet pattern
- **tRPC Client**: Type-safe API calls
- **Pages**: Route-level components
- **Styling**: Tailwind CSS with Shadcn UI components

## Directory Structure

```
packages/client/
├── src/
│   ├── main.tsx           # React entry point
│   ├── App.tsx            # Root component with routing
│   ├── index.css          # Global styles
│   ├── components/
│   │   ├── obra/          # Obra UI components
│   │   ├── common/        # Reusable custom components
│   │   ├── CaseList/      # Feature components (modlet pattern)
│   │   ├── CaseDetails/
│   │   └── Header/
│   ├── pages/
│   │   ├── CasePage/
│   │   └── CreateCasePage/
│   └── lib/
│       ├── trpc.tsx       # tRPC client setup
│       └── utils.ts       # Utility functions
├── public/
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

## Naming Conventions

- **PascalCase** for component folders: `EditableTitle/`, `CaseList/`, `Header/`
- **kebab-case** for grouping/utility folders (non-components): `inline-edit/`, `date-utils/`
- **lowercase** for standard folders: `components/`, `common/`, `lib/`, `pages/`

Example structure with grouping folder:

```
components/
  common/
    inline-edit/          # grouping folder (kebab-case)
      EditableTitle/      # component folder (PascalCase)
      EditableSelect/     # component folder (PascalCase)
```

## Component Pattern (Modlet)

Each feature component follows the modlet pattern:

```
ComponentName/
├── ComponentName.tsx      # Main component
├── ComponentName.test.tsx # Tests
├── ComponentName.stories.tsx # Storybook stories
├── index.ts               # Public exports
├── types.ts               # TypeScript types
└── components/            # Sub-components
    └── SubComponent/
```

## Import Rules

### From @carton/shared/client (Browser-Safe)

```typescript
import { formatCaseNumber, CASE_STATUS_OPTIONS, type CaseStatus } from '@carton/shared/client';
```

### From @carton/server (Type-Only)

```typescript
import type { AppRouter } from '@carton/server';
import type { inferRouterOutputs } from '@trpc/server';
```

### ❌ NEVER Import

```typescript
// WRONG - breaks browser builds
import { prisma } from '@carton/shared';
import { something } from '@carton/server'; // non-type import
```

## Type Inference Pattern

Create component types by inferring from AppRouter:

```typescript
// types.ts
import type { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '@carton/server';

type RouterOutputs = inferRouterOutputs<AppRouter>;

// Infer types from API responses
export type CaseListItem = RouterOutputs['case']['list'][number];
export type CaseDetail = RouterOutputs['case']['getById'];

// Use in props
export interface CaseListProps {
  cases?: CaseListItem[];
  onCaseSelect?: (caseItem: CaseListItem) => void;
}
```

This ensures types always match what the API returns (including Date → string serialization).

## tRPC Usage

### Query

```typescript
import { trpc } from '@/lib/trpc';

function CaseList() {
  const { data: cases, isLoading } = trpc.case.list.useQuery();

  if (isLoading) return <Spinner />;
  return <ul>{cases?.map(c => <li key={c.id}>{c.title}</li>)}</ul>;
}
```

### Mutation

```typescript
function CreateCase() {
  const utils = trpc.useUtils();
  const createCase = trpc.case.create.useMutation({
    onSuccess: () => {
      utils.case.list.invalidate();
    },
  });

  const handleSubmit = (data: CreateCaseInput) => {
    createCase.mutate(data);
  };
}
```

## Styling

Use Tailwind CSS classes. Put custom styles in external CSS files, not inline.

```tsx
// ✅ Good - Tailwind classes
<div className="flex items-center gap-4 p-4">

// ❌ Bad - inline styles
<div style={{ display: 'flex', alignItems: 'center' }}>
```

## Icons

This project uses **Kendo SVG Icons** exclusively (via `@progress/kendo-svg-icons` and `@progress/kendo-react-common`).

### Basic Usage

```tsx
import { SvgIcon } from '@progress/kendo-react-common';
import { checkIcon, xIcon, caretAltDownIcon } from '@progress/kendo-svg-icons';

function MyComponent() {
  return (
    <>
      <SvgIcon icon={checkIcon} size="small" />
      <SvgIcon icon={xIcon} size="medium" />
      <SvgIcon icon={caretAltDownIcon} size="large" />
    </>
  );
}
```

### Icon Sizes

Kendo provides standardized size values:

- `xsmall`: 12px
- `small`: 14px
- `medium`: 16px (default)
- `large`: 20px
- `xlarge`: 24px
- `xxlarge`: 32px
- `xxxlarge`: 48px

```tsx
// ✅ Good - Use named sizes
<SvgIcon icon={pencilIcon} size="small" />

// ❌ Bad - Don't use custom sizes
<SvgIcon icon={pencilIcon} style={{ width: '15px' }} />
```

### Common Icon Mappings

See [specs/006-replace-icons/icon-mapping.md](../../../specs/006-replace-icons/icon-mapping.md) for the full list. Common icons:

| Use Case | Icon | Import                 |
| -------- | ---- | ---------------------- |
| Confirm  | ✓    | `checkIcon`            |
| Cancel   | ×    | `xIcon`                |
| Dropdown | ▼    | `caretAltDownIcon`     |
| Edit     | ✎    | `pencilIcon`           |
| Delete   | 🗑   | `trashIcon`            |
| Loading  | ↻    | `clockArrowRotateIcon` |
| Menu     | ⋮    | `moreVerticalIcon`     |
| Filter   | ⌕    | `filterIcon`           |
| Star     | ★    | `starIcon`             |
| Calendar | 📅   | `calendarIcon`         |

### Styling Requirements

Kendo icons require special CSS to render correctly. The project includes `src/kendo-icons.css`:

```css
/* Ensure Kendo SVG icons render with proper display properties */
.k-icon,
.k-svg-icon {
  display: inline-flex;
}

.k-svg-icon svg {
  display: block;
}
```

This is imported in `src/main.tsx` - do not remove this import.

### ❌ Deprecated: Lucide React

Do not use `lucide-react` - it has been removed from the project. All icons should use Kendo SVG icons.

```tsx
// ❌ WRONG - Lucide is deprecated
import { Check, X } from 'lucide-react';
<Check className="w-4 h-4" />;

// ✅ CORRECT - Use Kendo
import { SvgIcon } from '@progress/kendo-react-common';
import { checkIcon, xIcon } from '@progress/kendo-svg-icons';
<SvgIcon icon={checkIcon} size="small" />;
```

## Testing

Each component should have tests:

```typescript
// ComponentName.test.tsx
import { render, screen } from '@testing-library/react';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('Expected')).toBeInTheDocument();
  });
});
```

Run tests: `npm run test:client`

## Storybook

Each component should have stories:

```typescript
// ComponentName.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from './ComponentName';

const meta: Meta<typeof ComponentName> = {
  component: ComponentName,
};

export default meta;
type Story = StoryObj<typeof ComponentName>;

export const Default: Story = {
  args: {
    // default props
  },
};
```

Run Storybook: `npm run storybook`

## UX Patterns

- **Create**: Dedicated pages (not modals)
- **Edit**: Click-to-edit inline on view pages
- **Delete**: Always use ConfirmationDialog

## Adding a New Feature Component

1. Create directory: `src/components/FeatureName/`
2. Create files following modlet pattern
3. Export from `index.ts`
4. Create types in `types.ts` using AppRouter inference
5. Add tests and stories
