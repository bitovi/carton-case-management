# Flat Orchestrator — Only Child Subagents

Orchestrate the full react-to-figma-dom pipeline using ONLY direct child subagents. No grandchild subagents — every subagent call is a leaf that reads its own prompt, does its work, and returns `PASS` or `FAIL: <reason>`.

## Context Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `sourceRoot` | `packages/client/src` | React source root |
| `storybookUrl` | `http://localhost:6006` | Storybook URL (required for Phase C) |
| `devServerUrl` | `http://localhost:5173` | Dev server URL (required for Phase G page screenshots) |
| `figmaFileKey` | _(ask user)_ | Target Figma file key (required for Phases E-G) |
| `pipelineDir` | `.temp/react-to-figma/` | Root output directory |
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
    → Skip to Stage 3 (Execute the checklist)
    → Read figmaFileKey from the checklist header ("Figma file key: ...")
```

If not, start from Stage 1.

---

## Todo Tracking

Use the **todo list tool** (`manage_todo_list`) throughout this prompt to give the user visibility into progress:

- **Stages 1 & 2**: Create a todo list with one item per step (1.1 through 1.6, plus "Generate checklist"). Mark each in-progress before starting, completed immediately after.
- **Stage 3**: Once the checklist is generated, replace the todo list with one item per checklist line (B.1, B.2, ..., F.1, F.2, F.3, ..., G.1, G.2, etc.). Mark each in-progress before calling the subagent, completed (or failed) immediately after.

Update the todo list **before and after every subagent call** — never batch updates.

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

### Step 1.6: Generate pages manifest

Only run if `{pipelineDir}/component-hierarchy/pages.json` exists.

```
Read and execute the prompt at {skillDir}/1-find-hierarchy/6-prompt.generate-pages-manifest.md

Arguments:
  pagesJsonPath = {pipelineDir}/component-hierarchy/pages.json
  componentAnalysesDir = {pipelineDir}/components/
  output = {pipelineDir}/component-hierarchy/pages.md

When complete, respond with ONLY: PASS or FAIL: <one-line reason>
```

---

## Stage 2: Generate the Checklist

Read these files to determine components and pages:

1. `{pipelineDir}/component-hierarchy/build-order.md` — parse components in topological order (Level 0 first = leaves)
2. `{pipelineDir}/component-hierarchy/pages.md` or `pages.json` — parse routes

Build a flat ordered list of every component name (leaves first) and every route.

Write `{pipelineDir}/checklist.md` with this exact format:

```markdown
# Pipeline Checklist
Generated: {ISO timestamp}
Skill dir: {skillDir}
Pipeline dir: {pipelineDir}
Source root: {sourceRoot}
Storybook URL: {storybookUrl}
Dev server URL: {devServerUrl}
Figma file key: {figmaFileKey}

Components (build-order): {comma-separated list, leaves first}
Pages: {comma-separated route list}

## Phase B: Tokens, Assets, Patterns
- [ ] B.1 | 2-extract-design-tokens/prompt.md |
- [ ] B.2 | 3-extract-assets/prompt.md |
- [ ] B.3 | 4-discover-story-patterns/prompt.md |

## Phase C.1: Identify Variants [PARALLEL]
{For each component in build-order, emit 1 line:}
- [ ] C.1.{n} | 6-capture-dom-from-stories/1-prompt.identify-variants-for-a-component.md | componentName={Name}

## Phase C.2: Generate Stories [PARALLEL]
{For each component in build-order, emit 1 line:}
- [ ] C.2.{n} | 6-capture-dom-from-stories/2-prompt.generate-stories-for-a-component.md | componentName={Name}

## Phase C.3: Capture DOM [PARALLEL]
{For each component in build-order, emit 1 line:}
- [ ] C.3.{n} | 6-capture-dom-from-stories/3-prompt.capture-dom-for-a-component.md | componentName={Name}

## Phase D: Build Scripts (per component, build-order)
{For each component in build-order, emit 2 lines:}
- [ ] D.{n}   | 7-generate-build-scripts/1-prompt.diff-and-classify-for-a-component.md | componentName={Name}
- [ ] D.{n+1} | 7-generate-build-scripts/2-prompt.preprocess-for-a-component.md | componentName={Name}
{After all components, emit 1 line:}
- [ ] D.{n+2} | 7-generate-build-scripts/3-prompt.prioritize-page-variants.md |

## Phase E: Figma Setup
- [ ] E.1 | 5-setup-figma-file/prompt.md | figmaFileKey={figmaFileKey}

## Phase F: Build, Verify & Fix Components (build-order, leaves first)
{For each component in build-order, emit 3 lines:}
- [ ] F.{n}   | 8-batch-build/prompts/build-a-component.md  | componentName={Name}, figmaFileKey={figmaFileKey}
- [ ] F.{n+1} | 8-batch-build/prompts/verify-a-component.md | componentName={Name}, figmaFileKey={figmaFileKey}
- [ ] F.{n+2} | 8-batch-build/prompts/fix-a-component.md    | componentName={Name}, figmaFileKey={figmaFileKey}

## Phase G: Compose & Verify Pages
{For each route, emit 2 lines:}
- [ ] G.{n}   | 8-batch-build/prompts/build-a-page-frame.md  | route={route}, figmaFileKey={figmaFileKey}
- [ ] G.{n+1} | 8-batch-build/prompts/verify-a-page-frame.md | route={route}, figmaFileKey={figmaFileKey}

## ★ HUMAN CHECKPOINT — Review pages in Figma before continuing
```

Report to the user:
```
Checklist generated: {pipelineDir}/checklist.md
  {B_count} token/asset/pattern steps
  {C_count} DOM capture steps ({component_count} components × 3 waves)
    C.1: {component_count} identify-variant items [PARALLEL]
    C.2: {component_count} generate-stories items [PARALLEL]
    C.3: {component_count} capture-dom items [PARALLEL]
  {D_count} build script steps ({component_count} components × 2 + 1)
  {E_count} Figma setup step
  {F_count} build/verify/fix steps ({component_count} components × 3)
  {G_count} page compose steps ({page_count} pages × 2)
  Total: {total} checklist items
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

#### Step 5: Parallel batch execution

When a section header contains `[PARALLEL]`:

1. Collect ALL `- [ ]` lines in that section
2. If none remain (all are `[x]` or `[!]`) → skip to the next section
3. Launch ALL collected items as **parallel subagents simultaneously** — one `runSubagent` call per item, all in the same tool-call block
4. As results return, update each line in `checklist.md`:
   - `PASS` → change `- [ ]` to `- [x]`, log `✓`
   - `FAIL` → change `- [ ]` to `- [!]`, log `✗`
5. After ALL subagents in the batch complete, report the batch summary:
   ```
   Parallel batch {section_id} complete: {pass_count} passed, {fail_count} failed
   ```
6. If any failed, ask the user: "Batch had {fail_count} failures. Continue to next phase, retry failed items, or stop?"
   - **Continue**: proceed to next section
   - **Retry**: reset `- [!]` back to `- [ ]` for failed items, re-run step 5 for this section
   - **Stop**: halt execution
7. Proceed to the next section (go to step 1)

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
2. **Parallel `[PARALLEL]` phases, sequential otherwise.** When a section header contains `[PARALLEL]`, launch ALL items in that section as simultaneous subagent calls. All other phases execute one subagent at a time.
3. **Always update checklist.md after each step (or batch).** This is the checkpoint mechanism. If the conversation ends, re-running this prompt will resume from where it left off.
4. **The fix prompt is self-gating.** `fix-a-component` checks `verification-results.json` and returns PASS immediately if all variants already pass. No wasted work.
5. **Build-order is critical for Phases D–G.** Components are listed leaves-first so parent components can reference child Figma node IDs. Phases C.1/C.2/C.3 are safe to parallelize because they have no cross-component dependencies within the same step.
6. **Storybook settle pause.** After Phase C.2 (Generate Stories) completes, wait 5 seconds before starting Phase C.3 (Capture DOM) to let Storybook finish hot-reloading all new story files.
