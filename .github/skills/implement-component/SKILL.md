---
name: implement-component
description: Implement React components from Figma designs. Use after figma-design-react has analyzed the design. Delegates to create-react-modlet for folder structure, then adds Figma-specific implementation, stories for each variant, Code Connect mapping, and README with design context.
---

# Skill: Implement Component from Figma Design

This skill implements React components from analyzed Figma designs. It creates complete modlets with stories matching Figma variants and establishes the foundation for Code Connect and future design syncing.

## When to Use

- After `figma-design-react` skill has analyzed a Figma design
- User wants to build a component from a Figma URL
- Creating a new component that should stay in sync with Figma

## What This Skill Does

1. Verifies design analysis exists (or triggers it)
2. Creates component modlet following project standards
3. Writes README with Figma source and mapping context
4. Implements the component matching Figma design precisely
5. Creates Storybook stories for each Figma variant/state
6. Creates Code Connect mapping for Figma integration
7. Verifies tests pass and Storybook renders

## Prerequisites

- Figma design analyzed with `figma-design-react` skill
- Design context file at `.temp/design-components/{component-name}/design-context.md`
- Proposed API file at `.temp/design-components/{component-name}/proposed-api.md`

## Workflow Overview

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. VERIFY - Check for design analysis files                    │
├─────────────────────────────────────────────────────────────────┤
│ 2. CREATE MODLET - Build folder structure using modlet pattern │
├─────────────────────────────────────────────────────────────────┤
│ 3. WRITE README - Document Figma source and mapping rationale  │
├─────────────────────────────────────────────────────────────────┤
│ 4. IMPLEMENT - Build component matching Figma precisely        │
├─────────────────────────────────────────────────────────────────┤
│ 5. CREATE STORIES - Story for each Figma variant/state         │
├─────────────────────────────────────────────────────────────────┤
│ 6. CODE CONNECT - Create .figma.tsx mapping file               │
├─────────────────────────────────────────────────────────────────┤
│ 7. VERIFY - Run tests, check types, confirm Storybook renders  │
└─────────────────────────────────────────────────────────────────┘
```

## Step-by-Step Instructions

### Step 1: Verify Design Analysis Exists

Check for required files:

```
.temp/design-components/{component-name}/
├── design-context.md    # Raw Figma data
└── proposed-api.md      # Suggested component API
```

**If files don't exist:**
1. Ask user for Figma URL
2. Run `figma-design-react` skill first
3. Return to this skill after analysis is complete

**If files exist:**
1. Read `design-context.md` to get Figma data and URL
2. Read `proposed-api.md` to understand props and variants
3. **Check if multiple components are recommended** (see Step 1b)

### Step 1b: Handle Multiple Component Recommendations

The `proposed-api.md` may recommend splitting a Figma component into multiple React components (e.g., `Button` and `LinkButton`). This is common when:
- A Figma component has fundamentally different visual patterns
- Different variants serve distinct UX purposes
- Combining would create invalid prop combinations

**If multiple components are recommended:**

1. **Create a parent folder** for the component group:
   ```
   packages/client/src/components/common/{parent-name}/
   ├── {ComponentA}/     # First component modlet
   ├── {ComponentB}/     # Second component modlet
   └── index.ts          # Re-exports all components
   ```

2. **Update the todo list** to iterate through each component:
   ```
   1. Create parent folder with index.ts
   2. [ComponentA] Create modlet via subagent
   3. [ComponentA] Write README with Figma source
   4. [ComponentA] Implement component
   5. [ComponentA] Create stories
   6. [ComponentA] Create Code Connect mapping
   7. [ComponentB] Create modlet via subagent
   8. [ComponentB] Write README with Figma source
   9. [ComponentB] Implement component
   10. [ComponentB] Create stories
   11. [ComponentB] Create Code Connect mapping
   12. Run tests and verify all components
   13. Verify Storybook renders for all components
   ```

3. **Create parent index.ts** that re-exports all components:
   ```typescript
   // packages/client/src/components/common/button/index.ts
   export { Button } from './Button';
   export type { ButtonProps } from './Button';
   export { LinkButton } from './LinkButton';
   export type { LinkButtonProps } from './LinkButton';
   ```

4. **Implement each component** following Steps 3-9 for each one

**Example folder structure for Button + LinkButton:**
```
packages/client/src/components/common/button/
├── index.ts                      # Re-exports Button and LinkButton
├── Button/
│   ├── index.ts
│   ├── Button.tsx
│   ├── Button.test.tsx
│   ├── Button.stories.tsx
│   ├── Button.figma.tsx
│   ├── types.ts
│   └── README.md
└── LinkButton/
    ├── index.ts
    ├── LinkButton.tsx
    ├── LinkButton.test.tsx
    ├── LinkButton.stories.tsx
    ├── LinkButton.figma.tsx
    ├── types.ts
    └── README.md
```

**If single component:** Continue to Step 2 as normal.

### Step 2: Plan with Todos

Use `manage_todo_list` to track all steps:

```
1. Create modlet folder structure (via subagent using create-react-modlet skill)
2. Write README with Figma source
3. Create types.ts with props interface
4. Implement main component
5. Update test file with component tests
6. Create stories for each variant
7. Create Code Connect mapping
8. Run tests and verify
9. Verify Storybook renders
```

**Note:** Step 1 uses `runSubagent` to invoke the `create-react-modlet` skill, which creates the initial folder structure with stub files (index.ts, component, test, stories, types). You'll then update these files with the actual implementation.

### Step 3: Create Modlet Structure

**IMPORTANT: Invoke the `create-react-modlet` skill to create the modlet folder structure.**

Use the `runSubagent` tool to delegate modlet creation:

```
runSubagent({
  description: "Create modlet for {ComponentName}",
  prompt: `Read the skill file at .github/skills/create-react-modlet/SKILL.md and follow it to create a visual modlet for {ComponentName} at:
  
  packages/client/src/components/common/{ComponentName}/
  
  Create ALL files required for a visual modlet:
  - index.ts (re-exports)
  - {ComponentName}.tsx (stub component)
  - {ComponentName}.test.tsx (basic test)
  - {ComponentName}.stories.tsx (default story)
  - types.ts (props interface placeholder)
  
  Also create these additional files for Figma integration:
  - {ComponentName}.figma.tsx (Code Connect mapping placeholder)
  - README.md (empty, will be filled with Figma context)
  
  Return the list of files created.`
})
```

The modlet should be created at:
```
packages/client/src/components/common/{ComponentName}/
```

Expected folder structure after subagent completes:

```
{ComponentName}/
├── index.ts                      # Re-exports
├── {ComponentName}.tsx           # Component implementation
├── {ComponentName}.test.tsx      # Tests
├── {ComponentName}.stories.tsx   # Storybook stories
├── {ComponentName}.figma.tsx     # Code Connect mapping
├── types.ts                      # TypeScript interfaces
└── README.md                     # Figma source & mapping docs
```

### Step 4: Write README with Design Context

Create `README.md` documenting the Figma-to-code mapping:

```markdown
# {ComponentName}

{Brief description of what the component does}

## Figma Source

{Original Figma URL from design-context.md}

## Accepted Design Differences

| Category | Figma | Implementation | File | Reason |
|----------|-------|----------------|------|--------|
| Example | Fixed 36px | Auto height | ComponentName.tsx | Flexible content |

## Design-to-Code Mapping

### Variant Mappings

| Figma Variant | Figma Value | React Prop | React Value | Notes |
|---------------|-------------|------------|-------------|-------|
| Size | Small | `size` | `'sm'` | Height 32px |
| Size | Medium | `size` | `'md'` | Height 40px (default) |

### Property Mappings

| Figma Property | Type | React Prop | Notes |
|----------------|------|------------|-------|
| Has Icon | Boolean | `icon?: ReactNode` | Renders icon when provided |
| Label | Text | `children` | - |

### Excluded Properties (CSS/Internal)

| Figma Property | Handling | Reason |
|----------------|----------|--------|
| State: Hover | Tailwind `hover:` | Pseudo-state |
| State: Focused | Tailwind `focus-visible:` | Pseudo-state |
```

### Step 5: Create Types

Create `types.ts` based on `proposed-api.md`:

```typescript
export interface {ComponentName}Props {
  /**
   * Size variant
   * @default 'md'
   * @figma Variant: Size
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Visual variant
   * @default 'primary'
   * @figma Variant: Type
   */
  variant?: 'primary' | 'secondary';
  
  /**
   * Disabled state
   * @default false
   * @figma Boolean: Disabled
   */
  disabled?: boolean;
  
  /**
   * Optional leading icon
   * @figma Instance: Icon (when Has Icon = true)
   */
  icon?: React.ReactNode;
  
  /**
   * Button content
   * @figma Text: Label
   */
  children: React.ReactNode;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}
```

### Step 6: Implement Component

Create `{ComponentName}.tsx` matching Figma design precisely:

1. **Load design context** - Re-read `design-context.md` for exact values
2. **Match dimensions** - Use exact spacing, sizes from Figma
3. **Match colors** - Use Tailwind classes or CSS variables
4. **Match typography** - Font size, weight, line height
5. **Implement all variants** - Handle all prop combinations
6. **Use Tailwind** - Apply styles with Tailwind classes and `cn()` utility

```tsx
import { cn } from '@/lib/utils';
import type { ComponentNameProps } from './types';

const sizeClasses = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-base',
  lg: 'h-12 px-6 text-lg',
} as const;

const variantClasses = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'bg-transparent text-primary border border-primary hover:bg-primary/10',
} as const;

export function ComponentName({
  size = 'md',
  variant = 'primary',
  disabled = false,
  icon,
  children,
  className,
}: ComponentNameProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded font-semibold transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      disabled={disabled}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}
```

### Step 7: Create Stories for Each Variant

Create `{ComponentName}.stories.tsx` with a story for **every Figma variant**:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from './ComponentName';

const meta: Meta<typeof ComponentName> = {
  component: ComponentName,
  title: 'Common/ComponentName',
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://figma.com/design/...?node-id=...', // From design-context.md
    },
  },
};

export default meta;
type Story = StoryObj<typeof ComponentName>;

// Default state (matches Figma default)
export const Default: Story = {
  args: {
    children: 'Button Label',
  },
};

// Size variants
export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Button',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    children: 'Medium Button',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Button',
  },
};

// Type variants
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
};

// Boolean properties
export const WithIcon: Story = {
  args: {
    icon: <span>★</span>,
    children: 'With Icon',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled',
  },
};

// Responsive stories (if Figma has responsive designs)
export const Mobile: Story = {
  args: {
    children: 'Mobile View',
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};
```

### Step 8: Create Code Connect Mapping

Create `{ComponentName}.figma.tsx` following `figma-connect-component` skill:

```tsx
import figma from '@figma/code-connect';
import { ComponentName } from './ComponentName';

figma.connect(ComponentName, 'https://figma.com/design/...?node-id=...', {
  props: {
    size: figma.enum('Size', {
      Small: 'sm',
      Medium: 'md',
      Large: 'lg',
    }),
    variant: figma.enum('Type', {
      Primary: 'primary',
      Secondary: 'secondary',
    }),
    disabled: figma.boolean('Disabled'),
    children: figma.textContent('Label'),
    icon: figma.boolean('Has Icon', {
      true: figma.instance('Icon'),
      false: undefined,
    }),
  },
  example: ({ size, variant, disabled, children, icon }) => (
    <ComponentName
      size={size}
      variant={variant}
      disabled={disabled}
      icon={icon}
    >
      {children}
    </ComponentName>
  ),
});
```

### Step 9: Create Tests

Create `{ComponentName}.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('renders with default props', () => {
    render(<ComponentName>Click me</ComponentName>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('renders with size="sm"', () => {
    render(<ComponentName size="sm">Small</ComponentName>);
    expect(screen.getByRole('button')).toHaveClass('h-8');
  });

  it('renders with size="lg"', () => {
    render(<ComponentName size="lg">Large</ComponentName>);
    expect(screen.getByRole('button')).toHaveClass('h-12');
  });

  it('renders with variant="secondary"', () => {
    render(<ComponentName variant="secondary">Secondary</ComponentName>);
    expect(screen.getByRole('button')).toHaveClass('border');
  });

  it('renders disabled state', () => {
    render(<ComponentName disabled>Disabled</ComponentName>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('renders with icon', () => {
    render(
      <ComponentName icon={<span data-testid="icon">★</span>}>
        With Icon
      </ComponentName>
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<ComponentName className="custom-class">Button</ComponentName>);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });
});
```

### Step 10: Create index.ts

Create `index.ts` with re-exports:

```typescript
export { ComponentName } from './ComponentName';
export type { ComponentNameProps } from './types';
```

### Step 11: Verify Everything

Run verification commands from project root:

```bash
# Run tests
npm run test

# Type check
npm run typecheck

# Start Storybook
npm run storybook
```

**Tell the user which stories to check:**

```
✅ Implementation complete!

## Verify in Storybook

Run `npm run storybook` and check these stories:

📖 Common/ComponentName
  - Default
  - Small
  - Medium  
  - Large
  - Primary
  - Secondary
  - WithIcon
  - Disabled

Each story should match its corresponding Figma variant.

## Figma URL for comparison
{original Figma URL}
```

## Output Files Summary

After completion, the modlet should contain:

```
packages/client/src/components/common/{ComponentName}/
├── index.ts                      # ✅ Re-exports
├── {ComponentName}.tsx           # ✅ Component
├── {ComponentName}.test.tsx      # ✅ Tests
├── {ComponentName}.stories.tsx   # ✅ Stories for each variant
├── {ComponentName}.figma.tsx     # ✅ Code Connect
├── types.ts                      # ✅ TypeScript types
└── README.md                     # ✅ Figma source & mapping
```

## Quality Checklist

Before marking complete:

- [ ] All files from modlet pattern exist
- [ ] README.md has Figma URL and mapping table
- [ ] Component matches Figma dimensions exactly
- [ ] Component matches Figma colors exactly
- [ ] All Figma variants have corresponding stories
- [ ] Responsive behaviors documented and have stories
- [ ] Code Connect mapping created
- [ ] Tests pass (`npm run test`)
- [ ] Types pass (`npm run typecheck`)
- [ ] Stories render in Storybook

## Related Skills

- **figma-design-react**: Run first to analyze Figma and generate proposed API
- **create-react-modlet**: Defines the modlet folder structure
- **figma-connect-component**: Detailed Code Connect mapping guidance
- **figma-component-sync**: Use later to check implementation against Figma changes
