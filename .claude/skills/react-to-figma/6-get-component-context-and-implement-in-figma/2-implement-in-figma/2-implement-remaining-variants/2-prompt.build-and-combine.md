# Build Remaining Variants and Combine

Build ALL remaining variant components from override plans, then combine everything (including the default) into a Figma component set.

## Before You Start

Read these reference files in `2-implement-in-figma/reference/`:
1. `figma-use-rules.md` — Critical rules for every `use_figma` call
2. `figma-gotchas.md` — Silent bugs to avoid
3. `figma-component-patterns.md` — Component and component set creation, `combineAsVariants()`
4. `figma-variable-binding.md` — How to bind design tokens
5. `fix-sizing.md` — The `fixSizing()` function

## Inputs

| Input | Description |
|-------|-------------|
| `build-plan.md` | Frame tree, instance manifest, style properties (shared structure) |
| `variant-plans.md` | Per-variant override plans (property diff tables) |
| `default-variant/figma-result.md` | Default variant node ID |
| `fileKey` | Figma file key |
| `parentFrameId` | Node ID of the container frame |

## Output

Write `figma-result.md` to the component directory (root level, not under `default-variant/`).

## Procedure

### 1. Read all plans

Parse:
- `build-plan.md` → frame tree (structure to clone for each variant), instance manifest
- `variant-plans.md` → list of combos, each with property override tables and structural overrides
- `default-variant/figma-result.md` → default variant node ID

### 2. Build each remaining variant

For each combo in `variant-plans.md`:

**a) Clone the default variant structure**

Create a new component with the same frame tree as the default. Use the frame tree from `build-plan.md` — build it from scratch (do NOT use `clone()` — Figma Plugin API component cloning creates instances, not independent components).

```javascript
const variant = figma.createComponent();
variant.name = '{componentName}';
// ... apply the same base structure from build-plan.md
// ... same children, instances, text nodes
```

**b) Apply property overrides**

For each override in the variant's property override table:

```javascript
// COLOR override:
const figmaVar = await figma.variables.getVariableByIdAsync('{newVariableId}');
node.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
node.setBoundVariable('fills', 0, figmaVar);

// If no variable ID, use fallback:
node.fills = [{ type: 'SOLID', color: {fallbackRgb} }];

// SIZE override:
node.paddingLeft = {newValue};
node.paddingRight = {newValue};
node.paddingTop = {newValue};
node.paddingBottom = {newValue};
```

**c) Apply structural overrides**

From the variant's structural overrides table:
```javascript
// Hide a child:
const child = variant.findOne(n => n.name === '{name}');
child.visible = false;

// Change text:
const text = variant.findOne(n => n.type === 'TEXT' && n.characters === '{defaultText}');
await figma.loadFontAsync(text.fontName);
text.characters = '{newText}';
```

**d) Run fixSizing**

```javascript
fixSizing(variant);
```

**e) Append to parent**

```javascript
parentFrame.appendChild(variant);
```

Record each variant's node ID and combo identity.

### 3. Combine into component set

After ALL remaining variants are built:

```javascript
const defaultComp = figma.getNodeById('{defaultNodeId}');

// Set variant names on all components before combining
defaultComp.name = '{axisName1}={defaultValue1}, {axisName2}={defaultValue2}';
// ... for each variant, set name per its combo

const allComponents = [defaultComp, variant1, variant2, ...];
const componentSet = figma.combineAsVariants(allComponents, parentFrame);
componentSet.name = '{componentName}';

// Apply auto-layout to the set frame
componentSet.layoutMode = 'HORIZONTAL';
componentSet.layoutWrap = 'WRAP';
componentSet.itemSpacing = 40;
componentSet.counterAxisSpacing = 40;
componentSet.paddingTop = 40;
componentSet.paddingBottom = 40;
componentSet.paddingLeft = 40;
componentSet.paddingRight = 40;
componentSet.primaryAxisSizingMode = 'AUTO';
componentSet.counterAxisSizingMode = 'AUTO';

return JSON.stringify({
  setId: componentSet.id,
  setName: componentSet.name,
  variants: allComponents.map(c => ({ id: c.id, name: c.name }))
});
```

### 4. Write figma-result.md

Write to `{componentDir}/figma-result.md`:

```markdown
# Figma Result: {componentName}

## Component Set
- **Set Node ID**: {setId}
- **Set Name**: {componentName}
- **Parent Frame**: {parentFrameId}

## Variants

| Variant Name | Node ID | Combo |
|-------------|---------|-------|
| Variant=primary, Size=default | {id} | default |
| Variant=destructive, Size=default | {id} | {combo JSON} |
| Variant=outline, Size=default | {id} | {combo JSON} |
| ... | ... | ... |

## Instance Manifest Used

| Child | Master Node ID | Per-Variant Count |
|-------|---------------|-------------------|
| {name} | {nodeId} | {count} |

## Variable Bindings Applied

| Variant | Property | Variable ID |
|---------|----------|-------------|
| default | fills[0] | VariableID:5:10 |
| destructive | fills[0] | VariableID:5:20 |
| ... | ... | ... |
```

## Splitting Large Builds

If there are many variants (>6), split into batches:

1. **Batch 1**: Build first 3–4 non-default variants, record their IDs
2. **Batch 2**: Build next 3–4 variants, record their IDs
3. **Combine**: All variants (including default) in one `combineAsVariants()` call

Each batch is a separate `use_figma` call. Return node IDs from each.

## Error Handling

| Scenario | Action |
|----------|--------|
| `combineAsVariants` fails | Ensure all components have unique variant names (axis=value format). Retry. |
| Instance master not found | Use the ID from `build-plan.md` instance manifest — verified in Phase 1. |
| Too many nodes for one call | Split into build batches + final combine call. |
| Font loading fails | Use Inter Regular as fallback. |
