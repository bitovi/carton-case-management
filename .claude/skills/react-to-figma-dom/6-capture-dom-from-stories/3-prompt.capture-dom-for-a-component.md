# 6 Get Component Context and Implement in Figma
## 6.1 Get Component Context
### 6.1.3 Capture Variant Screenshots (DOM Mode)

**Begin your response by outputting the heading lines above verbatim.**

Run the DOM-aware `capture-dom.js` helper to capture structured DOM JSON, fiber data, and screenshots for every variant story. This is the DOM-based variant of the capture step — it produces machine-readable `dom.json`, `fiber-dom-map.json`, and `screenshot.png` per variant, organized into per-variant subfolders.

## Inputs

- **Component name**: PascalCase name (e.g., `Button`)
- **Storybook base URL**: URL where Storybook is running (e.g., `http://localhost:6006`)
- **Output directory**: `.temp/react-to-figma/components/{Name}/variants/`

## Procedure

### 1. Run the DOM capture helper

Run the helper script:

```bash
node .claude/skills/react-to-figma-dom/scripts/capture-dom.js \
  --component {ComponentName} \
  --storybook-url http://localhost:6006 \
  --output-dir .temp/react-to-figma/components/{ComponentName}/variants
```

The script will:
1. Fetch Storybook's `index.json` to discover all story IDs matching the prefix `figma-variants-{component-kebab}`
2. Launch Playwright, navigate to each story's iframe URL, and capture per-variant subfolders:
   - `{ExportName}/dom.json` — structured DOM tree with computed styles, bounding boxes, and attributes per node
   - `{ExportName}/fiber-dom-map.json` — React fiber → DOM correlation (component boundaries)
   - `{ExportName}/screenshot.png` — viewport screenshot
3. Write `capture-manifest.json` in the output directory

**IMPORTANT**: Do NOT rewrite or recreate this script. Use it as-is. If it fails due to a bug, fix the bug in the existing file rather than generating a new capture script.

If the script exits with a non-zero code, some variants failed. Check the manifest JSON for the `failed` array.

### 2. Validate captures

The capture script includes built-in content quality checks. After it completes, review its console output and the `capture-manifest.json`:

- **✅ variants**: Captured successfully with meaningful content
- **⚠️ variants**: Captured but flagged with a warning (e.g., small screenshot) — may still be valid for minimal-render states
- **❌ variants**: Failed — either threw an error during capture or had empty content (0 DOM children)

If any variants are marked ❌ or ⚠️, read the relevant story source code and (if it exists) the variant's `dom.json` to diagnose the root cause before retrying.

### 3. Self-healing retry

If any variants failed or look blank/incorrect:

1. Read the failed variant's `dom.json` (if it exists) and the story source code
2. Diagnose the root cause:
   - **Story not found**: The story ID doesn't match — check story title and export name in the `.figma-variants.stories.tsx` file
   - **Blank page**: Missing provider/decorator, hook error, or component crash
   - **Spinner only**: Loading state not overridden
3. Fix the story file and re-run the capture helper for just those variants (or all variants again — the script overwrites existing files)
4. Re-validate

**Maximum retries**: 2 per component. If variants still fail after 2 retries, mark them as failed in the manifest and continue.

### 4. Update stories-manifest.md

Update `.temp/react-to-figma/components/{Name}/stories-manifest.md` to add capture status:

```markdown
## Capture Results

| Variant | Screenshot | DOM JSON | Fiber Map | Status |
|---------|-----------|----------|-----------|--------|
| PrimaryDefault | ✅ | ✅ | ✅ | captured |
| PrimaryHover | ✅ | ✅ | ✅ | captured |
| StateLoading | ❌ | ❌ | ❌ | failed (blank after 2 retries) |

**Total**: {captured}/{total} variants captured successfully
**Failed**: {list of failed variants, or "none"}
```

### 5. Return summary

```
DOM capture complete: {ComponentName}
- Captured: {success_count}/{total_count} variants
- Failed: {fail_count} ({list or "none"})
- Retries used: {retry_count}/2
- Output: .temp/react-to-figma/components/{Name}/variants/
- DOM JSON files: {dom_count}
- Fiber maps: {fiber_count}
```
