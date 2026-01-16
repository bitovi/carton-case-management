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
│   │   ├── ui/            # Shadcn UI components
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
import { 
  formatCaseNumber, 
  CASE_STATUS_OPTIONS,
  type CaseStatus 
} from '@carton/shared/client';
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

## Shadcn UI Components

Located in `src/components/ui/`. Install new components:

```bash
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add select
```

Always prefer Shadcn components over native HTML:
- ✅ `<Button>` not `<button>`
- ✅ `<Select>` not `<select>`
- ✅ `<Input>` not `<input>`

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
