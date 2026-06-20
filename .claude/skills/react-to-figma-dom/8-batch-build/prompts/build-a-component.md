# 6 Get Component Context and Implement in Figma
## 6.2 Implement in Figma (DOM Pipeline)
### 6.2.1 Build All Variants

**Begin your response by outputting the heading lines above verbatim.**

Generate Figma IR and build code for EVERY variant, execute them all in Figma, and combine into a component set if multi-variant.

## FAIL-FAST RULE

Your FIRST action after reading reference files must be a `use_figma` call — a simple probe (`return { ok: true }`) to confirm MCP connectivity. If the call fails or `use_figma` is unavailable, **STOP immediately**. Do NOT write any output files (`figma-result.json`, `build-orchestrator.js`, etc). Return ONLY:

```
ERROR: use_figma unavailable — {error details}
```

This applies to every subsequent `use_figma` call too: if ANY call fails, stop and report the error. Do not continue to the next variant.

## Before You Start

You MUST read these reference files using `read_file` BEFORE doing anything else. Do NOT skip this step — these contain critical rules that prevent silent bugs:
1. `.claude/skills/react-to-figma-dom/legacy/6-get-component-context-and-implement-in-figma/2-implement-in-figma/reference/figma-use-rules.md` — Critical rules for every `use_figma` call
2. `.claude/skills/react-to-figma-dom/legacy/6-get-component-context-and-implement-in-figma/2-implement-in-figma/reference/figma-gotchas.md` — Silent bugs to avoid
3. `.claude/skills/react-to-figma-dom/legacy/6-get-component-context-and-implement-in-figma/2-implement-in-figma/reference/figma-component-patterns.md` — Component and component set creation, `combineAsVariants()`
4. `.claude/skills/react-to-figma-dom/legacy/6-get-component-context-and-implement-in-figma/2-implement-in-figma/reference/figma-variable-binding.md` — How to bind design tokens

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
| `componentDir` | Component directory (e.g., `.temp/react-to-figma-dom/components/Badge/`) |
| `pipelineDir` | Pipeline directory (e.g., `.temp/react-to-figma-dom/`) |
| `skillDir` | Skill directory (e.g., `.claude/skills/react-to-figma-dom/6-get-component-context-and-implement-in-figma/2-implement-in-figma/`) |
| `fileKey` | Figma file key |
| `builtComponents` | Map of already-built component name → node ID |

## Output

Write `{componentDir}/figma-result.json` with all node IDs and build status.

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

### 1. Identify all variants and verify build-manifest exists

Read `{componentDir}/build-manifest.json`. This file describes the execution plan:
- `groups[]` — structural groups, each with a base variant and optional clone-batches
- `groups[].baseScript` — path to the base variant's `build-script.js` (relative to componentDir)
- `groups[].cloneBatches[]` — array of clone-batch JS file names
- `groups[].label` — "dependent" (has clones) or "independent" (standalone build only)
- `groups[].variantCount` — total variants in this group (base + clones)

If `build-manifest.json` does not exist, run the generation script first:
```bash
node .claude/skills/react-to-figma-dom/scripts/generate-build-and-clone-scripts.js \
  --component-dir {componentDir} \
  --figma-variants {componentDir}/figma-variants.json \
  --pipeline-dir {pipelineDir}
```

### 2. (Skipped — generation done in Phase 7)

IR and build scripts are already generated by `generate-build-and-clone-scripts.js`. No manual `dom-to-figma-ir.js` or `ir-to-figma-code.js` runs needed.

### 3. (Skipped — generation done in Phase 7)

Clone batches are already packed into `clone-batch-{group}-{batch}.js` files.

### 4. Execute ALL variants in Figma (manifest-driven)

**This step uses ONLY the generated scripts. Do NOT write Figma API code yourself.**

Process groups from `build-manifest.json` in order:

#### For each group:

**a) Execute the base build-script:**
1. Read the FULL file content of `{componentDir}/{group.baseScript}`
2. Pass that EXACT content to `use_figma` — do NOT modify it
3. Receive `{ rootNodeId, setId, name, mode }`
4. Record `setId` (ComponentSet ID)

**b) Execute clone-batches (if any):**
For each file in `group.cloneBatches`:
1. Read the FULL file content of `{componentDir}/{batchFile}`
2. Pass that EXACT content to `use_figma`
3. Receive `{ cloned, setChildren, setId }`
4. Verify `setChildren` matches expectations

**c) For independent groups:**
Independent groups have no clone-batches. Just execute their `baseScript` — it builds a single variant and appends it to the existing ComponentSet.

**Summary**: A component with N variants typically needs only 2-5 `use_figma` calls instead of N:
- 1 call for the base build (creates ComponentSet)
- 1 call per clone-batch (~47 variants per batch)
- 1 call per independent structural group

Each `use_figma` call runs in an isolated sandbox. The generated scripts handle page navigation and ComponentSet lookup internally.

If any `use_figma` call fails, STOP and report the error. Do NOT hand-code a replacement.

### 5. Wire component properties (BOOLEAN injection)

If `figma-variants.json` defines BOOLEAN, INSTANCE_SWAP, or TEXT component properties, inject and wire them on the ComponentSet after all variants are built.

#### 5a. Generate the injection script (preferred — automated)

If any BOOLEAN property in `figma-variants.json` has a `referenceCapture` field, generate the injection script:

```bash
node .claude/skills/react-to-figma-dom/scripts/generate-boolean-injection.js \
  --component-dir {componentDir} \
  --figma-variants {componentDir}/figma-variants.json \
  --output {componentDir}/boolean-injection-script.js
```

If the script was generated (exit code 0 and output file exists), execute it via `use_figma`:
1. Read `{componentDir}/boolean-injection-script.js`
2. Pass the exact content to `use_figma`
3. Verify the returned `injected` array matches expectations

#### 5b. Manual wiring (fallback — no referenceCapture)

If BOOLEAN properties do NOT have `referenceCapture` (or the injection script wasn't generated), wire them manually:

**CRITICAL**: `componentPropertyReferences` can only be set on a node that is ALREADY a child of a component. You MUST call `variant.insertChild()` BEFORE setting `componentPropertyReferences`. Setting it on a detached node throws "Can only set component property references on symbol sublayer".

```javascript
const componentsPage = figma.root.children.find(p => p.name === 'Components');
await figma.setCurrentPageAsync(componentsPage);
const componentSet = componentsPage.findOne(n => n.type === 'COMPONENT_SET' && n.name === '{componentName}');

// BOOLEAN example:
const boolKey = componentSet.addComponentProperty('Show left icon', 'BOOLEAN', false);
for (const variant of componentSet.children) {
  const slotNode = figma.createFrame();
  slotNode.name = 'leftIcon slot wrapper';
  slotNode.visible = false;
  slotNode.fills = [];
  variant.insertChild(0, slotNode);  // MUST be inserted first
  slotNode.componentPropertyReferences = { visible: boolKey };  // THEN set reference
}
```

Skip this step entirely if `figma-variants.json` only has VARIANT axes (no BOOLEAN/TEXT/INSTANCE_SWAP properties).

### 6. Write figma-result.json

Write to `{componentDir}/figma-result.json`:

```json
{
  "componentName": "{componentName}",
  "buildStatus": "PASS",
  "executedAt": "{ISO timestamp}",
  "variants": [
    {
      "variant": "{VariantFolderName}",
      "nodeId": "{nodeId}",
      "name": "{componentName}—Variant={VariantFolderName}",
      "status": "PASS",
      "scriptFile": "variants/{VariantFolderName}/build-script.js"
    }
  ],
  "summary": {
    "totalVariants": 1,
    "successCount": 1,
    "failCount": 0,
    "primaryNodeId": "{setId or componentId}"
  },
  "notes": "{Any warnings or issues encountered}"
}
```

Set `buildStatus` to `"FAIL"` if any variant failed. Each variant entry gets `"status": "PASS"` or `"status": "FAIL"` individually.

## Error Handling

| Scenario | Action |
|----------|--------|
| Missing `dom.json` for a variant combo | Stop and report which variants are missing DOM captures |
| Missing dependency in `builtComponents` | Log a warning but continue — the component will be built with inline children instead of instances. The parent can be re-resolved later. |
| `use_figma` execution fails | Report the error and which variant failed. Do not retry — the orchestrator decides. Do NOT hand-code a replacement. |
| `combineAsVariants` fails | Verify the Components container frame exists (Step 0). The codegen handles combineAsVariants automatically. |

### 7. Register in built-components.json

After successfully building the component, register its node ID so parent components can create instances of it:

```bash
node {skillDir}/scripts/register-built-component.js \
  --name {componentName} \
  --node-id {setId} \
  --built-components {pipelineDir}/built-components.json
```

Use the `setId` returned by the last `use_figma` call in Step 4 — this is the ComponentSet ID.

This is CRITICAL — without this step, parent components that depend on this one will fall back to inline rendering instead of creating proper Figma instances.
