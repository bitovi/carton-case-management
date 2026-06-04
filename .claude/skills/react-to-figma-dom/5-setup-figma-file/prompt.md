# Setup Figma File

Create the Figma file structure, variable collections, and icon/asset components from the locally-extracted Phase 2 and Phase 3 outputs. This is the first phase that requires a Figma MCP connection.

## MUST READ BEFORE PROCEEDING

Read these reference files before writing any `use_figma` code:

1. **`reference/figma-use-rules.md`** — Critical sandbox rules. The `use_figma` sandbox has **NO filesystem access** — `require('fs')` throws `ReferenceError`. All data must be inlined as JSON literals. `return` is the only output channel (not `console.log`).
2. **`reference/figma-gotchas.md`** — Common mistakes that cause silent bugs.
3. **`reference/token-creation.md`** — Patterns for creating variable collections, variables, aliases, and scopes.
4. **`reference/api-reference.md`** — Full Plugin API surface reference.

## FAIL-FAST RULE

Your FIRST action must be a `use_figma` call — a simple probe (`return { ok: true }`) to confirm MCP connectivity. If the call fails or `use_figma` is unavailable, **STOP immediately**. Do NOT write any output files. Return ONLY:

```
ERROR: use_figma unavailable — {error details}
```

## DO NOT — CRITICAL

These rules are non-negotiable. Violating ANY of them produces broken output that silently poisons every downstream phase.

- Do NOT use `require('fs')`, `require('path')`, or any Node.js APIs inside `use_figma` calls. The Figma plugin sandbox has NO filesystem access.
- Do NOT hand-serialize large data sets (tokens, icons) into `use_figma` code. Use the pre-generation script to create the code files with data already inlined.
- Do NOT write output map files (`figma-icons-map.json`, `figma-variables-map.json`, `figma-file-setup.json`) with placeholder or fabricated IDs. Every `componentId`, `variableId`, and page/frame node ID **MUST** come from actual `use_figma` return values.
- Do NOT use string patterns like `icon-{name}-component`, `page-{name}`, or `frame-{name}-container` as IDs. These are NOT valid Figma node IDs.
- Do NOT use sequential IDs like `VariableID:111:1`, `VariableID:111:2`, `VariableID:111:3`. Real Figma IDs are assigned by the Figma backend and are not sequential small numbers.
- Do NOT report this phase as complete unless the Step 7 verification passes.
- Do NOT skip `use_figma` calls and write output files from memory or assumption. Each variable, icon, and page must be created via actual MCP calls.
- Do NOT use `console.log()` as output — use `return { ... }` instead.
- Do NOT use `getPluginData()` / `setPluginData()` — use `getSharedPluginData()` / `setSharedPluginData()`.
- Do NOT use `figma.notify()` — throws in sandbox.

**Valid Figma node ID format**: digits colon digits, e.g., `12:34`, `456:789`, `1:2`.  
**Valid Figma variable ID format**: `VariableID:` followed by digits colon digits, e.g., `VariableID:456:789`.

## Inputs

- **`design-tokens.json`**: `.temp/react-to-figma-dom/design-tokens.json` (from Phase 2)
- **`css-figma-map.json`**: `.temp/react-to-figma-dom/css-figma-map.json` (from Phase 2)
- **`icons.json`**: `.temp/react-to-figma-dom/icons.json` (from Phase 3)
- **`assets/icons/*.svg`**: `.temp/react-to-figma-dom/assets/icons/` (from Phase 3)
- **`static-assets.json`**: `.temp/react-to-figma-dom/assets/static-assets.json` (from Phase 3)
- **Figma file key**: The target Figma file (from user or parent orchestrator)

## Output

| File | Purpose |
|------|---------|
| `.temp/react-to-figma-dom/figma-variables-map.json` | CSS var/class → Figma variable ID lookup |
| `.temp/react-to-figma-dom/figma-icons-map.json` | Icon name → Figma component node ID lookup |
| `.temp/react-to-figma-dom/figma-assets-map.json` | Asset name → Figma component node ID lookup |
| `.temp/react-to-figma-dom/figma-file-setup.json` | Machine-readable map of page and container frame node IDs |
| `.temp/react-to-figma-dom/figma-file-setup.md` | Human-readable summary of what was created |

## Prerequisites

- Phases 2 and 3 must be complete (`design-tokens.json` and `icons.json` must exist)
- The `use_figma` MCP tool must be available
- A target Figma file must be specified

## Procedure

### Step 1: Create file structure

Using the `use_figma` MCP tool, create the following pages in the Figma file (skip any that already exist):

| Page Name | Purpose |
|-----------|---------|
| **Foundations** | Design token documentation, color swatches, typography samples |
| **Icons** | All icon components (one per extracted icon) |
| **Components** | Where Phase 6 builds each component |
| **Screens** | Where Phase 7 composes full page frames |

Check existing pages first. If pages already exist with these names, reuse them. Do not create duplicates.

### Step 1b: Create container frames

After creating (or locating) the pages, create a **WRAP auto-layout container frame** on the **Components**, **Screens**, and **Icons** pages. These frames auto-position child elements so component sets, screen frames, and icons arrange in rows without manual x/y coordinates.

For each of the **Components**, **Screens**, and **Icons** pages:

1. Check if a child frame named `_Components` (or `_Screens`, `_Icons`) already exists. If so, reuse it.
2. If not, create a frame and configure it:

```javascript
const page = figma.getNodeById(componentsPageId);
const container = figma.createFrame();
container.name = '_Components';

container.layoutMode = 'HORIZONTAL';
container.layoutWrap = 'WRAP';
container.itemSpacing = 60;
container.counterAxisSpacing = 80;
container.paddingTop = 40;
container.paddingBottom = 40;
container.paddingLeft = 40;
container.paddingRight = 40;

container.resize(4000, container.height);
container.primaryAxisSizingMode = 'FIXED';
container.counterAxisSizingMode = 'AUTO';

container.fills = [];

page.appendChild(container);
```

The `_Screens` container uses the same pattern but with `container.name = '_Screens'`.

The `_Icons` container uses tighter spacing since icons are small (24×24): `itemSpacing = 24`, `counterAxisSpacing = 24`, `resize(1200, ...)` instead of 4000.

Record the node IDs of all three container frames for the output map.

### Step 2: Create variable collections

**Use the pre-generated code files.** Do NOT read `design-tokens.json` directly or hand-serialize token data into `use_figma` calls.

#### 2a. Generate the code files

Run the code generation script locally (this is a Node.js script, NOT a `use_figma` call):

```bash
node .claude/skills/react-to-figma-dom/scripts/generate-phase5-figma-code.js \
  --pipeline-dir .temp/react-to-figma-dom
```

This reads `design-tokens.json`, `icons.json`, and `css-figma-map.json` and generates self-contained JavaScript files in `.temp/react-to-figma-dom/phase5-figma-calls/`. Each file has all token data pre-inlined as JSON literals — no filesystem access needed in the Figma sandbox.

The script also writes a `manifest.json` listing all files in execution order with their dependencies and placeholder replacements.

#### 2b. Execute the generated code files

Read `manifest.json` and execute each file in order via `use_figma`:

1. Read each `.js` file from `phase5-figma-calls/`
2. For files with `placeholders` in the manifest, replace placeholder strings with real IDs from previous calls:
   - `PALETTE_COLLECTION_ID` → the `collectionId` returned by `03-palette-batch-1.js`
   - `SEMANTIC_COLLECTION_ID` → the `collectionId` returned by `04-semantic-batch-1.js`
   - `COMPONENTS_PAGE_ID` → the Components page ID from `01-create-pages.js`
   - `SCREENS_PAGE_ID` → the Screens page ID from `01-create-pages.js`
   - `ICONS_PAGE_ID` → the Icons page ID from `01-create-pages.js`
3. Pass the code (with placeholders replaced) to `use_figma`
4. Save each result to `phase5-figma-calls/results/{filename}-result.json`

**State accumulation pattern:** Each call returns IDs needed by subsequent calls. Track these in a local variable map:

```
Step 1 result → page IDs (Foundations, Icons, Components, Screens)
Step 2 result → container frame IDs
Batch 1 result → collectionId (reuse for batches 2+)
All batch results → variable IDs (for final map)
```

#### 2c. Build the output maps

After all `use_figma` calls complete, run the map builder (Node.js script):

```bash
node .temp/react-to-figma-dom/phase5-figma-calls/07-build-maps.js
```

This reads all results from `phase5-figma-calls/results/` and produces:
- `figma-variables-map.json`
- `figma-icons-map.json`
- `figma-file-setup.json`

### Step 3: Create icon components

Icon creation is handled by the generated code files (`06-icons-batch-N.js`). These are already included in the manifest and will be executed in Step 2b.

Each icon batch:
1. Switches to the Icons page
2. Finds the `_Icons` auto-layout container frame (created in Step 1b)
3. Checks for existing components with the same name inside the container (idempotent)
4. Creates a Figma component from the SVG using `figma.createNodeFromSvg(svgString)`
5. Names the component using `figmaName` (e.g., `Icon/Check`, `Icon/MoreVertical`)
6. Appends the component to the `_Icons` container (NOT directly to the page)
7. Returns the created component IDs

**Important**: Icons must go into the `_Icons` container, not the page. Appending directly to a page places all children at (0,0) since pages have no auto-layout.

The results are saved to `phase5-figma-calls/results/06-icons-batch-N-result.json` and consumed by the map builder in Step 2c.

### Step 4: Create static asset components

If `static-assets.json` has assets with `type: "svg"` and a `svgContent` field:

1. Navigate to the **Icons** page (assets go alongside icons)
2. For each SVG asset, create a Figma component from `svgContent` via `use_figma`:

```javascript
const page = figma.getNodeById('ICONS_PAGE_ID');
figma.currentPage = page;

const svgContent = '...'; // inlined SVG string
const node = figma.createNodeFromSvg(svgContent);
const comp = figma.createComponent();
comp.name = 'Asset/CartonLogo';
comp.resize(node.width, node.height);
while (node.children.length > 0) {
  comp.appendChild(node.children[0]);
}
node.remove();
page.appendChild(comp);
return { name: comp.name, id: comp.id };
```

3. Size to match the original asset dimensions

For non-SVG assets (PNG, JPG, etc.):
- These cannot be created programmatically via the Figma API
- Log them as pending manual imports in the summary

Write `figma-assets-map.json` after creating all asset components:

```json
{
  "CartonLogo": { "figmaName": "Asset/CartonLogo", "componentId": "12:78", "type": "svg" }
}
```

All IDs must come from actual `use_figma` return values.

### Step 5: Create Foundations page content

On the **Foundations** page, create documentation frames showing:

1. **Color Palette**: A grid of color swatches for each Palette variable — each swatch is a 48×48 rectangle filled with the color, with a text label below showing the token name and hex value. Use a WRAP auto-layout container to arrange swatches in rows.
2. **Semantic Colors**: Same pattern for Semantic variables.
3. **Border Radius / Spacing**: Visual examples of each Numbers value — rectangles with the corresponding border-radius applied, or spacing bars.

This content is generated by the pre-generation script (`05a-foundations-*.js` files) using the same pattern as variable and icon batches.

This step is nice-to-have. If context is getting large, skip it and note it in the summary.

### Step 6: Write summary

Write `.temp/react-to-figma-dom/figma-file-setup.json` (machine-readable, used by Phase 6 orchestrator):

```json
{
  "fileKey": "{fileKey}",
  "pages": {
    "foundations": "{foundationsPageId}",
    "icons": "{iconsPageId}",
    "components": "{componentsPageId}",
    "screens": "{screensPageId}"
  },
  "containerFrames": {
    "componentsFrameId": "{componentsContainerNodeId}",
    "screensFrameId": "{screensContainerNodeId}"
  }
}
```

Then write `.temp/react-to-figma-dom/figma-file-setup.md`:

```markdown
# Figma File Setup

**File key**: {fileKey}
**Created at**: {timestamp}

## Pages
- Foundations: {created | already existed}
- Icons: {created | already existed}
- Components: {created | already existed}
- Screens: {created | already existed}

## Container Frames
- _Components: {nodeId} ({created | already existed})
- _Screens: {nodeId} ({created | already existed})

## Variable Collections
- Palette: {count} variables created
- Semantic: {count} variables created ({aliasCount} aliased to Palette)
- Numbers: {count} variables created

## Icon Components
- Created: {count} icon components
- Skipped (null SVG): {count}

## Asset Components
- SVG assets created: {count}
- Non-SVG assets (manual import needed): {list}

## Output Files
- figma-file-setup.json: page IDs + container frame IDs
- figma-variables-map.json: {entryCount} entries
- figma-icons-map.json: {entryCount} entries
- figma-assets-map.json: {entryCount} entries
```

## Idempotency

Before creating any item, check if it already exists:
- **Pages**: Check page names before creating
- **Variables**: Check if a variable at the same path already exists in the collection
- **Icon components**: Check if a component with the same name exists on the Icons page

If items already exist, reuse their IDs for the output maps. Do not create duplicates.

If all output files already exist (`figma-variables-map.json`, `figma-icons-map.json`, `figma-assets-map.json`, `figma-file-setup.json`), report that setup is already complete and skip.

## Error Handling

- If `use_figma` MCP tool is not available, stop immediately with a clear message explaining that this phase requires a Figma MCP connection
- If a variable creation fails, log the error and continue with remaining variables
- If an SVG fails to import (malformed SVG), log the icon name and continue
- At the end, report any failures in the summary

## Step 7: Verify Outputs

After writing all output files, run the validation script:

```bash
node .claude/skills/react-to-figma-dom/scripts/validate-phase5-outputs.js \
  --pipeline-dir .temp/react-to-figma-dom/
```

If the script exits with code 1 (invalid), **STOP**. Report the validation errors. Do NOT mark this phase as complete.

If the script is not available, perform manual validation:

1. Read back `figma-file-setup.json`. Verify every page and container frame ID matches the pattern `^\d+:\d+$` (digits, colon, digits). If ANY value is a placeholder string like `"page-foundations"`, the file is invalid.

2. Read back `figma-icons-map.json`. Verify every `componentId` matches `^\d+:\d+$`. If ANY value looks like `"icon-check-component"`, the file is invalid.

3. Read back `figma-variables-map.json`. Verify every `variableId` matches `^VariableID:\d+:\d+$`.

4. **Spot-check probe**: Pick ONE icon `componentId` and run via `use_figma`:
```javascript
const n = figma.getNodeById('{componentId}');
return { exists: !!n, type: n?.type, name: n?.name };
```
If the node does not exist, the output is invalid.

5. **Spot-check probe**: Pick ONE `variableId` and run via `use_figma`:
```javascript
try {
  const v = figma.variables.getVariableById('{variableId}');
  return { exists: !!v, name: v?.name };
} catch(e) {
  return { exists: false, error: e.message };
}
```
If the variable does not exist, the output is invalid.

If ALL validations pass, mark this phase as complete.
