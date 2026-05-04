---
name: figma-setup-file-structure
description: Create the Carton Figma file's page skeleton and foundations documentation frames. Run after figma-setup-variables and before figma:figma-generate-library Phase 3. This is Phase 2 of the code-to-Figma workflow.
---

# Skill: Set Up Figma File Structure

Creates the page layout and foundations documentation for the Carton Figma file. This is Phase 2 of `figma:figma-generate-library` — it must run after variables exist (Phase 1) and before components are built (Phase 3).

## When to Use

After `figma-setup-variables` has created the variable collections, before starting component work.

## Prerequisites

- Variable collections (`Palette`, `Semantic`, `Spacing`) must already exist in the file
- `figma:figma-use` skill MUST be loaded before any `use_figma` calls

## Required Inputs

- `fileKey`: The Figma file key

## Page Structure to Create

Rename/create pages in this exact order:

| Page Name | Purpose |
|-----------|---------|
| `🎨 Foundations` | Color swatches, type specimens, spacing scale |
| `📦 Components` | All component sets (built in Phase 3) |
| `📄 Screens` | Assembled page screens (built in Phase 4) |

If pages already exist with these names, skip creation.

## Foundations Page Content

On the `🎨 Foundations` page, create three documentation frames stacked vertically with 80px gaps:

### Frame 1: Color Palette (y=0)

Name: `Color Palette`  
Width: 1200, height: auto  
Background: white  
Padding: 48px all sides  
Layout: VERTICAL, gap 40px

**Section structure:**
```
Color Palette (frame)
  ├── Title: "Color Palette" (Inter Bold 32px, #0f172a)
  ├── Gray scale row (label + 11 swatches)
  ├── Teal scale row
  ├── Orange scale row
  ├── Green scale row
  ├── Yellow scale row
  ├── Violet scale row
  ├── Blue scale row
  └── Pink scale row
```

Each scale row:
- Horizontal auto-layout, gap 12px, align center
- Scale label: Inter Semi Bold 12px, #64748b, width 60px (e.g. "gray")
- 11 swatches for 50→950, each: 40×40px rectangle, cornerRadius 6, filled with the Palette variable for that step, tooltip text below showing the step number (50, 100, 200…950)

### Frame 2: Semantic Colors (y = Frame1.height + 80)

Name: `Semantic Colors`  
Width: 1200, height: auto  
Background: white, padding 48px, vertical layout gap 32px

Groups to show (one horizontal row per group, label + swatches):
- `Background & Surface`: background, card, popover, sidebar
- `Text`: foreground, foreground/alt, muted/foreground, mid-alt
- `Brand`: primary, primary/foreground, secondary, secondary/foreground
- `States`: destructive, destructive/subtle, destructive/border, ring/error
- `Border`: border, border/3, border/4, border/5
- `Sidebar`: sidebar, sidebar/foreground, sidebar/accent, sidebar/primary

Each swatch: 48×48px, cornerRadius 6, filled with the Semantic variable, label below (12px, #64748b, truncated to 14 chars).

### Frame 3: Spacing Scale (y = Frame2.y + Frame2.height + 80)

Name: `Spacing Scale`  
Width: 1200, height: auto  
Background: white, padding 48px, vertical layout gap 20px

Title: "Spacing Scale" (Inter Bold 24px)

Two sub-sections side by side (horizontal layout):

**Spacing:**  
For each value (4, 8, 12, 16, 20, 24, 32, 40, 48, 64):
- Horizontal row: teal rectangle (width = value px, height 24px, filled #01a6ae), label "spacing/{n} = {value}px" (Inter Regular 13px, #334155)

**Border Radius:**  
For each value (0, 2, 4, 6, 8, 12, 16, 24, 9999):
- Row: 32×32px white rectangle with border (#e2e8f0), cornerRadius = value, label "radius/{name} = {value}px"

## How to Execute

Load `figma:figma-use`, then work in small incremental `use_figma` calls:

1. **Call 1** — Set up pages (rename existing Page 1, create Components and Screens if missing)
2. **Call 2** — Create Color Palette frame with gray and teal rows
3. **Call 3** — Add orange, green, yellow, violet, blue, pink rows to Color Palette
4. **Call 4** — Create Semantic Colors frame
5. **Call 5** — Create Spacing Scale frame
6. **Call 6** — Screenshot all three frames for verification

After each call, `return` the created node IDs and take an inline `screenshot()`.

## Variable Binding in Swatches

Bind swatch fills to variables rather than hardcoding hex values:

```javascript
const vars = await figma.variables.getLocalVariablesAsync();
const grayVar = vars.find(v => v.name === "Palette/gray/500");
const swatch = figma.createRectangle();
swatch.fills = [figma.variables.setBoundVariableForPaint(
  { type: "SOLID", color: { r: 0, g: 0, b: 0 } }, "color", grayVar
)];
```

## Feeds Into

`figma:figma-generate-library` Phase 3 (components). The Components page must exist before components are placed on it. The Foundations page gives the library skill a reference for what tokens are available.
