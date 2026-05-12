---
name: figma-from-code
description: Orchestrates the full code-to-Figma rebuild workflow for Carton. Runs seven phases (discovery, icon discovery, tokens, file structure, pre-capture, component builds, screens + validate). All Figma MCP tools (use_figma, get_screenshot) work in both the orchestrator and subagents.
---

# Skill: Rebuild Figma from Code (Orchestrator)

Conducts the full code-to-Figma pipeline for Carton. Phase 3 dispatches parallel subagents that each run the complete `figma-from-code-build-component` workflow (analyze → build → screenshot → compare → fix) for a single component.

> **Figma MCP in subagents:** All Figma MCP tools (`use_figma`, `get_screenshot`, etc.) work in subagents. This enables full parallelization of component builds in Phase 3.

## When to Use

- Starting a fresh Figma rebuild from the Carton codebase
- Resuming a partially completed build after a session break
- After significant code changes that require the Figma file to be re-synced

## Required Inputs

- `fileKey`: The Figma file key (e.g. `o3eOcCYZWvOpie7ZYRonPO`)
- `resume` (optional): `true` to resume from last completed phase

## Page Frame Convention

Every Figma page uses a **single top-level container frame** that holds all content for that page. Content is never placed directly on the canvas.

| Page           | Container frame name | Contents                                                                               |
| -------------- | -------------------- | -------------------------------------------------------------------------------------- |
| 🎨 Foundations | `Foundations`        | Color Palette, Semantic Colors, Spacing Scale (stacked vertically, 80px gaps)          |
| 📦 Components  | one frame per tier   | `Tier 1a — Primitives`, `Tier 1b — Composites`, `Tier 2 — Common`, `Tier 3 — Features` |
| 📄 Screens     | `Screens`            | all 6 screen frames (in a 2-column grid)                                               |

Build agents receive the **tier frame node ID** to append components into, not the raw page ID.

---

## State Ledger

Write to `.temp/figma-from-code/state.json` after every phase and tier transition:

```json
{
  "fileKey": "o3eOcCYZWvOpie7ZYRonPO",
  "startedAt": "2026-05-06T00:00:00Z",
  "phases": {
    "phase0a": "complete",
    "phase0b": "complete",
    "phase1": "complete",
    "phase2": "complete",
    "phase2_5": "complete",
    "phase3": "in_progress",
    "phase4": "pending",
    "phase5": "pending"
  },
  "tierProgress": {
    "tier1": "complete",
    "tier2": "in_progress",
    "tier3": "pending",
    "tier4": "pending",
    "tier5": "pending",
    "tier6": "pending"
  },
  "buildOrder": {
    "tierCount": 6,
    "tiers": [
      { "tier": 1, "label": "Leaf components", "components": ["BaseEditable", "Bot", "..."] },
      { "tier": 2, "label": "Uses tier 1", "components": ["Button", "CaseComments", "..."] },
      "..."
    ]
  },
  "figmaNodes": {
    "foundationsPageId": "0:1",
    "componentsPageId": "2:2",
    "screensPageId": "2:3",
    "foundationsFrameId": "10:1",
    "iconsFrameId": "20:0",
    "tier1FrameId": "20:1",
    "tier2FrameId": "20:2",
    "tier3FrameId": "20:3",
    "tier4FrameId": "20:4",
    "tier5FrameId": "20:5",
    "tier6FrameId": "20:6",
    "screensFrameId": "30:1"
  },
  "builtComponents": {},
  "iconDiscovery": {
    "iconCount": 21,
    "icons": ["Check", "X", "Loader2", "..."],
    "assetCount": 1,
    "assets": ["CartonLogoSvg"]
  }
}
```

**Subagents do not modify state.json.** Each writes its own output file. The orchestrator reads those files and updates state.

### Per-Agent Output Files

```
.temp/figma-from-code/
  component-map.json          # Phase 0a: site-component-map output (authoritative build order)
  component-map.md            # Phase 0a: human-readable report with Mermaid diagram
  icons.json                  # Phase 0b: icon/asset manifest (SVG strings, per-component mapping)
  precapture-forms.json       # Pre-capture agent output
  precapture-cases.json
  precapture-customers.json
  precapture-users.json
  precapture-screens.json
  build-tier1.json            # Build agent output (one per discovered tier)
  build-tier2.json
  build-tier3.json
  build-tier{N}.json
  build-screens.json
  validate-lower.json         # Validation agent output
  validate-mid.json
  validate-upper.json
```

Build agent output format:

```json
{
  "tier": "tier1a",
  "completed": [
    { "name": "Button", "nodeId": "123:45", "figmaScreenshot": ".temp/.../Button/figma.png" }
  ],
  "failed": [{ "name": "Calendar", "error": "use_figma exceeded incremental limit" }]
}
```

Pre-capture agent output format:

```json
{
  "group": "forms",
  "captured": [
    { "name": "Button", "app": ".temp/.../Button/app.png", "text": ".temp/.../Button/text.json" }
  ],
  "skipped": ["Skeleton"],
  "failed": []
}
```

Validation agent output format:

```json
{
  "scope": "primitives",
  "results": [
    { "name": "Button", "verdict": "match", "matchPct": 94.2, "iterations": 0 },
    {
      "name": "Input",
      "verdict": "match",
      "matchPct": 91.5,
      "iterations": 1,
      "fixes": ["border-radius 4px->6px"]
    },
    { "name": "Skeleton", "verdict": "no_app_reference", "matchPct": null, "iterations": 0 }
  ]
}
```

---

## Workflow Overview

```
Phase 0    Discovery                orchestrator — delegates to discovery skills
  Phase 0a   Component Discovery    figma-from-code-discovery-components
  Phase 0b   Icon & Asset Discovery figma-from-code-discovery-assets
Phase 1    Tokens (variables)       orchestrator — delegates to figma-setup-variables
Phase 2    File Structure           orchestrator — delegates to figma-setup-file-structure + inline use_figma
Phase 2.5  Pre-capture              parallel subagents — figma-from-code-precapture   model: haiku
Phase 3    Build components         parallel subagents — figma-from-code-build-tier   model: sonnet
Phase 4    Build screens            orchestrator — delegates to figma-from-code-build-screens
Phase 5    Validate + fix           orchestrator — use_figma + shell scripts directly
```

### Subagent usage

All Figma MCP tools (`use_figma`, `get_screenshot`, etc.) work in subagents. Two phases use parallel subagents:

| Phase | Subagent role | Model | What they do |
|-------|--------------|-------|-------------|
| 2.5 Pre-capture | Capture app screenshots + text | haiku | Per `figma-from-code-precapture` skill: run `screenshot.js` and `extract-text.js` in batch mode |
| 3 Build components | Full build + validate per component | sonnet | Per `figma-from-code-build-tier` skill: run the entire `figma-from-code-build-component` workflow per component |

Phase 3 dispatches one subagent per component within a tier. All components in the same tier run in parallel. **Tiers run sequentially** because each tier depends on components built in lower tiers. The orchestrator collects results between tiers, updates `builtComponents` in state.json, and checkpoints with the user.

Phase 0 (0a + 0b) delegates to discovery skills. Phases 1–2, 4, and 5 run directly in the orchestrator.

---

### Phase 0: Discovery

#### Phase 0a: Component Discovery

**Runs in:** orchestrator  
**Delegate to:** `figma-from-code-discovery-components` skill

Pass file key. The skill runs `map-components.js` against the live dev server and inspects the Figma file (read-only).

After completion, read outputs and merge into state.json:

1. Read `.temp/figma-from-code/component-map.json`
2. Save to `state.json → buildOrder`:
   ```json
   {
     "buildOrder": {
       "tierCount": 6,
       "tiers": [
         {"tier": 1, "label": "Leaf components", "components": ["BaseEditable", "Bot", ...]},
         {"tier": 2, "label": "Uses tier 1", "components": ["Button", "CaseComments", ...]},
         ...
       ]
     }
   }
   ```
3. Update state: `"phase0a": "complete"`

**Skip if:** `resume: true` and `phase0a: complete` — but verify `.temp/figma-from-code/component-map.json` exists.

#### Phase 0b: Icon & Asset Discovery

**Delegate to:** `figma-from-code-discovery-assets` skill

After completion, read output and merge into state.json:

1. Read `.temp/figma-from-code/icons.json`
2. Save to `state.json → iconDiscovery`:
   ```json
   {
     "iconDiscovery": {
       "iconCount": 21,
       "icons": ["Check", "X", "Loader2", "..."],
       "assetCount": 1,
       "assets": ["CartonLogoSvg"]
     }
   }
   ```
3. Update state: `"phase0b": "complete"`
4. **Checkpoint:** report build order summary and icon/asset counts

**Skip if:** `resume: true` and `phase0b: complete` — but verify `.temp/figma-from-code/icons.json` exists.

---

### Phase 1: Tokens

**Runs in:** orchestrator  
**Delegate to:** `figma-setup-variables` skill

Pass file key and which collections already exist. After completion, verify via `use_figma`, update state, checkpoint with variable counts.

**Skip if:** `phase1: complete` AND all three collections verified to exist.

---

### Phase 2: File Structure

**Runs in:** orchestrator  
**Delegate to:** `figma-setup-file-structure` skill

Pass file key and which pages already exist. After completion:

- Screenshot the Foundations page
- Record `foundationsFrameId` (the `Foundations` container frame ID) in `figmaNodes`
- Create the four tier frames on the Components page and record their IDs in `figmaNodes`
- Create the `Screens` container frame on the Screens page and record `screensFrameId`

**Tier frame creation (orchestrator does this after the file structure skill runs):**

Read the tier count from `state.json → buildOrder.tiers` (set during Phase 0a from the site-component-map output). Create one frame per tier — the number of tiers is dynamic, not hardcoded.

```javascript
// use_figma — create tier container frames on the Components page
await figma.setCurrentPageAsync(componentsPage);

// buildOrder.tiers comes from Phase 0a (site-component-map output)
const tiers = buildOrder.tiers; // [{tier: 1, label: "Leaf components", components: [...]}, ...]

// Icons container frame — holds all icon components (created in Phase 3 preamble)
const iconsFrame = figma.createFrame();
iconsFrame.name = 'Icons';
iconsFrame.layoutMode = 'HORIZONTAL';
iconsFrame.primaryAxisSizingMode = 'AUTO';
iconsFrame.counterAxisSizingMode = 'AUTO';
iconsFrame.layoutWrap = 'WRAP';
iconsFrame.itemSpacing = 24;
iconsFrame.counterAxisSpacing = 24;
iconsFrame.paddingTop = 24;
iconsFrame.paddingBottom = 24;
iconsFrame.paddingLeft = 24;
iconsFrame.paddingRight = 24;
iconsFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
iconsFrame.x = 0;
iconsFrame.y = 0;
componentsPage.appendChild(iconsFrame);

let yPos = 200; // start below the Icons frame
const frameIds = { icons: iconsFrame.id };
for (const { tier, label } of tiers) {
  const name = `Tier ${tier} — ${label}`;
  const f = figma.createFrame();
  f.name = name;
  f.layoutMode = 'HORIZONTAL';
  f.primaryAxisSizingMode = 'AUTO';
  f.counterAxisSizingMode = 'AUTO';
  f.itemSpacing = 80;
  f.paddingTop = 48;
  f.paddingBottom = 48;
  f.paddingLeft = 48;
  f.paddingRight = 48;
  f.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  f.x = 0;
  f.y = yPos;
  componentsPage.appendChild(f);
  frameIds[`tier${tier}`] = f.id;
  yPos += 200;
}

// Screens container frame on the Screens page
await figma.setCurrentPageAsync(screensPage);
const screensFrame = figma.createFrame();
screensFrame.name = 'Screens';
screensFrame.layoutMode = 'HORIZONTAL';
screensFrame.primaryAxisSizingMode = 'AUTO';
screensFrame.counterAxisSizingMode = 'AUTO';
screensFrame.itemSpacing = 80;
screensFrame.paddingTop = 80;
screensFrame.paddingBottom = 80;
screensFrame.paddingLeft = 80;
screensFrame.paddingRight = 80;
screensFrame.fills = [{ type: 'SOLID', color: { r: 0.973, g: 0.973, b: 0.98 } }];
screensFrame.x = 0;
screensFrame.y = 0;
screensPage.appendChild(screensFrame);

return { iconsFrameId: frameIds.icons, tierFrameIds: frameIds, screensFrameId: screensFrame.id };
```

Save all returned IDs to `figmaNodes` in state.json (as `iconsFrameId`, `tier1FrameId`, `tier2FrameId`, ..., `tier{N}FrameId`) before proceeding to Phase 2.5.

**Skip if:** `phase2: complete` AND all pages and tier frames verified to exist.

---

### Phase 2.5: Pre-capture Reference Material

**Runs in:** parallel haiku subagents (background)  
**Delegate to:** `figma-from-code-precapture` skill (contains agent groups, manifest formats, prompt template)

Captures all app screenshots and text.json files before any Figma building begins.

**Orchestrator responsibilities before dispatching:**

1. Verify dev server is running:
   ```bash
   curl -s --max-time 3 http://localhost:5173 > /dev/null && echo "running" || echo "not_running"
   ```
2. Start shared Playwright server:
   ```bash
   node .claude/skills/figma-from-code-validator/browser-server.js &
   ```
3. Build manifest files per agent group (read the Component App Map in `figma-from-code-validator` skill)
4. Write manifests to `.temp/figma-from-code/manifests/{group}-screenshots.json` and `{group}-text.json`
5. Dispatch 5 haiku subagents in parallel using the prompt template from the precapture skill

**After all subagents complete:**

- Read each `precapture-{group}.json`
- Verify expected files exist on disk
- Log any failures
- Update state: `"phase2_5": "complete"`
- **Checkpoint:** report capture counts (e.g., "42 app screenshots, 38 text.json files, 17 skipped (no app selector)")

---

### Phase 3: Build Components

**Runs in:** orchestrator + parallel sonnet subagents (tier by tier)  
**Delegate to:** `figma-from-code-build-tier` skill (contains preamble, library component handling, subagent prompt template, result format)

The skill handles the icon/asset preamble, then processes tiers sequentially. Within each tier, one sonnet subagent per component runs in parallel via the `figma-from-code-build-component` workflow.

**Orchestrator responsibilities:**

1. **Preamble** — build icon/asset components per the skill's preamble section. Merge IDs into `builtComponents` in state.json.
2. **Per tier** — for each tier in `state.json → buildOrder.tiers`:
   - Filter out library components (icons already in `builtComponents`)
   - Construct subagent prompts using the template from the skill
   - Dispatch all subagents for the tier in a single message (`model: "sonnet"`)
3. **Between tiers** — after all subagents complete:
   - Read `.temp/figma-from-code/build-results/{ComponentName}.json` per component
   - Write `build-tier{N}.json` with completed/failed/match lists
   - Merge new node IDs into `builtComponents` in state.json
   - Spot-check: `get_screenshot(fileKey, tierFrameId)` — verify varied heights
   - Update `tierProgress.tier{N}` and `phase3` status
   - Report match counts
   - **Checkpoint with user** — do not auto-proceed across tier boundaries

---

### Phase 4: Build Screens

**Runs in:** orchestrator  
**Delegate to:** `figma-from-code-build-screens` skill (contains screen definitions, layout code, output format)

Builds 1440x900 screen frames by composing built component instances. Uses pre-captured full-page screenshots as visual reference.

**Orchestrator responsibilities:**

1. Read screen definitions and build each via `use_figma` per the skill's workflow
2. After all screens: write `build-screens.json`, update state `"phase4": "complete"`
3. **Checkpoint:** present side-by-side app vs Figma screenshots

---

### Phase 5: Validate + Fix

**Runs in:** orchestrator (inline `use_figma` + shell scripts)  
**Goal:** Compare every built component against its app screenshot, fix defects, iterate.

The standalone `figma-from-code-validator` skill remains available for ad-hoc use.

**Note:** When Phase 3 uses the `figma-from-code-build-component` skill, each component already goes through a 3-iteration fix loop during build. Phase 5 serves as a **second pass** for any components that still have mismatches after the initial build, or for components that were built without an app screenshot reference during Phase 3.

Process tiers in groups (lower / mid / upper) sequentially in the orchestrator. For each component that was not already validated as `match` during Phase 3:

1. If `COMPONENT_SET`: resolve the specific variant that matches the app rendering (see Phase 1e in validator skill)
2. Follow Steps 3–5 of the `figma-from-code-build-component` skill (screenshot → compare → fix loop) for the existing Figma node. The skill's fix loop (up to 3 iterations) applies here too.
3. If no `app.png`: record `"no_app_reference"`, skip.

Write results to `.temp/figma-from-code/validate-{scope}.json` after each group.

#### After all validation groups complete

1. Read all `validate-{scope}.json` files
2. Compile aggregate report to `.temp/figma-validation/report.md`:

```markdown
# Figma Rebuild Validation Report

File: {fileKey} | Generated: {timestamp}

## Summary

| Metric                  | Value                                   |
| ----------------------- | --------------------------------------- |
| Components compared     | {N}                                     |
| Match (>=90%)           | {n}                                     |
| Minor diff (75-90%)     | {n}                                     |
| Mismatch (<75%)         | {n}                                     |
| No app reference        | {n}                                     |
| Fixed during validation | {n}                                     |
| Average match %         | {avg}%                                  |
| **Overall verdict**     | {PASS if >=80% of compared are "match"} |
```

3. Update state: `"phase5": "complete"`
4. **Stop the shared Playwright server:**
   ```bash
   kill $(cat .temp/figma-from-code/pw-server.pid 2>/dev/null) 2>/dev/null; rm -f .temp/figma-from-code/pw-endpoint.txt
   ```
5. **Clean up Components page layout:** Subagents sometimes create their own frames instead of using the designated tier frames, or place components on the wrong page. Run a cleanup pass via `use_figma`:

   ```javascript
   // Step 1: Move any misplaced components into their correct tier frames
   const componentsPage = figma.root.children.find(p => p.name.includes('Components'));
   await figma.setCurrentPageAsync(componentsPage);

   // Known tier frame IDs from state.json → figmaNodes
   const tierFrameIds = new Set([iconsFrameId, tier1FrameId, tier2FrameId, /* ...all tier frames... */]);

   // Find stray frames (children of the page that aren't designated tier frames)
   const strayFrames = componentsPage.children.filter(c => !tierFrameIds.has(c.id));

   // For each stray frame, move its children to the correct tier frame based on
   // which tier the component belongs to (look up in state.json → buildOrder.tiers)
   // Then delete the empty stray frame

   // Also check other pages (Foundations, Screens) for components that belong on
   // the Components page — move them to the correct tier frame

   // Step 2: Re-stack all tier frames vertically with 80px gaps
   const frameOrder = [iconsFrameId, tier1FrameId, tier2FrameId, /* ... */];
   let yPos = 0;
   const gap = 80;
   for (const id of frameOrder) {
     const frame = figma.getNodeById(id);
     frame.x = 0;
     frame.y = yPos;
     yPos += Math.round(frame.height) + gap;
   }
   ```

   This ensures the Components page has a clean vertical stack of tier frames with no overlapping, regardless of where subagents placed their components during Phase 3.

6. **Final checkpoint:** present summary table and overall verdict

---

## Checkpoint Protocol

At the end of each phase, stop and report:

- What was created or validated (counts, key metrics)
- What comes next

Wait for user confirmation before starting the next phase. Do not auto-proceed across phase boundaries.

Example:

```
Phase 2.5 complete - 42 app screenshots, 38 text.json files captured
  5 pre-capture agents ran in parallel
  17 components skipped (no app selector)
  0 failures

Ready for Phase 3 (build Tier 1a - 21 primitives). Proceed?
```

---

## Resuming After Interruption

1. Read `.temp/figma-from-code/state.json`
2. Check for per-agent output files (`build-{tier}.json`, `precapture-{group}.json`, `validate-{scope}.json`)
3. Report progress: which phases and tiers are complete, which are partial
4. Ask user to confirm resume point
5. Skip completed phases and tiers
6. For partially completed tiers: read the build file, dispatch a new agent for only the components not in `completed`
7. If a build file exists but state.json doesn't reflect it, trust the build file (agent completed but orchestrator didn't update state)

---

## Error Handling

| Scenario                                      | Action                                                                                                        |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Dev server not running                        | Halt before Phase 2.5, tell user to run `npm run dev`                                                         |
| Pre-capture agent fails entirely              | Report, offer retry; missing screenshots are non-fatal — build uses source code alone                         |
| Pre-capture partial failures                  | Log in output file, continue — icons and library components won't have app references anyway                  |
| `use_figma` fails in orchestrator             | Diagnose error, fix script, retry once; if it fails again mark component as failed and continue               |
| `use_figma` incremental limit                 | Split component builds across multiple `use_figma` calls within the same tier                                 |
| Components all same thin height in screenshot | `fixSizing()` was not run after building — run it on the tier frame immediately, then re-screenshot to verify |
| Text node padding error                       | Wrap text in an auto-layout frame (see Phase 3 gotchas section)                                               |
| Library component has no source file          | Check import site; build icon placeholder or nav link variant per the library component table                 |
| Validation shell script fails                 | Report, offer manual validation via standalone `figma-from-code-validator` skill                              |
| State inconsistency                           | Trust per-tier build JSON files over state.json; rebuild state from outputs                                   |

Never skip a failed component silently. Every failure must surface at the next checkpoint.
