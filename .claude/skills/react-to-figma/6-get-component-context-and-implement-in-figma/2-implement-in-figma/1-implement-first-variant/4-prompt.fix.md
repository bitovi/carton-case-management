# Fix Default Variant

Apply targeted fixes to a Figma component based on verification results. This agent has **fresh context** — it never saw the original build. It diagnoses purely from verification data and applies fixes via `use_figma`.

## Before You Start

Read these reference files in `2-implement-in-figma/reference/`:
1. `figma-use-rules.md` — Critical rules for every `use_figma` call
2. `figma-gotchas.md` — Silent bugs to avoid
3. `fix-sizing.md` — The `fixSizing()` function
4. `figma-variable-binding.md` — How to bind design tokens

## Inputs

| Input | Description |
|-------|-------------|
| `default-variant/verification.md` | Verdict, category scores, and actionable fix instructions with node IDs |
| `default-variant/figma-result.md` | Component node ID and instance manifest |
| `fileKey` | Figma file key |

## Output

- Updated Figma nodes (via `use_figma` calls)
- Updated `default-variant/figma-result.md` (if node IDs changed)

## Procedure

### 1. Parse verification issues

Read `default-variant/verification.md` → extract all issues with:
- Node ID to fix
- Expected value
- Actual value
- Fix instruction

Group issues by node ID — apply all fixes to the same node in one `use_figma` call.

### 2. Apply fixes

For each group of issues on a node:

```javascript
const node = figma.getNodeById('{nodeId}');
// Apply fixes per the verification instructions
// Example fixes:

// COLOR fix:
const figmaVar = await figma.variables.getVariableByIdAsync('{variableId}');
node.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
node.setBoundVariable('fills', 0, figmaVar);

// SIZING fix:
node.layoutSizingHorizontal = 'FILL';
node.primaryAxisSizingMode = 'AUTO';

// TEXT fix:
await figma.loadFontAsync(node.fontName);
node.characters = '{correct text}';

// SPACING fix:
node.itemSpacing = {correct value};
node.paddingTop = {value};

// MISSING CHILD fix:
const master = figma.getNodeById('{masterNodeId}');
const inst = master.createInstance();
node.appendChild(inst);
```

### 3. Run fixSizing

After all fixes are applied, run `fixSizing()` on the root component:

```javascript
const root = figma.getNodeById('{componentNodeId}');
fixSizing(root);
return JSON.stringify({ fixed: true, id: root.id });
```

### 4. Update figma-result.md

If any node IDs changed (e.g., child was recreated), update `default-variant/figma-result.md` with the new IDs.

## Rules

- **Do NOT read `analysis.md`, `variants.md`, screenshots, or the build plan** — you diagnose only from `verification.md`
- **Do NOT rebuild the component** — only fix the specific issues listed
- **Do NOT change properties that are already correct** — minimize side effects
- Apply the `fixSizing()` function AFTER all other fixes
- If a fix instruction is ambiguous, prefer the approach that matches common Figma patterns
