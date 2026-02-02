---
name: figma-implement-component
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
│ 0. CREATE TODO LIST - Track all steps systematically           │
├─────────────────────────────────────────────────────────────────┤
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
│ 7. VERIFY - Run tests, check types, confirm Storybook renders  │├─────────────────────────────────────────────────────────────────┤
│ 8. PLAYWRIGHT VISUAL TEST - Test Storybook against Figma design│
└─────────────────────────────────────────────────────────────────┘
```

## ⚠️ CRITICAL: Use Todo List for Systematic Execution

**REQUIRED:** Create a todo list using `manage_todo_list` at the start of implementation to ensure all steps are completed and nothing is skipped.

This prevents common failures like:
- Skipping file creation steps
- Forgetting to create Code Connect mapping
- Missing verification steps
- Not documenting Figma source

**Workflow Pattern:**
1. Create todo list with all steps
2. Mark step as in-progress before starting
3. Complete the step's work
4. Mark step as completed immediately
5. Only provide final output after all steps checked off

## Step-by-Step Instructions

### Step 0: Create Todo List (REQUIRED)

**MANDATORY FIRST STEP:** Use `manage_todo_list` to create a checklist before starting implementation.

**For single component:**

```javascript
manage_todo_list({
  operation: 'write',
  todoList: [
    {
      id: 1,
      title: 'Verify design analysis files exist',
      description: 'Check for .temp/design-components/{name}/design-context.md and proposed-api.md',
      status: 'not-started'
    },
    {
      id: 2,
      title: 'Create modlet structure via subagent',
      description: 'Use runSubagent to invoke create-react-modlet skill for folder structure',
      status: 'not-started'
    },
    {
      id: 3,
      title: 'Write README.md with Figma source',
      description: 'Document Figma URL and design-to-code mapping tables',
      status: 'not-started'
    },
    {
      id: 4,
      title: 'Create types.ts with props interface',
      description: 'Define TypeScript interface from proposed-api.md',
      status: 'not-started'
    },
    {
      id: 5,
      title: 'Implement component matching Figma',
      description: 'Build component with exact dimensions, colors, typography from Figma',
      status: 'not-started'
    },
    {
      id: 6,
      title: 'Create stories for all variants',
      description: 'Story for each Figma variant, size, state, and boolean property',
      status: 'not-started'
    },
    {
      id: 7,
      title: 'Create Code Connect mapping',
      description: 'Write {ComponentName}.figma.tsx with figma.connect()',
      status: 'not-started'
    },
    {
      id: 8,
      title: 'Create/update tests',
      description: 'Add tests for all props, variants, and interactions',
      status: 'not-started'
    },
    {
      id: 9,
      title: 'Update index.ts exports',
      description: 'Export component and types',
      status: 'not-started'
    },
    {
      id: 10,
      title: 'Run verification',
      description: 'Run npm test and verify Storybook renders',
      status: 'not-started'
    },
    {
      id: 11,
      title: 'Playwright visual testing',
      description: 'Use Playwright MCP to test Storybook stories against Figma design and verify interactions',
      status: 'not-started'
    }
  ]
})
```

**For multiple components (e.g., Button + LinkButton):**

```javascript
manage_todo_list({
  operation: 'write',
  todoList: [
    {
      id: 1,
      title: 'Verify design analysis files exist',
      description: 'Check for design-context.md and proposed-api.md',
      status: 'not-started'
    },
    {
      id: 2,
      title: 'Create parent folder and index.ts',
      description: 'Create packages/client/src/components/common/{parent}/ with barrel export',
      status: 'not-started'
    },
    {
      id: 3,
      title: '[Button] Create modlet via subagent',
      description: 'Create Button/ folder structure',
      status: 'not-started'
    },
    {
      id: 4,
      title: '[Button] Write README with Figma source',
      description: 'Document Button-specific Figma mapping',
      status: 'not-started'
    },
    {
      id: 5,
      title: '[Button] Create types and implementation',
      description: 'Implement Button component',
      status: 'not-started'
    },
    {
      id: 6,
      title: '[Button] Create stories',
      description: 'Stories for Button variants',
      status: 'not-started'
    },
    {
      id: 7,
      title: '[Button] Create Code Connect mapping',
      description: 'Write Button.figma.tsx',
      status: 'not-started'
    },
    {
      id: 8,
      title: '[LinkButton] Create modlet via subagent',
      description: 'Create LinkButton/ folder structure',
      status: 'not-started'
    },
    {
      id: 9,
      title: '[LinkButton] Write README with Figma source',
      description: 'Document LinkButton-specific Figma mapping',
      status: 'not-started'
    },
    {
      id: 10,
      title: '[LinkButton] Create types and implementation',
      description: 'Implement LinkButton component',
      status: 'not-started'
    },
    {
      id: 11,
      title: '[LinkButton] Create stories',
      description: 'Stories for LinkButton variants',
      status: 'not-started'
    },
    {
      id: 12,
      title: '[LinkButton] Create Code Connect mapping',
      description: 'Write LinkButton.figma.tsx',
      status: 'not-started'
    },
    {
      id: 13,
      title: 'Run tests for all components',
      description: 'Verify npm test passes',
      status: 'not-started'
    },
    {
      id: 14,
      title: 'Verify all Storybooks',
      description: 'Check Button and LinkButton stories render correctly',
      status: 'not-started'
    }
    {
      id: 15,
      title: 'Playwright visual testing',
      description: 'Use Playwright MCP to test all stories against Figma design and verify interactions',
      status: 'not-started'
    }
  ]
})
```

**Important:** Mark each task as `in-progress` before starting it, complete the work, then mark it `completed` immediately. Do not batch completion updates.

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
4. **Mark Step 1 as completed** in todo list

### Step 1b: Handle Multiple Component Recommendations

The `proposed-api.md` may recommend splitting a Figma component into multiple React components (e.g., `Button` and `LinkButton`). This is common when:
- A Figma component has fundamentally different visual patterns
- Different variants serve distinct UX purposes
- Combining would create invalid prop combinations

**If multiple components are recommended:**

1. **Mark Step 1b as in-progress** in todo list

2. **Create a parent folder** for the component group:
   ```
   packages/client/src/components/common/{parent-name}/
   ├── {ComponentA}/     # First component modlet
   ├── {ComponentB}/     # Second component modlet
   └── index.ts          # Re-exports all components
   ```

3. **Update the todo list** to iterate through each component (see Step 0 for multi-component template)

4. **Create parent index.ts** that re-exports all components:
   ```typescript
   // packages/client/src/components/common/button/index.ts
   export { Button } from './Button';
   export type { ButtonProps } from './Button';
   export { LinkButton } from './LinkButton';
   export type { LinkButtonProps } from './LinkButton';
   ```

5. **Implement each component** following Steps 3-9 for each one

6. **Mark Step 1b as completed** in todo list

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

### Step 2: Create Modlet Structure

**Before starting:** Mark Step 2 as `in-progress` in todo list.

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

**After completion:** Mark Step 2 as `completed` in todo list.

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

### Step 3: Write README with Design Context

**Before starting:** Mark Step 3 as `in-progress` in todo list.

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

**After completion:** Mark Step 3 as `completed` in todo list.

### Step 4: Create Types

**Before starting:** Mark Step 4 as `in-progress` in todo list.

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

**After completion:** Mark Step 4 as `completed` in todo list.

### Step 5: Implement Component

**Before starting:** Mark Step 5 as `in-progress` in todo list.

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

**After completion:** Mark Step 5 as `completed` in todo list.

### Step 6: Create Stories for Each Variant

**Before starting:** Mark Step 6 as `in-progress` in todo list.

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

**After completion:** Mark Step 6 as `completed` in todo list.

### Step 7: Create Code Connect Mapping

**Before starting:** Mark Step 7 as `in-progress` in todo list.

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

**After completion:** Mark Step 7 as `completed` in todo list.

### Step 8: Create Tests

**Before starting:** Mark Step 8 as `in-progress` in todo list.

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

**After completion:** Mark Step 8 as `completed` in todo list.

### Step 9: Create index.ts

**Before starting:** Mark Step 9 as `in-progress` in todo list.

Create `index.ts` with re-exports:

```typescript
export { ComponentName } from './ComponentName';
export type { ComponentNameProps } from './types';
```

**After completion:** Mark Step 9 as `completed` in todo list.

### Step 10: Verify Tests and Storybook

**Before starting:** Mark Step 10 as `in-progress` in todo list.

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

**After completion:** Mark Step 10 as `completed` in todo list.

### Step 11: Playwright Visual Testing with MCP

**Before starting:** Mark Step 11 as `in-progress` in todo list.

Use Playwright MCP tools to verify each Storybook story matches the Figma design visually and behaviorally.

#### Prerequisites
- Storybook running (start with `npm run storybook`)
- Figma screenshot from `mcp_figma_get_screenshot` for reference

#### Test Each Story

For **every story** in the component's `.stories.tsx` file:

1. **Navigate** to the story URL: `{storybook-url}/iframe.html?id={story-id}&viewMode=story`
2. **Take a snapshot** to get the component structure and element references
3. **Verify visually** that the rendered component matches the corresponding Figma variant
4. **Test interactions** appropriate to the story

#### What to Verify

Verify visual and interactive aspects based on the component. Examples:

- **Visual**: Layout, colors, typography, spacing match Figma
- **Hover**: Background/border changes on hover
- **Focus**: Focus ring visible with correct styling
- **Disabled**: Reduced opacity, cursor change, no interaction
- **Sizing**: Each size variant matches Figma dimensions

#### Component-Specific Behaviors

Beyond visual states, test interactive behaviors appropriate to the component. Examples:

- **Select/Dropdown**: Click opens menu, selecting item closes menu and updates value
- **Accordion**: Click expands/collapses content
- **Modal/Dialog**: Opens on trigger, closes on backdrop click or close button
- **Tabs**: Clicking tab switches content

Determine what behaviors to test based on the component's purpose and the Figma design.

#### Report Results

After testing all stories, document:
- ✅ Stories that match Figma
- ⚠️ Any accepted visual differences (add to README "Accepted Design Differences")
- ❌ Issues found that need fixing

**After completion:** Mark Step 11 as `completed` in todo list.

**Final step:** Provide summary to user only after all todos are marked completed.

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

### File Structure
- [ ] All files from modlet pattern exist
- [ ] README.md has Figma URL and mapping table

### Design Fidelity
- [ ] Component matches Figma dimensions exactly
- [ ] Component matches Figma colors exactly
- [ ] Typography matches Figma (size, weight, line-height)
- [ ] Spacing/padding matches Figma

### Stories & Variants
- [ ] All Figma variants have corresponding stories
- [ ] Responsive behaviors documented and have stories
- [ ] Code Connect mapping created
### Unit Tests
- [ ] Tests pass (`npm run test`)
- [ ] Types pass (`npm run typecheck`)

### Playwright Visual Testing
- [ ] Each story tested in Storybook via Playwright MCP
- [ ] Visual appearance matches Figma design
- [ ] Interactive behaviors (hover, focus, disabled) work correctly
- [ ] Any accepted differences documented in README

## Related Skills

- **figma-design-react**: Run first to analyze Figma and generate proposed API
- **create-react-modlet**: Defines the modlet folder structure
- **figma-connect-component**: Detailed Code Connect mapping guidance
- **figma-component-sync**: Use later to check implementation against Figma changes
