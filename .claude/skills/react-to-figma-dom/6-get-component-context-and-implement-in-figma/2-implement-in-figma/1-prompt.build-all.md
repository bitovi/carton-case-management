# 6 Get Component Context and Implement in Figma
## 6.2 Implement in Figma (DOM Pipeline)
### 6.2.1 Build All Variants

**Begin your response by outputting the heading lines above verbatim.**

Generate Figma IR and build code for EVERY variant, execute them all in Figma, and combine into a component set if multi-variant.

## FAIL-FAST RULE

Your FIRST action after reading reference files must be a `use_figma` call — a simple probe (`return { ok: true }`) to confirm MCP connectivity. If the call fails or `use_figma` is unavailable, **STOP immediately**. Do NOT write any output files (`figma-result.md`, `build-orchestrator.js`, etc). Return ONLY:

```
ERROR: use_figma unavailable — {error details}
```

This applies to every subsequent `use_figma` call too: if ANY call fails, stop and report the error. Do not continue to the next variant.

## Before You Start

You MUST read these reference files in `2-implement-in-figma/reference/` using `read_file` BEFORE doing anything else. Do NOT skip this step — these contain critical rules that prevent silent bugs:
1. `figma-use-rules.md` — Critical rules for every `use_figma` call
2. `figma-gotchas.md` — Silent bugs to avoid
3. `figma-component-patterns.md` — Component and component set creation, `combineAsVariants()`
4. `figma-variable-binding.md` — How to bind design tokens

If you did not read all four files, STOP and read them now.

## DO NOT — CRITICAL

These rules are non-negotiable. Violating ANY of them produces broken output.

- Do NOT write `use_figma` code from scratch. Run the scripts to generate it.
- Do NOT modify generated `build-script.js` files manually unless the IR or codegen has a confirmed bug.
- Do NOT report success without the orchestrator running the verify step.
- Do NOT create a monolithic orchestrator script or `build-orchestrator.js`. Each variant has its own `build-script.js` — execute them individually.
- Do NOT create placeholder components — the `build-script.js` files contain all design detail (colors, fonts, sizing, variable bindings). Never substitute simplified stand-ins.
- Do NOT write ANY code from scratch for building variants. The generated `build-script.js` is complete and ready to execute as-is.

### Anti-hand-coding enforcement

For Step 4 (Execute ALL variants in Figma), you MUST:
1. **Read** the `build-script.js` file from disk. If `read_file` fails (e.g., spaces in path), use `cat` in a terminal to read the file content instead.
2. **Pass** the file's exact content to `use_figma` — do NOT paraphrase, simplify, or rewrite it
3. **Verify** after each `use_figma` call that the returned `rootNodeId` exists

If you find yourself writing `figma.createComponent()`, `figma.createFrame()`, `figma.createText()`, or similar Figma API calls **outside** of Step 0 or Step 5 — **STOP**. You are hand-coding. Go back to Step 4 and use the generated `build-script.js` file.

### Recovering from errors

If a `use_figma` call fails with a parentFrameId or node-not-found error:
1. Do NOT abandon the generated scripts and hand-code replacements.
2. The generated build scripts resolve the parent frame dynamically by name — they do NOT use hardcoded node IDs. If the "Components" frame is missing, run Step 0 to create it, then retry the generated script as-is.
3. If the error is something else, report it and stop.

## Inputs

| Variable | Description |
|----------|-------------|
| `componentName` | Component being built (e.g., `Badge`) |
| `componentDir` | Component directory (e.g., `.temp/react-to-figma/components/Badge/`) |
| `pipelineDir` | Pipeline directory (e.g., `.temp/react-to-figma/`) |
| `skillDir` | Skill directory (e.g., `.claude/skills/react-to-figma-dom/6-get-component-context-and-implement-in-figma/2-implement-in-figma/`) |
| `fileKey` | Figma file key |
| `builtComponents` | Map of already-built component name → node ID |

## Output

Write `{componentDir}/figma-result.md` with all node IDs.

## Procedure

### 0. Ensure Components container frame exists

The generated `build-script.js` files resolve the parent frame dynamically by name (not by node ID). However, the container frame must exist before the first variant is built.

Run this code in a single `use_figma` call to ensure the container exists:

```javascript
// Find the Components page
const componentsPage = figma.root.children.find(p => p.name === 'Components');
if (!componentsPage) {
  return { error: 'FATAL: No page named "Components" found in this Figma file. Create it first or rename the correct page to "Components".' };
}
await figma.setCurrentPageAsync(componentsPage);

// Clean up orphan "Components" frames (from prior failed runs)
const existingFrames = componentsPage.children.filter(n => n.type === 'FRAME' && n.name === 'Components');
let containerFrame = null;
for (const frame of existingFrames) {
  if (frame.children.length > 0 && !containerFrame) {
    containerFrame = frame;
  } else if (frame.children.length === 0) {
    frame.remove();
  }
}

// Create container frame if none exists
if (!containerFrame) {
  containerFrame = figma.createFrame();
  containerFrame.name = 'Components';
  componentsPage.appendChild(containerFrame);
}
// Always ensure auto-layout is configured (fixes stale frames from prior runs)
containerFrame.layoutMode = 'HORIZONTAL';
containerFrame.layoutWrap = 'WRAP';
containerFrame.itemSpacing = 40;
containerFrame.counterAxisSpacing = 40;
containerFrame.paddingTop = 40;
containerFrame.paddingBottom = 40;
containerFrame.paddingLeft = 40;
containerFrame.paddingRight = 40;
containerFrame.primaryAxisSizingMode = 'AUTO';
containerFrame.counterAxisSizingMode = 'AUTO';
containerFrame.fills = [];
return { ok: true, containerFrameId: containerFrame.id };
```

The `containerFrameId` is returned for logging only — you do NOT pass it to subsequent steps. The generated build scripts find the frame by name themselves.

**IMPORTANT**: Each `use_figma` call runs in an isolated sandbox. Frames created in one call DO persist in the Figma file, but `figma.currentPage` resets between calls. The generated build scripts handle this by calling `setCurrentPageAsync` internally. If you hand-code any `use_figma` call, you MUST call `await figma.setCurrentPageAsync(componentsPage)` before searching for frames.

If this call fails or returns an error, **STOP** immediately.

### 1. Identify all variants and map to DOM captures

Read `{componentDir}/figma-variants.md`:
- Parse the **Figma Variant Axes** table — only axes with `Type = VARIANT` are physical variant combos
- Parse the **Component Properties** table — `BOOLEAN`, `INSTANCE_SWAP`, and `TEXT` properties are wired AFTER combining, not built as separate variants
- Identify the default combo (first listed or marked as default)
- Compute `allCombos` — cross-product of VARIANT-type axes ONLY
- If only one combo → single-component mode

**CRITICAL**: The `variants/` directory may contain folders for non-VARIANT entries (e.g., "Readonly True...", "With Alt Label", etc.) that demonstrate BOOLEAN or TEXT property behavior. These are NOT in `allCombos`. **Exclude them from the build list.** They are only used as reference for wiring component properties in Step 5d.

To compute `allCombos`, look ONLY at the **Figma → React Mapping** table rows that map to VARIANT axis combinations. For example, if axes are `State` (rest, interest, edit, saving) and `Error` (none, with-error), then `allCombos` has at most 8 entries. But check the mapping table — some combos may share the same visual (e.g., error is only visible in edit state), and each combo must have a matching variant folder with a `dom.json`.

List `{componentDir}/variants/` and match each combo to its `dom.json` file.

Record the mapping:
```
defaultCombo: { State: 'rest', Error: 'none' }
allCombos:
  - Readonly False Rest No Error → variants/Readonly False Rest No Error/dom.json  (State=rest, Error=none)
  - Readonly False Edit No Error → variants/Readonly False Edit No Error/dom.json  (State=edit, Error=none)
  - ...
excluded (non-VARIANT):
  - With Alt Label → TEXT property demo, used in Step 5d
  - Readonly True Rest No Error → BOOLEAN property demo, used in Step 5d
```

If a VARIANT combo has no matching variant folder or `dom.json`, stop and report the error.

### 2. Generate Figma IR for ALL variants

For EVERY variant (including default), run:

```bash
node {skillDir}/scripts/dom-to-figma-ir.js \
  --dom-file {componentDir}/variants/{VariantName}/dom.json \
  --fiber-map {componentDir}/variants/{VariantName}/fiber-dom-map.json \
  --variables-map {pipelineDir}/figma-variables-map.json \
  --design-tokens {pipelineDir}/design-tokens.json \
  --icons-map {pipelineDir}/figma-icons-map.json \
  --built-components {pipelineDir}/built-components.json \
  --component-name {componentName} \
  --output {componentDir}/variants/{VariantName}/figma-ir.json
```

Check for warnings in each IR (MISSING component references, unresolved colors). If a dependency is not in `builtComponents`, stop and report the error.

### 3. Generate use_figma code for ALL variants

For EVERY variant in `allCombos`, run:

```bash
node {skillDir}/scripts/ir-to-figma-code.js \
  --ir-file {componentDir}/variants/{VariantName}/figma-ir.json \
  --output {componentDir}/variants/{VariantName}/build-script.js
```

Note: `--parent-frame-id` is no longer required. The generated scripts resolve the parent frame dynamically by name.

### 4. Execute ALL variants in Figma

**This step uses ONLY the generated `build-script.js` files. Do NOT write Figma API code yourself.**

For each variant in `allCombos`:

1. Read the FULL file content of `{componentDir}/variants/{VariantName}/build-script.js`. Variant folder names often contain spaces — if `read_file` fails, use `cat "{componentDir}/variants/{VariantName}/build-script.js"` in a terminal to get the content.
2. Pass that EXACT content to `use_figma` as a single call — do NOT modify, simplify, paraphrase, or rewrite ANY part of it. The scripts contain precise colors, fonts, variable bindings, and sizing from the DOM capture.
3. Receive the returned `{ rootNodeId }`
4. Record the mapping: `variantName → rootNodeId`

Each variant is a SEPARATE `use_figma` call. Never batch multiple variants into one call.

If there are chunk files (`build-script.chunk0.js`, `build-script.chunk1.js`), execute them sequentially for that variant, passing node IDs forward between chunks.

If any `use_figma` call fails, STOP and report the error. Do not continue to the next variant. Do NOT hand-code a replacement — the generated script IS the source of truth for design details.

### 5. Combine into component set (multi-variant only)

If `allCombos` has more than one entry:

**a) Rename each component to its variant combo string**

```javascript
const node = figma.getNodeById('{variantNodeId}');
node.name = '{axisName1}={value1}, {axisName2}={value2}';
```

**b) Combine**

```javascript
const componentsPage = figma.root.children.find(p => p.name === 'Components');
const parentFrame = componentsPage.children.find(n => n.type === 'FRAME' && n.name === 'Components');
if (!parentFrame) {
  return { error: 'FATAL: Components container frame not found. Do NOT fall back to currentPage.' };
}
const allComponents = [{nodeId1}, {nodeId2}, ...].map(id => figma.getNodeById(id));
const componentSet = figma.combineAsVariants(allComponents, parentFrame);
componentSet.name = '{componentName}';
componentSet.fills = [{ type: 'SOLID', color: { r: 0.95, g: 0.95, b: 0.98 } }];
componentSet.cornerRadius = 8;
```

**CRITICAL**: If the parent frame `find()` returns `null`, STOP. Return an error. Do NOT fall back to `figma.currentPage`.

**c) Layout the set**

```javascript
const SPACING = 40;
const columns = Math.ceil(Math.sqrt(allComponents.length));
const maxChildWidth = Math.max(...componentSet.children.map(c => c.width));
const targetWidth = columns * (maxChildWidth + SPACING) + SPACING;
componentSet.layoutMode = 'HORIZONTAL';
componentSet.layoutWrap = 'WRAP';
componentSet.itemSpacing = SPACING;
componentSet.counterAxisSpacing = SPACING;
componentSet.paddingTop = SPACING;
componentSet.paddingBottom = SPACING;
componentSet.paddingLeft = SPACING;
componentSet.paddingRight = SPACING;
componentSet.resize(targetWidth, componentSet.height);
componentSet.primaryAxisSizingMode = 'FIXED';
componentSet.counterAxisSizingMode = 'AUTO';
```

Do NOT set `x` or `y` on the component set itself — the parent container frame uses WRAP auto-layout to position component sets automatically in rows.

**d) Wire component properties** (if `figma-variants.md` has BOOLEAN/INSTANCE_SWAP/TEXT properties)

```javascript
// BOOLEAN example:
const boolKey = componentSet.addComponentProperty('Show left icon', 'BOOLEAN', false);
for (const variant of componentSet.children) {
  const slotNode = variant.findOne(n => n.name === 'leftIcon');
  if (slotNode) {
    slotNode.visible = false;
    slotNode.componentPropertyReferences = { visible: boolKey };
  }
}
```

### 6. Single-component mode

If only one combo, skip Step 5. The single variant IS the final component. The build script already appended it to the parent frame.

### 7. Write figma-result.md

Write to `{componentDir}/figma-result.md`:

```markdown
# Figma Result: {componentName}

## Component Set
- **Set Node ID**: {setId} (or component ID if single)
- **Set Name**: {componentName}
- **Parent Frame**: Components > Components (resolved by name)
- **Single Component**: {true/false}

## Variants Built (VARIANT-axis combos only)

| Variant Name | Node ID | Axis Values | Screenshot Source |
|-------------|---------|-------------------|
| {VariantComboString} | {nodeId} | variants/{VariantName}/screenshot.png |
| ... | ... | ... |

## Build Artifacts

| Variant | IR File | Build Script |
|---------|---------|-------------|
| {VariantName} | variants/{VariantName}/figma-ir.json | variants/{VariantName}/build-script.js |
| ... | ... | ... |

## Warnings
{Any IR warnings or issues encountered}
```

## Error Handling

| Scenario | Action |
|----------|--------|
| Missing `dom.json` for a variant combo | Stop and report which variants are missing DOM captures |
| Missing dependency in `builtComponents` | Stop and report which components need to be built first |
| `use_figma` execution fails | Report the error and which variant failed. Do not retry — the orchestrator decides. Do NOT hand-code a replacement. |
| `combineAsVariants` fails | Ensure all components have unique variant names. Retry once. |
