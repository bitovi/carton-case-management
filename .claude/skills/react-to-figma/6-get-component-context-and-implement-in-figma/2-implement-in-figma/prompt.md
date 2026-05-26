# Implement in Figma (Sub-Orchestrator)

Coordinate building a component in Figma: analyze inputs, build the default variant first, verify it works, then build remaining variants and combine into a component set.

## Your Role

You are a **pure orchestrator**. You do NOT read files or gather context yourself. Your only job is:

1. Launch a subagent with a **prompt file path** and **input file paths**
2. Check the subagent's output file exists
3. Pass output paths forward to the next step

Do NOT read prompt files, input files, screenshots, or JSON maps yourself. Tell each subagent: "Read your prompt at `{path}` and follow its instructions. Your inputs are at `{paths}`." The subagent reads everything it needs.

## Fresh Build — Always Start from Step 1

When this prompt is invoked, it means **build (or rebuild) the component in Figma**. Always start fresh from Step 1. Never skip steps based on existing files.

**Before starting, verify these INPUT files exist** in `{componentDir}`:
- `analysis.md` (required)
- `props.md` (required)
- `figma-variants.md` (required)
- `variants.md` (required)
- `screenshots/` directory with at least one `.png` (required)

If any input is missing, stop and report the error.

**Ignore all existing BUILD OUTPUT files** — they are from a previous run and will be overwritten:
- `build-plan.md` (output of Step 1)
- `default-variant/` (output of Steps 2-3)
- `variant-plans.md` (output of Step 5)
- `figma-result.md` (output of Steps 6/8)
- `verification.md` (output of Steps 3/7)

Do NOT read build outputs to "understand state" or skip steps. Do NOT assume any step is already done.

## DO NOT

- Do NOT read or analyze the component's input files (analysis.md, props.md, variants.md, screenshots, etc.). The subagents handle all file reading and analysis.
- Do NOT read the subagent prompt files (e.g., `1-prompt.analyze.md`). Pass the file path to the subagent and let it read its own instructions.
- Do NOT combine multiple steps into a single subagent call. Each step (analyze, build, verify, fix) is a separate subagent with its own focused prompt and reference files.
- Do NOT skip the verify step. The build → verify → fix loop exists because `use_figma` calls frequently produce visually wrong results that only screenshots reveal.
- Do NOT report success without visual verification. A `use_figma` call returning without error does NOT mean the component looks correct.

## Inputs

These are the values you receive from the parent orchestrator. Use them to construct paths for subagents.

| Variable | Example | Description |
|----------|---------|-------------|
| `componentName` | `Badge` | Component being built |
| `componentDir` | `.temp/react-to-figma/components/Badge/` | All component files live here |
| `pipelineDir` | `.temp/react-to-figma/` | Pipeline-level maps and tokens |
| `skillDir` | `.claude/skills/react-to-figma/6-get-component-context-and-implement-in-figma/2-implement-in-figma/` | This orchestrator's directory (prompt files and reference/) |
| `fileKey` | `K185dncc0RbBmFGFxA1iyY` | Figma file key |
| `parentFrameId` | `3:4` | Figma parent frame to create components in |
| `builtComponents` | `{ "Button": "18:5" }` | Map of already-built component name → node ID |

## Output

- `figma-result.md` — final component/set node ID, all variant IDs, instance manifest
- `verification.md` — final verification verdict

## Procedure

### Step 1: Analyze default variant

Launch a **subagent** (Sonnet) with:
- **Prompt**: `{skillDir}/1-implement-first-variant/1-prompt.analyze.md`
- **Inputs**: `{componentDir}/analysis.md`, `props.md`, `figma-variants.md`, `variants.md`, `screenshots/`, `app-context/` (if exists), `{pipelineDir}/figma-variables-map.json`, `figma-icons-map.json`, `figma-assets-map.json`, `builtComponents`
- **Output**: `{componentDir}/build-plan.md`

Tell the subagent: "Read your prompt at `{promptPath}`. Your component dir is `{componentDir}`. Your pipeline dir is `{pipelineDir}`. builtComponents = `{builtComponents}`."

After the subagent finishes, check that `build-plan.md` exists. If it reports a missing dependency, stop and return the error to the parent orchestrator.

### Step 2: Build default variant

Launch a **subagent** (Opus) with:
- **Prompt**: `{skillDir}/1-implement-first-variant/2-prompt.build.md`
- **Reference dir**: `{skillDir}/reference/`
- **Inputs**: `{componentDir}/build-plan.md`, `fileKey={fileKey}`, `parentFrameId={parentFrameId}`
- **Output**: `{componentDir}/default-variant/figma-result.md`

Tell the subagent: "Read your prompt at `{promptPath}`. Reference files are in `{skillDir}/reference/`. Your component dir is `{componentDir}`. fileKey=`{fileKey}`, parentFrameId=`{parentFrameId}`."

### Step 3: Verify default variant

Launch a **subagent** (Sonnet) with:
- **Prompt**: `{skillDir}/1-implement-first-variant/3-prompt.verify.md`
- **Inputs**: `{componentDir}/default-variant/figma-result.md`, default variant screenshot from `{componentDir}/screenshots/`, `{componentDir}/analysis.md`, `builtComponents`, `fileKey={fileKey}`
- **Output**: `{componentDir}/default-variant/verification.md`

Tell the subagent: "Read your prompt at `{promptPath}`. Your component dir is `{componentDir}`. fileKey=`{fileKey}`. builtComponents=`{builtComponents}`."

After the subagent finishes, read `default-variant/verification.md` verdict. If **PARTIAL** or **FAIL**, enter fix loop:

```
for iteration in 1..3:
  1. Launch subagent (Opus) with:
     - Prompt: {skillDir}/1-implement-first-variant/4-prompt.fix.md
     - Reference dir: {skillDir}/reference/
     - Inputs: default-variant/verification.md, default-variant/figma-result.md, fileKey
  2. Re-run Step 3 (verify)
  3. If PASS → break
```

### Step 4: Check for additional variants

Read `{componentDir}/build-plan.md` — this is the ONE file the orchestrator reads. Check `allCombos`. If there is only one combo (the default), this is a single component — skip to Step 8.

### Step 5: Analyze remaining variants

Launch a **subagent** (Sonnet) with:
- **Prompt**: `{skillDir}/2-implement-remaining-variants/1-prompt.analyze.md`
- **Inputs**: `{componentDir}/build-plan.md`, `default-variant/figma-result.md`, `figma-variants.md`, `variants.md`, `screenshots/`, `{pipelineDir}/figma-variables-map.json`
- **Output**: `{componentDir}/variant-plans.md`

Tell the subagent: "Read your prompt at `{promptPath}`. Your component dir is `{componentDir}`. Your pipeline dir is `{pipelineDir}`."

### Step 6: Build remaining variants and combine

Launch a **subagent** (Opus) with:
- **Prompt**: `{skillDir}/2-implement-remaining-variants/2-prompt.build-and-combine.md`
- **Reference dir**: `{skillDir}/reference/`
- **Inputs**: `{componentDir}/build-plan.md`, `variant-plans.md`, `default-variant/figma-result.md`, `fileKey={fileKey}`, `parentFrameId={parentFrameId}`
- **Output**: `{componentDir}/figma-result.md`

Tell the subagent: "Read your prompt at `{promptPath}`. Reference files are in `{skillDir}/reference/`. Your component dir is `{componentDir}`. fileKey=`{fileKey}`, parentFrameId=`{parentFrameId}`."

The subagent handles both combining variants AND wiring component properties (BOOLEAN, INSTANCE_SWAP, TEXT) if the build plan includes a "Component Properties" section. Component properties are wired after `combineAsVariants()` — they cannot be added before combining.

### Step 7: Verify and fix all variants

Launch a **subagent** (Opus) with:
- **Prompt**: `{skillDir}/2-implement-remaining-variants/3-prompt.verify-and-fix.md`
- **Inputs**: `{componentDir}/figma-result.md`, all screenshots from `{componentDir}/screenshots/`, `{componentDir}/analysis.md`, `builtComponents`, `fileKey={fileKey}`
- **Output**: `{componentDir}/verification.md`

Tell the subagent: "Read your prompt at `{promptPath}`. Your component dir is `{componentDir}`. fileKey=`{fileKey}`. builtComponents=`{builtComponents}`."

After the subagent finishes, **validate output artifacts exist** before reading the verdict:

```bash
# Must exist — if not, the subagent fabricated results
ls {componentDir}/figma-variants/*.png
ls {componentDir}/diffs/*/comparison.json
cat {componentDir}/verification-results.json | head -5
```

If `figma-variants/` is empty, `diffs/` has no `comparison.json` files, or `verification-results.json` doesn't exist, the verification was NOT actually performed. Re-run Step 7 with an explicit note: "Previous run did not produce required artifacts. You MUST use get_screenshot to capture Figma PNGs, write verify-manifest.json, and run verify-variants.js. Do not write verification.md without real diff data."

If artifacts exist, read `verification.md` verdict. If **PARTIAL** or **FAIL**, re-run this step up to 2 more times.

### Step 8: Finalize

Ensure final `figma-result.md` and `verification.md` are written to `{componentDir}/`.

Return to parent orchestrator with:
- Component name
- Final verdict (PASS / PARTIAL / FAIL)
- Node ID (component or component set)

## Single Component Shortcut

If `figma-variants.md` has no variant axes (or only one combo):

```
Step 1 (analyze) → Step 2 (build) → Step 3 (verify) → [Step fix loop] → Step 8 (finalize)
```

Skip Steps 4–7 entirely. The default variant IS the final component — no combining needed. Write `figma-result.md` directly from `default-variant/figma-result.md`.
