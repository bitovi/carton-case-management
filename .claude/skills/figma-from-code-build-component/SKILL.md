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
| `componentName`   | Name of the component (e.g., `Button`, `UserProfile`)                                             | Build order / caller                                 |
| `fileKey`         | Figma file key                                                                                    | State ledger or caller                               |
| `parentFrameId`   | Node ID of the tier/container frame to append the component into                                  | State ledger                                         |
| `sourceCode`      | The component's `.tsx` source code (read the file contents)                                       | Project's component source directory                 |
| `appScreenshot`   | Path to the app screenshot PNG                                                                    | `.temp/figma-from-code/screenshots/{name}/app.png`   |
| `textContent`     | Extracted text JSON from the live app                                                             | `.temp/figma-from-code/screenshots/{name}/text.json` |
| `variants`        | List of variant configurations (props/states) to build                                            | Source code analysis                                 |
| `iconUsage`       | Which Lucide icons and SVG assets the component uses, with sizes                                  | Source code imports + `icons.json`                   |
| `builtComponents` | Map of `{componentName: nodeId}` for all previously built components available for instance reuse | State ledger `builtComponents`                       |
| `preExistingComponents` | Immutable snapshot of components that existed in Figma BEFORE this orchestrator run started | State ledger `preExistingComponents` (Phase 0a snapshot) |
| `screenshotDir`   | Directory for saving Figma screenshots and diff artifacts                                         | `.temp/figma-from-code/screenshots/{name}/`          |

### Optional Inputs

| Input            | Description                                                                                                                                  |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `computedStyles` | Resolved CSS values from `computed-styles.json` (produced by `inspect-styles.js` in step 1g). Authoritative for colors, spacing, typography |
| `stateScreenshots` | Paths to state screenshots (`state-hover.png`, `state-focus.png`, `state-disabled.png`) and style diffs from `states.json`                |
| `cssFile`        | Path to the component's `.css` module file if external styles exist                                                                         |
| `figmaVariant`   | Variant properties that match the app rendering (for comparison targeting)                                                                  |

---

## Pre-Existing Components Rule

Before doing any work that resolves to a node ID in `preExistingComponents`, **stop**. That node existed in Figma before this run; modifying it (rebuild, resize the master, delete + recreate, swap variants out from under existing instances) requires explicit user authorization per the orchestrator skill's "Pre-Existing Components Rule".

Concretely:

- If `componentName` itself maps to a node in `preExistingComponents` and the caller's intent is to **rebuild** that node: write a result file with `"status": "needs_authorization"` and `"preExistingTouched": ["<name>"]`, then return. Do not call `use_figma` to delete, replace, resize, or restyle the existing node. Building a *fresh* component with the same name into a different `parentFrameId` is also a modification (it creates a duplicate the orchestrator must reconcile) — don't do it without authorization.
- If a *child* you would normally instantiate inside this component (e.g., `Icon/Check`, `Button`) is in `preExistingComponents`: **instancing it is fine** — that's reuse, not modification. Modifying its master is not.
- The fix-loop in Step 5 must never edit a node in `preExistingComponents`. If the comparison says you need to, escalate to the orchestrator instead.

This rule overrides Steps 2–5 of the workflow when in conflict.

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
Step 1    Analyze       Read source + reference material, inspect live component, plan structure
Step 2    Build         Create the component in Figma via use_figma
Step 3    Screenshot    Capture the Figma result via get_screenshot
Step 4    Compare       Pixel diff against the app screenshot
Step 5    Fix Loop      If mismatch, diagnose and fix (up to 3 iterations)
Step 6    Track         Write figma.json into the component folder
Step 7    Return        Report result with node ID, match score, and any remaining issues
```

---

## Step 1: Analyze the Component

Before writing any `use_figma` code, analyze all inputs to plan the Figma structure.

> **Pre-flight: dev server is required for Step 1g (live inspection).** Step 1g — inspecting the rendered component in a browser via `inspect-styles.js` — is the authoritative source for colors, spacing, typography, and interactive states. **Do not silently skip it.** If you don't already have a dev server URL (from the orchestrator state ledger, project memory, or the caller's arguments), pause and ask the user for one before proceeding past Step 1. Only skip Step 1g if the user explicitly says no dev server is available, or has already said so earlier in this conversation. See Step 1g for the full decision tree.

### 1a. Identify the component structure

Read the source code and determine:

- **Layout direction**: Is the root a vertical stack (`flex-col`) or horizontal row (`flex`, `flex-row`)?
- **Sizing intent** (CAPTURE THIS EXPLICITLY — Step 4a verifies the built component matches): For the *outermost* container, classify each axis as one of:
  - `fill` — has `w-full`, `flex-1`, `flex: 1`, `min-w-full`, or in a flex parent without sized siblings (Figma equivalent: `primaryAxisSizingMode='FIXED'` on the parent + `layoutSizingHorizontal='FILL'` on the child; or for masters, fixed width matching the consumer)
  - `fixed:NNN` — has explicit value like `w-[200px]`, `w-64`, `h-10` (Figma: fixed width/height matching NNN)
  - `hug` — none of the above; content-driven (Figma: `*SizingMode='AUTO'`)
  Repeat per axis (width AND height). Capture this as `{widthIntent: 'fill' | 'fixed:NNN' | 'hug', heightIntent: ...}`. Record it now — Step 4a uses it.
- **Role hint**: If the source file path is under `pages/` or `routes/`, OR the component name ends in `Page` / `Screen` / `Layout`, treat it as a **page-level** component. Page-level components default to filling the screen body (typically ~1380×768 — read `screensFrameId` body size from state if available) regardless of how the captured `app.png` looks, because the precapture selector may have grabbed a hug-content wrapper.
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
- HTML elements states (e.g., `:hover`, `:focus`, `:disabled`) that require separate variants for accurate screenshot comparison
- Explicit variant types in the component's props interface

For each variant combination, note:

- The variant property names and values (e.g., `{Variant: "primary", Size: "regular"}`)
- The visual differences (colors, sizes, borders, etc.)
- Create a screenshot by manipulating props and capturing the app rendering for each variant to use as reference during comparison

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

### 1e. Verify all child components exist in Figma (prerequisite gate)

After identifying all child components (sub-components and icons) from steps 1c and 1d, verify that **every one** exists in `builtComponents`. Build a list of required children:

- Every sub-component referenced in source code (from step 1d)
- Every icon referenced in source code (from step 1c), as `Icon/{Name}`

For each required child, check `builtComponents[childName]`. If the node ID is present, the child is available. If **any** child is missing:

**STOP — do not proceed to step 2.** Return immediately with a rejection result:

```json
{
  "componentName": "CaseDetails",
  "status": "rejected",
  "reason": "missing_children",
  "missingChildren": ["CaseComments", "Icon/Trash"],
  "availableChildren": ["Button", "CaseInformation", "Icon/Check"]
}
```

Write this result to `.temp/figma-from-code/build-results/{componentName}.json` so the orchestrator can see which children need to be built first.

**Standalone (no orchestrator)** — if the caller is the user directly, also surface the rejection in the conversation and ask how to proceed. Don't fall back to inlining the missing children, building stubs, or downgrading the build into "best effort" — those produce a different artifact than the skill is supposed to produce. The right options are: (a) build the missing children first in dependency order, (b) abandon the build, or (c) get explicit user authorization to deviate.

**Enforcement gate** — before you call `use_figma` to start building, run:

```bash
node .claude/skills/figma-from-code-build-component/check-prereqs.js <componentName> <sourceFile.tsx>
```

The script reads imports from `sourceFile.tsx`, looks each one up in `.temp/figma-from-code/builtComponents.json`, and either writes `.temp/figma-from-code/prereqs/<componentName>.ok` (exit 0) or prints the rejection JSON and exits 1. A `PreToolUse` hook on `mcp__claude_ai_Figma__use_figma` blocks any `use_figma` call that creates a fresh component (contains `figma.createComponent()` with a `<var>.name = '<componentName>'` assignment) unless the matching `.ok` marker exists and is fresh (< 1 hour). The hook is configured at `.claude/hooks/figma-prereqs-gate.js`.

If the script reports `missing_children`, that *is* the rejection — write it to the build-results file, surface it to the user (when standalone), and stop. Do not work around the hook by renaming the master, splitting `createComponent` across calls to evade the regex, or editing the hook itself.

Only proceed to step 1f and beyond if check-prereqs.js exits 0.

### 1f. Plan text content

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

### 1g. Inspect live component in Playwright

Before building, inspect the actual rendered component in the browser to capture computed styles and interactive state screenshots. This provides ground-truth values that are more reliable than inferring from Tailwind classes alone — especially for resolved colors, inherited styles, and CSS variable chains.

Run `inspect-styles.js` against the component's selector on the dev server:

```bash
node .claude/skills/figma-from-code-validator/inspect-styles.js \
  "http://localhost:5173/{route}" \
  --selector "{componentSelector}" \
  --output ".temp/figma-from-code/screenshots/{ComponentName}/"
```

This produces:

| File | Contents |
|------|----------|
| `computed-styles.json` | Key CSS properties from `getComputedStyle` (colors, spacing, typography, layout, borders, shadows) plus the element's class list |
| `state-hover.png` | Screenshot with `:hover` emulated — **only created if visually different from default** |
| `state-focus.png` | Screenshot with `:focus-visible` emulated — **only created if visually different** |
| `state-disabled.png` | Screenshot with `[disabled]` set — **only created if the element supports it and looks different** |
| `states.json` | Index of which states were captured vs skipped, with per-state computed style diffs |

**How to use the outputs:**

1. **`computed-styles.json`** — Use resolved color values (RGB) directly instead of tracing Tailwind → CSS variable → HSL → RGB. Use exact `fontSize`, `fontWeight`, `lineHeight`, `borderRadius`, `padding`, `gap` values to set Figma properties. These are the authoritative values.

2. **State screenshots** — Each captured state screenshot becomes a variant in the Figma component set. For example, if `state-hover.png` exists, create a `State=Hover` variant using the hover computed styles from `states.json`. If `state-focus.png` exists, create a `State=Focus` variant. Combine with any prop-based variants from step 1b (e.g., `Variant=primary, State=Hover`).

3. **Skipped states** — If `states.json` shows a state was skipped (`"reason": "no visual difference from default"`), do not create a variant for it.

**Batch mode** — When the orchestrator dispatches subagents, it can pre-run inspect-styles in batch for all components in a tier:

```bash
node .claude/skills/figma-from-code-validator/inspect-styles.js --batch manifest.json
```

Where `manifest.json` contains entries like:
```json
[
  {"url": "http://localhost:5173/cases", "selector": "[data-component='Button']", "output": ".temp/figma-from-code/screenshots/Button/"},
  {"url": "http://localhost:5173/cases", "selector": "[data-component='Input']", "output": ".temp/figma-from-code/screenshots/Input/"}
]
```

**Dev server is required — don't silently skip this step.**

The live-component inspection produces the authoritative ground truth for colors, spacing, typography, and interactive states. Skipping it means the build is inferred entirely from Tailwind classes and CSS variable chains, which routinely drifts from what the app actually renders. Only skip when the user has explicitly told you no dev server is available.

Decide what to do based on what the caller gave you:

1. **Orchestrator-dispatched (subagent) call** — the orchestrator passes the dev server URL and per-component route/selector in the state ledger. Use those directly. If they're missing from the manifest, treat that as a state-ledger bug and report it back to the orchestrator; do not fall back to skipping.

2. **Standalone call (no orchestrator)** — before falling back to source-only analysis, determine whether a dev server is running:
   - Check the project for an obvious dev command (`package.json` `scripts.dev`, `npm run dev`, `vite`, etc.) and a likely URL (commonly `http://localhost:5173` for Vite, `localhost:3000` for Next.js/CRA). If memory contains a known dev server URL for this project, use that.
   - Probe the URL with a quick `curl -s -o /dev/null -w "%{http_code}" <url>` (or equivalent). If it responds, proceed with inspect-styles against it.
   - If no URL is reachable AND the user has not already told you a dev server is unavailable, **stop and ask the user**: "Is a dev server running for this project? If so, what's the URL and the route/selector for `{ComponentName}`?" Wait for the answer before continuing.
   - Only skip step 1g if the user explicitly says no dev server is available (or has said so earlier in the conversation). Record that decision in the result file's `notes` field so the omission is visible downstream.

3. **Auto/non-interactive mode** — if you cannot ask the user (e.g., running fully autonomously inside a batch), and probing finds no dev server, still attempt to start one if the project clearly supports it (e.g., `npm run dev &` with a port check loop). If starting the server isn't safe or appropriate, proceed without 1g but explicitly flag `"liveInspection": "skipped_no_dev_server"` in the result so the validator can re-check later.

**If the component has no known selector or route but the dev server IS running**, attempt to derive them: search the codebase for routes that render `{ComponentName}` (e.g., grep imports of the component file), and use a Playwright selector like `[data-component='{ComponentName}']`, the component's display class, or a text-content match from `text.json`. Only fall back to source-only analysis if this derivation also fails — and ask the user before doing so.

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
2. Look up that CSS variable in the project's main CSS file to find the HSL/OKLCH value
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

### 4a. Sizing sanity check (run BEFORE the pixel compare)

A pixel diff against a narrow `app.png` can pass even when the component is built far smaller than it will render in real usage — this is the most common silent failure mode. Run this check first; it is independent of the screenshot.

Inspect the built component (`use_figma`) and read its top-level frame:

```javascript
const node = figma.getNodeById('{nodeId}');
const built = {
  w: Math.round(node.width),
  h: Math.round(node.height),
  primaryAxisSizingMode: node.primaryAxisSizingMode,
  counterAxisSizingMode: node.counterAxisSizingMode,
  layoutMode: node.layoutMode,
};
```

Compare against the **sizing intent** captured in Step 1a:

| Intent (per axis) | Expected built state | Flag if … |
|---|---|---|
| `fill` | Master is FIXED at the consumer's expected size (page body width for page-level; parent slot width otherwise). Or the root child is FILL inside its parent. | `*SizingMode === 'AUTO'` AND the dimension is much smaller than the expected fill size (< 50%) |
| `fixed:NNN` | Dimension equals NNN ± 2px | Difference > 2px |
| `hug` | `*SizingMode === 'AUTO'` | Forced FIXED with no clear reason |

**Additional checks:**

- **Page-level component (role hint from Step 1a)**: width must be ≥ 1200px AND height must be ≥ 600px (or the screen body dimensions read from `figmaNodes.screensFrameId`). If the master is 622×304 because precapture cropped the screenshot, this check catches it.
- **Children with `flex-1` siblings in source but matching `*SizingMode='HUG'` in Figma**: the auto-layout will collapse the component. Flag.

If any check fails, **treat this as a `size_mismatch` discrepancy and feed it into Step 5 alongside (or before) the pixel diff results.** Do not declare a match based on pixel score alone if the sizing check failed — pixel match against a too-narrow `app.png` is a false positive.

Record the sizing check result in the eventual result file:

```json
"comparison": {
  "sizingCheck": {
    "verdict": "pass" | "fail",
    "issues": ["page-level component is 622×304, expected ≥1200×600"],
    "builtSize": {"w": 622, "h": 304},
    "expectedSize": {"w": 1380, "h": 768}
  },
  "matchPct": 95.26,
  ...
}
```

### 4b. Pixel diff comparison

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

**Verdict thresholds (combined with Step 4a result):**

- 4a passed AND `matchPct >= 90%` AND `borderMatchPct >= 85%` → **match** (done)
- 4a failed (regardless of pixel score) → **size_mismatch** (needs fixing — fix sizing first, then re-screenshot, then re-run 4a + 4b)
- 4a passed AND `matchPct 75-90%` or `borderMatchPct < 85%` → **minor_diff** (needs fixing)
- 4a passed AND `matchPct < 75%` → **mismatch** (needs fixing)

A passing pixel verdict alone is NOT enough — 4a must also pass. Otherwise the build is silently wrong-sized and the validation phase will reject it later.

If no app screenshot exists (`appScreenshot` is null), skip pixel comparison — but still run Step 4a. Report `no_app_reference` only if 4a also passes; otherwise report `size_mismatch`.

---

## Step 5: Fix Loop (Up to 3 Iterations)

If the verdict is `minor_diff` or `mismatch`, enter the fix loop.

### Per-iteration process

**5a. Diagnose the discrepancy**

Use all four inputs together to identify specific differences:

1. **Step 4a sizing check result** — if it failed, address sizing FIRST. A too-small master will mask everything else and will re-fail validation later.
2. **Read `diff.png`** — red regions show exactly where pixels differ
3. **Read `app.png`** — what the component should look like
4. **Read `figma.png`** — what was actually built
5. **Read source `.tsx`** — Tailwind classes reveal intended values (colors, spacing, radii, font weights)

Cross-reference to identify the exact Figma properties that need correction. Common discrepancy patterns:

| Symptom                                                                  | Likely Cause                                                                    | Fix                                                                                                                                                                  |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Step 4a sizing check failed** (master too small for `fill` intent)     | Master built with `*SizingMode='AUTO'`, hugged content, app.png was cropped narrow | Set sizing modes FIRST, then resize: `node.primaryAxisSizingMode='FIXED'; node.counterAxisSizingMode='FIXED'; node.resizeWithoutConstraints(W, H)`. Set fill children to `layoutSizingHorizontal='FILL'` / `layoutSizingVertical='FILL'`. Order matters — sizing modes before `resize()`, otherwise the resize collapses back to AUTO. |
| **Step 4a sizing check failed** (fixed dimension off by > 2px)           | Wrong literal width/height from Tailwind class                                  | `node.resizeWithoutConstraints(intendedW, intendedH)`                                                                                                                |
| Red border ring around component                                         | Wrong border color, extra stroke, missing stroke                                | Adjust `strokes`, `strokeWeight`, `strokeAlign`                                                                                                                      |
| Red fill region                                                          | Wrong background color                                                          | Adjust `fills` color values                                                                                                                                          |
| Red text area                                                            | Wrong font size/weight, wrong text color, wrong text content                    | Adjust font properties, text fills                                                                                                                                   |
| Shifted content                                                          | Wrong padding or spacing                                                        | Adjust `itemSpacing`, padding values                                                                                                                                 |
| Missing element                                                          | Child not created or wrong visibility                                           | Add missing child element                                                                                                                                            |
| Extra element                                                            | Decorative element not in source                                                | Remove unexpected child                                                                                                                                              |
| Size mismatch (from pixel diff, not 4a)                                  | Wrong resize values or sizing mode                                              | Adjust `resize()` or `layoutSizingMode`                                                                                                                              |
| Components all thin strips                                               | `fixSizing()` not applied, or `counterAxisSizingMode = 'FIXED'`                 | Run `fixSizing()` on the component                                                                                                                                   |

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

## Step 6: Write figma.json tracking file

Write a Figma tracking record to the component's modlet folder so the codebase has a durable link back to the Figma node. Applies whether this run created the component fresh or worked with an existing one.

**Path:** `packages/client/src/components/{ComponentName}/figma.json`

**Schema:**

```json
{
  "fileKey": "{figmaFileKey}",
  "nodeId": "{componentSetIdOrComponentId}",
  "url": "https://figma.com/design/{fileKey}?node-id={nodeIdWithDashes}",
  "componentName": "Button",
  "createdAt": "2026-05-15T14:32:00Z",
  "updatedAt": "2026-05-15T14:32:00Z"
}
```

**Field rules:**

- `nodeId` — the COMPONENT_SET id when variants exist, otherwise the COMPONENT id. Same value reported as `nodeId` in Step 7.
- `url` — convert the colon in `nodeId` to a dash for the URL fragment (Figma's URL format).
- `componentName` — the Figma component name (e.g. `Button`, `Icon/Check`, `Asset/CartonLogoSvg`).

**Read-then-write semantics:**

1. If `figma.json` already exists at the target path: parse it, preserve the existing `createdAt`, and refresh `nodeId`, `url`, `updatedAt` (and `componentName` if it changed) with current values.
2. If it does not exist: write a fresh file with `createdAt` and `updatedAt` both set to the current ISO 8601 UTC timestamp.

**Folder resolution:**

The component folder is the modlet folder for `componentName`. For namespaced names (`Icon/Bot`, `Asset/CartonLogoSvg`), the folder lives under the corresponding subdirectory:

- `Button` → `packages/client/src/components/Button/figma.json`
- `Icon/Bot` → `packages/client/src/components/Icon/Bot/figma.json`
- `Asset/CartonLogoSvg` → `packages/client/src/components/Asset/CartonLogoSvg/figma.json`

If the target folder does not exist (e.g. an icon or asset whose modlet hasn't been scaffolded), create the folder before writing the file.

**Failure handling:** if the write fails (permission, missing parent path that can't be created), log the failure and continue — do not fail the build. Surface the failure in the Step 7 return result under a `trackingFile` field with `{ written: false, error: "..." }` so the orchestrator can report it.

---

## Step 7: Return Result

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
| Sub-component not in `builtComponents` | Reject the build — return `status: "rejected"` with the missing children list (step 1e)      |
| Icon not in `builtComponents`          | Reject the build — return `status: "rejected"` with the missing icon in `missingChildren`    |

Never fail silently. Every error or skip must appear in the returned result.
