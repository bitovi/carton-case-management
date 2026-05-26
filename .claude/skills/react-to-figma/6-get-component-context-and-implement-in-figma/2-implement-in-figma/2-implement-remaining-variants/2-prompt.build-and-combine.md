# 6 Get Component Context and Implement in Figma
## 6.2 Implement in Figma
### 6.2.2 Implement Remaining Variants
#### 6.2.2.2 Build Remaining Variants and Combine

**Begin your response by outputting the heading lines above verbatim.**

Build ALL remaining variant components from override plans, then combine everything (including the default) into a Figma component set.

## Before You Start

Read these reference files in `2-implement-in-figma/reference/`:
1. `figma-use-rules.md` — Critical rules for every `use_figma` call
2. `figma-gotchas.md` — Silent bugs to avoid
3. `figma-component-patterns.md` — Component and component set creation, `combineAsVariants()`
4. `figma-variable-binding.md` — How to bind design tokens
5. `fix-sizing.md` — The `fixSizing()` function

## DO NOT

- Do NOT write `use_figma` code from memory. Use the exact patterns from the reference files above.
- Do NOT build more than 3-4 variants per `use_figma` call. Split into batches and return node IDs from each.
- Do NOT skip setting layout on the component set after `combineAsVariants()` — it stacks everything at (0,0) by default.
- Do NOT skip `fixSizing()` on each variant before combining, AND on the set after combining.
- Do NOT report the build as successful without the orchestrator running the verify step. A call returning without error does NOT mean the component looks correct.
- Do NOT create variants from scratch when cloning is available. Use `base.clone()` + override (see §2a).

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

**a) Resolve the parent frame and clone the default variant**

Every `use_figma` call that appends to the parent frame MUST start by resolving it. Then use `clone()` on the default component node. This creates an independent ComponentNode copy (NOT an instance) with all children, layout, and bindings intact.

```javascript
const parentFrame = figma.getNodeById('{parentFrameId}');
const defaultComp = figma.getNodeById('{defaultNodeId}');
const variant = defaultComp.clone();
variant.name = '{componentName}';
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

defaultComp.name = '{axisName1}={defaultValue1}, {axisName2}={defaultValue2}';
// ... for each variant, set name per its combo

const allComponents = [defaultComp, variant1, variant2, ...];
const componentSet = figma.combineAsVariants(allComponents, parentFrame);
componentSet.name = '{componentName}';

// Light gray fill + rounded corners on the component set (Figma best practice)
componentSet.fills = [{ type: 'SOLID', color: { r: 0.95, g: 0.95, b: 0.98 } }];
componentSet.cornerRadius = 8;
```

#### Layout the component set

`combineAsVariants` stacks everything at (0,0). Use WRAP auto-layout with a calculated fixed width to create a grid:

```javascript
const SPACING = 40;
const columns = Math.ceil(Math.sqrt(allComponents.length));
const maxChildWidth = Math.max(...componentSet.children.map(c => c.width));
const targetWidth = columns * (maxChildWidth + SPACING) + SPACING;

componentSet.layoutMode = 'HORIZONTAL';
componentSet.layoutWrap = 'WRAP';
componentSet.itemSpacing = SPACING;
componentSet.counterAxisSpacing = SPACING;
componentSet.paddingTop = SPACING;
componentSet.paddingBottom = SPACING;
componentSet.paddingLeft = SPACING;
componentSet.paddingRight = SPACING;

// Fixed width forces wrapping at the correct column count
componentSet.resize(targetWidth, componentSet.height);
componentSet.primaryAxisSizingMode = 'FIXED';
componentSet.counterAxisSizingMode = 'AUTO';
```

Do NOT use manual x/y positioning — it conflicts with auto-layout. Do NOT set `layoutSizingHorizontal` or `layoutSizingVertical` on the component set.

Do NOT set `x` or `y` on the component set itself — the parent container frame uses WRAP auto-layout to position component sets automatically in rows.

### 4. Wire component properties

If `build-plan.md` or `variant-plans.md` includes a "Component Properties" section, wire them AFTER `combineAsVariants`:

```javascript
// BOOLEAN property (show/hide a child node)
const boolKey = componentSet.addComponentProperty(
  'Show left icon',
  'BOOLEAN',
  false
);

// Wire the BOOLEAN to control child visibility in EVERY variant
for (const variant of componentSet.children) {
  const slotNode = variant.findOne(n => n.name === 'leftIcon');
  if (slotNode) {
    slotNode.visible = false; // default state
    slotNode.componentPropertyReferences = { visible: boolKey };
  }
}

// INSTANCE_SWAP property (swap which component fills a slot)
const swapKey = componentSet.addComponentProperty(
  'Left icon',
  'INSTANCE_SWAP',
  placeholderComponentId
);

for (const variant of componentSet.children) {
  const slotInstance = variant.findOne(n => n.name === 'leftIcon' && n.type === 'INSTANCE');
  if (slotInstance) {
    slotInstance.componentPropertyReferences = { mainComponent: swapKey };
  }
}
```

The base variant must already contain hidden placeholder nodes for all BOOLEAN-controlled children (built in the default variant step). `addComponentProperty` is only available on the component set, so this step must happen AFTER combining.

Return the result:

```javascript
return JSON.stringify({
  setId: componentSet.id,
  setName: componentSet.name,
  variants: componentSet.children.map(c => ({ id: c.id, name: c.name }))
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

## Component Properties Wired

| Property | Figma Type | Key | Controlled Node | Default |
|----------|-----------|-----|----------------|---------|
| Show left icon | BOOLEAN | {key} | leftIcon | false (hidden) |
| Left icon | INSTANCE_SWAP | {key} | leftIcon instance | {placeholderId} |
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
