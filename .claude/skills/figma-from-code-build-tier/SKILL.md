---
name: figma-from-code-build-tier
description: Build all Figma components for a single tier by dispatching parallel opus subagents. Handles the icon/asset preamble, library component filtering, subagent prompt construction, and result collection. This is Phase 3 of figma-from-code.
---

# Skill: Build Components (Phase 3)

Builds all Figma components using pre-captured reference material, reusing lower-tier components as instances. Tiers run sequentially because each tier depends on components built in all lower tiers. Within a tier, one subagent per component runs in parallel.

## When to Use

- When `figma-from-code` reaches Phase 3
- Standalone to build or rebuild a single tier of components
- After code changes to rebuild affected components

## Prerequisites

- Phases 0–2.5 complete (build order, icons, tokens, file structure, screenshots all in place)
- `.temp/figma-from-code/state.json` populated with `buildOrder`, `figmaNodes`, `iconDiscovery`
- Pre-captured screenshots in `.temp/figma-from-code/screenshots/`

## Preamble: Build Icon & Asset Components

**Before processing any tier**, the orchestrator creates all icon and asset components directly via `use_figma`. This is deterministic work — no judgment needed, just SVG data in, vector components out.

**Skip already-built icons/assets:** Check `builtComponents` in state.json first. Any icon or asset that already has a node ID (seeded from Phase 0a Figma inspection) should be skipped. Only create icons/assets that are not yet in `builtComponents`.

1. Read `.temp/figma-from-code/icons.json` (produced in Phase 0b)
2. Filter out icons/assets already in `builtComponents` (e.g. if `Icon/Bot` already has a node ID, skip it)
3. For each remaining icon, call `use_figma` to create a component from SVG. Batch ~7 icons per call to stay within code limits:

```javascript
// use_figma — create icon components from SVG strings
const iconsFrame = figma.getNodeById('{iconsFrameId}');
const results = {};

const iconData = [
  {
    name: 'Check',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  },
  // ... more icons
];

for (const icon of iconData) {
  const svgGroup = figma.createNodeFromSvg(icon.svg);
  const comp = figma.createComponent();
  comp.name = `Icon/${icon.name}`;
  comp.resize(24, 24);
  comp.fills = [];
  comp.clipsContent = false;
  while (svgGroup.children.length > 0) {
    comp.appendChild(svgGroup.children[0]);
  }
  svgGroup.remove();
  iconsFrame.appendChild(comp);
  results[`Icon/${icon.name}`] = comp.id;
}

return JSON.stringify(results);
```

3. For SVG file assets (e.g., app logos), use the same approach with the raw SVG file content:

```javascript
const logoSvg = `<svg width="34" height="34" ...>...</svg>`; // from icons.json assets[].svgString
const svgGroup = figma.createNodeFromSvg(logoSvg);
const comp = figma.createComponent();
comp.name = 'Asset/AppLogoSvg';
comp.resize(34, 34);
comp.fills = [];
while (svgGroup.children.length > 0) {
  comp.appendChild(svgGroup.children[0]);
}
svgGroup.remove();
iconsFrame.appendChild(comp);
results['Asset/AppLogoSvg'] = comp.id;
```

4. Merge all newly created icon/asset component IDs into `builtComponents` in state.json
5. **Checkpoint:** "Built {N} icon components and {M} asset components. Skipped {S} already-built. Proceeding to tier builds."

If `figma.createNodeFromSvg()` fails for a specific icon, fall back to creating a 24x24 placeholder rectangle named `Icon/{Name}` so higher-tier components can still instantiate it for correct sizing.

## Handling Library Components (no source file)

Many tier-1 components detected by site-component-map are Lucide icons or router primitives imported directly from npm packages. They have no `.tsx` file in the codebase.

| Type             | Example                           | Figma approach                                                                                            |
| ---------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Lucide icon      | `Bot`, `Star`, `EllipsisVertical` | **Already built as `Icon/{Name}` in preamble** — skip, these are in `builtComponents`                     |
| SVG asset        | `AppLogoSvg`                   | **Already built as `Asset/{Name}` in preamble** — skip                                                    |
| Router primitive | `Link` (react-router-dom)         | Build as a nav link component set (Default / Active variants) showing what the link looks like in context |

When a tier-1 component name matches a Lucide icon discovered in Phase 0b, do not rebuild it — it already exists as `Icon/{Name}` in `builtComponents`.

## Per-Tier Process

Each subagent runs the **entire** `figma-from-code-build-component` workflow for a single component: analyze source → build via `use_figma` → screenshot via `get_screenshot` → compare via `compare.js` → fix loop (up to 3 iterations). All components within a tier run in parallel.

**Before dispatching:** ensure the results directory exists:
```bash
mkdir -p .temp/figma-from-code/build-results
```

### Filter out already-built components

Before dispatching subagents for a tier, check each component against `builtComponents` in state.json. If a component's name already has a node ID in `builtComponents` (seeded from Phase 0a Figma inspection or from a prior tier build), **skip it** — do not dispatch a subagent.

> **Pre-Existing Components Rule (orchestrator skill):** components whose node ID is in `state.json → preExistingComponents` predate this run. They are skipped here by default. If the user (or a Phase 5 finding) requests a rebuild for one of them, the orchestrator MUST first obtain explicit user authorization before dispatching, even in auto mode. See the orchestrator skill's "Pre-Existing Components Rule" section.

```
Tier 2 components: [Button, CaseComments, Link, RelatedCasesAccordion]
Already in builtComponents: [Button, Link]
→ Dispatch subagents only for: [CaseComments, RelatedCasesAccordion]
→ Report: "Skipped 2 already-built components: Button, Link"
```

This enables partial rebuilds — pointing the pipeline at a Figma file that already has some components built will skip those and only create what's missing.

### Subagent Prompt Template

**Model: `opus`** — dispatch one subagent per component. Send all subagents for the tier in a **single message** so they run in parallel.

```
Build a Figma component from its React source code, then validate it visually.

Follow the figma-from-code-build-component skill (all 6 steps):
1. Analyze the source code and reference material
2. Build the component in Figma via use_figma
3. Screenshot the result via get_screenshot
4. Compare against the app screenshot via compare.js
5. If mismatch, diagnose and fix (up to 3 iterations)
6. Write results to .temp/figma-from-code/build-results/{ComponentName}.json

Inputs:
- Component: {ComponentName}
- Figma file key: {fileKey}
- Parent frame node ID: {tierFrameId}
- Source file: {sourceFilePath}
- CSS file: {cssFilePath or "none"}
- App screenshot: .temp/figma-from-code/screenshots/{ComponentName}/app.png
- Text content: .temp/figma-from-code/screenshots/{ComponentName}/text.json
- Icons manifest: .temp/figma-from-code/icons.json
- Variable map: .temp/figma-from-code/variables.json (CSS-variable → Figma-variable-ID lookup, used in Step 2e for binding variables to fills/strokes/radius)
- Screenshot dir: .temp/figma-from-code/screenshots/{ComponentName}/

Available built components (for instance reuse):
{JSON.stringify(builtComponents)}

Pre-existing Figma nodes (DO NOT MODIFY without orchestrator authorization):
{JSON.stringify(preExistingComponents)}

If your build would require modifying any node ID listed in preExistingComponents — including
rebuilding, resizing the master, swapping out the variant set, deleting and recreating, etc.
— do NOT proceed. Stop and write a result file with "status": "needs_authorization" and
"preExistingTouched": [<list of names>] so the orchestrator can prompt the user. Creating
a new component that *references* a pre-existing node as an instance is fine — that's reuse,
not modification.

Read the figma-from-code-build-component skill for the Tailwind-to-Figma
mapping reference, fixSizing() function, variant handling, and common pitfalls.

Result file format (.temp/figma-from-code/build-results/{ComponentName}.json):
{
  "componentName": "...",
  "nodeId": "123:45",
  "type": "COMPONENT" or "COMPONENT_SET",
  "variants": [{"name": "...", "nodeId": "..."}],
  "comparison": {
    "matchPct": 94.2,
    "borderMatchPct": 91.0,
    "verdict": "match",
    "iterations": 1,
    "fixes": ["border-radius 4px -> 8px"]
  },
  "figmaScreenshot": ".temp/figma-from-code/screenshots/{ComponentName}/figma.png"
}
```

### After All Subagents Complete

1. Read each `.temp/figma-from-code/build-results/{ComponentName}.json`
2. Collect all node IDs, match scores, and failures
3. Log any subagents that failed entirely (no result file)

## Orchestrator Behavior Between Tiers

After all subagents for a tier complete:

1. Write `build-tier{N}.json` with completed/failed/match lists
2. Merge new node IDs into `builtComponents` in state.json
3. Spot-check: `get_screenshot(fileKey, tierFrameId)` — verify components have realistic, varied heights (not all thin strips)
4. Update `tierProgress.tier{N}` and `phase3` status
5. Report comparison results: how many matched, how many fixed, how many remain mismatched
6. **Checkpoint with user** — ask to proceed to next tier
7. Do not auto-proceed across tier boundaries

## Output Files

Written to `.temp/figma-from-code/`:

| File | Contents |
|------|----------|
| `build-results/{ComponentName}.json` | Per-component result (written by subagent) |
| `build-tier{N}.json` | Tier summary (written by orchestrator after collecting results) |

### Per-component result format

```json
{
  "componentName": "Button",
  "nodeId": "123:45",
  "type": "COMPONENT_SET",
  "variants": [{"name": "Variant=primary, State=Default", "nodeId": "123:46"}],
  "comparison": {
    "matchPct": 94.2,
    "borderMatchPct": 91.0,
    "verdict": "match",
    "iterations": 1,
    "fixes": ["border-radius 4px -> 8px"]
  },
  "figmaScreenshot": ".temp/figma-from-code/screenshots/Button/figma.png"
}
```

### Tier summary format

```json
{
  "tier": "tier1",
  "completed": [
    {"name": "Button", "nodeId": "123:45", "figmaScreenshot": ".temp/.../Button/figma.png"}
  ],
  "failed": [{"name": "Calendar", "error": "use_figma exceeded incremental limit"}]
}
```

## Tier Definitions

Tiers are dynamic — they come from the `site-component-map` output stored at `.temp/figma-from-code/component-map.json` during Phase 0a. Read `state.json → buildOrder.tiers` for the current build order.

## Skip / Resume

If called with `resume: true`, check `state.json → tierProgress` for completed tiers and `build-results/` for individual component results. Only dispatch subagents for components without a result file.

## Error Handling

| Scenario | Action |
|----------|--------|
| `use_figma` fails in subagent | Subagent retries once; if still fails, writes error to result file |
| `use_figma` incremental limit | Split component builds across multiple `use_figma` calls |
| Components all same thin height | `fixSizing()` was not run — run it on the tier frame, re-screenshot |
| Text node padding error | Wrap text in an auto-layout frame (see build-component skill) |
| Library component has no source file | Check icon/asset preamble; build nav link variant if router primitive |
| Subagent produces no result file | Log as failed, report at checkpoint |
| `createNodeFromSvg()` fails for icon | Create 24x24 placeholder rectangle so higher tiers can instantiate |
| Subagent hung / no result after 10 minutes | The component's Playwright scripts have built-in 60–90s timeouts. If a subagent is still running after 10 minutes, it is likely stuck in a `use_figma` call or MCP roundtrip. Log the component as `failed` with `"error": "subagent_timeout"` and proceed. |
