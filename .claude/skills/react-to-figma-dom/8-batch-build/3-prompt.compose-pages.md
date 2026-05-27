# Compose Pages (Phase F) ★ HUMAN CHECKPOINT

Build page frames from `pages.json`, instancing built components with resolved props. Verify page frames against live app screenshots. After completion, pause for human review.

## Inputs

| Variable | Source | Description |
|----------|--------|-------------|
| `pipelineDir` | `.temp/react-to-figma/` | Root output directory |
| `skillDir` | `.claude/skills/react-to-figma-dom/8-batch-build/` | This phase's directory |
| `fileKey` | env/config | Figma file key |
| `devServerUrl` | `http://localhost:5173` | Dev server for live screenshots |

Required files:
- `{pipelineDir}/component-hierarchy/pages.json` — from Phase 1
- `{pipelineDir}/built-components.json` — from Phase D
- `{pipelineDir}/figma-variables-map.json` — from Phase 5
- `{pipelineDir}/design-tokens.json` — from Phase 2

## Procedure

### 1. Load page definitions

Read `{pipelineDir}/component-hierarchy/pages.json`. Each route entry describes the component tree and props for that page.

### 2. Build each page frame

For each route:

Launch a **subagent** with:
- **Prompt**: `{skillDir}/prompts/build-a-page-frame.md`
- **Context**: route, page tree, built-components map, figma-variables-map, design-tokens, fileKey
- **Output**: `{pipelineDir}/pages/{routeSlug}/page-figma-result.json`

Tell the subagent: "Read your prompt at `{skillDir}/prompts/build-a-page-frame.md`. Route is `{route}`, pipelineDir is `{pipelineDir}`, fileKey is `{fileKey}`."

### 3. Verify each page frame

For each built page frame:

Launch a **subagent** with:
- **Prompt**: `{skillDir}/prompts/verify-a-page-frame.md`
- **Context**: route, page-figma-result, devServerUrl, fileKey
- **Output**: `{pipelineDir}/pages/{routeSlug}/page-verification.json`

### 4. ★ HUMAN CHECKPOINT

Present the results to the human for review:

```
═══════════════════════════════════════════════════
★ HUMAN CHECKPOINT — Page Composition Complete
═══════════════════════════════════════════════════

Pages composed: {count}
  PASS: {count}  PARTIAL: {count}  FAIL: {count}

Please review the composed pages in Figma:
  File: https://www.figma.com/file/{fileKey}
  Page: "Screens"

When ready to continue, say "continue" to proceed
with Phase G (page-level fixes) and Phase H
(remaining variants).
═══════════════════════════════════════════════════
```

**STOP HERE**. Wait for the human to respond before continuing.
