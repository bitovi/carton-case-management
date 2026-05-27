# Fix Sweep — Remaining Variants (Phase I)

Final fix sweep over all components. Aggregate scores across all variants (page + remaining), fix FAIL/PARTIAL components, produce final scoreboard.

## Inputs

| Variable | Source | Description |
|----------|--------|-------------|
| `pipelineDir` | `.temp/react-to-figma/` | Root output directory |
| `skillDir` | `.claude/skills/react-to-figma-dom/8-batch-build/` | This phase's directory |
| `fileKey` | env/config | Figma file key |

## Procedure

### 1. Final aggregate

```bash
node {skillDir}/aggregate-scores.js
```

Read the scoreboard. Identify all FAIL and PARTIAL components.

If none:
```
Phase I: All components PASS. Final scoreboard generated.
```

### 2. Fix loop (max 2 iterations per component)

Same pattern as Phase E — for each FAIL/PARTIAL component:
1. Launch fix subagent with `{skillDir}/prompts/fix-a-component.md`
2. Re-verify with `batch-verify.js`
3. If still failing, try once more
4. After 2 iterations, log and move on

### 3. Final scoreboard

Run aggregate one final time:
```bash
node {skillDir}/aggregate-scores.js
```

### 4. Log summary

```
═══════════════════════════════════════════════════
★ FINAL RESULTS — React to Figma Pipeline Complete
═══════════════════════════════════════════════════

Total components: {count}
Total variants built: {count}

  PASS: {count} ({percentage}%)
  PARTIAL: {count} ({percentage}%)
  FAIL: {count} ({percentage}%)

Pages composed: {count}
  Page PASS: {count}  Page PARTIAL: {count}  Page FAIL: {count}

Scoreboard: {pipelineDir}/scoreboard.md
═══════════════════════════════════════════════════
```
