# Verify Page Frame

Compare a composed Figma page frame against a full-page screenshot of the live application to identify layout discrepancies.

## Inputs

- **Route**: The route to verify (e.g., `/cases/1`)
- **Dev server URL**: The running dev server (e.g., `http://localhost:5173`)
- **Page Figma result**: Path to `page-figma-result.json` containing the Figma frame node ID

## Output

- **`verification.md`**: Written to the output path provided by the parent orchestrator

## Procedure

### 1. Capture live app screenshot

Using the Playwright MCP tool:

1. Navigate to `{devServerUrl}{route}` (e.g., `http://localhost:5173/cases/1`).
2. Wait for network idle.
3. Set viewport to 1440×900 (matching the Figma frame).
4. Take a full-page screenshot.
5. Save as `.temp/react-to-figma-dom/pages/{RouteName}/screenshot-app.png`.

### 2. Export Figma frame screenshot

Using the `use_figma` MCP tool:

1. Read `page-figma-result.json` to get the frame node ID.
2. Export the frame as PNG at 1x scale.
3. Save as `.temp/react-to-figma-dom/pages/{RouteName}/screenshot-figma.png`.

### 3. Compare

Visually compare the two screenshots. Check for:

1. **Layout structure**: Are major sections (header, sidebar, content) in the same relative positions?
2. **Component presence**: Are all visible components from the app present in the Figma frame?
3. **Sizing**: Are component proportions roughly correct (header height, sidebar width, content area)?
4. **Spacing**: Are gaps between components reasonable (exact pixel match not required)?
5. **Missing elements**: Are there visible elements in the app screenshot that have no corresponding element in the Figma frame?
6. **Extra elements**: Are there elements in the Figma frame that don't appear in the app?

### 4. Write verification

Write `verification.md`:

```markdown
# Page Verification: {route}

## Screenshots
- App: screenshot-app.png
- Figma: screenshot-figma.png

## Overall: {PASS | PARTIAL | FAIL}

## Checks
| Check | Status | Notes |
|-------|--------|-------|
| Layout structure | ✅/⚠️/❌ | {description} |
| Component presence | ✅/⚠️/❌ | {description} |
| Sizing | ✅/⚠️/❌ | {description} |
| Spacing | ✅/⚠️/❌ | {description} |
| Missing elements | ✅/⚠️/❌ | {list of missing} |
| Extra elements | ✅/⚠️/❌ | {list of extra} |

## Recommended fixes
{If PARTIAL or FAIL, list specific fixes:}
- {fix 1}
- {fix 2}
```

### Grading

- **PASS**: Layout structure matches, all major components present, sizing roughly correct. Minor spacing differences are acceptable.
- **PARTIAL**: Layout structure mostly matches but 1-2 components are mispositioned or missing. Fixable with targeted adjustments.
- **FAIL**: Layout structure is fundamentally wrong (e.g., sidebar on wrong side, header missing, content area collapsed).
