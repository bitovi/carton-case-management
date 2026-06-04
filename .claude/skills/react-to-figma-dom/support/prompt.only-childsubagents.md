# Flat Orchestrator — Only Child Subagents

Orchestrate the full react-to-figma-dom pipeline using ONLY direct child subagents. No grandchild subagents — every subagent call is a leaf that reads its own prompt, does its work, and returns `PASS` or `FAIL: <reason>`.

## Context Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `sourceRoot` | `packages/client/src` | React source root |
| `storybookUrl` | `http://localhost:6006` | Storybook URL (required for Phase C) |
| `devServerUrl` | `http://localhost:5173` | Dev server URL (required for Phase G page screenshots) |
| `figmaFileKey` | _(ask user)_ | Target Figma file key (required for Phases E-G) |
| `pipelineDir` | `.temp/react-to-figma-dom/` | Root output directory |
| `skillDir` | `.claude/skills/react-to-figma-dom/` | This skill's directory |

## Figma File Key

`figmaFileKey` is NOT stored in `.env` or config. The orchestrator must resolve it before generating the checklist:

1. If the user provided it as input → use it
2. Otherwise → ask the user: "What is the Figma file key? (from the URL: figma.com/design/**{fileKey}**/...)"

The file key is only needed by Phases E, F, and G (Figma-writing phases). Phases B, C, and D are local work and don't need it.

## Resume Check

Before doing anything, check if `{pipelineDir}/checklist.md` already exists:

```
if file exists "{pipelineDir}/checklist.md"
  AND it contains at least one "- [x]" line:
    → Run checklist reconciliation (see below)
    → Skip to Stage 3 (Execute the checklist)
    → Read figmaFileKey from the checklist header ("Figma file key: ...")
```

If not, start from Stage 1.

### Checklist Reconciliation

When resuming from an existing checklist, run the reconciliation script to sync disk state before executing:

```bash
node {skillDir}/scripts/reconcile-checklist.js \
  --pipeline-dir {pipelineDir} \
  --checklist {pipelineDir}/checklist.md
```

This scans actual output files on disk and flips `- [ ]` → `- [x]` for items whose output already exists (e.g., from a prior partial run). It is additive only — never unchecks `[x]` items. Review the summary output before proceeding.

### Pre-flight Checks

Before starting each Figma-writing phase (E, F, G), run the pre-flight check:

```bash
node {skillDir}/scripts/preflight-check.js \
  --phase <E|F|G> \
  --pipeline-dir {pipelineDir} \
  --skill-dir {skillDir}
```

If the pre-flight check exits with code 1, **STOP** and report the errors to the user. Do not proceed with the phase until all errors are resolved.

---

## Todo Tracking

Use the **todo list tool** (`manage_todo_list`) throughout this prompt to give the user visibility into progress:

- **Stages 1 & 2**: Create a todo list with one item per step (1.1 through 1.6, plus "Generate checklist"). Mark each in-progress before starting, completed immediately after.
- **Stage 3 — sequential phases**: Create one todo item per checklist line (B.1, B.2, B.3, D.1, D.2, etc.). Mark in-progress before the subagent call, completed or failed after.
- **Stage 3 — `[PARALLEL]` phases**: When starting a parallel section, create a new todo list with one item per batch of 4 (e.g., "C.1 batch 1/{totalBatches}", "C.1 batch 2/{totalBatches}", ...). Compute `totalBatches = ceil(itemCount / 4)`. Mark each batch in-progress before launching its 4 subagents, completed or failed after all 4 return. When the section finishes, replace the todo list with the next section's items.

Update the todo list **before and after every subagent call or batch**.

---

## Stage 1: Bootstrap Discovery

Run these steps to discover all components and pages. These are hardcoded (not from the checklist) because we need their output to generate the checklist.

Each step is a direct `runSubagent` call. Do NOT read the prompt file yourself — tell the subagent which prompt to read.

### Step 1.1: Discover components from files

This MUST run first — Step 1.2 depends on its output.

```
Read and execute the prompt at {skillDir}/1-find-hierarchy/1-from-files/1-prompt.discover-components.md

Arguments:
  sourceRoot = {sourceRoot}
  outputDirectory = {pipelineDir}
  outputSubdir = component-hierarchy/from-files/

When complete, respond with ONLY: PASS or FAIL: <one-line reason>
```

### Step 1.2: Discover components from app

Requires Step 1.1 output (uses the from-files barrel map and component list).

```
Read and execute the prompt at {skillDir}/1-find-hierarchy/2-from-app/1-prompt.discover-components.md

Arguments:
  devServerUrl = {devServerUrl}
  sourceRoot = {sourceRoot}
  outputDirectory = {pipelineDir}
  outputSubdir = component-hierarchy/from-app/

When complete, respond with ONLY: PASS or FAIL: <one-line reason>
```

### Step 1.3: Reconcile and filter

```
Read and execute the prompt at {skillDir}/1-find-hierarchy/3-prompt.merge-file-and-app-discoveries.md

Arguments:
  sourceRoot = {sourceRoot}
  fromFilesOutput = {pipelineDir}/component-hierarchy/from-files/components.json
  fromAppOutput = {pipelineDir}/component-hierarchy/from-app/components.json
  componentMapJson = {pipelineDir}/component-hierarchy/component-map.json
  outputDirectory = {pipelineDir}/component-hierarchy/
  skillDir = {skillDir}

When complete, respond with ONLY: PASS or FAIL: <one-line reason>
```

Verify: `{pipelineDir}/component-hierarchy/components-todo.md` exists and has at least one component.

### Step 1.4: Extract children graph (fast static analysis)

Run the `extract-children.js` script to build the parent-child dependency graph. This replaces the previous per-component subagent loop (~1 second vs ~50 minutes for 100 components).

```
Read and execute the prompt at {skillDir}/1-find-hierarchy/4a-prompt.extract-children-graph.md

Arguments:
  componentsTodo = {pipelineDir}/component-hierarchy/components-todo.md
  outputDirectory = {pipelineDir}
  sourceRoot = {sourceRoot}
  skillDir = {skillDir}

When complete, respond with ONLY: PASS or FAIL: <one-line reason>
```

Verify: `{pipelineDir}/component-hierarchy/children-graph.json` exists.

Note: Props extraction is deferred to Phase C (step 6.1 — identify-variants). That prompt generates `props.md` on-the-fly when it reads the source file for variant classification.

### Step 1.5: Generate build order

```
Read and execute the prompt at {skillDir}/1-find-hierarchy/5-prompt.generate-build-order.md

Arguments:
  childrenGraph = {pipelineDir}/component-hierarchy/children-graph.json
  componentAnalyses = {pipelineDir}/components/*/analysis.md
  barrelMapPath = {pipelineDir}/component-hierarchy/barrel-map.md
  outputDirectory = {pipelineDir}/component-hierarchy/

When complete, respond with ONLY: PASS or FAIL: <one-line reason>
```

---

## Stage 2: Generate the Checklist

Delegate checklist generation to a subagent:

```
Read and execute the prompt at {skillDir}/support/prompt.generate-checklist.md

Arguments:
  pipelineDir = {pipelineDir}
  skillDir = {skillDir}
  sourceRoot = {sourceRoot}
  storybookUrl = {storybookUrl}
  devServerUrl = {devServerUrl}
  figmaFileKey = {figmaFileKey}

When complete, respond with ONLY: PASS or FAIL: <one-line reason>
```

---

## Stage 3: Execute the Checklist

Read `{pipelineDir}/checklist.md`. Parse the header to extract context variables (skill dir, pipeline dir, source root, storybook URL, dev server URL, figma file key).

### Execution loop

1. Read `{pipelineDir}/checklist.md`
2. Find the next unchecked section or line:
   - If the section header contains `[PARALLEL]` → go to step 5 (parallel batch)
   - If the line is a single `- [ ]` item → go to step 6 (sequential single)
3. If no unchecked lines remain → report summary and stop
4. If the line contains `★ HUMAN CHECKPOINT` → stop and ask the user to review the Figma file
4b. **Phase boundary pre-flight**: When entering a new phase section (E, F, or G), run the pre-flight check BEFORE executing any items in that phase:
    ```bash
    node {skillDir}/scripts/preflight-check.js --phase <E|F|G> --pipeline-dir {pipelineDir} --skill-dir {skillDir}
    ```
    If exit code is 1, STOP and report the errors. Do not proceed until the user resolves them.
4c. **Phase boundary post-flight**: When ALL items in a phase section (D, E, or F) are complete, run the post-flight check BEFORE moving to the next phase:
    ```bash
    node {skillDir}/scripts/postflight-check.js --phase <D|E|F> --pipeline-dir {pipelineDir} --skill-dir {skillDir}
    ```
    If exit code is 1, STOP and report the errors. The phase produced incomplete or invalid outputs that must be fixed before continuing.

#### Step 5: Parallel batch execution

When a section header contains `[PARALLEL]`:

1. Collect ALL `- [ ]` lines in that section
2. If none remain (all are `[x]` or `[!]`) → skip to the next section
3. Split the collected items into **batches of 4**. For each batch:
   a. Launch all items in the batch as parallel subagents — one `runSubagent` call per item, all in the same tool-call block
   b. When the batch completes, update each line in `checklist.md`:
      - `PASS` → change `- [ ]` to `- [x]`
      - `FAIL` → change `- [ ]` to `- [!]`
   c. Update the batch's todo item to completed (or failed)
   d. Proceed to the next batch
4. After ALL batches in the section complete, report the section summary:
   ```
   Section {section_id} complete: {pass_count} passed, {fail_count} failed ({batch_count} batches)
   ```
5. If any failed, ask the user: "Section had {fail_count} failures. Continue to next phase, retry failed items, or stop?"
   - **Continue**: proceed to next section
   - **Retry**: reset `- [!]` back to `- [ ]` for failed items, re-run step 5 for this section
   - **Stop**: halt execution
6. Proceed to the next section (go to step 1)

**Storybook settle pause**: After completing a `[PARALLEL]` section for story generation (Phase C.2), wait 5 seconds for Storybook's hot-reload to process all new story files before starting Phase C.3.

#### Step 6: Sequential single execution

For non-parallel items:

1. Parse the line: extract the prompt path (column 2) and arguments (column 3)
2. Call `runSubagent` with this prompt:

```
Read and execute the prompt at {skillDir}/{promptPath}.

Arguments:
  {parsed arguments, e.g. componentName=Badge}
  pipelineDir = {pipelineDir}
  sourceRoot = {sourceRoot}
  storybookUrl = {storybookUrl}
  devServerUrl = {devServerUrl}
  figmaFileKey = {figmaFileKey}
  skillDir = {skillDir}

IMPORTANT: When complete, respond with ONLY one of:
  PASS
  FAIL: <one-line reason>
Do not include any other output.
```

3. Parse the subagent's response:
   - If response starts with `PASS`:
     - Update the line in `checklist.md`: change `- [ ]` to `- [x]`
     - Log: `✓ {step_id} {prompt_path} — PASS`
     - Continue to next unchecked line (go to step 1)
   - If response starts with `FAIL`:
     - Update the line in `checklist.md`: change `- [ ]` to `- [!]`
     - Log: `✗ {step_id} {prompt_path} — {failure_reason}`
     - Ask the user: "Step {step_id} failed: {failure_reason}. Continue to next step, retry this step, or stop?"
       - **Continue**: go to step 1 (finds next `- [ ]` line)
       - **Retry**: change `- [!]` back to `- [ ]`, go to step 1
       - **Stop**: halt execution
   - If response is unclear (neither PASS nor FAIL):
     - Treat as FAIL with reason "Subagent returned unclear response"

### Completion report

When all lines are checked (no `- [ ]` remaining), report:

```
Pipeline complete.
  ✓ {pass_count} passed
  ✗ {fail_count} failed
  ⏭ {skip_count} skipped

Failed steps:
  {list of - [!] lines, if any}
```

---

## Rules

1. **Never read a prompt file yourself.** Always tell the subagent which file to read. This keeps orchestrator context small.
2. **Parallel `[PARALLEL]` phases, sequential otherwise.** When a section header contains `[PARALLEL]`, launch items in batches of 4 as described in Step 5. All other phases execute one subagent at a time.
3. **Always update checklist.md after each step (or batch).** This is the checkpoint mechanism. If the conversation ends, re-running this prompt will resume from where it left off.
4. **The fix prompt is self-gating.** `fix-a-component` checks `verification-results.json` and returns PASS immediately if all variants already pass. No wasted work.
5. **Build-order is critical for Phases D–G.** Components are listed leaves-first so parent components can reference child Figma node IDs. Phases C.1/C.2/C.3 are safe to parallelize because they have no cross-component dependencies within the same step.
6. **Storybook settle pause.** After Phase C.2 (Generate Stories) completes, wait 5 seconds before starting Phase C.3 (Capture DOM) to let Storybook finish hot-reloading all new story files.
7. **Never ask about batch size or parallelism strategy.** Always use the batch size of 4 defined in Step 5. Do not offer alternatives like "focus on leaf components first" or "process a subset." Execute every item in the section without asking.
