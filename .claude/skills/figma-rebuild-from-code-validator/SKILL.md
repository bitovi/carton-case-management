---
name: figma-rebuild-from-code-validator
description: Validate a figma-rebuild-from-code run by listing all Figma components, screenshotting each component from the live app using Playwright element screenshots, and comparing them against the Figma counterpart. Reports components not visible in the app and structural checks (variables, pages, screens). Use after running figma-rebuild-from-code to audit correctness. Produces a report at .temp/figma-validation/report.md.
---

# Skill: Figma Rebuild Validator

Validates the output of `figma-rebuild-from-code` by navigating the live app, screenshotting each component in its natural context, and comparing against the **matching Figma variant** — not the entire component set. Produces a structured report with side-by-side screenshots.

## When to Use

- After running `figma-rebuild-from-code` to verify the output
- When auditing whether Figma components match their React implementations
- To identify which components are not directly visible in the running app

## Prerequisites

- Figma MCP must be connected and authenticated
- Dev server must be running on `localhost:5173` (`npm run dev` from project root)
- `.temp/figma-from-code/state.json` must exist (produced by `figma-rebuild-from-code`)

## Workflow

```
Phase 1: Inventory        → list all Figma components + classify app visibility
Phase 1e: Variant Resolve → for each component set, find the specific variant used in the app
Phase 2: Screenshots      → Playwright element screenshot from app + Figma get_screenshot of resolved variant
Phase 3: Structural       → check variables, pages, screen sizes
Phase 4: Report           → write .temp/figma-validation/report.md
```

---

## Phase 1: Build Component Inventory

### Step 1a — Read state file

```bash
cat .temp/figma-from-code/state.json
```

Extract `fileKey`.

### Step 1b — Query Figma for all components

```javascript
// use_figma
await figma.setCurrentPageAsync(figma.root.children.find(p => p.name === '📦 Components'));
const sets = figma.currentPage.findAll(n => n.type === 'COMPONENT_SET');
const singles = figma.currentPage.children.filter(n => n.type === 'COMPONENT');
const all = [
  ...sets.map(s => ({ name: s.name, id: s.id, type: 'set' })),
  ...singles.map(s => ({ name: s.name, id: s.id, type: 'single' })),
];
return JSON.stringify(all);
```

### Step 1c — Classify each component

Use the **Component App Map** below to assign each component a `url`, `selector`, optional `click` action, and `figmaVariant` (the variant properties that match what's rendered in the app).

### Step 1d — Check dev server

```bash
curl -s --max-time 3 http://localhost:5173 > /dev/null && echo "running" || echo "not_running"
```

If `not_running`: halt and tell the user to run `npm run dev`.

Print the classification to the conversation:
```
📱 App visible (44): Button, Input, ...
⚠️  Requires interaction (4): Dialog, Sheet, ...
🚫  Not visible in app (1): Skeleton (loading state only)
```

---

## Phase 1e: Variant Node Resolution

**This is the key step that ensures Figma screenshots match the app variant.**

For every component whose `type === 'set'` and that has a `figmaVariant` specified in the Component App Map, resolve the specific child variant node ID before taking screenshots.

### What this solves

Without this step, `get_screenshot(fileKey, setNodeId)` returns an image of **all variants tiled** in the component set — not the single variant that the app is rendering. Resolving to the child node gives an apples-to-apples comparison.

### Resolution script (run once per component set)

```javascript
// use_figma
const setNodeId = '{nodeId from Phase 1b}';
const targetProps = {Variant: 'primary', State: 'Default'}; // from Component App Map figmaVariant column

const componentSet = figma.getNodeById(setNodeId);
if (!componentSet || componentSet.type !== 'COMPONENT_SET') {
  return JSON.stringify({ resolvedId: setNodeId, resolvedName: componentSet?.name ?? 'unknown', fallback: true });
}

// Log available variant property names and their values to aid debugging
const available = componentSet.children.map(c => ({
  id: c.id,
  name: c.name,
  props: c.variantProperties,
}));

// Try exact match first (case-insensitive values)
let match = componentSet.children.find(child =>
  Object.entries(targetProps).every(([k, v]) =>
    child.variantProperties?.[k]?.toLowerCase() === v.toLowerCase()
  )
);

// Partial match fallback: match only props that exist on the set's property keys
if (!match) {
  const availableKeys = Object.keys(componentSet.children[0]?.variantProperties ?? {});
  const filteredTarget = Object.fromEntries(
    Object.entries(targetProps).filter(([k]) => availableKeys.includes(k))
  );
  match = componentSet.children.find(child =>
    Object.entries(filteredTarget).every(([k, v]) =>
      child.variantProperties?.[k]?.toLowerCase() === v.toLowerCase()
    )
  );
}

// Last resort: first child
match = match ?? componentSet.children[0];
return JSON.stringify({ resolvedId: match.id, resolvedName: match.name, props: match.variantProperties, available });
```

**Store the resolved `variantNodeId` for each component.** Use this in Phase 2 when calling `get_screenshot`.

### Handling multiple app variants for one component

Some components appear in multiple variants in the app (e.g., Button appears as `primary` on form submit and `ghost` in menus). For these, create **two entries** in the comparison table:

| Entry | App Variant | Figma Variant Props |
|-------|------------|---------------------|
| Button (submit) | `button[type="submit"]` on `/cases/new` | `{Variant: "primary", Size: "regular"}` |
| Button (menu action) | `[data-radix-dropdown-menu-content] button` on `/cases/` | `{Variant: "ghost", Size: "small"}` |

---

## Component App Map

Maps every Figma component to the app page, Playwright CSS selector, and the Figma variant properties that match the app rendering.

The screenshot script is: `.claude/skills/figma-rebuild-from-code-validator/screenshot.js`

Usage:
```bash
# Element screenshot (preferred)
node screenshot.js <url> <output> --selector "css" [--click "click-css"] [--hover "hover-css"] [--variant "label"] [width] [height]

# Full-page fallback
node screenshot.js <url> <output> [width] [height]
```

Flags:
- `--selector` — CSS selector for the element to screenshot
- `--click` — click this element before screenshotting (opens overlays, enters edit mode)
- `--hover` — hover over this element before screenshotting (reveals tooltips, hover cards)
- `--variant` — label printed in output for logging (no effect on screenshot)
- `--nth N` — use the Nth matching element (0-indexed)

### Tier 1 — App chrome (always visible)

| Component | URL | Selector | Figma Variant |
|-----------|-----|----------|---------------|
| Header | `/cases/` | `header[aria-label="Main navigation"]` | `{}` (single) |
| MenuList | `/cases/` | `nav[aria-label="Main menu"] div[class*="lg:flex"]` | `{}` (single) |

### Tier 2 — List sidebars (200px columns)

| Component | URL | Selector | Figma Variant |
|-----------|-----|----------|---------------|
| CaseList | `/cases/` | `[class*="w-[200px]"]` | `{}` (single) |
| CustomerList | `/customers/` | `[class*="w-[200px]"]` | `{}` (single) |
| UserList | `/users/` | `[class*="w-[200px]"]` | `{}` (single) |

### Tier 3 — Detail panels (auto-selected first record on desktop)

| Component | URL | Selector | Figma Variant |
|-----------|-----|----------|---------------|
| CaseDetails | `/cases/` | `[class*="flex-1"][class*="flex-col"]` | `{}` (single) |
| CaseInformation | `/cases/` | `[class*="flex-col"][class*="gap-4"]` | `{}` (single) |
| CaseEssentialDetails | `/cases/` | `[class*="w-[200px]"][class*="flex-col"][class*="gap-3"]` | `{}` (single) |
| CaseComments | `/cases/` | `[class*="gap-4"] textarea` | `{}` (single) |
| CustomerDetails | `/customers/` | `.flex-1.flex-col.lg\\:flex-row` | `{}` (single) |
| UserDetails | `/users/` | `.flex-1.flex-col.lg\\:flex-row` | `{}` (single) |

### Tier 4 — Create form components

Navigate to `/cases/new` which shows Input, Textarea, Select, Label, and Button.

| Component | URL | Selector | Figma Variant |
|-----------|-----|----------|---------------|
| Input | `/cases/new` | `input[placeholder="Enter case title"]` | `{State: "Default"}` |
| Textarea | `/cases/new` | `textarea` | `{State: "Default"}` |
| Label | `/cases/new` | `label[for="title"]` | `{}` (single or first variant) |
| Button (primary) | `/cases/new` | `button[type="submit"]` | `{Variant: "primary", Size: "regular", State: "Default"}` |
| Button (secondary) | `/cases/new` | `a[href="/cases/"]` | `{Variant: "secondary", Size: "regular", State: "Default"}` |
| Select | `/cases/new` | `button[role="combobox"]` | `{State: "Default"}` |

### Tier 5 — Inline editing (click to enter edit mode)

Use `--click` to enter edit mode before screenshotting.

| Component | URL | Click selector | Screenshot selector | Figma Variant |
|-----------|-----|----------------|---------------------|---------------|
| EditableTitle | `/cases/` | `h1` | `div[class*="flex"][class*="gap-1"] input` | `{State: "editing"}` |
| EditableSelect | `/cases/` | `[class*="EditableSelect"] [data-state]` | `[class*="EditableSelect"]` | `{State: "editing"}` |
| EditableTextarea | `/cases/` | `[class*="EditableTextarea"] p` | `[class*="EditableTextarea"] textarea` | `{State: "editing"}` |
| EditControls | `/cases/` | `h1` | `div[class*="flex"][class*="gap-1"] div[class*="gap-1"]` | `{}` (single) |

### Tier 6 — Overlays (require click to open)

Use `--click` to trigger before screenshotting the overlay.

| Component | URL | Click selector | Screenshot selector | Figma Variant |
|-----------|-----|----------------|---------------------|---------------|
| MoreOptionsMenu | `/cases/` | `button[aria-label="More options"]` | `[data-radix-popper-content-wrapper]` | `{}` (single) |
| ConfirmationDialog | `/cases/` | `button[aria-label="More options"]`, then `button:has-text("Delete")` | `[role="alertdialog"]` | `{}` (single) |
| FiltersTrigger | `/cases/` | — (visible) | `button:has-text("Filters")` | `{State: "Default"}` |
| FiltersDialog | `/cases/` | `button:has-text("Filters")` | `[role="dialog"]` | `{}` (single) |
| FiltersList | `/cases/` | `button:has-text("Filters")`, apply a filter | `[class*="FiltersList"]` | `{}` (single) |
| MultiSelect | `/cases/` | `button:has-text("Filters")` | `[data-radix-popper-content-wrapper]` | `{}` (single) |
| RelationshipManagerDialog | `/cases/` | `button:has-text("Add")` | `[role="dialog"]` | `{}` (single) |
| Dialog | `/cases/` | trigger | `[role="dialog"]` | `{}` (single) |
| AlertDialog | `/cases/` | delete trigger | `[role="alertdialog"]` | `{}` (single) |
| Sheet | `/cases/` | mobile menu button | `[data-radix-dialog-content]` | `{}` (single) |

### Tier 7 — Common components (appear embedded)

| Component | URL | Selector | Figma Variant |
|-----------|-----|----------|---------------|
| FiltersTrigger | `/cases/` | `button:has-text("Filters")` | `{State: "Default"}` |
| VoteButton | `/cases/` | `button[class*="vote"], [class*="VoteButton"]` | `{State: "Default"}` |
| ReactionStatistics | `/cases/` | `[class*="ReactionStatistics"], [class*="reaction"]` | `{}` (single) |
| CheckboxGroup | `/cases/` → open filters | `[class*="CheckboxGroup"]` | `{}` (single) |
| RelationshipManagerList | `/cases/` → open manage | `[class*="RelationshipManager"]` | `{}` (single) |
| RelationshipManagerAccordion | `/customers/` | `[class*="Accordion"][class*="Related"]` | `{}` (single) |
| RelatedCasesAccordion | `/customers/` | `button:has-text("Related Cases")` | `{}` (single) |
| VoterTooltip | `/cases/` | `[data-radix-popper-content-wrapper]:has([class*="voter"])` | Use `--hover "[class*='VoteButton']"` to reveal before screenshotting | `{}` (single) |
| EditableText | `/customers/` | `[class*="EditableText"]:not([class*="EditableTitle"])` | `{State: "Default"}` |
| EditableCurrency | n/a | not used in app UI | — |
| EditableNumber | n/a | not used in app UI | — |
| EditablePercent | n/a | not used in app UI | — |
| EditableDate | n/a | not used in app UI | — |

### Components not directly visible in app

| Component | Reason |
|-----------|--------|
| Skeleton | Loading state only — capture during initial page load before data arrives |
| Alert | Error state only — capture by simulating a network error |
| HoverCard | Hover required — use `--hover "trigger-selector" --selector "[data-radix-popper-content-wrapper]"` |
| Tooltip | Hover required — use `--hover "trigger-selector" --selector "[role='tooltip']"` |
| Calendar | Requires click-to-edit on a date field |
| Checkbox | Embedded inside FiltersList or RelationshipManagerList |
| Badge | Embedded inside FiltersTrigger (only when filters active) |
| Card | Not currently used in app UI |
| Accordion | In CaseEssentialDetails collapse — click to expand |
| Popover | Click required |
| DialogHeader | Inside Dialog — open dialog first |
| CheckboxGroup | Inside FiltersDialog |
| RichCheckboxGroup | Not used in app UI |
| EditControls | Appears after clicking into edit mode |

For hover-only components, use Playwright's `.hover()` API in a custom script rather than the `--click` flag.

---

## Phase 2: Screenshot Pairs

For each component with a URL and selector:

### Step 2a — Check for pre-build app screenshot and text

Before capturing a new screenshot, check if the orchestrator already captured one:

```bash
ls .temp/figma-from-code/screenshots/{ComponentName}/app.png 2>/dev/null && echo "exists" || echo "missing"
```

- If **exists**: copy it to `.temp/figma-validation/screenshots/{ComponentName}/app.png` — skip the Playwright capture for this component.
- If **missing**: capture a fresh screenshot using Steps 2b/2c below.

Also check for pre-extracted text:
```bash
ls .temp/figma-from-code/screenshots/{ComponentName}/text.json 2>/dev/null && echo "exists" || echo "missing"
```

- If **text.json exists**: the Figma component was already built with real text — skip Step 2b-text.
- If **missing**: run `extract-text.js` (Step 2b-text) and use it to update the Figma component's text nodes before screenshotting (Step 2c-text).

### Step 2b — Capture app screenshot (if not pre-built)

Run the screenshot script with `--selector`:
```bash
node .claude/skills/figma-rebuild-from-code-validator/screenshot.js \
  "http://localhost:5173{url}" \
  ".temp/figma-validation/screenshots/{ComponentName}/app.png" \
  --selector "{selector}" \
  1440 900
```

If the component requires a click first, use `--click`:
```bash
node .claude/skills/figma-rebuild-from-code-validator/screenshot.js \
  "http://localhost:5173{url}" \
  ".temp/figma-validation/screenshots/{ComponentName}/app.png" \
  --selector "{screenshot-selector}" \
  --click "{click-selector}" \
  1440 900
```

### Step 2b-text — Extract and inject real text (if text.json missing)

If `text.json` was not produced during the rebuild, run the extractor now and update the Figma component's text nodes to match the app before screenshotting:

**Extract:**
```bash
node .claude/skills/figma-rebuild-from-code-validator/extract-text.js \
  "http://localhost:5173{url}" \
  --selector "{selector}" \
  [--click "{click-selector}"] \
  [--nth N] \
  > ".temp/figma-validation/screenshots/{ComponentName}/text.json"
```

**Inject into Figma** (run once per component, before step 2d):
```javascript
// use_figma — update Figma text nodes to match app text
async function injectText(nodeId, textJson) {
  const node = figma.getNodeById(nodeId);
  const { lines, headings, inputs, buttons, labels } = textJson;

  // Collect all visible text strings in app order
  const appStrings = [...headings, ...labels, ...inputs, ...buttons, ...lines]
    .filter((s, i, arr) => s && arr.indexOf(s) === i) // dedupe, preserve order
    .slice(0, 20);

  let strIdx = 0;
  async function updateTextNodes(n) {
    if (n.type === 'TEXT' && strIdx < appStrings.length) {
      const s = appStrings[strIdx++];
      if (s) {
        const fn = n.fontName === figma.mixed ? { family: 'Inter', style: 'Regular' } : n.fontName;
        await figma.loadFontAsync(fn);
        n.characters = s;
      }
    }
    if ('children' in n) {
      for (const c of n.children) await updateTextNodes(c);
    }
  }
  await updateTextNodes(node);
}
const textJson = JSON.parse('{contents of text.json}');
await injectText('{variantNodeId}', textJson);
return 'done';
```

Skip this step for components that have no app selector (not visible in app).

### Step 2c — Structural QA: inspect the Figma node before screenshotting

Before taking the Figma screenshot, run a structural check on the resolved variant node. This catches defects that are invisible in a screenshot but cause visual discrepancies in the app.

```javascript
// use_figma
function auditNode(node) {
  const issues = [];
  // INSIDE stroke alignment creates a double-border visual that doesn't match CSS
  if ('strokeAlign' in node && node.strokeAlign === 'INSIDE' && node.strokes?.length > 0) {
    issues.push({ type: 'inside_stroke', node: node.id, name: node.name });
  }
  // Multiple overlapping fills can cause unexpected color blending
  if ('fills' in node && node.fills.filter(f => f.visible !== false).length > 1) {
    issues.push({ type: 'multiple_fills', node: node.id, count: node.fills.length });
  }
  if ('children' in node) node.children.forEach(c => issues.push(...auditNode(c)));
  return issues;
}
const node = figma.getNodeById('{variantNodeId}');
const issues = auditNode(node);
return JSON.stringify(issues);
```

If any issues are returned, fix them before screenshotting (e.g., change `strokeAlign` from `INSIDE` to `OUTSIDE`). Note the fix in the report.

### Step 2d — Capture Figma screenshot of the resolved variant

**Always use the `variantNodeId` resolved in Phase 1e, NOT the component set node ID.**

```
get_screenshot(fileKey, variantNodeId)
curl -sL "{image_url}" -o ".temp/figma-validation/screenshots/{ComponentName}/figma.png"
```

- For components marked `{}` (single) or `type === 'single'`, use the node ID as-is.
- For components listed as "not visible in app", note them in the report without a screenshot pair.
- When a component has multiple app variants (e.g., Button primary and Button ghost), create sub-folders: `Button-primary/` and `Button-ghost/`.

**Why this matters:** Screenshotting the component set shows all variants stacked side-by-side in Figma. Screenshotting the resolved variant node shows only the single variant that matches what the app renders — making the visual comparison meaningful.

### Step 2e — Pixel diff comparison

After both screenshots are saved, run the comparison script:

```bash
node .claude/skills/figma-rebuild-from-code-validator/compare.js \
  ".temp/figma-validation/screenshots/{ComponentName}/app.png" \
  ".temp/figma-validation/screenshots/{ComponentName}/figma.png" \
  ".temp/figma-validation/screenshots/{ComponentName}/"
```

The script outputs:
- `diff.png` — red pixels mark differences, dimmed original provides context
- `comparison.json` — `{ matchPct, borderMatchPct, verdict, borderVerdict }`
- Exit code: `0` = match, `1` = minor_diff (⚠️ flag for review), `2` = mismatch (❌ auto-defect)

**Thresholds:**
- Overall ≥ 90% → match; 75–90% → minor_diff; < 75% → mismatch
- Border ring ≥ 85% → border_ok; < 85% → border_diff (flags as minor_diff even if overall passes)

The border-region check catches subtle styling defects (extra strokes, wrong border color, box-shadow presence/absence) that are masked by text-content differences in the overall score. Always include the `diff.png` in the report table regardless of verdict — it lets you visually verify what the score detected.

**Note on text-content diffs:** When Figma components were built with real app text (via `extract-text.js` in Phase 3), scores should be high (> 90%) for matching components. A score of 75–90% on a text-seeded component is meaningful — inspect the diff image for structural differences (layout, spacing, color). If components were built with placeholder text (older rebuild), scores of 60–85% are expected for text-heavy components and are not defects; in that case rely on the border score and diff image to find real issues.

---

## Phase 3: Structural Checks

```javascript
// use_figma
const results = {};
const colls = figma.variables.getLocalVariableCollections();
results.collections = colls.map(c => ({ name: c.name, mode: c.modes[0].name, count: c.variableIds.length }));
results.pages = figma.root.children.map(p => p.name);
await figma.setCurrentPageAsync(figma.root.children.find(p => p.name === '📄 Screens'));
results.screens = figma.currentPage.children.map(f => ({ name: f.name, w: Math.round(f.width), h: Math.round(f.height) }));
await figma.setCurrentPageAsync(figma.root.children.find(p => p.name === '🎨 Foundations'));
results.foundationFrames = figma.currentPage.children.map(f => f.name);
return JSON.stringify(results);
```

Expected: Palette (89), Semantic (50), Spacing (19), 3 pages, 3 foundation frames, 6 screens at 1440×900.

---

## Phase 4: Write Report

Output: `.temp/figma-validation/report.md`

```markdown
# Figma Rebuild Validation Report
File: {fileKey} | Generated: {timestamp}

## Summary
| | Count |
|-|-------|
| Components in Figma | {total} |
| Screenshotted from app | {captured} |
| Not visible in app | {skipped} |
| Screenshot failures | {failed} |
| Structural QA fixes | {structFixes} |
| Fixed after validation | {fixed} |

## Structural Checks
...

## Components Not Visible in App
| Component | Reason |
|-----------|--------|
...

## Screenshot Comparisons
### {ComponentName}
Figma variant: `{variantProperties}` (node: `{variantNodeId}`)
Pixel score: **{matchPct}%** overall | **{borderMatchPct}%** border — verdict: `{verdict}`

| App (`{url}`) | Figma (`{variantNodeId}`) | Diff |
|---|---|---|
| ![app](screenshots/{ComponentName}/app.png) | ![figma](screenshots/{ComponentName}/figma.png) | ![diff](screenshots/{ComponentName}/diff.png) |
```

After writing the report, assess whether any components have visual defects or mismatches:

- If **defects found**: proceed directly to Phase 5 (Fix Loop), starting at iteration 1.
- If **no defects**: print a completion message and stop.

---

## Phase 5: Fix Loop

Runs up to **3 iterations**. Each iteration attempts to fix all remaining defects, re-screenshots, and re-evaluates.

### Per-iteration steps

**Step 5a — Identify defects**

Review the report for all components marked as mismatched or defective. On iteration 1 this is the initial report; on subsequent iterations, only components still marked ⚠️ Still Defective.

**Step 5b — Fix each defective component in Figma**

For each defective component:
1. Identify the specific visual difference (color, spacing, layout, missing variant, wrong text, etc.)
2. Fix it in Figma using `use_figma`
3. Re-take the Figma screenshot: `get_screenshot(fileKey, variantNodeId)` — use the **same resolved variant node ID**, not the set
4. Overwrite `.temp/figma-validation/screenshots/{ComponentName}/figma.png`
5. Compare the new `figma.png` against the existing `app.png`
6. Mark as **✅ Fixed** or **⚠️ Still Defective**

Never re-attempt a component already marked ✅ Fixed in a prior iteration.

**Step 5c — Update the report**

Append an iteration section to `report.md`:

```markdown
## Fix Loop — Iteration {N}
| Component | Status | Notes |
|-----------|--------|-------|
| Button | ✅ Fixed | Corrected border-radius from 4px to 6px |
| Input | ⚠️ Still Defective | Focus ring color still wrong |
```

Update the summary counter: `Fixed after validation: {total fixed so far}`.

**Step 5d — Exit conditions**

- If all defects are resolved → print a success summary and stop.
- If the iteration count reaches 3 and defects remain → append a final section listing all unresolved components, note they require manual review, and stop.

```markdown
## Unresolved After 3 Fix Iterations
| Component | Remaining Issue |
|-----------|----------------|
| Input | Focus ring color does not match app |
```

---

## Output File Structure

```
.temp/figma-validation/
├── report.md
└── screenshots/
    ├── Button-primary/
    │   ├── app.png      ← Playwright element screenshot from live app
    │   └── figma.png    ← Figma MCP get_screenshot of resolved variant node
    ├── Button-ghost/
    │   ├── app.png
    │   └── figma.png
    └── Input/
        ├── app.png
        └── figma.png
```

---

## Error Handling

| Error | Action |
|-------|--------|
| Dev server not running | Halt, tell user to run `npm run dev` |
| Component set has no matching variant | Log resolved variant + all available props; use first child; note in report |
| Selector not found on page | Log as `selector_not_found`, skip; note in report |
| Element exists but empty/zero-size | Log as `element_empty`, try broader selector |
| Requires interaction not yet supported | Note as `requires_interaction`, include fallback full-page screenshot |
| Component not visible in app | Note as `not_visible`, include Figma variant screenshot only |

Never stop the full run for a single component failure.
