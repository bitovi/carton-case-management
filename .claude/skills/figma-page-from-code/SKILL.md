---
name: figma-page-from-code
description: Build a full application page in Figma from a React page component. Assembles previously built Figma components into a realistic page layout matching the React app. This is step 4 of the code-to-Figma workflow.
---

# Skill: Build Figma Page from React Code

This skill takes a React page component (from `packages/client/src/pages/`) and builds its equivalent in Figma as a full-width frame. It instances previously built Figma components to assemble the layout, then takes a screenshot for comparison against the live app.

## When to Use

- After `figma-component-from-code` has built all leaf/composed components
- When you want a full-page view in Figma for design review
- Building screens for a presentation or design handoff

## Prerequisites

- All component dependencies must exist in Figma already (built by `figma-component-from-code`)
- `figma:figma-use` skill MUST be loaded before calling `use_figma`
- Figma file key must be known
- The "Components" page must exist in the Figma file

## Required Inputs

- `pagePath`: Path to the page file (e.g., `packages/client/src/pages/CasePage/CasePage.tsx`)
- `fileKey`: The Figma file key
- `viewportWidth` (optional, default: 1440): Desktop viewport width in px

## What This Skill Produces

1. A new page in Figma named after the page component (e.g., "Cases Page")
2. A full-width frame (1440×900 by default) containing the page layout
3. Component instances placed to match the React layout
4. A screenshot saved to `.temp/figma-from-code/screenshots/pages/{PageName}-figma.png`
5. A comparison screenshot from the live app (via `/browse`)

## Workflow

```
┌──────────────────────────────────────────────────────────────┐
│ 1. READ — Load page .tsx + all imported components           │
├──────────────────────────────────────────────────────────────┤
│ 2. ANALYZE — Map JSX structure to layout regions             │
├──────────────────────────────────────────────────────────────┤
│ 3. BROWSE — Screenshot the live app for visual reference     │
├──────────────────────────────────────────────────────────────┤
│ 4. LOAD figma:figma-use SKILL (mandatory before use_figma)   │
├──────────────────────────────────────────────────────────────┤
│ 5. CREATE PAGE — Add new page to Figma file                  │
├──────────────────────────────────────────────────────────────┤
│ 6. LAYOUT — Create frame + layout regions                    │
├──────────────────────────────────────────────────────────────┤
│ 7. INSTANCE — Place component instances in layout            │
├──────────────────────────────────────────────────────────────┤
│ 8. SCREENSHOT — Capture Figma page + compare                 │
└──────────────────────────────────────────────────────────────┘
```

## Step-by-Step Instructions

### Step 1: Read Page Source

Read:
1. The main page `.tsx` file
2. All components it directly imports
3. The App.tsx to understand the outer shell (Header, MenuList, main layout)

### Step 2: Analyze Layout Structure

From the JSX, identify the layout regions:

**App shell (always present)**:
- Header bar: top, full width, ~64px height, dark teal background
- Side navigation: left side, ~68px wide on desktop, light gray
- Main content area: flex-1, scrollable, has padding

**Page-specific regions** — for CasePage:
```
Main content:
  - Left panel: CaseList (~320px wide)
  - Right panel: CaseDetails (flex-1)
  
For CustomerPage:
  - Left panel: CustomerList (~320px wide)
  - Right panel: CustomerDetails (flex-1)

For CreateCasePage:
  - Single centered form
```

Map the Tailwind classes on container elements:
- `flex gap-6` → horizontal auto-layout, 24px gap
- `lg:flex` → desktop layout
- `min-h-full` → fill height
- `p-6` → 24px padding
- `overflow-hidden` → clip content

### Step 3: Screenshot Live App

Use the `/browse` skill to screenshot the live app:
1. Navigate to `http://localhost:5173` (or wherever the app runs)
2. Navigate to the relevant page (e.g., `/cases/1`)
3. Take a full-page screenshot
4. Save to `.temp/figma-from-code/screenshots/pages/{PageName}-live.png`

If the app is not running, skip this step.

### Step 4: Load figma:figma-use Skill

**MANDATORY**: Invoke `figma:figma-use` skill before any `use_figma` calls.

### Step 5: Create/Navigate to Page

```javascript
// Check if page already exists
const existingPage = figma.root.children.find(p => p.name === "Cases Page");
if (existingPage) {
  figma.currentPage = existingPage;
} else {
  const newPage = figma.createPage();
  newPage.name = "Cases Page";
  figma.currentPage = newPage;
}
```

### Step 6: Create Main Frame

```javascript
// Create the viewport frame
const frame = figma.createFrame();
frame.name = "Desktop - 1440";
frame.resize(1440, 900);
frame.layoutMode = "VERTICAL";
frame.fills = [{ type: "SOLID", color: { r: 0.937, g: 0.886, b: 0.886, a: 1 } }]; // #DFE2E2

// Place at origin
frame.x = 0;
frame.y = 0;
```

### Step 7: Place Component Instances

**Finding component nodes**:
```javascript
// Find all component sets on the Components page
const componentsPage = figma.root.children.find(p => p.name === "Components");
// Get all components from the page
const allComponents = componentsPage.findAllWithCriteria({ types: ['COMPONENT_SET', 'COMPONENT'] });

// Get a specific component by name
const buttonSet = allComponents.find(c => c.name === "Button");
const defaultButton = buttonSet.defaultVariant; // or find by variant name

// Create instance
const buttonInstance = defaultButton.createInstance();
```

**App Shell layout**:
```javascript
// Header
const headerComp = findComponent("Header");
const header = headerComp.createInstance();
header.resize(1440, 64);
frame.appendChild(header);

// Body row: menu + content
const bodyRow = figma.createFrame();
bodyRow.layoutMode = "HORIZONTAL";
bodyRow.layoutGrow = 1;
bodyRow.name = "body";

  // Side nav
  const menuComp = findComponent("MenuList");
  const menu = menuComp.createInstance();
  menu.resize(68, 836);
  bodyRow.appendChild(menu);

  // Content area
  const content = figma.createFrame();
  content.layoutMode = "HORIZONTAL";
  content.layoutGrow = 1;
  content.paddingLeft = 24;
  content.paddingRight = 24;
  content.paddingTop = 24;
  content.paddingBottom = 24;
  content.itemSpacing = 24;
  content.fills = [{ type: "SOLID", color: { r: 0.984, g: 0.988, b: 0.988, a: 1 } }]; // gray-50
  content.cornerRadius = 8;

    // For CasePage: list + detail
    const caseListComp = findComponent("CaseList");
    const caseList = caseListComp.createInstance();
    caseList.resize(320, 812); // fixed width

    const caseDetailsComp = findComponent("CaseDetails");
    const caseDetails = caseDetailsComp.createInstance();
    caseDetails.layoutGrow = 1; // fill remaining space

    content.appendChild(caseList);
    content.appendChild(caseDetails);

  bodyRow.appendChild(content);
frame.appendChild(bodyRow);
```

**Sizing principles**:
- Fixed-width panels: use the actual px widths from React classes
- Flexible panels: `layoutGrow = 1`
- Auto-height containers: `primaryAxisSizingMode = "AUTO"`
- Fixed-height rows: `primaryAxisSizingMode = "FIXED"`

### Step 8: Screenshot and Compare

1. Use `get_screenshot` on the Figma frame node
2. Save to `.temp/figma-from-code/screenshots/pages/{PageName}-figma.png`
3. Report any components that were missing and had to be approximated
4. If live screenshot exists, write comparison notes to `.temp/figma-from-code/page-build-log.md`

## Placeholder Components

If a component doesn't exist in Figma yet:
1. Create a plain rectangle with the appropriate dimensions
2. Fill with a light gray (`#f0f0f0`)
3. Add a text label with the component name
4. Note in the build log that this is a placeholder

## Multiple Viewport Sizes

After building the desktop (1440) frame, optionally build:
- **Tablet** (768px): Adjust layout for tablet breakpoints
- **Mobile** (375px): Stack layout vertically

## Output

Report:
```
✅ {PageName} page built in Figma
  - Frame size: 1440×900
  - Components placed: X
  - Placeholders used: Y (list them)
  
📸 Screenshots:
  - Live app: .temp/figma-from-code/screenshots/pages/{name}-live.png
  - Figma page: .temp/figma-from-code/screenshots/pages/{name}-figma.png
```
