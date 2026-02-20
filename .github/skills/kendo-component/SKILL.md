---
name: kendo-component
description: Build UI components with KendoUI and React, integrating with the kendo-react-assistant MCP server. Use when implementing KendoUI components, converting from other UI libraries, or leveraging KendoUI's advanced features. Automatically activates the kendo-react-assistant MCP server and optionally the Figma MCP server if a design URL is provided.
---

# Skill: Building UI Components with KendoUI

This skill guides the implementation of UI components using KendoUI for React, leveraging the `kendo-react-assistant` MCP server for intelligent component recommendations, API guidance, and code generation.

## What Is KendoUI?

KendoUI is a comprehensive suite of professional UI components for React that includes:
- **Data Grid**: Advanced data visualization and manipulation
- **Form Controls**: Inputs, selects, date pickers with built-in validation
- **Dropdowns & Popups**: Rich selection and notification components
- **Charts & Gauges**: Data visualization
- **Scheduling**: Calendar and scheduler components
- **Editors**: Rich text and code editors
- **Layout**: Splitter, drawer, and responsive containers

## When to Use This Skill

Use this skill when:
- Converting components from other libraries (Shadcn, Material-UI) to KendoUI
- Implementing complex data-driven features (grids, schedulers, forms)
- Leveraging KendoUI's advanced features (filtering, sorting, grouping)
- Needing professional design with minimal customization
- Building enterprise features with rich interactivity
- Working with design files that specify KendoUI components

**Do NOT use KendoUI when:**
- Simple UI suffices (use Shadcn UI instead)
- Avoiding external dependencies
- Customization requirements exceed KendoUI's theming capabilities

## When to Pair with Figma

If your request includes:
- A Figma URL or design link
- Instructions to implement from a design
- Questions about how to translate a design to KendoUI

Then also activate the Figma MCP server to extract design context and specifications.

## MCP Server Integration

This skill uses two MCP servers:

### 1. kendo-react-assistant (Always Active)

When implementing KendoUI components, the `kendo-react-assistant` MCP server:
- Recommends appropriate KendoUI components for use cases
- Suggests correct component props and configurations
- Generates code examples for common patterns
- Helps troubleshoot KendoUI-specific issues
- Advises on theming and customization

**When you see a user request involving KendoUI:**
1. Check if `kendo-react-assistant` tools are available
2. If not available, activate via: `activate_kendo_assistant_tools()` (if you have access to MCP management)
3. Proceed with implementation using the MCP server's guidance

### 2. Figma MCP Server (Conditional)

When a Figma URL is provided in the request:
1. Activate the Figma MCP server
2. Use `mcp_figma_get_design_context` to extract design specifications
3. Use `mcp_figma_get_screenshot` to compare implementation to design
4. Use `mcp_figma_get_variable_defs` to extract design tokens

## Workflow Overview

```
┌────────────────────────────────────────────────────────────────────┐
│ 0. SETUP - Activate MCP servers and check prerequisites           │
├────────────────────────────────────────────────────────────────────┤
│ 1. ANALYZE REQUEST - Determine component type and requirements    │
├────────────────────────────────────────────────────────────────────┤
│ 2. COMPONENT AUDIT - Check if component exists (component-reuse)  │
│    → If exists: Extend or wrap existing component                 │
│    → If new: Proceed to design analysis                           │
├────────────────────────────────────────────────────────────────────┤
│ 3. DESIGN ANALYSIS (if Figma provided) - Extract requirements     │
├────────────────────────────────────────────────────────────────────┤
│ 4. SELECT KENDOUI - Use MCP to recommend best component(s)       │
├────────────────────────────────────────────────────────────────────┤
│ 5. CREATE MODLET - Build component folder structure               │
├────────────────────────────────────────────────────────────────────┤
│ 6. IMPLEMENT - Build component with KendoUI                       │
├────────────────────────────────────────────────────────────────────┤
│ 7. CONFIGURE THEMING - Apply project design tokens               │
├────────────────────────────────────────────────────────────────────┤
│ 8. CREATE STORIES - Storybook for each variant                    │
├────────────────────────────────────────────────────────────────────┤
│ 9. CREATE TESTS - Unit tests and state variations                 │
├────────────────────────────────────────────────────────────────────┤
│ 10. VERIFY - Run tests, compile, visual check                     │
├────────────────────────────────────────────────────────────────────┤
│ 11. CODE CONNECT (if Figma) - Map to Figma component              │
└────────────────────────────────────────────────────────────────────┘
```

## Prerequisites

Before implementing a KendoUI component, ensure:

1. **KendoUI React Packages Installed**
   ```bash
   npm list @progress/kendo-react-*
   ```
   
   If missing, core packages include:
   - `@progress/kendo-react-common` - Base utilities
   - `@progress/kendo-react-inputs` - Form controls
   - `@progress/kendo-react-dropdowns` - Dropdowns and selects
   - `@progress/kendo-react-grid` - Data grid
   - `@progress/kendo-react-buttons` - Buttons
   - `@progress/kendo-react-layout` - Layout components
   
   Install via: `npm install @progress/kendo-react-{feature-name}`

2. **KendoUI License** (if using licensed features)
   - Check community vs. licensed features
   - Set license key in `main.tsx` or component
   
3. **Design Tokens Available** (optional but recommended)
   - Access to project's Tailwind/Shadcn design tokens
   - Color palette and typography already defined

4. **Accessibility Compliance**
   - KendoUI components are WCAG 2.1 AA by default
   - Verify ARIA attributes in custom implementations

## Step-by-Step Implementation

### Step 0: Prepare and Activate MCP Servers

Before starting, ensure servers are ready:

1. Check if `kendo-react-assistant` MCP server is available
2. If implementing from Figma design:
   - Verify Figma MCP server tools are accessible
   - Have the Figma design URL ready

```
Figma URL format: https://figma.com/design/{fileKey}/{fileName}?node-id={nodeId}
```

### Step 1: Analyze the Request

Determine:
- **Component Type**: What does the user want? (Grid, Form, Dialog, etc.)
- **Context**: Is it standalone or part of a feature?
- **Data Source**: Does it connect to tRPC, static data, or props?
- **Design Reference**: Is there a Figma design or mockup?
- **Integration**: Does it use Shadcn components too?

### Step 2: Component Reuse Check

**Always check if a component exists first** (see `component-reuse` skill):

1. Search in `packages/client/src/components/` for existing implementations
2. Search for similar functionality in other features
3. Check if wrapping an existing Shadcn component with KendoUI would be better

If component exists:
- Extend it with new props
- Or create a specialization wrapper
- Document the relationship in README

If new:
- Proceed to design analysis or KendoUI selection

### Step 3: Extract Design Requirements (if Figma provided)

If the request includes a Figma URL:

1. **Fetch Design Context**
   ```
   Use mcp_figma_get_design_context with the node ID
   Extract variants, props, states, and visual specifications
   ```

2. **Capture Screenshot**
   ```
   Use mcp_figma_get_screenshot for visual reference
   Helps understand interaction patterns and states
   ```

3. **Get Design Tokens** (if available)
   ```
   Use mcp_figma_get_variable_defs to extract colors, spacing, etc.
   Map to project's Tailwind tokens
   ```

4. **Document Requirements**
   - List all visible states and variants
   - Note interaction patterns
   - Identify which KendoUI component best fits

### Step 4: Select the Right KendoUI Component

Use the `kendo-react-assistant` MCP server to:

1. **Describe the need**: What should the component do?
2. **Request recommendations**: Ask MCP for suitable KendoUI components
3. **Compare options**: 
   - Native KendoUI component
   - KendoUI wrapped in Shadcn
   - Custom component using KendoUI primitives

Example prompt to MCP:
```
I need a table component that displays cases with:
- Filtering by status and date
- Sorting by multiple columns
- Inline row selection
- Pagination

Which KendoUI component should I use?
How should I configure it?
```

### Step 5: Create Component Modlet

Follow the `create-react-modlet` skill to create folder structure:

```
ComponentName/
├── index.ts                     # Re-export entry
├── ComponentName.tsx            # Component implementation
├── ComponentName.test.tsx       # Unit tests
├── ComponentName.stories.tsx    # Storybook stories
├── types.ts                     # TypeScript interfaces
├── hooks/                       # Custom hooks (if needed)
│   └── useComponentState.ts
└── styles.css                   # Component-specific styles (if any)
```

**Important for KendoUI:**
- Keep KendoUI imports isolated in component file
- Extract complex logic into custom hooks
- All styling via Tailwind CSS in styles.css
- Do NOT inline KendoUI themes

### Step 6: Implement the Component

**Core Implementation Pattern:**

```typescript
// ComponentName.tsx
import { KendoReactComponent } from '@progress/kendo-react-*/';
import './ComponentName.css';

interface ComponentNameProps {
  // Props here
  data?: any[];
  onSelectionChange?: (selected: any[]) => void;
  // ... rest of props
}

export function ComponentName({
  data = [],
  onSelectionChange,
  // ... rest of destructuring
}: ComponentNameProps) {
  // Component logic
  return (
    <div className="component-name">
      <KendoReactComponent
        {/* KendoUI props */}
        data={data}
        onSelectionChange={onSelectionChange}
      />
    </div>
  );
}
```

**Best Practices:**

1. **Props Interface**: Define all props clearly with types and defaults
2. **State Management**: Keep state minimal; prefer props-driven updates
3. **Event Handlers**: Expose callbacks for parent components to respond to
4. **Accessibility**: Verify KendoUI accessibility by default
5. **Performance**: Use React.memo for expensive renders
6. **Error Handling**: Handle empty states and error cases

### Step 7: Configure Theming

KendoUI components can be themed in two ways:

**Option A: Tailwind CSS (recommend)**

```css
/* ComponentName.css */
.component-name .k-widget {
  @apply border-gray-200 rounded-lg shadow-sm;
}

.component-name .k-state-selected {
  @apply bg-primary text-white;
}
```

**Option B: KendoUI Theme**

```typescript
import '@progress/kendo-theme-bootstrap/dist/all.css';
// or '@progress/kendo-theme-material/dist/all.css'
// or '@progress/kendo-theme-fluent/dist/all.css'
```

**Configuration:**
- Use Tailwind for consistency with rest of app
- Override KendoUI defaults minimally
- Document theme decisions in component README

### Step 8: Create Storybook Stories

Create stories showing each state/variant:

```typescript
// ComponentName.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from './ComponentName';

const meta: Meta<typeof ComponentName> = {
  component: ComponentName,
  title: 'Components/ComponentName',
};

export default meta;
type Story = StoryObj<typeof ComponentName>;

export const Default: Story = {
  args: {
    data: [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
    ],
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};

export const Empty: Story = {
  args: {
    data: [],
  },
};
```

### Step 9: Create Unit Tests

Test KendoUI component behavior:

```typescript
// ComponentName.test.tsx
import { render, screen } from '@testing-library/react';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('renders with data', () => {
    const data = [{ id: 1, name: 'Test' }];
    render(<ComponentName data={data} />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('handles selection change', async () => {
    const onSelectionChange = vi.fn();
    const data = [{ id: 1, name: 'Test' }];
    render(
      <ComponentName 
        data={data} 
        onSelectionChange={onSelectionChange} 
      />
    );
    // Simulate user interaction...
    // expect(onSelectionChange).toHaveBeenCalled();
  });
});
```

### Step 10: Verify Implementation

Run through verification checklist:

- [ ] **Type checking**: `npm run typecheck` passes
- [ ] **Tests**: `npm test` passes for component tests
- [ ] **Linting**: `npm run lint` passes
- [ ] **Storybook**: Stories render correctly
- [ ] **Accessibility**: Run axe accessibility checker in Storybook
- [ ] **Visual**: Compare Storybook against design (if Figma)
- [ ] **Props**: All designed props are implemented
- [ ] **Edge cases**: Empty state, loading, error states

### Step 11: Create Code Connect Mapping (if Figma)

If implemented from Figma design, establish Code Connect mapping:

1. Create `.figma.tsx` file in component directory
2. Map component props to Figma variants
3. Use `figma-connect-component` skill for detailed mapping

```typescript
// ComponentName.figma.tsx
import figma from '@figma/code-connect';
import { ComponentName } from './ComponentName';

figma.connect(ComponentName, 'https://figma.com/design/...?node-id=...', {
  props: {
    variant: figma.enum('Variant', {
      'Default': { variant: 'default' },
      'Active': { variant: 'active' },
    }),
  },
  example: ({ variant }) => <ComponentName variant={variant} />,
});
```

## Common Patterns

### Pattern 1: KendoUI Grid with Filtering & Sorting

```typescript
import { GridColumn as Column, Grid } from '@progress/kendo-react-grid';

export function DataGrid({ data, onSelectionChange }) {
  return (
    <Grid
      data={data}
      selectable="multiple"
      onSelectionChange={onSelectionChange}
      style={{ height: '400px' }}
    >
      <Column field="id" title="ID" width="80px" />
      <Column field="name" title="Name" />
      <Column field="status" title="Status" />
    </Grid>
  );
}
```

### Pattern 2: KendoUI Form with Validation

```typescript
import { Form } from '@progress/kendo-react-form';
import { Input } from '@progress/kendo-react-inputs';

export function FormComponent({ onSubmit }) {
  return (
    <Form onSubmit={onSubmit}>
      <Input
        name="email"
        label="Email"
        type="email"
        required
      />
      <Input
        name="message"
        label="Message"
        component={TextArea}
      />
    </Form>
  );
}
```

### Pattern 3: KendoUI Dialog

```typescript
import { Dialog } from '@progress/kendo-react-dialogs';

export function ConfirmDialog({ isOpen, onConfirm, onCancel }) {
  return (
    <Dialog visible={isOpen} onClose={onCancel}>
      <p>Are you sure?</p>
      <button onClick={onConfirm}>Confirm</button>
      <button onClick={onCancel}>Cancel</button>
    </Dialog>
  );
}
```

### Pattern 4: Wrapping KendoUI with Shadcn

```typescript
// Use Shadcn Button with KendoUI internals
import { Button } from '@/components/ui/button';
import { DropDownList } from '@progress/kendo-react-dropdowns';

export function CustomSelect({ items, value, onChange }) {
  return (
    <div className="flex gap-2">
      <DropDownList
        data={items}
        value={value}
        onChange={onChange}
      />
      <Button variant="outline">Custom Action</Button>
    </div>
  );
}
```

## Related Skills

These skills are often used together with KendoUI components:

| Skill | When to Use |
|-------|-------------|
| `component-reuse` | Before implementing - check if component exists |
| `create-react-modlet` | Creating component folder structure |
| `figma-design-react` | When you have a Figma design to analyze |
| `figma-component-sync` | Keeping KendoUI component in sync with Figma |
| `validate-implementation` | Before marking component complete |
| `figma-connect-component` | Mapping KendoUI component to Figma |

## Troubleshooting

### Issue: KendoUI component not styled correctly

**Solution:**
1. Check if KendoUI theme CSS is imported
2. Verify Tailwind overrides aren't conflicting
3. Use browser DevTools to inspect KendoUI's `.k-*` classes
4. Consider using CSS modules for KendoUI-specific styles

### Issue: Type errors with KendoUI props

**Solution:**
1. Ensure `@progress/kendo-react-*` packages are installed
2. Verify TypeScript is finding KendoUI type definitions
3. Use `npm run typecheck` to surface issues
4. Reference KendoUI documentation for prop types

### Issue: Performance slow with large data sets

**Solution:**
1. Enable KendoUI virtual scrolling for grids
2. Implement pagination rather than rendering all rows
3. Use React.memo for component memoization
4. Lazy load data using tRPC + React Query

### Issue: Accessibility not meeting standards

**Solution:**
1. KendoUI is WCAG 2.1 AA compliant by default
2. Run axe accessibility audit in Storybook
3. Test with keyboard navigation
4. Verify screen reader announcements in browser

## Additional Resources

- [KendoUI React Documentation](https://www.telerik.com/kendo-react-ui/components/)
- [KendoUI React API Reference](https://www.telerik.com/kendo-react-ui/api/)
- [Project Component Guidelines](./.github/skills/create-react-modlet/SKILL.md)
- [Cross-Package Types](./.github/skills/cross-package-types/SKILL.md)
