# Fix Sweep (Phase E)

Run a fix sweep over all components that scored FAIL or PARTIAL in Phase D verification. For each failing component, launch a fix subagent, re-build, and re-verify. Maximum 2 iterations per component.

## Inputs

| Variable | Source | Description |
|----------|--------|-------------|
| `pipelineDir` | `.temp/react-to-figma/` | Root output directory |
| `skillDir` | `.claude/skills/react-to-figma-dom/8-batch-build/` | This phase's directory |
| `fileKey` | env/config | Figma file key |

## Procedure

### 1. Aggregate scores

```bash
node {skillDir}/aggregate-scores.js
```

Read the output scoreboard. Identify all components with FAIL or PARTIAL verdicts.

If no components need fixing:
```
Phase E: No components need fixing. All PASS. Skipping.
```

### 2. Fix loop (max 2 iterations per component)

For each FAIL/PARTIAL component:

#### Iteration 1

Launch a **subagent** with:
- **Prompt**: `{skillDir}/prompts/fix-a-component.md`
- **Context**: componentName, componentDir, fileKey, failingVariants (list of variant names that failed)

Tell the subagent: "Read your prompt at `{skillDir}/prompts/fix-a-component.md`. componentName=`{componentName}`, componentDir=`{componentDir}`, fileKey=`{fileKey}`, failingVariants=`{list}`."

After fix, re-verify:
```bash
node {skillDir}/batch-verify.js \
  --component-dir {componentDir} \
  --file-key {fileKey}
```

If now PASS, move to next component.

#### Iteration 2 (if still FAIL/PARTIAL)

Repeat fix + verify once more.

If still failing after 2 iterations, log and move on:
```
{componentName}: Still {verdict} after 2 fix iterations. Moving on.
```

### 3. Log summary

```
Phase E Complete: Fix Sweep
  Components requiring fixes: {count}
  Fixed to PASS: {count}
  Still PARTIAL: {count}
  Still FAIL: {count}
```
