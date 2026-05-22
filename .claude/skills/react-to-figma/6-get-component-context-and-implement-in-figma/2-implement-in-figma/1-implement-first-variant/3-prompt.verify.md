# Verify Default Variant

Screenshot the built Figma component and compare it against the React reference screenshot. Determine if the component is visually correct.

## Inputs

| Input | Description |
|-------|-------------|
| `default-variant/figma-result.md` | Node ID and instance manifest from the build step |
| `screenshots/{defaultScreenshot}` | React reference PNG for the default variant |
| `analysis.md` | Expected children list and component structure |
| `builtComponents` | Map of `{componentName: nodeId}` for child components |
| `fileKey` | Figma file key |

## Output

Write `default-variant/verification.md` to the component directory.

## Procedure

### 1. Screenshot the Figma component

Read `default-variant/figma-result.md` → get the node ID.

Use `get_screenshot` or `get_design_context` MCP tool to capture the Figma component:
- `fileKey`: from input
- `nodeId`: from figma-result.md
- Get the screenshot at 2x scale

### 2. View both screenshots

View the React reference screenshot and the Figma screenshot side-by-side (sequentially if tools don't support side-by-side).

### 3. Compare visual characteristics

Check each category:

**Layout & Spacing**:
- Overall dimensions proportional to React reference?
- Spacing between children matches?
- Padding inside the container matches?
- Flex direction correct?

**Colors & Fills**:
- Background color correct?
- Border/stroke color present and correct?
- Text colors match?
- No unintended white/black backgrounds?

**Typography**:
- Font sizes proportionally correct?
- Font weights match (bold vs regular vs medium)?
- Text content matches?
- Line heights not collapsed?

**Children & Instances**:
- All expected children from `analysis.md` present?
- Children in correct order?
- Instance text overrides showing correct text?
- Icons correct size and color?

**Sizing**:
- Component not 0×0 or collapsed?
- No HUG+FILL collapse issues (check if children are properly sized)?
- Rectangles/dividers properly stretched?

### 4. Instance integrity check

For each entry in `figma-result.md` instance manifest:
1. Use `use_figma` to verify the instance still exists and points to the correct master:
   ```javascript
   const node = figma.getNodeById('{instanceNodeId}');
   return JSON.stringify({
     type: node.type,
     masterComponentId: node.type === 'INSTANCE' ? node.mainComponent.id : null,
     visible: node.visible,
     width: node.width,
     height: node.height
   });
   ```
2. Compare master ID against `builtComponents` — should match

### 5. Write verification.md

```markdown
# Verification: {componentName} (default variant)

## Verdict: {PASS | PARTIAL | FAIL}

## Summary

{1-2 sentence summary of overall comparison}

## Category Scores

| Category | Status | Notes |
|----------|--------|-------|
| Layout & Spacing | {PASS/FAIL} | {what's wrong if FAIL} |
| Colors & Fills | {PASS/FAIL} | {what's wrong if FAIL} |
| Typography | {PASS/FAIL} | {what's wrong if FAIL} |
| Children & Instances | {PASS/FAIL} | {what's wrong if FAIL} |
| Sizing | {PASS/FAIL} | {what's wrong if FAIL} |
| Instance Integrity | {PASS/FAIL} | {what's wrong if FAIL} |

## Issues Found

{Only if PARTIAL or FAIL}

### Issue 1: {title}
- **Node ID**: {id of the problematic node}
- **Expected**: {what it should look like / value}
- **Actual**: {what it looks like / value}
- **Fix**: {specific actionable instruction — e.g., "Set fills[0] to variable VariableID:5:30" or "Change layoutMode to HORIZONTAL"}

### Issue 2: ...

## Screenshots

- **React reference**: screenshots/{filename}
- **Figma result**: {describe what was captured}
```

## Verdict Rules

| Verdict | Criteria |
|---------|----------|
| **PASS** | All categories pass. Minor pixel-level differences acceptable (±2px, slight color difference from variable binding). |
| **PARTIAL** | 1-2 categories fail with fixable issues (wrong color, missing text override, sizing off). No structural problems. |
| **FAIL** | 3+ categories fail, OR structural issue (missing children, wrong layout direction, component is empty/collapsed). |
