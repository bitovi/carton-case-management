# 6 Get Component Context and Implement in Figma
## 6.1 Get Component Context
### 6.1.3 Capture Variant Screenshots (DOM Mode)

**Begin your response by outputting the heading lines above verbatim.**

Run the DOM-aware `capture-dom.js` helper in **batch mode** to capture structured DOM JSON, fiber data, and screenshots for ALL components in a single browser session. Batch mode reuses one Playwright browser instance across all components, avoiding the overhead and race conditions of parallel per-component launches.

## Inputs

- **Storybook base URL**: URL where Storybook is running (e.g., `http://localhost:6006`)
- **Output directory**: `.temp/react-to-figma-dom/components/` (the batch root — NOT a per-component path)
- **Components filter** (optional): Comma-separated list to capture only a subset (e.g., `Badge,Button,Input`)

## Procedure

### 1. Run the DOM capture helper in batch mode

Run the helper script WITHOUT the `--component` flag. This activates batch mode, which discovers ALL `figma-variants-*` stories from Storybook's `index.json` and groups them by component automatically:

```bash
node .claude/skills/react-to-figma-dom/scripts/capture-dom.js \
  --storybook-url http://localhost:6006 \
  --output-dir .temp/react-to-figma-dom/components
```

To capture only specific components, add `--components`:

```bash
node .claude/skills/react-to-figma-dom/scripts/capture-dom.js \
  --storybook-url http://localhost:6006 \
  --output-dir .temp/react-to-figma-dom/components \
  --components Badge,Button,Input
```

The script will:
1. Fetch Storybook's `index.json` to discover all story IDs matching `figma-variants-*` prefixes
2. Group stories by component name
3. Launch ONE Playwright browser, navigate to each story's iframe URL, and capture per-variant subfolders:
   - `{ComponentName}/variants/{ExportName}/dom.json` — structured DOM tree with computed styles, bounding boxes, and attributes per node
   - `{ComponentName}/variants/{ExportName}/fiber-dom-map.json` — React fiber → DOM correlation (component boundaries)
   - `{ComponentName}/variants/{ExportName}/screenshot.png` — viewport screenshot
4. Write `{ComponentName}/variants/capture-manifest.json` per component

**IMPORTANT**: Do NOT rewrite or recreate this script. Use it as-is. If it fails due to a bug, fix the bug in the existing file rather than generating a new capture script.

### 2. Validate captures

After the script completes, review its console output for per-component summaries:

- **✅ components**: All variants captured successfully
- **⚠️ components**: Some variants captured with warnings
- **❌ components**: Some or all variants failed

For any failed components, check if stories exist in Storybook (Phase C.2 may have failed for those components).

### 3. Self-healing retry

If specific components failed:

1. Read the failed component's story source and check the Storybook index for matching IDs
2. Diagnose root cause (missing story, wrong title format, rendering errors)
3. Fix the story file if needed
4. Re-run capture for only the failed components:

```bash
node .claude/skills/react-to-figma-dom/scripts/capture-dom.js \
  --storybook-url http://localhost:6006 \
  --output-dir .temp/react-to-figma-dom/components \
  --components FailedComp1,FailedComp2
```

**Maximum retries**: 2. If components still fail after 2 retries, mark them as failed and continue.

### 4. Return summary

```
DOM batch capture complete
- Components discovered: {total}
- Components captured: {success_count}/{total}
- Total variants: {variant_total}
- Failed components: {list or "none"}
- Output: .temp/react-to-figma-dom/components/
```
