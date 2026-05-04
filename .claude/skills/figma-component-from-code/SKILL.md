---
name: figma-component-from-code
description: Analyze a single React component from the codebase (reading its TypeScript types, stories, and visual rendering) and build the equivalent Figma component with proper variants, auto-layout, and variable bindings. This is step 3 of the code-to-Figma workflow.
---

# Skill: Build Figma Component from React Code

This skill takes a single React component and builds its equivalent in Figma. It reads the component's TypeScript props, Storybook stories (for variant coverage), and optionally takes a live screenshot for visual reference, then uses the Figma Plugin API to create the component with correct variants, auto-layout, typography, and variable bindings.

## When to Use

- Building Figma components from existing React code (code→design direction)
- After `figma-component-dependency-map` has produced a build order
- When a component exists in code but has no Figma equivalent

## Prerequisites

- `figma-setup-variables` must have run (variables must exist in the Figma file)
- `figma-component-dependency-map` must have run (to know build order)
- `figma:figma-use` skill MUST be loaded before calling `use_figma`
- Figma file key must be known

## Required Inputs

- `componentPath`: Path to the component file (e.g., `packages/client/src/components/obra/Button/Button.tsx`)
- `fileKey`: The Figma file key
- `pageId` (optional): Which page in Figma to place the component (defaults to "Components" page)

## What This Skill Produces

1. A Figma component with proper variants matching the React component's props
2. Auto-layout applied throughout
3. Variable bindings (colors, spacing) using the Figma variables from `figma-setup-variables`
4. The component placed in the "Components" page in a logical section
5. A screenshot saved to `.temp/figma-from-code/screenshots/components/{ComponentName}.png`
6. A Code Connect mapping file at the component's location

## Workflow

```
┌──────────────────────────────────────────────────────────────┐
│ 1. READ — Load component .tsx + types + stories              │
├──────────────────────────────────────────────────────────────┤
│ 2. ANALYZE — Extract variants, props, visual structure        │
├──────────────────────────────────────────────────────────────┤
│ 3. SCREENSHOT — Get live visual reference via Storybook       │
├──────────────────────────────────────────────────────────────┤
│ 4. LOAD figma:figma-use SKILL (mandatory before use_figma)   │
├──────────────────────────────────────────────────────────────┤
│ 5. NAVIGATE — Find/create "Components" page in Figma         │
├──────────────────────────────────────────────────────────────┤
│ 6. BUILD — Create component using Plugin API                  │
├──────────────────────────────────────────────────────────────┤
│ 7. VERIFY — Screenshot Figma output + compare to React       │
├──────────────────────────────────────────────────────────────┤
│ 8. CODE CONNECT — Generate .figma.ts file                    │
└──────────────────────────────────────────────────────────────┘
```

## Step-by-Step Instructions

### Step 1: Read Component Source

Read these files for the target component:
1. The main component `.tsx` file
2. Any sibling type files (`.types.ts`, types defined in same file)
3. The `.stories.tsx` file (if it exists) — stories define the variant matrix
4. The `index.ts` to understand what's exported

### Step 2: Analyze Component Variants and Structure

From the TypeScript props interface, identify:

**Variant props** (map to Figma variants):
- Props with a finite set of string literals: `variant: 'primary' | 'secondary' | 'destructive'`
- Boolean props that change appearance: `disabled?: boolean`, `loading?: boolean`
- Size props: `size: 'sm' | 'md' | 'lg'`

**Slot props** (map to Figma component properties):
- `children?: ReactNode` → text layer or nested slot
- `icon?: ReactNode` → icon slot (boolean visible in Figma)
- `className?: string` → ignore in Figma

**State props** (map to Figma variants or interactive states):
- `isActive`, `isSelected`, `isOpen` → Figma variants or Boolean properties

**Content props** (map to Figma text/content layers):
- `label: string`, `title: string`, `description?: string`

Build a variant matrix:
```
Component variants:
  - variant: primary | secondary | ghost | destructive | outline
  - size: sm | md | lg  
  - disabled: true | false
  
Figma variant combinations to create:
  - 5 variants × 3 sizes × 2 states = 30 variants
  (Reduce to most common combinations if > 20)
```

**Structure analysis** — from reading the TSX:
- Identify the root element and its className
- Map Tailwind classes to visual properties:
  - `bg-primary` → fill: Semantic/primary variable
  - `text-primary-foreground` → text fill: Semantic/primary-foreground variable
  - `rounded-md` → corner radius: Spacing/radius/md variable
  - `px-4 py-2` → padding: Spacing/spacing/4 × Spacing/spacing/2
  - `gap-2` → item spacing: Spacing/spacing/2
  - `flex items-center` → auto-layout horizontal, align center
  - `h-9` → fixed height: 36px
  - `text-sm font-medium` → font size 14px, weight 500

### Step 3: Get Visual Reference

Storybook runs on port 6006. Use the `/browse` skill to screenshot the component in Storybook:
1. Navigate to `http://localhost:6006` → find the component story
2. Take a screenshot of the Default story
3. Take screenshots of key variant stories
4. Save to `.temp/figma-from-code/screenshots/storybook/{ComponentName}-{variant}.png`

If Storybook is not running, skip this step and work from code analysis alone.

### Step 4: Load figma:figma-use Skill

**MANDATORY**: Invoke the `figma:figma-use` skill before any `use_figma` calls.

### Step 5: Navigate/Create Components Page

In the target Figma file:
1. Check if "Components" page exists
2. If not, create it: `figma.createPage()` named "Components"
3. Navigate to it

Organize sections on the page:
- "Primitives" — obra components (Button, Input, Badge, etc.)
- "Common" — common/ components
- "Feature" — domain-specific components

### Step 6: Build the Figma Component

**Naming convention**: Use the React component name exactly.

**Component structure in Figma Plugin API**:

```javascript
// Create a component set (for variants)
const components = [];

// For each variant combination
variantMatrix.forEach(({ variant, size, disabled }) => {
  const comp = figma.createComponent();
  comp.name = `variant=${variant}, size=${size}, disabled=${disabled}`;
  
  // Apply auto-layout
  comp.layoutMode = "HORIZONTAL";
  comp.primaryAxisAlignItems = "CENTER";
  comp.counterAxisAlignItems = "CENTER";
  comp.paddingLeft = paddingBySize[size];
  comp.paddingRight = paddingBySize[size];
  comp.paddingTop = paddingBySize[size] / 2;
  comp.paddingBottom = paddingBySize[size] / 2;
  comp.itemSpacing = 8;
  
  // Apply fills using variables
  const fill = figma.variables.setBoundVariableForPaint(
    { type: "SOLID", color: { r: 0, g: 0, b: 0 } },
    "color",
    primaryVariable  // resolved from collection
  );
  comp.fills = [fill];
  
  // Apply corner radius using variable
  comp.cornerRadius = 6; // or bind to variable
  
  // Create text node
  const text = figma.createText();
  await figma.loadFontAsync({ family: "Inter", style: "Medium" });
  text.characters = "Button";
  text.fontSize = fontSizeBySize[size];
  // bind text color variable
  
  comp.appendChild(text);
  components.push(comp);
});

// Combine into component set
const componentSet = figma.combineAsVariants(components, figma.currentPage);
componentSet.name = "Button";
```

**Variable binding pattern**:
```javascript
// Get variable by name
const colorVariables = await figma.variables.getLocalVariables("COLOR");
const primaryVar = colorVariables.find(v => v.name === "Semantic/primary");

// Bind to fill
const boundFill = figma.variables.setBoundVariableForPaint(
  { type: "SOLID", color: { r: 0.06, g: 0.09, b: 0.16, a: 1 } },
  "color",
  primaryVar
);
node.fills = [boundFill];
```

**Tailwind → Figma translation reference**:

| Tailwind Class | Figma Property |
|---------------|----------------|
| `flex` | `layoutMode = "HORIZONTAL"` |
| `flex-col` | `layoutMode = "VERTICAL"` |
| `items-center` | `counterAxisAlignItems = "CENTER"` |
| `justify-center` | `primaryAxisAlignItems = "CENTER"` |
| `justify-between` | `primaryAxisAlignItems = "SPACE_BETWEEN"` |
| `gap-{n}` | `itemSpacing = n * 4` |
| `p-{n}` | `padding{Left/Right/Top/Bottom} = n * 4` |
| `px-{n}` | paddingLeft + paddingRight = n * 4 |
| `py-{n}` | paddingTop + paddingBottom = n * 4 |
| `rounded-none` | `cornerRadius = 0` |
| `rounded-sm` | `cornerRadius = 4` |
| `rounded-md` | `cornerRadius = 6` |
| `rounded-lg` | `cornerRadius = 8` |
| `rounded-full` | `cornerRadius = 9999` |
| `text-xs` | `fontSize = 12` |
| `text-sm` | `fontSize = 14` |
| `text-base` | `fontSize = 16` |
| `text-lg` | `fontSize = 18` |
| `text-xl` | `fontSize = 20` |
| `font-normal` | `fontWeight = 400` |
| `font-medium` | `fontWeight = 500` |
| `font-semibold` | `fontWeight = 600` |
| `font-bold` | `fontWeight = 700` |
| `w-full` | `layoutGrow = 1` (or `primaryAxisSizingMode = "FILL"`) |
| `h-{n}` | `resize(width, n * 4)` |
| `opacity-50` | `opacity = 0.5` |
| `hidden` | `visible = false` |
| `border` | stroke with 1px |
| `border-{color}` | stroke fill = color variable |
| `shadow-xs` | effects: drop shadow |

**Color class mapping** (use Figma variables):
- `bg-primary` → fill: Semantic/primary
- `bg-secondary` → fill: Semantic/secondary  
- `bg-muted` → fill: Semantic/muted
- `bg-background` → fill: Semantic/background
- `bg-destructive` → fill: Semantic/destructive
- `text-primary-foreground` → text fill: Semantic/primary-foreground
- `text-foreground` → text fill: Semantic/foreground
- `text-muted-foreground` → text fill: Semantic/muted-foreground
- `border-border` → stroke: Semantic/border
- `bg-gray-{n}` → fill: Palette/gray/{n}
- `bg-teal-{n}` → fill: Palette/teal/{n}
- (etc. for all color scales)

**Font loading**: Always load fonts before setting text:
```javascript
await figma.loadFontAsync({ family: "Inter", style: "Regular" });
await figma.loadFontAsync({ family: "Inter", style: "Medium" });
await figma.loadFontAsync({ family: "Inter", style: "SemiBold" });
```

### Step 7: Verify the Component

After building:
1. Use `get_screenshot` to capture the component in Figma
2. Compare visually to the Storybook screenshot (if available)
3. Note any differences in `.temp/figma-from-code/component-build-log.md`
4. Save Figma screenshot to `.temp/figma-from-code/screenshots/components/{ComponentName}-figma.png`

### Step 8: Generate Code Connect File

Create a `.figma.ts` file next to the component with the Figma node IDs:

```typescript
import figma from "@figma/code-connect";
import { Button } from "./Button";

figma.connect(Button, "FIGMA_NODE_URL", {
  props: {
    variant: figma.enum("variant", {
      primary: "primary",
      secondary: "secondary",
      ghost: "ghost",
    }),
    size: figma.enum("size", {
      sm: "sm",
      md: "md",
      lg: "lg",
    }),
    disabled: figma.boolean("disabled"),
    children: figma.string("Label"),
  },
  example: ({ variant, size, children, disabled }) => (
    <Button variant={variant} size={size} disabled={disabled}>
      {children}
    </Button>
  ),
});
```

## Handling Complex Components

**For components with slots/children**:
- Create an instance swap property in Figma for icon slots
- Use `figma.nestedProps` or `figma.children` in Code Connect

**For components with conditional rendering**:
- Create separate Figma components for each major render path
- Group them under the same component set

**For components with many variants (>20)**:
- Build the most common combinations
- Document which variants were skipped in the build log

## Output

Report:
```
✅ {ComponentName} built in Figma
  - Variants created: X
  - Variables bound: Y
  - Figma node ID: {id}
  - Code Connect file: {path}
  
📸 Screenshots:
  - React (Storybook): .temp/figma-from-code/screenshots/storybook/{name}.png
  - Figma output: .temp/figma-from-code/screenshots/components/{name}-figma.png
```
