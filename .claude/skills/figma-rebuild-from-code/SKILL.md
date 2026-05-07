---
name: figma-rebuild-from-code
description: Orchestrates the full code-to-Figma rebuild workflow for Carton using subagents for isolated context. Runs six phases (discovery, tokens, file structure, pre-capture, component builds, screens + validate), dispatching per-tier build agents so each gets a fresh context window.
---

# Skill: Rebuild Figma from Code (Orchestrator)

Conducts the full code-to-Figma pipeline for Carton. The orchestrator handles discovery, tokens, and file structure directly, then dispatches **subagents** for component builds and validation. Each build agent gets a fresh context containing only its tier's components and pre-captured reference material, preventing context drift across 55+ component builds.

The orchestrator never calls `use_figma` for component or screen work — it delegates, collects results, and gates transitions between phases.

## When to Use

- Starting a fresh Figma rebuild from the Carton codebase
- Resuming a partially completed build after a session break
- After significant code changes that require the Figma file to be re-synced

## Required Inputs

- `fileKey`: The Figma file key (e.g. `o3eOcCYZWvOpie7ZYRonPO`)
- `resume` (optional): `true` to resume from last completed phase

## Page Frame Convention

Every Figma page uses a **single top-level container frame** that holds all content for that page. Content is never placed directly on the canvas.

| Page | Container frame name | Contents |
|------|---------------------|---------|
| 🎨 Foundations | `Foundations` | Color Palette, Semantic Colors, Spacing Scale (stacked vertically, 80px gaps) |
| 📦 Components | one frame per tier | `Tier 1a — Primitives`, `Tier 1b — Composites`, `Tier 2 — Common`, `Tier 3 — Features` |
| 📄 Screens | `Screens` | all 6 screen frames (in a 2-column grid) |

Build agents receive the **tier frame node ID** to append components into, not the raw page ID.

---

## State Ledger

Write to `.temp/figma-from-code/state.json` after every phase and tier transition:

```json
{
  "fileKey": "o3eOcCYZWvOpie7ZYRonPO",
  "startedAt": "2026-05-06T00:00:00Z",
  "phases": {
    "phase0": "complete",
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
      {"tier": 1, "label": "Leaf components", "components": ["BaseEditable", "Bot", "..."]},
      {"tier": 2, "label": "Uses tier 1", "components": ["Button", "CaseComments", "..."]},
      "..."
    ]
  },
  "figmaNodes": {
    "foundationsPageId": "0:1",
    "componentsPageId": "2:2",
    "screensPageId": "2:3",
    "foundationsFrameId": "10:1",
    "tier1FrameId": "20:1",
    "tier2FrameId": "20:2",
    "tier3FrameId": "20:3",
    "tier4FrameId": "20:4",
    "tier5FrameId": "20:5",
    "tier6FrameId": "20:6",
    "screensFrameId": "30:1"
  },
  "builtComponents": {}
}
```

**Subagents do not modify state.json.** Each writes its own output file. The orchestrator reads those files and updates state.

### Per-Agent Output Files

```
.temp/figma-from-code/
  component-map.json          # Phase 0: site-component-map output (authoritative build order)
  component-map.md            # Phase 0: human-readable report with Mermaid diagram
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
    {"name": "Button", "nodeId": "123:45", "figmaScreenshot": ".temp/.../Button/figma.png"}
  ],
  "failed": [
    {"name": "Calendar", "error": "use_figma exceeded incremental limit"}
  ]
}
```

Pre-capture agent output format:
```json
{
  "group": "forms",
  "captured": [
    {"name": "Button", "app": ".temp/.../Button/app.png", "text": ".temp/.../Button/text.json"}
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
    {"name": "Button", "verdict": "match", "matchPct": 94.2, "iterations": 0},
    {"name": "Input", "verdict": "match", "matchPct": 91.5, "iterations": 1, "fixes": ["border-radius 4px->6px"]},
    {"name": "Skeleton", "verdict": "no_app_reference", "matchPct": null, "iterations": 0}
  ]
}
```

---

## Workflow Overview

```
Phase 0    Discovery                orchestrator (lightweight)
Phase 1    Tokens (variables)       orchestrator
Phase 2    File Structure           orchestrator
Phase 2.5  Pre-capture              parallel subagents (by URL group)   model: haiku
Phase 3    Build components         sequential subagents (by tier)       model: sonnet
Phase 4    Build screens            subagent                             model: sonnet
Phase 5    Validate + fix           parallel subagents (by tier)         model: sonnet
```

### Model assignments

| Agent type | Model | Reason |
|------------|-------|--------|
| Pre-capture (Phase 2.5) | `haiku` | Shell commands only — no reasoning needed, runs 5 agents in parallel |
| Build — all tiers (Phase 3) | `sonnet` | Reads source, writes Figma — quality matters |
| Screens (Phase 4) | `sonnet` | Layout-heavy assembly from app screenshots |
| Validation (Phase 5) | `sonnet` | Pixel diff analysis + Figma fixes require judgment |

Pass `model: "haiku"` or `model: "sonnet"` in the Agent tool call when dispatching each subagent.

---

### Phase 0: Discovery

**Runs in:** orchestrator

1. **Run the `site-component-map` skill** against the live dev server to discover the actual runtime component hierarchy and build order:
   ```bash
   # Verify dev server is running first
   curl -s --max-time 3 http://localhost:5173 > /dev/null || echo "Dev server not running"

   # Scan all routes, generate both JSON and markdown
   node .claude/skills/figma-rebuild-from-code-validator/map-components.js \
     "http://localhost:5173" --crawl --max-crawl 30 \
     --markdown .temp/figma-from-code/component-map.md \
     --output .temp/figma-from-code/component-map.json
   ```
   This produces the **authoritative build order** — a topologically-sorted list of tiers where leaves come first and layouts come last. All subsequent phases use this output, not the static `figma-component-dependency-map`.

2. Read `.temp/figma-from-code/component-map.json` and extract:
   - `tiers[]` — the tiered build order (number of tiers varies per project)
   - `tree` — the merged component hierarchy
   - `componentCount` — total components to build
   - Save the tier count and component names to state.json under `buildOrder`

3. Run a read-only `use_figma` to inspect the Figma file:
   - List all pages (names + IDs)
   - Check if variable collections already exist (`Palette`, `Semantic`, `Spacing`)
   - Check if any components already exist on the Components page

4. Report what exists vs what needs to be created, including the discovered build order
5. Write initial state to `.temp/figma-from-code/state.json` with the `buildOrder` field:
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

**Skip if:** `resume: true` and `phase0: complete` — but verify `.temp/figma-from-code/component-map.json` exists.

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

Read the tier count from `state.json → buildOrder.tiers` (set during Phase 0 from the site-component-map output). Create one frame per tier — the number of tiers is dynamic, not hardcoded.

```javascript
// use_figma — create tier container frames on the Components page
await figma.setCurrentPageAsync(componentsPage);

// buildOrder.tiers comes from Phase 0 (site-component-map output)
const tiers = buildOrder.tiers; // [{tier: 1, label: "Leaf components", components: [...]}, ...]

let yPos = 0;
const frameIds = {};
for (const { tier, label } of tiers) {
  const name = `Tier ${tier} — ${label}`;
  const f = figma.createFrame();
  f.name = name;
  f.layoutMode = 'HORIZONTAL';
  f.primaryAxisSizingMode = 'AUTO';
  f.counterAxisSizingMode = 'AUTO';
  f.itemSpacing = 80;
  f.paddingTop = 48; f.paddingBottom = 48;
  f.paddingLeft = 48; f.paddingRight = 48;
  f.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  f.x = 0; f.y = yPos;
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
screensFrame.paddingTop = 80; screensFrame.paddingBottom = 80;
screensFrame.paddingLeft = 80; screensFrame.paddingRight = 80;
screensFrame.fills = [{ type: 'SOLID', color: { r: 0.973, g: 0.973, b: 0.980 } }];
screensFrame.x = 0; screensFrame.y = 0;
screensPage.appendChild(screensFrame);

return { tierFrameIds: frameIds, screensFrameId: screensFrame.id };
```

Save all returned IDs to `figmaNodes` in state.json (as `tier1FrameId`, `tier2FrameId`, ..., `tier{N}FrameId`) before proceeding to Phase 2.5.

**Skip if:** `phase2: complete` AND all pages and tier frames verified to exist.

---

### Phase 2.5: Pre-capture Reference Material

**Runs in:** parallel subagents (background)  
**Goal:** Capture all app screenshots and text.json files before any Figma building begins.

Decoupling capture from building means build agents never launch Chromium. Grouping by URL (not tier) minimizes page navigations within each agent.

**Prerequisite check** (orchestrator, before dispatching agents):
```bash
curl -s --max-time 3 http://localhost:5173 > /dev/null && echo "running" || echo "not_running"
```
If not running, halt and tell the user to run `npm run dev`.

**Start shared Playwright server** (orchestrator, before dispatching agents):
```bash
node .claude/skills/figma-rebuild-from-code-validator/browser-server.js &
```
This launches a single Chromium process that all screenshot/extract-text/compare scripts connect to via WebSocket. The endpoint is written to `.temp/figma-from-code/pw-endpoint.txt` and auto-detected by every script. If the server is running, scripts connect to it (fast — new tab only). If not, they fall back to launching their own browser (backward compatible). The orchestrator kills the server after Phase 5 completes.

#### Agent groups

| Agent | URL(s) | Components |
|-------|--------|------------|
| `precapture-forms` | `/cases/new` | Button (primary + secondary), Input, Textarea, Label, Select |
| `precapture-cases` | `/cases/` | Header, MenuList, CaseList, CaseDetails, CaseInformation, CaseEssentialDetails, CaseComments, EditableTitle, EditableSelect, EditableTextarea, EditControls, MoreOptionsMenu, ConfirmationDialog, FiltersTrigger, FiltersDialog, FiltersList, MultiSelect, VoteButton, ReactionStatistics, VoterTooltip, RelationshipManagerDialog, RelationshipManagerList, CheckboxGroup |
| `precapture-customers` | `/customers/` | CustomerList, CustomerDetails, CustomerInformation, RelationshipManagerAccordion, RelatedCasesAccordion, EditableText |
| `precapture-users` | `/users/` | UserList, UserDetails, UserInformation |
| `precapture-screens` | all 6 routes | Full-page screenshots at 1440x900 for Phase 4 |

**Components with no app selector** (skip pre-capture entirely): Skeleton, Alert, HoverCard, Tooltip, Calendar, Checkbox, Badge, Card, Dialog, Sheet, AlertDialog, Popover, RichCheckboxGroup, BaseEditable, EditableDate, EditableCurrency, EditableNumber, EditablePercent.

#### Pre-capture agent prompt template

**Model: `haiku`** — dispatch all 5 pre-capture agents with `model: "haiku"`.

The orchestrator constructs a manifest of components for each agent. The manifest is a JSON array where each entry has: `name`, `url`, `selector`, `click` (optional), `hover` (optional), `nth` (optional).

Build the manifest by reading the **Component App Map** in the `figma-rebuild-from-code-validator` skill.

**Batch mode (preferred):** Both screenshot.js and extract-text.js support `--batch manifest.json` mode, which processes all entries in a single browser session. This is significantly faster than invoking the script once per component because it eliminates repeated browser launches and Node.js startups.

The orchestrator should write two manifest files per agent group before dispatching:
- `.temp/figma-from-code/manifests/{group}-screenshots.json` — screenshot entries
- `.temp/figma-from-code/manifests/{group}-text.json` — text extraction entries

```
Capture app screenshots and text content for UI components from a running dev server.

Scripts (already exist, do not modify):
  Screenshot: node .claude/skills/figma-rebuild-from-code-validator/screenshot.js
  Text:       node .claude/skills/figma-rebuild-from-code-validator/extract-text.js

Both scripts support batch mode for faster execution (one browser, many captures):

1. Capture all screenshots in one batch:
   node .claude/skills/figma-rebuild-from-code-validator/screenshot.js \
     --batch .temp/figma-from-code/manifests/{group}-screenshots.json

2. Extract all text content in one batch:
   node .claude/skills/figma-rebuild-from-code-validator/extract-text.js \
     --batch .temp/figma-from-code/manifests/{group}-text.json

Screenshot manifest entry format:
{"url": "http://localhost:5173{url}", "output": ".temp/figma-from-code/screenshots/{name}/app.png", "selector": "{selector}", "click": "{click}", "hover": "{hover}", "nth": {nth}}

Text manifest entry format:
{"url": "http://localhost:5173{url}", "output": ".temp/figma-from-code/screenshots/{name}/text.json", "selector": "{selector}", "click": "{click}", "nth": {nth}}

After both batches complete, write results to:
.temp/figma-from-code/precapture-{group}.json

Use this format:
{"group": "{group}", "captured": [{"name": "...", "app": "...", "text": "..."}], "skipped": [...], "failed": [{"name": "...", "error": "..."}]}
```

For the `precapture-screens` agent, use batch mode with full-page entries (no `selector`):
```json
[
  {"url": "http://localhost:5173/cases/", "output": ".temp/figma-from-code/screenshots/screens/CasesPage/app.png"},
  {"url": "http://localhost:5173/customers/", "output": ".temp/figma-from-code/screenshots/screens/CustomersPage/app.png"}
]
```

#### After all pre-capture agents complete

- Read each `precapture-{group}.json`
- Verify expected files exist on disk
- Log any failures
- Update state: `"phase2_5": "complete"`
- **Checkpoint:** report capture counts (e.g., "42 app screenshots, 38 text.json files, 17 skipped (no app selector)")

---

### Phase 3: Build Components

**Runs in:** sequential subagents (one per tier, foreground)  
**Goal:** Build all Figma components using pre-captured reference material, reusing lower-tier components as instances.

Tiers run sequentially because each tier depends on the components built in all lower tiers. Within a tier, components are independent, but Figma write concurrency on the same file is risky, so one agent per tier.

#### Tier definitions (dynamic)

Tiers come from the `site-component-map` output stored at `.temp/figma-from-code/component-map.json` during Phase 0. The number and contents of tiers vary per project. Read `state.json → buildOrder.tiers` for the current build order.

Each tier entry from the component map includes:
- `components[]` — names of components in this tier
- `children` — for each component, which lower-tier components it uses

The orchestrator reads the component map's `tiers` array and processes them sequentially from tier 1 (leaves) to tier N (layouts).

#### Build agent prompt template

**Model: `sonnet`** — dispatch all tier build agents with `model: "sonnet"`.

Before dispatching, the orchestrator:
1. Resolves the source file path for each component:
   ```bash
   find packages/client/src/components -name "{ComponentName}.tsx" | grep -v ".test.\|.stories."
   ```
2. Collects the `builtComponents` map from state.json — these are components built in previous tiers, keyed by name with their Figma node IDs.
3. For each component in the current tier, looks up its `children` from the component map to determine which lower-tier components it should reference as instances.

```
Build Figma components inside a tier container frame on the Components page of a Figma file.

File key: {fileKey}
Tier: {tierNumber} of {totalTiers}
Tier frame node ID: {tierFrameId}   ← append all components INSIDE this frame

BEFORE any use_figma call, you MUST:
1. Load the figma:figma-use skill (invoke Skill tool with skill="figma:figma-use")
2. Load the figma:figma-generate-library skill for component-building patterns

Components to build (process in order):
{JSON array: [{name, sourcePath, children, hasAppScreenshot, hasTextJson}]}

AVAILABLE LOWER-TIER COMPONENTS (already built in Figma — use as instances):
{JSON object: {"Button": "123:45", "Input": "123:46", "Link": "123:47", ...}}

These are Figma component node IDs from tiers 1 through {tierNumber - 1}.

COMPONENT REUSE RULE — THIS IS CRITICAL:
When building a component that contains a child listed in AVAILABLE LOWER-TIER COMPONENTS,
you MUST create an instance of that existing component rather than rebuilding it from scratch.

  // CORRECT — reuse the lower-tier Button component
  const buttonComponent = figma.getNodeById('{nodeId}');
  const buttonInstance = buttonComponent.createInstance();
  parentFrame.appendChild(buttonInstance);

  // WRONG — never rebuild a component that already exists in a lower tier
  const button = figma.createFrame();
  button.name = 'Button';
  // ... manually recreating the button ...

For COMPONENT_SET nodes (components with variants), create the instance from the set:
  const componentSet = figma.getNodeById('{nodeId}');
  const instance = componentSet.defaultVariant.createInstance();

Check each component's `children` array to know which lower-tier components it uses.
If a child is NOT in the available components map (e.g., it failed to build), fall back
to building it inline.

PLACEMENT RULE: Every component set / single component must be appended as a child
of the tier frame (not the page). The tier frame uses horizontal auto-layout, so
components stack left-to-right automatically — do NOT set manual x/y.

  // Correct pattern
  const tierFrame = figma.getNodeById('{tierFrameId}');
  tierFrame.appendChild(componentSet);

For each component:
1. Read the source at {sourcePath} to understand props, variants, and visual structure
2. Check for pre-captured reference:
   - .temp/figma-from-code/screenshots/{name}/app.png  (visual reference)
   - .temp/figma-from-code/screenshots/{name}/text.json (real text to use)
3. Identify which children are available as lower-tier instances (from the map above)
4. Build the component in Figma using use_figma:
   - Use component instances for all available children
   - Use source code AND app.png as reference for layout and styling
5. After building, capture Figma screenshot:
   get_screenshot(fileKey, nodeId) -> save to .temp/figma-from-code/screenshots/{name}/figma.png

CRITICAL text rules:
- If text.json exists, use its EXACT strings for all text nodes
- Never use generic placeholders like "Button", "Label", "Placeholder text"
- For variants: use primary app text for default variant, contextual labels for others
- For composite/layout components: use all text lines from text.json

If a use_figma call fails:
- Diagnose the error
- Fix the script
- Retry once
- If it fails again, mark as failed and continue to the next component
- For complex components exceeding use_figma limits, split across multiple calls

After all components, write results to:
.temp/figma-from-code/build-tier{tierNumber}.json
```

#### Orchestrator behavior between tiers

After each tier agent completes:

1. Read `build-tier{N}.json`
2. **Update `builtComponents` in state.json** — merge the newly built component node IDs:
   ```json
   {
     "builtComponents": {
       "Button": "123:45",
       "Input": "123:46",
       "BaseEditable": "200:10",
       "...": "..."
     }
   }
   ```
   This map is passed to the next tier's agent so it knows which components are available as instances.
3. Spot-check: `get_screenshot(fileKey, tierFrameId)` — verify the tier frame is non-empty in Figma
4. Validate state consistency: every component must be in either `completed` or `failed`
5. Update state: `tierProgress.tier{N}` and `phase3` status
6. If failures exist: ask user whether to retry (dispatch new agent for only failed components) or continue
7. **Checkpoint:** "Tier {N}: {X} built, {Y} failed. Built components available for next tier: {list}. Proceed to tier {N+1}?"

When dispatching each tier agent, pass the correct `tierFrameId` from state.json:
- Tier N → `figmaNodes.tier{N}FrameId`

**Do not auto-proceed across tier boundaries.**

#### Splitting large tiers

If a tier has more than ~15 components, or if quality degrades on later components (visible in screenshots), split it into batches. Each batch gets the same `builtComponents` map. After batch 1 completes, merge its results into `builtComponents` before dispatching batch 2 (in case batch 2 components depend on batch 1 within the same tier).

Use this split on retry if the first attempt had late-tier failures.

---

### Phase 4: Build Screens

**Runs in:** subagent (foreground) — **model: `sonnet`**

| Screen | Route | Key Components |
|--------|-------|----------------|
| Cases Page | `/cases/:id` | Header + MenuList + CaseList + CaseDetails |
| Customers Page | `/customers/:id` | Header + MenuList + CustomerList + CustomerDetails |
| Users Page | `/users/:id` | Header + MenuList + UserList + UserDetails |
| Create Case Page | `/cases/new` | Header + MenuList + form |
| Create Customer Page | `/customers/new` | Header + MenuList + form |
| Create User Page | `/users/new` | Header + MenuList + form |

#### Screen agent prompt template

```
Build full-page screens inside a container frame on the Screens page of a Figma file.

File key: {fileKey}
Screens container frame node ID: {screensFrameId}   ← append all screen frames INSIDE this

BEFORE any use_figma call, you MUST:
1. Load the figma:figma-use skill
2. Load the figma:figma-generate-design skill for screen-building guidance

Pre-captured screenshots are at:
.temp/figma-from-code/screenshots/screens/{ScreenName}/app.png

Screens to build (1440x900 each):
{JSON array: [{name, route, components, appScreenshot}]}

PLACEMENT RULE: The Screens container frame uses HORIZONTAL auto-layout with
wrapping. Append each screen frame as a child of screensFrame — do NOT set x/y.

  // Correct pattern
  const screensFrame = figma.getNodeById('{screensFrameId}');
  screensFrame.layoutWrap = 'WRAP';
  screensFrame.counterAxisSpacing = 80;
  screensFrame.appendChild(screenFrame);

For each screen:
1. Read the page source at packages/client/src/pages/{PageFile}.tsx
2. Use app.png as visual reference
3. Build the screen frame (1440x900) in Figma and append it into screensFrame
4. Capture Figma screenshot: get_screenshot(fileKey, screenFrameId) -> save to
   .temp/figma-from-code/screenshots/screens/{ScreenName}/figma.png

Write results to .temp/figma-from-code/build-screens.json
```

After completion:
- Update state: `"phase4": "complete"`
- **Checkpoint:** side-by-side app vs Figma for each screen

---

### Phase 5: Validate + Fix

**Runs in:** parallel subagents (background) — **model: `sonnet`**  
**Goal:** Compare every built component against its app screenshot, fix defects, iterate.

This phase merges the validation loop into the main pipeline. The standalone `figma-rebuild-from-code-validator` skill remains available for ad-hoc use.

#### Validation agent groups

Split the discovered tiers into 3 validation groups (roughly equal size). The exact split depends on how many tiers the component map produced:

| Agent | Scope | Example (6 tiers) |
|-------|-------|--------------------|
| `validate-lower` | Bottom third of tiers | Tiers 1-2 (leaf + first composites) |
| `validate-mid` | Middle third of tiers | Tiers 3-4 (mid-level composites) |
| `validate-upper` | Top third + screens | Tiers 5-6 + screen builds |

All three run in **parallel** since they target different Figma nodes.

For a small tier count (e.g. 3 tiers), use one validator per tier instead of grouping.

#### Validation agent prompt template

```
Validate Figma components against app screenshots. Fix defects found, up to 3 iterations per component.

File key: {fileKey}

BEFORE any use_figma or get_screenshot call, you MUST load the figma:figma-use skill.

Read the figma-rebuild-from-code-validator skill for:
- Phase 1e variant resolution logic (resolve to the specific child variant, not the component set)
- Phase 2c structural QA script (check for inside strokes, multiple fills)
- Component App Map (figmaVariant column for variant matching)

Components to validate:
{JSON array from build-{tier}.json completed entries: [{name, nodeId}]}

For each component:
1. If the component is a COMPONENT_SET, resolve the specific variant node matching
   what the app renders (see Phase 1e in validator skill)
2. Run structural QA on the node — fix inside strokes, multiple fills before screenshotting
3. If .temp/figma-from-code/screenshots/{name}/app.png exists:
   a. Get Figma screenshot of the resolved variant: get_screenshot(fileKey, variantNodeId)
      Save to .temp/figma-from-code/screenshots/{name}/figma.png
   b. Run pixel diff:
      node .claude/skills/figma-rebuild-from-code-validator/compare.js \
        ".temp/figma-from-code/screenshots/{name}/app.png" \
        ".temp/figma-from-code/screenshots/{name}/figma.png" \
        ".temp/figma-from-code/screenshots/{name}/"
   c. If verdict is "mismatch" or "minor_diff":
      - Inspect diff.png to identify the specific visual difference
      - Fix in Figma using use_figma
      - Re-screenshot and re-compare
      - Up to 3 fix attempts per component
4. If no app.png exists: record as "no_app_reference", skip comparison

Write results to .temp/figma-from-code/validate-{scope}.json
```

#### After all validation agents complete

1. Read all `validate-{scope}.json` files
2. Compile aggregate report to `.temp/figma-validation/report.md`:

```markdown
# Figma Rebuild Validation Report
File: {fileKey} | Generated: {timestamp}

## Summary
| Metric | Value |
|--------|-------|
| Components compared | {N} |
| Match (>=90%) | {n} |
| Minor diff (75-90%) | {n} |
| Mismatch (<75%) | {n} |
| No app reference | {n} |
| Fixed during validation | {n} |
| Average match % | {avg}% |
| **Overall verdict** | {PASS if >=80% of compared are "match"} |
```

3. Update state: `"phase5": "complete"`
4. **Stop the shared Playwright server:**
   ```bash
   kill $(cat .temp/figma-from-code/pw-server.pid 2>/dev/null) 2>/dev/null; rm -f .temp/figma-from-code/pw-endpoint.txt
   ```
5. **Final checkpoint:** present summary table and overall verdict

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

| Scenario | Action |
|----------|--------|
| Dev server not running | Halt before Phase 2.5, tell user to run `npm run dev` |
| Pre-capture agent fails entirely | Report, offer retry; build agents handle missing screenshots gracefully |
| Pre-capture partial failures | Log in output file, continue — some components simply won't have app reference |
| Build agent fails entirely | Report to user, offer retry for the whole tier |
| Build agent partial failures | List failed components at checkpoint, offer targeted retry or skip |
| Validation agent fails | Report, offer manual validation via standalone validator skill |
| `use_figma` rate limit / incremental limit | Agent should split complex components across multiple calls |
| State inconsistency | Trust per-agent output files over state.json; rebuild state from outputs |

Never skip a failed component silently. Every failure must surface at the next checkpoint.
