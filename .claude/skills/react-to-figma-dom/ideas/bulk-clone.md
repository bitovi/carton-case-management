# Idea: Bulk Clone Strategy for use_figma Calls

## Problem

Currently each variant gets its own `build-script.js` and requires a separate `use_figma` call. For a component with 48 variants, that's 48 API calls — slow and wasteful since most variants share identical node structure and differ only in style properties (fills, strokes, border-radius, opacity, font-size).

## Proposal

Replace N individual build calls with:
1. **Build 1 base variant per structural group** (full `build-script.js`) — few calls
2. **Clone + bulk-modify** all remaining variants in that group — 1-2 calls per group

## Structural Grouping

Variants that differ ONLY in style properties (not node count/hierarchy):
- **STYLE_ONLY deltas**: fills, strokes, opacity, border-radius, font color, shadows
- **STRUCTURAL deltas**: different child count, different node types, added/removed layers

For Button (6 Variant × 4 Size × 2 Roundness × 4 State = 192 raw, 48 after pruning):
- Size changes dimensions/font-size → structural (different padding, heights)
- Variant changes fills/text-color → style only
- State changes fills/opacity → style only
- Roundness changes border-radius → style only

So ~4 structural groups (one per Size), each with 12 style-only variants.

**Result**: 4 full builds + 2-3 bulk clone calls ≈ 6-7 total calls instead of 48.

## Implementation

### New Script: `generate-bulk-clone-script.js`

Input:
- All `figma-ir.json` files for a component
- `figma-variants.json` (axis definitions)

Process:
1. Load all IR files
2. Compute structural fingerprint per variant (node tree shape without style values)
3. Group variants by fingerprint
4. For each group: pick one as "base" (ideally the default combo), diff others against it
5. Output a single `clone-and-modify.js` script per group

### Clone Script Structure

```javascript
// Built by generate-bulk-clone-script.js
const componentsPage = figma.root.children.find(p => p.name === 'Components');
await figma.setCurrentPageAsync(componentsPage);
const componentSet = componentsPage.findOne(n => n.type === 'COMPONENT_SET' && n.name === 'Button');
const base = componentSet.children.find(c => c.name === 'Variant=primary, Size=regular, Roundness=default, State=default');

// Clone for Variant=secondary
const v2 = base.clone();
v2.name = 'Variant=secondary, Size=regular, Roundness=default, State=default';
// Apply style deltas (generated from IR diff)
v2.children[0].fills = [{type:'SOLID', color:{r:0.96,g:0.96,b:0.96}}];
v2.children[0].children[0].fills = [{type:'SOLID', color:{r:0.09,g:0.09,b:0.09}}];
componentSet.appendChild(v2);

// Clone for Variant=outline
const v3 = base.clone();
// ... more deltas
```

### Delta Computation

Compare two `figma-ir.json` trees:
- Walk both in parallel
- Record only properties that differ
- Output as path + value pairs: `children[0].fills = [...]`

Each delta is ~200-500 bytes. A 50KB `use_figma` limit fits ~100+ clone operations.

## Size Estimates

| Component | Current Calls | With Cloning | Savings |
|-----------|--------------|--------------|---------|
| Button (48 variants) | 48 | ~6-7 | 86% |
| Input (48 variants) | 48 | ~5-6 | 88% |
| Sheet (5 variants) | 5 | 2-3 | 50% |
| Badge (4 variants) | 4 | 2 | 50% |

Biggest wins on components with many style-only variants (Button, Input, EditableSelect).

## Risks

- Clone inherits ALL properties including variable bindings — if base has variables bound, clones need rebinding only for changed values
- Node naming in clones: need to update names if they contain variant-specific labels
- 50KB `use_figma` limit: for very large components, may need to chunk clones across 2-3 calls
- combineAsVariants behavior: cloned components may need to be added to the set separately

## Prerequisites

- IR diff algorithm (compare two figma-ir.json trees)
- Structural fingerprint function (hash node tree ignoring style values)
- Understanding of which properties count as "style" vs "structure" for Figma nodes

## Status

Idea only — not yet implemented. Prioritize after the main pipeline rebuild validates correctness.
