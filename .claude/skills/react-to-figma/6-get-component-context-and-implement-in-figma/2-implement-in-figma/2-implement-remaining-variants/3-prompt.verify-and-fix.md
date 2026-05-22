# Verify and Fix All Variants

Screenshot every variant in the component set, compare each against its React reference, and fix any issues. This is a combined verify+fix agent — it does both in one pass.

## Before You Start

Read these reference files in `2-implement-in-figma/reference/`:
1. `figma-use-rules.md` — Critical rules for every `use_figma` call
2. `figma-gotchas.md` — Silent bugs to avoid
3. `fix-sizing.md` — The `fixSizing()` function
4. `figma-variable-binding.md` — How to bind design tokens

## Inputs

| Input | Description |
|-------|-------------|
| `figma-result.md` | Component set ID and all variant IDs |
| `screenshots/` | All React variant PNGs |
| `analysis.md` | Expected children and component structure |
| `builtComponents` | Map of `{componentName: nodeId}` |
| `fileKey` | Figma file key |

## Output

Write `verification.md` to the component directory.

## Procedure

### 1. Screenshot every variant

For each variant listed in `figma-result.md`:

Use `get_screenshot` or `get_design_context` MCP tool:
- `fileKey`: from input
- `nodeId`: variant's node ID (not the set ID)
- Get at 2x scale

### 2. Compare each variant

For each variant, view its Figma screenshot alongside the matching React screenshot from `screenshots/`.

Check:
- **Colors**: fills, strokes, text colors match the variant's expected values
- **Typography**: font sizes, weights, text content correct for this variant
- **Layout**: spacing, padding, sizing appropriate for this variant
- **Children**: all expected children present and visible (or hidden per structural overrides)
- **Icons**: correct icon, correct size, correct color

Record per-variant results.

### 3. Fix broken variants

For any variant with issues:

**a) Identify the variant's node ID** from `figma-result.md`

**b) Navigate to the specific node** within that variant:
```javascript
const variant = figma.getNodeById('{variantNodeId}');
const problemNode = variant.findOne(n => n.name === '{nodeName}');
```

**c) Apply targeted fixes** based on what the comparison found:

```javascript
// Color fix:
const figmaVar = await figma.variables.getVariableByIdAsync('{variableId}');
problemNode.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
problemNode.setBoundVariable('fills', 0, figmaVar);

// Text fix:
await figma.loadFontAsync(problemNode.fontName);
problemNode.characters = '{correctText}';

// Sizing fix:
problemNode.layoutSizingHorizontal = 'FILL';
fixSizing(variant);

// Visibility fix:
const hiddenChild = variant.findOne(n => n.name === '{name}');
hiddenChild.visible = false;
```

**d) Re-screenshot and re-verify** the fixed variant to confirm the fix worked.

### 4. Verify component set structure

After individual variants are verified/fixed, check the set level:

```javascript
const set = figma.getNodeById('{setNodeId}');
return JSON.stringify({
  type: set.type,
  name: set.name,
  childCount: set.children.length,
  variantNames: set.children.map(c => c.name),
  layoutMode: set.layoutMode,
  width: set.width,
  height: set.height
});
```

Verify:
- Set type is `COMPONENT_SET`
- All expected variants are present (count matches `figma-result.md`)
- Variant names use correct `axis=value` format
- Set has auto-layout (not collapsed)

### 5. Write verification.md

```markdown
# Verification: {componentName} (all variants)

## Overall Verdict: {PASS | PARTIAL | FAIL}

## Component Set
- **Set Node ID**: {setId}
- **Variant Count**: {expected} expected / {actual} found
- **Set Layout**: {layoutMode}, {width}×{height}

## Per-Variant Results

### {variantName}
- **Verdict**: {PASS | FIXED | FAIL}
- **Node ID**: {nodeId}
- **Comparison**: {1-line summary}
{if FIXED:}
- **Issues Found**: {what was wrong}
- **Fixes Applied**: {what was done}
{if FAIL:}
- **Issues Remaining**: {what couldn't be fixed}
- **Suggested Fix**: {manual steps needed}

### {next variant}
...

## Summary

| Variant | Verdict |
|---------|---------|
| Variant=primary, Size=default | PASS |
| Variant=destructive, Size=default | FIXED |
| Variant=outline, Size=lg | FAIL |
| ... | ... |

## Remaining Issues

{Only if overall verdict is PARTIAL or FAIL}

1. **{issue}**: {description, node ID, what would fix it}
```

## Verdict Rules

| Verdict | Criteria |
|---------|----------|
| **PASS** | All variants pass or were successfully fixed. |
| **PARTIAL** | Most variants pass. 1-2 variants have minor issues that couldn't be auto-fixed (wrong icon that doesn't exist, complex structural difference). |
| **FAIL** | Multiple variants have unfixable issues, or the component set structure is broken. |

## Re-Run Behavior

This agent may be called again if the orchestrator receives PARTIAL or FAIL. On subsequent runs:
1. Read the existing `verification.md` for context on previous issues
2. Focus only on variants that were FAIL in the previous run
3. Try alternative fix approaches if the same fix was already attempted
