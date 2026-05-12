---
name: figma-from-code-build-screens
description: Build full-page screen frames in Figma by composing built component instances into 1440x900 layouts. Uses pre-captured app screenshots as visual reference. This is Phase 4 of figma-from-code.
---

# Skill: Build Screens (Phase 4)

Builds full-page screen frames in Figma by composing built component instances into 1440x900 layouts. Each screen assembles Header, MenuList, list sidebar, and detail/form panels using instances of components already created in Phase 3.

## When to Use

- When `figma-from-code` reaches Phase 4
- Standalone to rebuild screen layouts after component changes
- To add new screens after adding pages to the app

## Prerequisites

- Phase 3 complete — all components exist in `builtComponents` in state.json
- Pre-captured full-page screenshots in `.temp/figma-from-code/screenshots/screens/`
- `screensFrameId` recorded in `state.json → figmaNodes`

## Screen Definitions

| Screen               | Route            | Key Components                                     |
| -------------------- | ---------------- | -------------------------------------------------- |
| Cases Page           | `/cases/:id`     | Header + MenuList + CaseList + CaseDetails         |
| Customers Page       | `/customers/:id` | Header + MenuList + CustomerList + CustomerDetails |
| Users Page           | `/users/:id`     | Header + MenuList + UserList + UserDetails         |
| Create Case Page     | `/cases/new`     | Header + MenuList + form                           |
| Create Customer Page | `/customers/new` | Header + MenuList + form                           |
| Create User Page     | `/users/new`     | Header + MenuList + form                           |

## Workflow

For each screen:

1. Read `packages/client/src/pages/{PageFile}.tsx` for layout structure
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
    {"name": "CasesPage", "nodeId": "600:1", "figmaScreenshot": ".temp/.../CasesPage/figma.png"},
    {"name": "CustomersPage", "nodeId": "600:2", "figmaScreenshot": ".temp/.../CustomersPage/figma.png"}
  ],
  "failed": []
}
```

## Error Handling

| Scenario | Action |
|----------|--------|
| Component missing from `builtComponents` | Use a placeholder frame with the component name, log warning |
| `use_figma` fails for a screen | Retry once; if still fails, mark as failed and continue |
| App screenshot missing | Build from source code alone, note in output |
