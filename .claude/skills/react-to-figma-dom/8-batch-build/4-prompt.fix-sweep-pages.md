# Fix Sweep — Pages (Phase G)

Analyze page-level verification results. Identify which component issues are visible at page scale. Fix those components, re-compose affected pages, and re-verify.

## Inputs

| Variable | Source | Description |
|----------|--------|-------------|
| `pipelineDir` | `.temp/react-to-figma/` | Root output directory |
| `skillDir` | `.claude/skills/react-to-figma-dom/8-batch-build/` | This phase's directory |
| `fileKey` | env/config | Figma file key |
| `devServerUrl` | `http://localhost:5173` | Dev server for live screenshots |

## Procedure

### 1. Identify page-level issues

Read `{pipelineDir}/pages/*/page-verification.json`. For each FAIL or PARTIAL page:
- Identify which component instances are causing visible issues
- Map back to the source component name

If no pages need fixing:
```
Phase G: All pages PASS. Skipping.
```

### 2. Fix affected components (max 2 iterations)

For each component causing page-level issues:

Launch a fix subagent:
- **Prompt**: `{skillDir}/prompts/fix-a-component.md`
- **Context**: componentName, componentDir, fileKey, failingVariants

Re-verify the component after fix.

### 3. Re-compose affected pages

For each page that contained a fixed component, re-compose:
- **Prompt**: `{skillDir}/prompts/build-a-page-frame.md`

Then re-verify:
- **Prompt**: `{skillDir}/prompts/verify-a-page-frame.md`

### 4. Log summary

```
Phase G Complete: Page-Level Fix Sweep
  Pages requiring fixes: {count}
  Components fixed: {count}
  Pages re-composed: {count}
  Final page scores: PASS={count} PARTIAL={count} FAIL={count}
```
