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

### ❌ Testing Pitfalls with Radix UI / Shadcn Dialogs

**Do not use `screen.getByRole('dialog')` to assert dialog open/closed state.** Radix UI portals and `jsdom` do not reliably expose a `dialog` ARIA role on open/close animations. This causes flaky or always-failing tests.

**Do not use ambiguous text matchers when the same text appears in multiple places.** For example, a trigger button labelled "Filters" and a dialog title "Filters" both render the same string — `screen.getByText('Filters')` will throw due to multiple matches.

**✅ Instead:**

- Confirm a dialog is **open** by asserting for a unique element _inside_ it, such as an action button: `screen.getByRole('button', { name: 'Apply' })`
- Confirm a dialog is **closed** by asserting absence of that same element: `screen.queryByRole('button', { name: 'Apply' })`
- Target trigger buttons with `screen.getByRole('button', { name: /label/i })` rather than `screen.getByText('label')` to avoid ambiguity

```typescript
// ✅ Good
await user.click(screen.getByRole('button', { name: /filters/i }));
await waitFor(() => {
  expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument();
});
await user.click(screen.getByRole('button', { name: 'Apply' }));
await waitFor(() => {
  expect(screen.queryByRole('button', { name: 'Apply' })).not.toBeInTheDocument();
});

// ❌ Bad - unreliable with Radix UI
expect(screen.getByRole('dialog')).toBeInTheDocument();
// ❌ Bad - ambiguous when trigger and dialog share the same label text
await user.click(screen.getByText('Filters'));
```

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
