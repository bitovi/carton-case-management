# 6 Get Component Context and Implement in Figma
## 6.2 Implement in Figma (DOM Pipeline)
### 6.2.3 Fix Variants

**Begin your response by outputting the heading lines above verbatim.**

Apply targeted fixes to Figma variants based on verification results. Diagnose from composite diff images, comparison stats, build scripts, and DOM data — this agent has fresh context and never saw the original build.

## FAIL-FAST RULE

Your FIRST action must be a `use_figma` call (a simple probe like `return { ok: true }`). If it fails or is unavailable, **STOP immediately**. Do NOT write any output files or claim fixes were applied. Return ONLY:

```
ERROR: use_figma unavailable — {error details}
```

## Before You Start

Read these reference files in `2-implement-in-figma/reference/`:
1. `figma-use-rules.md` — Critical rules for every `use_figma` call
2. `figma-gotchas.md` — Silent bugs to avoid
3. `figma-variable-binding.md` — How to bind design tokens

## DO NOT

- Do NOT rebuild the component — only fix the specific issues identified from diff images
- Do NOT change properties that are already correct
- Do NOT write `verification.md` or any verification output — the orchestrator handles verification

## Inputs

| Variable | Description |
|----------|-------------|
| `componentDir` | Component directory |
| `fileKey` | Figma file key |
| `failingVariants` | Array of variant names that failed verification |

For each failing variant, you receive these files:
- `{componentDir}/variants/{VariantName}/composite.png` — Side-by-side [React \| Diff \| Figma] image. VIEW this image to identify differences.
- `{componentDir}/variants/{VariantName}/comparison.json` — Match percentage and stats
- `{componentDir}/variants/{VariantName}/build-script.js` — The code that built this variant
- `{componentDir}/variants/{VariantName}/dom.json` — Ground truth DOM data

## Output

- Updated Figma nodes via `use_figma` calls
- Updated `{componentDir}/figma-result.md` if node IDs changed

## Procedure

### 1. Diagnose issues from diff images

For each variant in `failingVariants`:

1. **VIEW** `{componentDir}/variants/{VariantName}/composite.png` — the composite shows React reference (left), pixel diff with red regions (center), and Figma result (right)
2. **Read** `{componentDir}/variants/{VariantName}/comparison.json` — get match percentage and stats
3. For each red region in the diff, identify:
   - Which visual element? (background, border, text, icon, spacing, shadow)
   - What does React show? (left panel)
   - What does Figma show instead? (right panel)
   - Which Figma node is responsible?

### 2. Determine if issues are in IR/codegen or Figma execution

Before applying `use_figma` fixes, check if the issue is systematic (same bug across ALL variants). If so, the root cause is likely in the scripts:

- **Same wrong color everywhere** → `css-to-figma.js` color resolution or variable binding bug
- **Same wrong sizing everywhere** → `mapSizing()` logic bug
- **Same missing child everywhere** → `dom-to-figma-ir.js` node filtering bug

For systematic issues:
1. Read the relevant IR file (`build/{VariantName}.figma-ir.json`) to confirm the IR is wrong
2. Fix the script (`css-to-figma.js`, `dom-to-figma-ir.js`, or `ir-to-figma-code.js`)
3. Re-run the build pipeline for affected variants
4. Report the script fix to the orchestrator

For variant-specific issues, apply targeted `use_figma` fixes below.

### 3. Apply fixes per variant

For each variant with differences:

**a) Navigate to the variant and problem node**

```javascript
const variant = figma.getNodeById('{variantNodeId}');
const problemNode = variant.findOne(n => n.name === '{nodeName}');
```

**b) Apply the fix from verification.md**

```javascript
// COLOR fix:
const figmaVar = await figma.variables.getVariableByIdAsync('{variableId}');
problemNode.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
problemNode.setBoundVariable('fills', 0, figmaVar);

// Without variable — fallback RGB:
problemNode.fills = [{ type: 'SOLID', color: { r: 0.886, g: 0.910, b: 0.941 } }];

// TEXT fix:
await figma.loadFontAsync(problemNode.fontName);
problemNode.characters = '{correctText}';

// SIZING fix:
problemNode.layoutSizingHorizontal = 'FILL';

// SPACING fix:
problemNode.itemSpacing = {correctValue};
problemNode.paddingTop = {value};

// VISIBILITY fix:
const hiddenChild = variant.findOne(n => n.name === '{name}');
hiddenChild.visible = false;

// MISSING CHILD fix:
const master = figma.getNodeById('{masterNodeId}');
const inst = master.createInstance();
variant.appendChild(inst);
```

**c) Group fixes** — apply all fixes to the same variant in one `use_figma` call when possible.

### 4. Update figma-result.json and figma-result.md

If any node IDs changed (e.g., child recreated), update both `{componentDir}/figma-result.json` and `{componentDir}/figma-result.md`.

## Error Handling

| Scenario | Action |
|----------|--------|
| Fix instruction is ambiguous | Prefer the approach that matches Figma auto-layout patterns |
| Node not found by name | Try `findAll` and filter by type + content |
| Variable ID not found | Use fallback RGB from verification.md |
| Systematic bug across all variants | Fix the pipeline script, not individual nodes |
