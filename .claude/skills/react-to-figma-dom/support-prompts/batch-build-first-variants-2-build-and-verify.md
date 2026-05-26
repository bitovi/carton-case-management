# Batch Build and Verify (First 2 Variants Only)

**Begin your response by outputting the heading above verbatim.**

Orchestrate building the **first 2 variants** of every preprocessed component in Figma and verifying the results. This is a fast-feedback version — it builds only 2 variants per component to quickly validate the pipeline without waiting for all variants. Spawns two subagents per component (build, then verify), tracks progress via a todo list, and aggregates results into a scoreboard.

## FAIL-FAST RULE

Your FIRST action must be a `use_figma` probe call. If it fails, **STOP immediately**:

```
ERROR: use_figma unavailable — {error details}
```

Do NOT proceed to any component if Figma MCP is unavailable.

## Inputs

| Variable | Value |
|----------|-------|
| `pipelineDir` | `.temp/react-to-figma/` |
| `resultsFile` | `.temp/react-to-figma/batch-preprocess-results.json` |
| `skillDir` | `.claude/skills/react-to-figma-dom/6-get-component-context-and-implement-in-figma/2-implement-in-figma/` |
| `fileKey` | _(Figma file key — from context or ask user)_ |
| `maxVariants` | `2` |

## Procedure

### 0. Probe Figma MCP + ensure Components container exists

Run this as your very first `use_figma` call:

```javascript
// Probe + ensure container frame
const componentsPage = figma.root.children.find(p => p.name === 'Components');
if (!componentsPage) {
  return { error: 'FATAL: No page named "Components" found. Create it first.' };
}
await figma.setCurrentPageAsync(componentsPage);

const existingFrames = componentsPage.children.filter(n => n.type === 'FRAME' && n.name === 'Components');
let containerFrame = null;
for (const frame of existingFrames) {
  if (frame.children.length > 0 && !containerFrame) {
    containerFrame = frame;
  } else if (frame.children.length === 0) {
    frame.remove();
  }
}
if (!containerFrame) {
  containerFrame = figma.createFrame();
  containerFrame.name = 'Components';
  componentsPage.appendChild(containerFrame);
}
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
return { ok: true };
```

If this fails, STOP.

### 1. Read batch-preprocess-results.json and create todo list

Read `.temp/react-to-figma/batch-preprocess-results.json`. Extract all components where `readyForFigma === true`.

If the file doesn't exist, stop and tell the user to run `batch-build-1-preprocess.sh` first.

Create a todo list with one item per component (e.g., `Build & Verify: Badge (2 of N)`, `Build & Verify: Button (2 of N)`, ...) plus a final `Run scoreboard` item. All items start as `not-started`.

Print the list of components you will process, their total variant counts, and note that only the **first 2** variants of each will be built.

### 2. For each component: spawn Build subagent, then verify via script

Process components **one at a time**. For each component:

1. Mark its todo item as `in-progress`.
2. Spawn a **Build subagent** (see §Build Subagent below). The subagent is instructed to build only the **first 2 variants**.
3. If the build subagent reports success, run the **verify script** directly (NO subagent needed):
   ```bash
   node {skillDir}/scripts/batch-screenshot-and-verify.js \
     --component-dir {componentDir} \
     --file-key {fileKey}
   ```
   This uses `FIGMA_ACCESS_TOKEN` from `.env` to batch-download all variant screenshots via the REST API in one call, then runs pixel diffs. No MCP needed.
4. If the build subagent reports failure, record `build_failed` and skip verify.
5. Print a one-line status: `{componentName}: {build_ok|build_failed} / {verify_verdict|skipped} (2 of {totalVariants} variants)`
6. Mark its todo item as `completed`.
7. Proceed to the next component.

**IMPORTANT**: Before running any verify scripts, ensure `FIGMA_ACCESS_TOKEN` is set:
```bash
source .env
```

### 3. Run scoreboard

Mark the scoreboard todo item as `in-progress`. Run:

```bash
node .claude/skills/react-to-figma-dom/support-prompts/batch-build-3-aggregate-verification.js
```

Mark as `completed`. Print the path of the generated scoreboard file.

### 4. Final summary

Print a table:

```
Component           | Build    | Verify   | Avg Match% | Variants Built
--------------------|----------|----------|------------|---------------
Badge               | ok       | FAIL     | 61.2%      | 2 of 8
BaseEditable        | ok       | FAIL     | 71.3%      | 2 of 4
Button              | ok       | PASS     | 94.1%      | 2 of 12
...
```

Followed by:
```
Scoreboard: .temp/react-to-figma/verification-scoreboard.md
NOTE: Only first 2 variants per component were built. Run full batch-build-2-build-and-verify.md for complete coverage.
```

---

## Build Subagent

Spawn with `runSubagent`. The prompt you pass must include ALL of the following context inline — the subagent has no prior knowledge.

### Subagent prompt template

```
Build component "{componentName}" in Figma — FIRST 2 VARIANTS ONLY.

Component directory: {componentDir}
(e.g., .temp/react-to-figma/components/Badge)

## DO NOT — CRITICAL

- Do NOT write use_figma code from scratch. Only execute existing build-script.js files and template files.
- Do NOT hand-code any Figma API calls (figma.createComponent, figma.createFrame, figma.combineAsVariants, etc.). For cleanup and combine, ALWAYS use the template files below.
- Do NOT batch multiple variants into one use_figma call.
- Do NOT proceed past a variant if use_figma returns an error — mark the whole component as build_failed and report back.
- Do NOT diff, compare, or analyze build scripts against each other. Do NOT copy build scripts to /tmp. Each build-script.js is self-contained — read it and execute it immediately via use_figma, then move to the next variant.
- Do NOT try to "understand" or "optimize" the build order. Process variants in directory listing order.
- Do NOT build more than 2 variants. After building 2, skip directly to the combine step.
- Do NOT write your own combineAsVariants code. The template file handles this correctly. The Figma API signature is `figma.combineAsVariants(components[], parentNode)` — the second argument is a PARENT NODE, NOT an options object.

## Steps

### 1. Clean up existing component

Read the template file, replace `__COMPONENT_NAME__` with the actual component name, and pass the result to `use_figma`:

```
Template file: .claude/skills/react-to-figma-dom/6-get-component-context-and-implement-in-figma/2-implement-in-figma/scripts/cleanup-component.template.js
```

Steps:
1. Read the template file content.
2. Replace ALL occurrences of `__COMPONENT_NAME__` with `{componentName}`.
3. Pass the modified content to `use_figma` as-is. Do NOT modify anything else.

### 2. List variant subdirectories

List all subdirectories of {componentDir}/variants/ that contain a build-script.js file.
Sort them alphabetically, then **take only the first 2**. These are the only variants to build.
Print which variants were selected and which were skipped.

### 3. Execute each build-script.js — ONE AT A TIME, NO ANALYSIS (max 2)

Process the **first 2 variants** sequentially. For EACH variant:
1. Read the build-script.js file content. If read_file fails due to spaces in the path, use cat "{path}" in a terminal.
2. IMMEDIATELY pass the exact file content to use_figma as a single call. Do not read other variants' scripts first.
3. Record the returned rootNodeId.
4. If the call fails, report back: { "status": "build_failed", "componentName": "{componentName}", "failedVariant": "{variantName}", "error": "{error}" }
5. Move to the next variant. Do not go back and compare.

If a variant has chunk files (build-script.chunk0.js, build-script.chunk1.js, etc.) instead of a single build-script.js, execute them sequentially. Pass the rootNodeId from chunk0 into chunk1 as needed.

**STOP after 2 variants.** Do not build any more.

### 4. Combine into component set (if 2 variants were built)

Read the template file, replace `__COMPONENT_NAME__` with the actual component name, and pass to `use_figma`:

```
Template file: .claude/skills/react-to-figma-dom/6-get-component-context-and-implement-in-figma/2-implement-in-figma/scripts/combine-variants.template.js
```

Steps:
1. Read the template file content.
2. Replace ALL occurrences of `__COMPONENT_NAME__` with `{componentName}`.
3. Pass the modified content to `use_figma` as-is. Do NOT modify anything else in the template.
4. The template handles all edge cases: single variant, missing parent, layout after combine.

If only 1 variant, the template handles it (returns `single_component`).
CRITICAL: Do NOT write your own combine code. Always use the template.

### 5. Write figma-result.json and figma-result.md

Write {componentDir}/figma-result.json with this structure:

```json
{
  "componentName": "{componentName}",
  "setNodeId": "{setNodeId}",
  "fileKey": "{fileKey}",
  "singleComponent": false,
  "partialBuild": true,
  "partialBuiltCount": 2,
  "totalVariants": {totalVariants},
  "variantsBuilt": [
    { "name": "{variantFolderName}", "nodeId": "{nodeId}" },
    { "name": "{variantFolderName}", "nodeId": "{nodeId}" }
  ],
  "variantsSkipped": [
    "{skippedVariantName}",
    "..."
  ]
}
```

Also write {componentDir}/figma-result.md with this format:

```
# Figma Result: {componentName}

## Component Set
- **Set Node ID**: {setNodeId}
- **Set Name**: {componentName}
- **File Key**: {fileKey}
- **Single Component**: {true/false}
- **Partial Build**: true (first 2 of {totalVariants} variants)

## Variants Built

| # | Variant Name | Node ID |
|---|--------------|---------|
| 1 | {variantFolderName exactly as it appears on disk, e.g. "Multiple All Closed First Focus"} | {nodeId} |
| 2 | {variantFolderName} | {nodeId} |

## Variants Skipped

| # | Variant Name |
|---|--------------|
| 3 | {skippedVariantName} |
| ... | ... |
```

**CRITICAL**: The "Variant Name" column must exactly match the variant folder name on disk (including spaces).
The verify script uses this name to locate `variants/{name}/screenshot.png` and save `variants/{name}/figma.png`.

### 6. Report back

Return a single message with:
- status: "ok" or "build_failed"
- componentName
- variantCount (number of variants successfully built — max 2)
- totalVariants (total number of variants available)
- setNodeId (the component set node ID, or null if failed)
- figmaResultPath: "{componentDir}/figma-result.md"
```

### What to extract from the subagent response

Parse the subagent's final message for:
- `status`: `"ok"` or `"build_failed"`
- `setNodeId`: for summary
- `variantCount`: for summary table
- `totalVariants`: for summary table

---

## Verify Script (replaces Verify Subagent)

After a successful build, run the verify script directly — no subagent needed:

```bash
source .env  # ensures FIGMA_ACCESS_TOKEN is set
node {skillDir}/scripts/batch-screenshot-and-verify.js \
  --component-dir {componentDir} \
  --file-key {fileKey}
```

This script:
1. Parses `figma-result.md` to extract all variant node IDs
2. Calls Figma REST API `/v1/images/{fileKey}?ids=...` in **ONE batch request** to get all screenshot URLs
3. Downloads all PNGs in parallel (10 concurrent)
4. Runs `compare.js` on each (react screenshot vs figma screenshot)
5. Writes `verification-results.json`

Exit codes: 0 = all pass, 1 = minor diffs, 2 = failures, 3 = fatal error

### What to extract from the script output

Read `{componentDir}/verification-results.json` after the script completes:
- `overallVerdict`: PASS / PARTIAL / FAIL
- `pass`, `minorDiff`, `fail`, `error` counts
- `avgMatchPct`: average match percentage

---

## Error Handling

| Scenario | Action |
|----------|--------|
| `use_figma` probe fails | STOP — report MCP unavailable |
| `batch-preprocess-results.json` missing | STOP — tell user to run `batch-build-1-preprocess.sh` |
| No components with `readyForFigma: true` | STOP — all components failed preprocess |
| Build subagent reports `build_failed` | Skip verify, record failure, continue to next component |
| Verify script exits with code 3 | Record fatal error, continue to next component |
| `FIGMA_ACCESS_TOKEN` missing/expired | Script exits 3 — tell user to update `.env` |
| Component has only 1 variant | Build that 1 variant — no combine needed |
