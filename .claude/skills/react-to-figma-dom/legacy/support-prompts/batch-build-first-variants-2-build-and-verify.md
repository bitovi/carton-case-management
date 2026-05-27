# Batch Build and Verify (First 2 Variants Only)

**Begin your response by outputting the heading above verbatim.**

Orchestrate building the **first 2 variants** of every preprocessed component in Figma and verifying the results. This is a fast-feedback version — it builds only 2 variants per component to quickly validate the pipeline without waiting for all variants. Spawns **one build subagent per component**, tracks progress via a todo list, and aggregates results into a scoreboard.

## CRITICAL — ONE COMPONENT PER SUBAGENT

- Each `runSubagent` call must build **exactly ONE component**. Never batch multiple components into a single subagent.
- The orchestrator loop processes components sequentially: spawn build subagent → run verify script → record result → move to next component.
- Do NOT try to parallelize subagents, batch components together, or "optimize" by combining multiple components into fewer subagent calls.

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

### 0. Probe Figma MCP + clean slate + ensure Components container

Run this as your very first `use_figma` call. It probes MCP availability, **deletes all existing children** of the Components container (so individual subagents don't need to clean up), and ensures the container frame exists with correct layout.

```javascript
// Probe + clean slate + ensure container frame
const componentsPage = figma.root.children.find(p => p.name === 'Components');
if (!componentsPage) {
  return { error: 'FATAL: No page named "Components" found. Create it first.' };
}
await figma.setCurrentPageAsync(componentsPage);

// Find or create the Components container frame
const existingFrames = componentsPage.children.filter(n => n.type === 'FRAME' && n.name === 'Components');
let containerFrame = null;
for (const frame of existingFrames) {
  if (!containerFrame) {
    containerFrame = frame;
  } else {
    frame.remove();
  }
}
if (!containerFrame) {
  containerFrame = figma.createFrame();
  containerFrame.name = 'Components';
  componentsPage.appendChild(containerFrame);
}

// Delete ALL children — clean slate for the batch
const removed = containerFrame.children.length;
for (const child of [...containerFrame.children]) {
  child.remove();
}

// Also remove any loose components/component sets on the page outside the container
let looseRemoved = 0;
for (const child of [...componentsPage.children]) {
  if (child === containerFrame) continue;
  if (child.type === 'COMPONENT' || child.type === 'COMPONENT_SET') {
    child.remove();
    looseRemoved++;
  }
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
return { ok: true, removedFromContainer: removed, looseRemoved: looseRemoved };
```

If this fails, STOP.

### 1. Read batch-preprocess-results.json and create todo list

Read `.temp/react-to-figma/batch-preprocess-results.json`. Extract all components where `readyForFigma === true`.

If the file doesn't exist, stop and tell the user to run `batch-build-1-preprocess.sh` first.

Create a todo list with one item per component (e.g., `Build & Verify: Badge (2 of N)`, `Build & Verify: Button (2 of N)`, ...) plus a final `Run scoreboard` item. All items start as `not-started`.

Print the list of components you will process, their total variant counts, and note that only the **first 2** variants of each will be built.

### 2. For each component: spawn Build subagent, then verify via script

Process components **one at a time — one `runSubagent` call per component**. Do NOT batch multiple components into a single subagent. For each component:

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

Spawn with `runSubagent`. The subagent's instructions live in a separate file — you pass only the arguments.

### Subagent prompt template

```
Read the file `.claude/skills/react-to-figma-dom/support-prompts/build-component-subagent.md` and follow its instructions exactly.

componentName: {componentName}
componentDir: {componentDir}
fileKey: {fileKey}
maxVariants: 2
```

That's the entire prompt. Do not add context, explanations, or extra instructions.

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
