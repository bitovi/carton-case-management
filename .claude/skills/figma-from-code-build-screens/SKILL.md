---
name: figma-from-code-build-screens
description: Build full-page screen frames in Figma by composing built component instances into 1440x900 layouts. Uses pre-captured app screenshots as visual reference. This is Phase 4 of figma-from-code.
---

# Skill: Build Screens (Phase 4)

Builds full-page screen frames in Figma by composing built component instances into 1440x900 layouts. Each screen assembles navigation, list panels, and detail/form panels using instances of components already created in Phase 3.

## When to Use

- When `figma-from-code` reaches Phase 4
- Standalone to rebuild screen layouts after component changes
- To add new screens after adding pages to the app

## Prerequisites

- Phase 3 complete — all components exist in `builtComponents` in state.json
- Pre-captured full-page screenshots in `.temp/figma-from-code/screenshots/screens/`
- `screensFrameId` recorded in `state.json → figmaNodes`

## Screen Definitions

Screens are built dynamically from the routes discovered in `component-map.json` (Phase 0a). For each route:

| Field | Source |
|-------|--------|
| Screen name | Convert route path to PascalCase (e.g., `/items/:id` → `ItemsPage`, `/items/new` → `CreateItemPage`) |
| Route | From `component-map.json → routes` |
| Key components | The top-level components that appear on that route (from `component-map.json → tree`) |

Read each page's source file for layout structure. The page source path varies by project — discover it from the component's source file location in the codebase.

## Workflow

### 0. Verify all components exist (prerequisite gate)

Before building any screen, verify that **every component** referenced by the screens exists in `builtComponents` from `state.json`.

For each screen, identify its key components from `component-map.json → tree` (the top-level components on that route and all their descendants). Check each one against `builtComponents`.

If **any** component is missing from `builtComponents`:

**STOP — do not build any screens.** Return immediately with a rejection result:

```json
{
  "status": "rejected",
  "reason": "missing_components",
  "missingComponents": ["CaseDetails", "MenuList"],
  "screens": []
}
```

Write this to `.temp/figma-from-code/build-screens.json` so the orchestrator can see what's missing.

Only proceed to step 1 if all components are confirmed present.

### For each screen:

1. Read the page source file for layout structure
2. Use `.temp/figma-from-code/screenshots/screens/{ScreenName}/app.png` as visual reference
3. Build a 1440x900 frame via `use_figma` and append to the Screens container:

```javascript
const screensFrame = figma.getNodeById(screensFrameId);
screensFrame.layoutWrap = 'WRAP';
screensFrame.counterAxisSpacing = 80;
screensFrame.appendChild(screenFrame); // do NOT set x/y
```

4. `get_screenshot(fileKey, screenFrameId)` → save to `.temp/figma-from-code/screenshots/screens/{ScreenName}/figma.png`

## Output Files

Written to `.temp/figma-from-code/`:

| File | Contents |
|------|----------|
| `build-screens.json` | Summary of all screen builds |

### Output format

```json
{
  "screens": [
    {"name": "{ScreenName}", "nodeId": "600:1", "figmaScreenshot": ".temp/.../ScreenName/figma.png"}
  ],
  "failed": []
}
```

## Error Handling

| Scenario | Action |
|----------|--------|
| Component missing from `builtComponents` | Reject the entire build — return `status: "rejected"` with the missing components list (step 0) |
| `use_figma` fails for a screen | Retry once; if still fails, mark as failed and continue |
| App screenshot missing | Build from source code alone, note in output |
