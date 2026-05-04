---
name: figma-setup-variables
description: Extract design tokens from the codebase (CSS variables, Tailwind config) and create Figma variables (color, number, string) in a target Figma file. This is step 1 of the code-to-Figma workflow.
---

# Skill: Set Up Figma Variables from Code

This skill reads the codebase's design tokens (CSS custom properties and Tailwind config) and creates matching Figma variable collections in a target Figma file. It establishes the foundation so all subsequent component work can use variables instead of hardcoded values.

## When to Use

- At the start of any code→Figma rebuild workflow
- When design tokens in code change and Figma variables need syncing
- When creating a fresh Figma file for a project

## Prerequisites

- A Figma file must already exist (fileKey known)
- The `figma:figma-use` skill MUST be loaded before calling `use_figma`
- Design tokens live in `packages/client/src/index.css` (CSS vars) and `packages/client/tailwind.config.js`

## What This Skill Produces

1. **Color Variables** — Two collections:
   - `Palette` — all raw color scales (gray, teal, orange, green, yellow, violet, blue, pink, white)
   - `Semantic` — all semantic/alias colors (background, foreground, primary, border, etc.)
2. **Number Variables** — One collection: `Spacing & Radius`
   - Border radius values (--radius-xs through --radius-full)
   - Standard Tailwind spacing scale (4, 8, 12, 16, 20, 24, 32, 40, 48, 64px)
3. **Screenshots** — Saved to `.temp/figma-from-code/screenshots/`

## Required Inputs

- `fileKey`: The Figma file key (from the file URL)
- No other inputs needed — tokens are read from the codebase

## Workflow

```
┌──────────────────────────────────────────────────────────────┐
│ 1. READ TOKENS — Parse index.css and tailwind.config         │
├──────────────────────────────────────────────────────────────┤
│ 2. LOAD figma-use SKILL — Required before use_figma calls   │
├──────────────────────────────────────────────────────────────┤
│ 3. CREATE PALETTE COLLECTION — Raw color scales              │
├──────────────────────────────────────────────────────────────┤
│ 4. CREATE SEMANTIC COLLECTION — Alias colors (refs palette)  │
├──────────────────────────────────────────────────────────────┤
│ 5. CREATE SPACING COLLECTION — Radius + spacing numbers      │
├──────────────────────────────────────────────────────────────┤
│ 6. SCREENSHOT — Capture variables panel + save               │
└──────────────────────────────────────────────────────────────┘
```

## Step-by-Step Instructions

### Step 1: Read Design Tokens

Read these files:
- `packages/client/src/index.css` — all `--var-name: #hexvalue` or `--var-name: value`
- `packages/client/tailwind.config.js` — color mappings and extensions

Extract:
- **Palette colors**: CSS vars grouped by scale name (gray, teal, orange, etc.)
- **Semantic colors**: CSS vars that reference semantic meaning (background, foreground, primary, etc.)
- **Radius values**: `--radius-*` variables with their px/rem values
- **Spacing**: Standard Tailwind spacing increments (4, 8, 12, 16, 20, 24, 32, 40, 48, 64)

### Step 2: Load the figma-use Skill

**MANDATORY**: Load `figma:figma-use` skill before making any `use_figma` calls.

### Step 3: Create Palette Color Collection

Use `use_figma` to create a variable collection called `Palette` with MODE `Default`:

Structure:
```
Palette/
  gray/
    50: #fbfcfc
    100: #f4f5f5
    200: #dfe2e2
    ... (all 11 steps)
  teal/
    50: #f3feff
    ... (all 11 steps)
  orange/ ... green/ ... yellow/ ... violet/ ... blue/ ... pink/
  white: #ffffff
```

JavaScript pattern using the Plugin API:
```javascript
const collection = figma.variables.createVariableCollection("Palette");
const modeId = collection.defaultModeId;

// For each color in the palette
const variable = figma.variables.createVariable("gray/950", collection, "COLOR");
variable.setValueForMode(modeId, { r: 0.098, g: 0.149, b: 0.153, a: 1 }); // #192627
```

Note: Convert hex to 0-1 RGB values (divide by 255).

### Step 4: Create Semantic Color Collection

Create a collection `Semantic` that references palette variables where possible:

```
Semantic/
  background: → Palette/white (or direct hex if no palette match)
  foreground: #020617
  primary: #0f172a
  primary-foreground: #f8fafc
  border: #e2e8f0
  ... (all semantic tokens)
  
  sidebar/
    DEFAULT: #f1f5f9
    foreground: #334155
    ...
```

For semantic colors that match palette values, use variable aliases. For those that don't match, use direct hex values.

### Step 5: Create Spacing & Radius Collection

Create a collection `Spacing` with NUMBER type variables:

```
Spacing/
  spacing/
    1: 4
    2: 8
    3: 12
    4: 16
    5: 20
    6: 24
    8: 32
    10: 40
    12: 48
    16: 64
  radius/
    none: 0
    xs: 2
    sm: 4
    md: 6
    DEFAULT: 8
    xl: 12
    2xl: 16
    3xl: 24
    full: 9999
```

### Step 6: Screenshot and Save

After creating variables:
1. Take a screenshot of the Figma variables panel using `get_screenshot` on the file
2. Save to `.temp/figma-from-code/screenshots/01-variables.png`
3. Report what was created: counts of variables per collection

## Error Handling

- If a collection already exists with that name, skip creating it (don't duplicate)
- If a hex color can't be parsed, log the variable name and skip it
- If the Figma API rate limits, wait 2 seconds and retry once

## Output

Report:
```
✅ Variables created:
  - Palette collection: X color variables
  - Semantic collection: Y color variables  
  - Spacing collection: Z number variables
  
📸 Screenshot saved to .temp/figma-from-code/screenshots/01-variables.png
```
