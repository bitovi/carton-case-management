# Batch Build — Orchestrator (Phases D→E→F→G→H→I)

Execute the 6-pass build/fix/compose cycle. Each pass is a sub-orchestrator prompt that handles its own component iteration.

## Your Role

You are a **pure orchestrator**. You launch 6 sub-orchestrators in sequence, check their completion, and pass context forward. You do NOT build, verify, or fix anything yourself.

## DO NOT

- Do NOT read sub-prompt files. Pass file paths.
- Do NOT build or fix components directly.
- Do NOT skip passes. Even if a pass has nothing to do, let it detect that and report "skipping."
- Do NOT continue past Phase F without human approval.

## Inputs

| Variable | Source | Description |
|----------|--------|-------------|
| `pipelineDir` | `.temp/react-to-figma-dom/` | Root output directory |
| `skillDir` | `.claude/skills/react-to-figma-dom/8-batch-build/` | This phase's directory |
| `fileKey` | env/config | Figma file key |
| `parentFrameId` | Phase 5 output | Figma container frame ID |
| `devServerUrl` | `http://localhost:5173` | Dev server URL for page screenshots |

## Prerequisites

- Phase 5 (Setup Figma File) complete — `figma-variables-map.json`, `figma-icons-map.json` exist
- Phase 7 (Generate Build Scripts) complete — every component has `figma-variants.json`, `build-script.js` per variant
- `{pipelineDir}/page-priority-manifest.json` exists
- `{pipelineDir}/built-components.json` exists (may be empty `{}`)
- Figma MCP connection available
- Dev server running at `{devServerUrl}` (for Phase F page screenshots)

## Pre-flight: Validate Phase 5 Outputs

Before launching any pass, validate that Phase 5 produced real Figma IDs:

```bash
node .claude/skills/react-to-figma-dom/scripts/validate-phase5-outputs.js \
  --pipeline-dir {pipelineDir}
```

If this script exits with code 1, **STOP**. Report: "Phase 5 outputs contain invalid Figma IDs. Re-run Phase 5 before attempting Phase 8." Do NOT proceed to Pass 1.

## Procedure

### Pass 1: Phase D — Build Page Variants

Launch a **subagent** with:
- **Prompt**: `{skillDir}/1-prompt.build-page-variants.md`
- **Context**: pipelineDir, skillDir, fileKey, parentFrameId

#### Gate after Pass 1

Read `{pipelineDir}/built-components.json`. Count entries that have a string value matching the pattern `^\d+:\d+$` (real Figma node IDs). Exclude metadata keys like `phase_e_fix_sweep`.

- If **0 real component entries**: **STOP**. Report: "Phase D produced 0 components. Cannot continue. Check Phase D subagent output for errors."
- If **≥1 real component entries**: Continue to Pass 2.

### Pass 2: Phase E — Fix Sweep (component-level)

Launch a **subagent** with:
- **Prompt**: `{skillDir}/2-prompt.fix-sweep.md`
- **Context**: pipelineDir, skillDir, fileKey

### Pass 3: Phase F — Compose Pages ★ HUMAN CHECKPOINT

Launch a **subagent** with:
- **Prompt**: `{skillDir}/3-prompt.compose-pages.md`
- **Context**: pipelineDir, skillDir, fileKey, devServerUrl

**This pass will pause for human review.** Do not proceed until the human says "continue."

#### Gate after Pass 3

Before presenting the human checkpoint, check: if ALL pages have 0 real component instances (only placeholders), alert the human:
```
⚠️  WARNING: All composed pages contain only placeholder frames.
This likely means Phase D failed to build real components.
Review built-components.json and Phase D output before continuing.
```

### Pass 4: Phase G — Fix Sweep (page-level)

Launch a **subagent** with:
- **Prompt**: `{skillDir}/4-prompt.fix-sweep-pages.md`
- **Context**: pipelineDir, skillDir, fileKey, devServerUrl

### Pass 5: Phase H — Build Remaining Variants

Launch a **subagent** with:
- **Prompt**: `{skillDir}/5-prompt.build-remaining.md`
- **Context**: pipelineDir, skillDir, fileKey, parentFrameId

### Pass 6: Phase I — Fix Sweep (remaining)

Launch a **subagent** with:
- **Prompt**: `{skillDir}/6-prompt.fix-sweep-remaining.md`
- **Context**: pipelineDir, skillDir, fileKey

### Completion

Update `{pipelineDir}/state.json` to mark phase 8 as complete.

Log the final summary from Phase I's output.
