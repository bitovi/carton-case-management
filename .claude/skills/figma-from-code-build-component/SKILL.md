---
name: figma-from-code-build-component
description: Build a single Figma component from code. Accepts component name, app screenshots, variants, source code, computed styles, icon/image usage, and available built components. Creates the component in Figma, then compares against the original screenshot and iterates up to 3 times to fix visual discrepancies.
---

# Skill: Build a Figma Component from Code

Creates a single Figma component (or component set with variants) from source code and reference material, then validates it visually against an app screenshot — iterating up to 3 fix passes to converge on visual fidelity.

> **All Figma MCP tools (`use_figma`, `get_screenshot`, etc.) work in subagents.** This skill can run its entire workflow — build, screenshot, compare, fix — inside a subagent dispatched by the orchestrator.

## When to Use

- Building an individual component in Figma from its React source code
- Called by `figma-from-code` Phase 3 as a parallel subagent (one per component)
- Rebuilding or updating a single component after code changes
- Any time you need to translate a coded component into a Figma component with visual validation

## Required Inputs

| Input             | Description                                                                                       | Source                                               |
| ----------------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `componentName`   | Name of the component (e.g., `Button`, `CaseDetails`)                                             | Build order / caller                                 |
| `fileKey`         | Figma file key                                                                                    | State ledger or caller                               |
| `parentFrameId`   | Node ID of the tier/container frame to append the component into                                  | State ledger                                         |
| `sourceCode`      | The component's `.tsx` source code (read the file contents)                                       | `packages/client/src/components/`                    |
| `appScreenshot`   | Path to the app screenshot PNG                                                                    | `.temp/figma-from-code/screenshots/{name}/app.png`   |
| `textContent`     | Extracted text JSON from the live app                                                             | `.temp/figma-from-code/screenshots/{name}/text.json` |
| `variants`        | List of variant configurations (props/states) to build                                            | Source code analysis                                 |
| `iconUsage`       | Which Lucide icons and SVG assets the component uses, with sizes                                  | Source code imports + `icons.json`                   |
| `builtComponents` | Map of `{componentName: nodeId}` for all previously built components available for instance reuse | State ledger `builtComponents`                       |
| `screenshotDir`   | Directory for saving Figma screenshots and diff artifacts                                         | `.temp/figma-from-code/screenshots/{name}/`          |

### Optional Inputs

| Input            | Description                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------- |
| `computedStyles` | CSS custom properties, Tailwind classes, or computed style values relevant to the component |
| `cssFile`        | Path to the component's `.css` module file if external styles exist                         |
| `figmaVariant`   | Variant properties that match the app rendering (for comparison targeting)                  |

---

## Execution Modes

This skill supports two execution modes depending on the caller:

### Mode A: Inline (default)

The orchestrator runs all 6 steps directly in the main conversation. Use when building a single component or when the orchestrator is handling one component at a time.

### Mode B: Parallel subagents (preferred for batch builds)

The orchestrator dispatches one subagent per component. Each subagent runs the **entire workflow** (Steps 1–6) independently — analyze, build via `use_figma`, screenshot via `get_screenshot`, compare, fix loop, and return results.

The subagent writes its result to `.temp/figma-from-code/build-results/{componentName}.json`. The orchestrator collects results after all subagents complete.

**Within a tier**, all components can run in parallel since they only instantiate (not modify) lower-tier components. **Across tiers**, execution is sequential — each tier depends on components built in lower tiers.

---

## Workflow

```
Step 1    Analyze       Read source + reference material, plan the component structure
Step 2    Build         Create the component in Figma via use_figma
Step 3    Screenshot    Capture the Figma result via get_screenshot
Step 4    Compare       Pixel diff against the app screenshot
Step 5    Fix Loop      If mismatch, diagnose and fix (up to 3 iterations)
Step 6    Return        Report result with node ID, match score, and any remaining issues
```

---

## Step 1: Analyze the Component

Before writing any `use_figma` code, analyze all inputs to plan the Figma structure.

### 1a. Identify the component structure

Read the source code and determine:

- **Layout direction**: Is the root a vertical stack (`flex-col`) or horizontal row (`flex`, `flex-row`)?
- **Sizing**: Fixed width/height from Tailwind classes (e.g., `w-[200px]`, `h-10`) or flexible (`flex-1`, `w-full`)?
- **Spacing**: `gap-*` classes map to `itemSpacing` in Figma. `p-*`, `px-*`, `py-*` map to padding.
- **Colors**: `bg-*`, `text-*`, `border-*` classes. Resolve CSS variables from `index.css` if needed.
- **Typography**: Font size, weight, line height from Tailwind classes.
- **Border radius**: `rounded-*` classes.
- **Children**: What sub-elements exist? Which are text, which are icons, which are instances of other components?

### 1b. Identify variants

Examine the source code for variant-producing patterns:

- `cva()` or `class-variance-authority` definitions
- Conditional classes based on props (e.g., `variant`, `size`, `state`)
- Boolean props that toggle visual states (e.g., `disabled`, `active`, `selected`)
- Explicit variant types in the component's props interface

For each variant combination, note:

- The variant property names and values (e.g., `{Variant: "primary", Size: "regular"}`)
- The visual differences (colors, sizes, borders, etc.)

### 1c. Identify icon and image usage

From the source code imports:

```tsx
import { Check, X, Loader2 } from 'lucide-react';
```

Map each icon to its `builtComponents` entry (e.g., `Icon/Check`) and note the size from className:

- `h-3 w-3` = 12x12
- `h-3.5 w-3.5` = 14x14
- `h-4 w-4` = 16x16
- `h-5 w-5` = 20x20
- `h-6 w-6` = 24x24

### 1d. Identify instance reuse

Check if any child components in the source code are already in `builtComponents`. These should be instantiated rather than rebuilt:

```tsx
// Source has: <Button variant="primary">Save</Button>
// builtComponents has: { "Button": "123:45" }
// → Create an instance of Button, don't rebuild it
```

### 1e. Plan text content

Use `textContent` (from `text.json`) for exact text strings. Never use generic placeholders like "Lorem ipsum" or "Button text". The text.json structure:

```json
{
  "full": "complete text content",
  "lines": ["line 1", "line 2"],
  "headings": ["Case Details"],
  "labels": ["Title", "Status"],
  "inputs": ["Enter case title"],
  "buttons": ["Save", "Cancel"],
  "icons": [{ "name": "Check", "size": "h-4 w-4" }]
}
```

---

## Step 2: Build the Component in Figma

### 2a. Single component (no variants)

```javascript
// use_figma
const parentFrame = figma.getNodeById('{parentFrameId}');

const comp = figma.createComponent();
comp.name = '{componentName}';
comp.layoutMode = '{VERTICAL or HORIZONTAL}';
comp.primaryAxisSizingMode = 'AUTO';
comp.counterAxisSizingMode = 'AUTO';
comp.itemSpacing = { gapValue };
comp.paddingTop = { pt };
comp.paddingBottom = { pb };
comp.paddingLeft = { pl };
comp.paddingRight = { pr };
comp.cornerRadius = { radius };
comp.fills = [{ fill }];
comp.strokes = [{ stroke }]; // if bordered
comp.strokeWeight = 1;
comp.strokeAlign = 'OUTSIDE'; // always OUTSIDE to match CSS box model

// ... build children (text nodes, icon instances, sub-component instances) ...

fixSizing(comp);
parentFrame.appendChild(comp);
return JSON.stringify({ name: comp.name, id: comp.id });
```

### 2b. Component with variants

Build each variant as a separate component, then combine:

```javascript
// use_figma
const parentFrame = figma.getNodeById('{parentFrameId}');
const variants = [];

// Build each variant
for (const variantConfig of [
  { Variant: 'primary' },
  { Variant: 'secondary' },
  { Variant: 'ghost' },
]) {
  const v = figma.createComponent();
  // Variant naming convention: "Variant=primary, Size=regular"
  v.name = Object.entries(variantConfig)
    .map(([k, val]) => `${k}=${val}`)
    .join(', ');

  v.layoutMode = 'HORIZONTAL';
  v.primaryAxisSizingMode = 'AUTO';
  v.counterAxisSizingMode = 'AUTO';
  // ... apply variant-specific styles ...

  fixSizing(v);
  variants.push(v);
}

// Combine into a component set
const set = figma.combineAsVariants(variants, parentFrame);
set.name = '{componentName}';
set.layoutMode = 'HORIZONTAL';
set.layoutWrap = 'WRAP';
set.primaryAxisSizingMode = 'AUTO';
set.counterAxisSizingMode = 'AUTO';
set.paddingTop = 16;
set.paddingBottom = 16;
set.paddingLeft = 16;
set.paddingRight = 16;
set.itemSpacing = 16;
set.counterAxisSpacing = 16;

for (const v of set.children) fixSizing(v);
fixSizing(set);

return JSON.stringify({
  name: set.name,
  id: set.id,
  variants: set.children.map((c) => ({ name: c.name, id: c.id })),
});
```

### 2c. Creating child elements

**Text nodes:**

```javascript
await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
const text = figma.createText();
text.characters = '{exact text from text.json}';
text.fontSize = { size };
text.fontName = { family: 'Inter', style: '{Regular|Medium|Semi Bold|Bold}' };
text.fills = [{ type: 'SOLID', color: { rgb } }];
text.lineHeight = { value: { lh }, unit: 'PIXELS' };
parent.appendChild(text);
```

**Text nodes do NOT support padding.** Wrap in a frame:

```javascript
// WRONG: text.paddingLeft = 4;
// CORRECT:
const wrapper = figma.createFrame();
wrapper.layoutMode = 'HORIZONTAL';
wrapper.primaryAxisSizingMode = 'AUTO';
wrapper.counterAxisSizingMode = 'AUTO';
wrapper.paddingLeft = 4;
wrapper.paddingRight = 4;
wrapper.fills = [];
wrapper.appendChild(text);
```

**Icon instances:**

```javascript
const iconComp = figma.getNodeById(builtComponents['Icon/Check']);
const iconInstance = iconComp.createInstance();
iconInstance.resize(16, 16); // h-4 w-4
parent.appendChild(iconInstance);
```

**Sub-component instances:**

```javascript
const subComp = figma.getNodeById(builtComponents['Button']);
const instance = subComp.createInstance();
parent.appendChild(instance);
```

**Rectangles (dividers, backgrounds, decorative elements):**

```javascript
const divider = figma.createRectangle();
divider.name = 'Divider';
divider.resize(200, 1);
divider.fills = [{ type: 'SOLID', color: { r: 0.898, g: 0.906, b: 0.922 } }];
divider.layoutSizingHorizontal = 'FILL'; // stretch to fill parent width
parent.appendChild(divider);
```

### 2d. Tailwind-to-Figma mapping reference

| Tailwind            | Figma Property                                           | Value                          |
| ------------------- | -------------------------------------------------------- | ------------------------------ |
| `flex-col`          | `layoutMode`                                             | `'VERTICAL'`                   |
| `flex` / `flex-row` | `layoutMode`                                             | `'HORIZONTAL'`                 |
| `items-center`      | `counterAxisAlignItems`                                  | `'CENTER'`                     |
| `justify-between`   | `primaryAxisAlignItems`                                  | `'SPACE_BETWEEN'`              |
| `justify-center`    | `primaryAxisAlignItems`                                  | `'CENTER'`                     |
| `gap-{n}`           | `itemSpacing`                                            | `n * 4` (px)                   |
| `p-{n}`             | all paddings                                             | `n * 4`                        |
| `px-{n}`            | `paddingLeft/Right`                                      | `n * 4`                        |
| `py-{n}`            | `paddingTop/Bottom`                                      | `n * 4`                        |
| `rounded-md`        | `cornerRadius`                                           | `6`                            |
| `rounded-lg`        | `cornerRadius`                                           | `8`                            |
| `rounded-xl`        | `cornerRadius`                                           | `12`                           |
| `rounded-full`      | `cornerRadius`                                           | `9999`                         |
| `border`            | `strokeWeight`                                           | `1`, `strokeAlign: 'OUTSIDE'`  |
| `text-sm`           | `fontSize`                                               | `14`, lineHeight `20`          |
| `text-base`         | `fontSize`                                               | `16`, lineHeight `24`          |
| `text-lg`           | `fontSize`                                               | `18`, lineHeight `28`          |
| `text-xl`           | `fontSize`                                               | `20`, lineHeight `28`          |
| `text-2xl`          | `fontSize`                                               | `24`, lineHeight `32`          |
| `font-medium`       | fontName style                                           | `'Medium'`                     |
| `font-semibold`     | fontName style                                           | `'Semi Bold'`                  |
| `font-bold`         | fontName style                                           | `'Bold'`                       |
| `w-full` / `flex-1` | `layoutSizingHorizontal`                                 | `'FILL'`                       |
| `h-full`            | `layoutSizingVertical`                                   | `'FILL'`                       |
| `w-[Npx]`           | `resize(N, ...)` then `layoutSizingHorizontal = 'FIXED'` | explicit width                 |
| `truncate`          | `textTruncation`                                         | `'ENDING'`, `maxLines: 1`      |
| `overflow-hidden`   | `clipsContent`                                           | `true`                         |
| `shadow-sm`         | `effects`                                                | `[{type: 'DROP_SHADOW', ...}]` |
| `opacity-{n}`       | `opacity`                                                | `n / 100`                      |

### 2e. Resolving Tailwind color variables

When source code references Tailwind semantic colors (e.g., `bg-primary`, `text-muted-foreground`, `border-input`), resolve them through the CSS variable chain:

1. Look up the Tailwind class in `tailwind.config.js` to find the CSS variable name
2. Look up that CSS variable in `packages/client/src/index.css` to find the HSL/OKLCH value
3. Convert to Figma RGB (`{ r: 0-1, g: 0-1, b: 0-1 }`)

Common color resolutions (update these from the actual CSS):

| Tailwind Class          | CSS Variable         | Typical Figma RGB      |
| ----------------------- | -------------------- | ---------------------- |
| `bg-background`         | `--background`       | `{ r: 1, g: 1, b: 1 }` |
| `bg-primary`            | `--primary`          | project-specific       |
| `text-foreground`       | `--foreground`       | project-specific       |
| `text-muted-foreground` | `--muted-foreground` | project-specific       |
| `border-input`          | `--input`            | project-specific       |
| `bg-muted`              | `--muted`            | project-specific       |

---

## Step 3: Screenshot the Figma Result

After building, capture the Figma component for comparison.

### 3a. Determine what to screenshot

- **Single component**: screenshot the component node directly
- **Component set**: resolve the specific variant that matches the app screenshot

```javascript
// use_figma — resolve variant for screenshot
const node = figma.getNodeById('{componentOrSetId}');
if (node.type === 'COMPONENT_SET') {
  const targetProps = { Variant: 'primary', State: 'Default' }; // from figmaVariant input
  let match = node.children.find((child) =>
    Object.entries(targetProps).every(
      ([k, v]) => child.variantProperties?.[k]?.toLowerCase() === v.toLowerCase()
    )
  );
  match = match ?? node.children[0];
  return JSON.stringify({ screenshotNodeId: match.id, variantName: match.name });
} else {
  return JSON.stringify({ screenshotNodeId: node.id, variantName: node.name });
}
```

### 3b. Capture the screenshot

```
get_screenshot(fileKey, screenshotNodeId)
```

Save the result to `{screenshotDir}/figma.png`:

```bash
curl -sL "{image_url}" -o "{screenshotDir}/figma.png"
```

---

## Step 4: Compare Against App Screenshot

Run the pixel diff comparison:

```bash
node .claude/skills/screenshot-comparison/compare.js \
  "{screenshotDir}/app.png" \
  "{screenshotDir}/figma.png" \
  "{screenshotDir}/"
```

This produces:

- `diff.png` — red pixels mark differences, matching pixels dimmed
- `comparison.json` — `{ matchPct, borderMatchPct, verdict, borderVerdict }`

**Verdict thresholds:**

- `matchPct >= 90%` and `borderMatchPct >= 85%` → **match** (done)
- `matchPct 75-90%` or `borderMatchPct < 85%` → **minor_diff** (needs fixing)
- `matchPct < 75%` → **mismatch** (needs fixing)

If no app screenshot exists (`appScreenshot` is null), skip comparison — report `no_app_reference` and return after build.

---

## Step 5: Fix Loop (Up to 3 Iterations)

If the verdict is `minor_diff` or `mismatch`, enter the fix loop.

### Per-iteration process

**5a. Diagnose the discrepancy**

Use all four inputs together to identify specific differences:

1. **Read `diff.png`** — red regions show exactly where pixels differ
2. **Read `app.png`** — what the component should look like
3. **Read `figma.png`** — what was actually built
4. **Read source `.tsx`** — Tailwind classes reveal intended values (colors, spacing, radii, font weights)

Cross-reference to identify the exact Figma properties that need correction. Common discrepancy patterns:

| Symptom in diff.png              | Likely Cause                                                    | Fix                                             |
| -------------------------------- | --------------------------------------------------------------- | ----------------------------------------------- |
| Red border ring around component | Wrong border color, extra stroke, missing stroke                | Adjust `strokes`, `strokeWeight`, `strokeAlign` |
| Red fill region                  | Wrong background color                                          | Adjust `fills` color values                     |
| Red text area                    | Wrong font size/weight, wrong text color, wrong text content    | Adjust font properties, text fills              |
| Shifted content                  | Wrong padding or spacing                                        | Adjust `itemSpacing`, padding values            |
| Missing element                  | Child not created or wrong visibility                           | Add missing child element                       |
| Extra element                    | Decorative element not in source                                | Remove unexpected child                         |
| Size mismatch                    | Wrong resize values or sizing mode                              | Adjust `resize()` or `layoutSizingMode`         |
| Components all thin strips       | `fixSizing()` not applied, or `counterAxisSizingMode = 'FIXED'` | Run `fixSizing()` on the component              |

**5b. Apply the fix via `use_figma`**

Write a targeted fix — change only the properties identified in diagnosis:

```javascript
// use_figma — fix specific property
const node = figma.getNodeById('{nodeId}');
// Example: fix border radius
node.cornerRadius = 8; // was 4, should be rounded-lg (8px)
// Example: fix fill color
node.fills = [{ type: 'SOLID', color: { r: 0.141, g: 0.31, b: 0.722 } }];
fixSizing(node);
return 'fixed';
```

**5c. Re-screenshot and re-compare**

```
get_screenshot(fileKey, screenshotNodeId)
```

Save to `{screenshotDir}/figma.png` (overwrite previous).

```bash
node .claude/skills/screenshot-comparison/compare.js \
  "{screenshotDir}/app.png" \
  "{screenshotDir}/figma.png" \
  "{screenshotDir}/"
```

**5d. Evaluate and continue or stop**

- If verdict is now `match` → exit loop, report as fixed
- If verdict improved but still `minor_diff` or `mismatch` → continue to next iteration
- If iteration count reaches 3 → exit loop, report remaining issues

### Structural audit (run before first comparison if issues suspected)

```javascript
// use_figma
function auditNode(node) {
  const issues = [];
  if ('strokeAlign' in node && node.strokeAlign === 'INSIDE' && node.strokes?.length > 0) {
    issues.push({ type: 'inside_stroke', node: node.id, name: node.name });
  }
  if ('fills' in node && node.fills.filter((f) => f.visible !== false).length > 1) {
    issues.push({ type: 'multiple_fills', node: node.id, count: node.fills.length });
  }
  if ('children' in node) node.children.forEach((c) => issues.push(...auditNode(c)));
  return issues;
}
const node = figma.getNodeById('{nodeId}');
return JSON.stringify(auditNode(node));
```

Fix structural issues before screenshotting — `strokeAlign: 'INSIDE'` causes double-border visuals, multiple fills cause color blending.

---

## Step 6: Return Result

Return a structured result for the caller:

```json
{
  "componentName": "Button",
  "nodeId": "123:45",
  "type": "COMPONENT_SET",
  "variants": [
    { "name": "Variant=primary, Size=regular", "nodeId": "123:46" },
    { "name": "Variant=secondary, Size=regular", "nodeId": "123:47" }
  ],
  "comparison": {
    "matchPct": 94.2,
    "borderMatchPct": 91.0,
    "verdict": "match",
    "iterations": 1,
    "fixes": ["border-radius 4px -> 8px"]
  },
  "screenshotNodeId": "123:46",
  "figmaScreenshot": ".temp/figma-from-code/screenshots/Button/figma.png"
}
```

If no app screenshot was available:

```json
{
  "componentName": "Skeleton",
  "nodeId": "200:10",
  "type": "COMPONENT",
  "comparison": {
    "verdict": "no_app_reference",
    "matchPct": null,
    "iterations": 0
  }
}
```

---

## fixSizing() — Mandatory After Every Build

**Call `fixSizing()` on every component before appending to the parent frame.** This corrects frames whose height was locked by a `resize()` call.

```javascript
function fixSizing(node, depth = 0) {
  if (depth > 10 || !node) return;
  const hasLayout =
    (node.type === 'COMPONENT' || node.type === 'FRAME' || node.type === 'COMPONENT_SET') &&
    node.layoutMode &&
    node.layoutMode !== 'NONE';
  if (hasLayout) {
    if (node.layoutMode === 'VERTICAL') node.primaryAxisSizingMode = 'AUTO';
    node.counterAxisSizingMode = 'AUTO';
  }
  const children = 'children' in node ? node.children : [];
  for (const child of children) fixSizing(child, depth + 1);
}
```

**During construction**, always set `counterAxisSizingMode = 'AUTO'` before adding children:

```javascript
// WRONG — locks height
comp.counterAxisSizingMode = 'FIXED';
comp.resize(200, 10);

// CORRECT — height grows with content
comp.primaryAxisSizingMode = 'AUTO';
comp.counterAxisSizingMode = 'AUTO';
comp.resize(200, 10); // width hint only
```

---

## Common Pitfalls

| Pitfall                                               | Prevention                                                                                             |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| All components appear as thin strips                  | `fixSizing()` was not called — run it on every component                                               |
| Text node padding error                               | Wrap text in an auto-layout frame, not padding on the text node                                        |
| `strokeAlign: 'INSIDE'` double-border                 | Always use `strokeAlign: 'OUTSIDE'` to match CSS box model                                             |
| Placeholder text instead of real text                 | Always use exact strings from `textContent` / `text.json`                                              |
| Rebuilding a sub-component that already exists        | Check `builtComponents` first, create an instance instead                                              |
| Rebuilding an icon that already exists                | Check `builtComponents` for `Icon/{Name}`, create an instance                                          |
| Component set has no layout after `combineAsVariants` | Explicitly set `layoutMode`, sizing, padding, spacing on the set                                       |
| Manual x/y positioning inside auto-layout parent      | Never set x/y when the parent frame has `layoutMode` set — auto-layout manages positioning             |
| Colors don't match app                                | Resolve Tailwind CSS variables through the full chain: class → config → CSS variable → HSL/OKLCH → RGB |
| Icon at wrong size                                    | Check Tailwind size class on the icon element: `h-4 w-4` = 16x16, not 24x24                            |

---

## Error Handling

| Scenario                               | Action                                                                                       |
| -------------------------------------- | -------------------------------------------------------------------------------------------- |
| `use_figma` fails                      | Diagnose error, fix script, retry once. If it fails again, return component as `failed`      |
| `use_figma` incremental limit          | Split the build across multiple `use_figma` calls. Build sub-structures first, then assemble |
| No app screenshot available            | Build the component, skip comparison, return `no_app_reference`                              |
| `compare.js` fails                     | Report comparison error, return the component with `nodeId` but no match score               |
| `get_screenshot` fails                 | Retry once. If still failing, return component as built but unvalidated                      |
| Font not available                     | Fall back to `{ family: 'Inter', style: 'Regular' }` — Inter is always available in Figma    |
| Sub-component not in `builtComponents` | Build a placeholder frame with the expected dimensions and a name label                      |
| Icon not in `builtComponents`          | Create a placeholder 24x24 rectangle named `Icon/{Name}`                                     |

Never fail silently. Every error or skip must appear in the returned result.
