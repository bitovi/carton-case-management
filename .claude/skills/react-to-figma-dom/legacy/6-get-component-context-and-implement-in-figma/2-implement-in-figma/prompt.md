# Implement in Figma — DOM Pipeline (Sub-Orchestrator)

Coordinate building a component in Figma using the deterministic DOM-to-Figma pipeline. Scripts generate `use_figma` code from captured DOM data. Build ALL variants at once, then verify and fix.

## Your Role

You are a **pure orchestrator**. You do NOT read files or gather context yourself. Your only job is:

1. Launch a subagent with a **prompt file path** and **input variables**
2. Check the subagent's output files exist
3. Pass output paths forward to the next step

Do NOT read prompt files, input files, screenshots, or JSON maps yourself. Tell each subagent: "Read your prompt at `{path}` and follow its instructions." The subagent reads everything it needs.

## Fresh Build — Always Start from Step 1

When this prompt is invoked, it means **build (or rebuild) the component in Figma**. Always start fresh from Step 1. Never skip steps based on existing files.

**Before starting, verify these INPUT files exist** in `{componentDir}`:
- `figma-variants.md` (required)
- `variants/` directory with per-variant subfolders containing `dom.json` and `screenshot.png` (required)

If any input is missing, stop and report the error.

## DO NOT

- Do NOT read or analyze the component's input files. The subagents handle all file reading and analysis.
- Do NOT read the subagent prompt files. Pass the file path and let the subagent read its own instructions.
- Do NOT combine multiple steps into a single subagent call.
- Do NOT skip the verify step. A `use_figma` call returning without error does NOT mean the component looks correct.
- Do NOT report success without visual verification.

## Inputs

| Variable | Example | Description |
|----------|---------|-------------|
| `componentName` | `Badge` | Component being built |
| `componentDir` | `.temp/react-to-figma/components/Badge/` | All component files live here |
| `pipelineDir` | `.temp/react-to-figma/` | Pipeline-level maps and tokens |
| `skillDir` | `.claude/skills/react-to-figma-dom/6-get-component-context-and-implement-in-figma/2-implement-in-figma/` | This orchestrator's directory |
| `fileKey` | `K185dncc0RbBmFGFxA1iyY` | Figma file key |
| `parentFrameId` | `3:4` | Figma parent frame to create components in |
| `builtComponents` | `{ "Button": "18:5" }` | Map of already-built component name → node ID |

## Output

- `figma-result.md` — final component/set node ID, all variant IDs
- `verification-results.json` — final verification verdict (JSON, script-generated)

## Procedure

### Step 1: Build all variants

Launch a **subagent** with:
- **Prompt**: `{skillDir}/1-prompt.build-all.md`
- **Reference dir**: `{skillDir}/reference/`
- **Inputs**: `componentName`, `componentDir`, `pipelineDir`, `skillDir`, `fileKey`, `parentFrameId`, `builtComponents`
- **Output**: `{componentDir}/figma-result.md`

Tell the subagent: "Read your prompt at `{promptPath}`. Reference files are in `{skillDir}/reference/`. componentName=`{componentName}`, componentDir=`{componentDir}`, pipelineDir=`{pipelineDir}`, skillDir=`{skillDir}`, fileKey=`{fileKey}`, parentFrameId=`{parentFrameId}`, builtComponents=`{builtComponents}`."

After the subagent finishes, check that `figma-result.md` exists. If it reports a missing dependency or an error (including `use_figma unavailable`), stop and return the error to the parent orchestrator.

### Step 2: Verify all variants

Launch a **subagent** with:
- **Prompt**: `{skillDir}/2-prompt.verify.md`
- **Inputs**: `componentName`, `componentDir`, `skillDir`, `fileKey`
- **Output**: `{componentDir}/verification-results.json`, per-variant `composite.png` files

Tell the subagent: "Read your prompt at `{promptPath}`. componentName=`{componentName}`, componentDir=`{componentDir}`, skillDir=`{skillDir}`, fileKey=`{fileKey}`."

After the subagent finishes, read `{componentDir}/verification-results.json`. Validate it is script-generated (must contain `variantCount`, `pass`, `fail`, `error` fields as integers, and each variant result must have a `matchPct` field). If the file has `"message": "Component created successfully"` instead of `matchPct`, it was hand-written — delete it and re-run this step.

Check `overallVerdict`:
- **PASS** → skip to Step 4
- **PARTIAL** or **FAIL** → proceed to Step 3

### Step 3: Fix (if needed)

If verdict is **PARTIAL** or **FAIL**:

1. Identify failing variants from `verification-results.json` (any variant with `status: "fail"` or `status: "minor_diff"`)
2. Enter fix loop:

```
for iteration in 1..3:
  1. Launch subagent with:
     - Prompt: {skillDir}/3-prompt.fix.md
     - Reference dir: {skillDir}/reference/
     - Inputs: componentDir, fileKey, failingVariants (array of variant names)
     - Tell subagent which variants failed and where their diff artifacts are:
       "For each failing variant, VIEW the composite.png, READ comparison.json,
        build-script.js, and dom.json in {componentDir}/variants/{VariantName}/"
  2. Re-run Step 2 (launch verify subagent again with same inputs)
  3. If PASS → break
```

### Step 4: Finalize

Ensure final `figma-result.md` and `verification-results.json` are in `{componentDir}/`.

Return to parent orchestrator with:
- Component name
- Final verdict (PASS / PARTIAL / FAIL) — from `verification-results.json`'s `overallVerdict`
- Node ID (component or component set)
