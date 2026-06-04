# 6 Get Component Context and Implement in Figma
## 6.2 Implement in Figma (DOM Pipeline)
### 6.2.2 Verify Variants

**Begin your response by outputting the heading lines above verbatim.**

Screenshot every built Figma variant, pixel-diff against its React reference screenshot, score each variant, and produce a consolidated verification report. The fix agent uses these artifacts to diagnose and correct issues.

## FAIL-FAST RULE

Your FIRST action must be a `get_screenshot` call for the first variant. If it fails or `get_screenshot` is unavailable, **STOP immediately**. Return ONLY:

```
ERROR: get_screenshot unavailable — {error details}
```

## DO NOT

- Do NOT fix any issues — this prompt only verifies. The fix prompt handles corrections.
- Do NOT hand-write `verification-results.json` — only the `verify-variants.js` script may create it.
- Do NOT skip variants. Every variant in `figma-result.json` must be screenshotted and compared.
- Do NOT report PASS without running the pixel-diff script.

## Inputs

| Variable | Description |
|----------|-------------|
| `componentName` | Component being verified (e.g., `Badge`) |
| `componentDir` | Component directory (e.g., `.temp/react-to-figma-dom/components/Badge/`) |
| `skillDir` | Skill directory (e.g., `.claude/skills/react-to-figma-dom/6-get-component-context-and-implement-in-figma/2-implement-in-figma/`) |
| `fileKey` | Figma file key |

## Output

| File | Description |
|------|-------------|
| `{componentDir}/verify-manifest.json` | Input manifest for the verification script |
| `{componentDir}/verification-results.json` | Consolidated results with per-variant scores |
| `{componentDir}/variants/{Name}/figma.png` | Downloaded Figma screenshot per variant |
| `{componentDir}/variants/{Name}/diff.png` | Pixel diff image per variant |
| `{componentDir}/variants/{Name}/composite.png` | Side-by-side [React \| Diff \| Figma] per variant |
| `{componentDir}/variants/{Name}/comparison.json` | Per-variant match stats |

## Procedure

### 1. Parse figma-result.json

Read `{componentDir}/figma-result.json`. Extract every variant from the **variants** array:
- **Variant Name** (e.g., `State=rest`)
- **Node ID** (e.g., `340:2`)
- **Screenshot Source** (e.g., `variants/State Rest Readonly False Error None/screenshot.png`)

The variant folder name is derived from the Screenshot Source path. For example, if the screenshot source is `variants/State Rest Readonly False Error None/screenshot.png`, the variant folder name is `State Rest Readonly False Error None`.

If `figma-result.json` doesn't exist, STOP and report the error.

### 2. Screenshot every variant from Figma

For each variant, call `get_screenshot`:
- `fileKey`: from input
- `nodeId`: the variant's node ID (NOT the component set ID)
- `maxDimension`: 1024

Record each variant's returned asset URL.

**FAIL-FAST**: If the first `get_screenshot` call fails, STOP and report the error.

Screenshot ALL variants before proceeding. Do not skip any.

### 3. Write verify-manifest.json

Write `{componentDir}/verify-manifest.json`:

```json
{
  "componentName": "{componentName}",
  "componentDir": "{componentDir}",
  "variants": [
    {
      "name": "{VariantFolderName}",
      "nodeId": "{nodeId}",
      "assetUrl": "{assetUrlFromGetScreenshot}",
      "reactScreenshot": "variants/{VariantFolderName}/screenshot.png"
    }
  ]
}
```

**CRITICAL**: Every variant MUST have a non-empty `assetUrl`. If any variant has an empty `assetUrl`, the manifest is invalid — go back and screenshot that variant.

### 4. Run batch verification script

```bash
node {skillDir}/scripts/verify-variants.js \
  --manifest "{componentDir}/verify-manifest.json"
```

Exit codes:
- `0` = all variants pass (≥90% match)
- `1` = some variants have minor diffs (75-90% match)
- `2` = some variants fail (<75% match)
- `3` = script error (missing manifest, download failures, etc.)

### 5. Validate artifacts exist

Check that the script produced its outputs:

```bash
ls {componentDir}/variants/*/composite.png
```

If no `composite.png` files exist, the verification script failed. Check its stderr output and report the error.

### 6. Validate verification-results.json is script-generated

Read `{componentDir}/verification-results.json`. It MUST contain:
- `variantCount` field (integer)
- `pass`, `fail`, `error` fields (integers)
- Each variant result MUST have a `matchPct` field (number)

If the file has `"message": "Component created successfully"` instead of `matchPct`, the verification was hand-written and is INVALID. Delete the file and re-run steps 2-5.

### 7. Report results

Read `{componentDir}/verification-results.json` and report:

1. **Overall verdict**: `overallVerdict` field (PASS / PARTIAL / FAIL)
2. **Per-variant scores**, sorted worst-first:

```
Variant verification: {componentName}
  Overall: {overallVerdict}

  {variantName}: {matchPct}% — {status}
  {variantName}: {matchPct}% — {status}
  ...

  Failing variants: [{comma-separated names with status fail or minor_diff}]
```

3. For each failing variant (status `fail` or `minor_diff`), note that `composite.png` is available for the fix agent to VIEW.

## Error Handling

| Scenario | Action |
|----------|--------|
| `figma-result.json` missing | STOP — build step hasn't run |
| `get_screenshot` fails | STOP — Figma MCP unavailable |
| `verify-variants.js` exit code 3 | Report script error, check stderr |
| React screenshot missing for a variant | Report which variant is missing its `screenshot.png` |
| Downloaded Figma screenshot is blank/tiny | Script handles this — reports as `fail` with reason |
