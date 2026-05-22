# Capture Variant Screenshots

Run the reusable `capture-storybook-variants.js` helper to capture a screenshot, rendered HTML structure, and computed CSS for every variant story. The helper fetches story IDs directly from Storybook's `index.json`, so there is no need to manually construct story URLs.

## Inputs

- **Component name**: PascalCase name (e.g., `Button`)
- **Storybook base URL**: URL where Storybook is running (e.g., `http://localhost:6006`)
- **Output directory**: `.temp/react-to-figma/components/{Name}/screenshots/`

## Procedure

### 1. Run the capture helper

Run the helper script located alongside this prompt file:

```bash
node .claude/skills/react-to-figma/6-get-component-context-and-implement-in-figma/1-get-component-context/capture-storybook-variants.js \
  --component {ComponentName} \
  --storybook-url http://localhost:6006 \
  --output-dir .temp/react-to-figma/components/{ComponentName}/screenshots
```

The script will:
1. Fetch Storybook's `index.json` to discover all story IDs matching the prefix `figma-variants-{component-kebab}`
2. Launch Playwright, navigate to each story's iframe URL, and capture:
   - `{ExportName}.png` — viewport screenshot
   - `{ExportName}.html.md` — serialized DOM structure (role, aria, data-state attrs)
   - `{ExportName}.styles.md` — computed CSS for Figma-relevant properties with bounding box dimensions
3. Write `screenshots-manifest.json` one level up from the screenshots directory

**IMPORTANT**: Do NOT rewrite or recreate this script. Use it as-is. If it fails due to a bug, fix the bug in the existing file rather than generating a new capture script.

If the script exits with a non-zero code, some variants failed. Check the manifest JSON for the `failed` array.

### 2. Validate screenshots

After the script completes, check the `screenshots-manifest.json`:

- If `failed` array is non-empty, diagnose why those variants failed (missing story, render timeout, etc.)
- Spot-check a few `.html.md` files to confirm they contain meaningful content (not just an empty root wrapper)
- For interaction state variants (hover/focus/active), compare their `.html.md` to the default variant to confirm the interaction state is reflected

### 3. Self-healing retry

If any variants failed or look blank/incorrect:

1. Read the failed variant's `.html.md` (if it exists) and the story source code
2. Diagnose the root cause:
   - **Story not found**: The story ID doesn't match — check story title and export name in the `.figma-variants.stories.tsx` file
   - **Blank page**: Missing provider/decorator, hook error, or component crash
   - **Spinner only**: Loading state not overridden
3. Fix the story file and re-run the capture helper for just those variants (or all variants again — the script overwrites existing files)
5. Re-validate

**Maximum retries**: 2 per component. If variants still fail after 2 retries, mark them as failed in the manifest and continue.

### 5. Update stories-manifest.md

Update `.temp/react-to-figma/components/{Name}/stories-manifest.md` to add capture status:

```markdown
## Capture Results

| Variant | Screenshot | HTML | Styles | Status |
|---------|-----------|------|--------|--------|
| VariantPrimarySizeMdStateDefault | ✅ | ✅ | ✅ | captured |
| VariantPrimarySizeMdStateHover | ✅ | ✅ | ✅ | captured |
| StateLoading | ❌ | ❌ | ❌ | failed (blank after 2 retries) |

**Total**: {captured}/{total} variants captured successfully
**Failed**: {list of failed variants, or "none"}
```

### 6. Return summary

```
Screenshot capture complete: {ComponentName}
- Captured: {success_count}/{total_count} variants
- Failed: {fail_count} ({list or "none"})
- Retries used: {retry_count}/2
- Output: .temp/react-to-figma/components/{Name}/screenshots/
```
