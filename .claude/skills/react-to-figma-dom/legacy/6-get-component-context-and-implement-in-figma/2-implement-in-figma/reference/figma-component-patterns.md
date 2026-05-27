# Figma Component Creation Patterns

Patterns for creating components, component sets (with variants), and working with instances via `use_figma`.

## Single Component

```javascript
const parentFrame = figma.getNodeById('{parentFrameId}');
const comp = figma.createComponent();
comp.name = 'MyComponent';
comp.layoutMode = 'VERTICAL';
comp.primaryAxisSizingMode = 'AUTO';
comp.counterAxisSizingMode = 'AUTO';
comp.itemSpacing = 8;
comp.paddingTop = 16;
comp.paddingBottom = 16;
comp.paddingLeft = 16;
comp.paddingRight = 16;
comp.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];

// Add children...
fixSizing(comp);
parentFrame.appendChild(comp);
return { name: comp.name, id: comp.id };
```

## Component Set (Variants)

### Variant count guidance

Independent axes should always be Component Properties — they never multiply. For dependent axes, the cross-product can legitimately exceed 30 for complex components (e.g., Button with 6 variants × 4 sizes × 2 roundness × 4 states = 192 is normal). If the count is high, verify each axis is truly visual — but do not force-convert visual axes just to reduce the count.

### 1. Create the base variant, then clone for remaining variants

Build the default/base variant fully (layout, children, variable bindings). Then use `clone()` for each remaining variant — this creates an independent ComponentNode copy with all children and bindings intact.

```javascript
// Build the base variant first (via the default variant build step)
const base = figma.getNodeById(baseNodeId); // already built

// Clone for each remaining variant
const variant2 = base.clone();
variant2.name = 'Variant=secondary, Size=default';
// Override only what differs:
const figmaVar = await figma.variables.getVariableByIdAsync(newVariableId);
variant2.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
variant2.setBoundVariable('fills', 0, figmaVar);
// ... apply other overrides from variant plan

fixSizing(variant2);
```

### 2. Combine into a set with manual grid layout

```javascript
const parentFrame = figma.getNodeById('{parentFrameId}');
const allComponents = [base, variant2, variant3, ...];
const set = figma.combineAsVariants(allComponents, parentFrame);
set.name = 'MyComponent';

// Light gray fill + rounded corners on the component set (Figma best practice)
set.fills = [{ type: 'SOLID', color: { r: 0.95, g: 0.95, b: 0.98 } }];
set.cornerRadius = 8;

// combineAsVariants stacks everything at (0,0) — use WRAP layout with fixed width
const SPACING = 40;
const columns = Math.ceil(Math.sqrt(allComponents.length));
const maxChildWidth = Math.max(...set.children.map(c => c.width));
const targetWidth = columns * (maxChildWidth + SPACING) + SPACING;

set.layoutMode = 'HORIZONTAL';
set.layoutWrap = 'WRAP';
set.itemSpacing = SPACING;
set.counterAxisSpacing = SPACING;
set.paddingTop = SPACING;
set.paddingBottom = SPACING;
set.paddingLeft = SPACING;
set.paddingRight = SPACING;

// Fixed width forces wrapping at the correct column count
set.resize(targetWidth, set.height);
set.primaryAxisSizingMode = 'FIXED';
set.counterAxisSizingMode = 'AUTO';

// Fix sizing on all variants within the set
for (const v of set.children) fixSizing(v);
fixSizing(set);

return {
  name: set.name,
  id: set.id,
  variants: set.children.map(c => ({ name: c.name, id: c.id }))
};
```

## Component Properties

Wire component properties AFTER `combineAsVariants()`. These are properties that appear in the Figma properties panel — not variant axes.

### BOOLEAN (visibility toggle)

Controls whether a child node is visible. Used for independent structural toggles (e.g., show/hide icon slot).

```javascript
const boolKey = componentSet.addComponentProperty(
  'Show left icon',   // designer-friendly name
  'BOOLEAN',
  false               // default: hidden
);

// Wire to child node in EVERY variant
for (const variant of componentSet.children) {
  const slot = variant.findOne(n => n.name === 'leftIcon');
  if (slot) {
    slot.visible = false; // match default
    slot.componentPropertyReferences = { visible: boolKey };
  }
}
```

### INSTANCE_SWAP (content swap)

Controls which component fills a slot. Used for independent content axes (e.g., which icon to display).

```javascript
const swapKey = componentSet.addComponentProperty(
  'Left icon',
  'INSTANCE_SWAP',
  placeholderComponentId  // default component to show
);

for (const variant of componentSet.children) {
  const inst = variant.findOne(n => n.name === 'leftIcon' && n.type === 'INSTANCE');
  if (inst) {
    inst.componentPropertyReferences = { mainComponent: swapKey };
  }
}
```

### TEXT (editable text)

Controls text content in a child node.

```javascript
const textKey = componentSet.addComponentProperty(
  'Label',
  'TEXT',
  'Button'  // default text
);

for (const variant of componentSet.children) {
  const text = variant.findOne(n => n.name === 'label' && n.type === 'TEXT');
  if (text) {
    text.componentPropertyReferences = { characters: textKey };
  }
}
```

## Instance Creation + Text Overrides

```javascript
const master = figma.getNodeById(builtComponents['EditableTitle']);
const instance = master.createInstance();

// If master is a component set, select variant
instance.setProperties({ State: 'Rest' });

// Override text content ONLY — keep master's styling defaults
const textNode = instance.findOne(n => n.type === 'TEXT' && n.characters === 'Title');
await figma.loadFontAsync(textNode.fontName);
textNode.characters = 'First Name';

parent.appendChild(instance);
```

### Multi-field instances

```javascript
const inst = editableTextMaster.createInstance();
const textNodes = inst.findAll(n => n.type === 'TEXT');
// textNodes[0] = label, textNodes[1] = value (match by position)
await figma.loadFontAsync(textNodes[0].fontName);
await figma.loadFontAsync(textNodes[1].fontName);
textNodes[0].characters = 'Email Address';
textNodes[1].characters = 'lisa@example.com';
```

## Screenshot-First Override Rule

During the initial build step, override ONLY `characters` (text content) on instances. Do NOT override:
- `fontSize`
- `fontName`
- `lineHeight`
- `fills` (text color)

Keep the master's defaults. Let the visual comparison step catch mismatches, then fix in the fix loop using the diff image as evidence.

## Icon Instances

```javascript
const iconMaster = figma.getNodeById(builtComponents['Icon/Check']);
const iconInst = iconMaster.createInstance();
iconInst.resize(16, 16); // Match Tailwind size class: h-4 w-4 = 16x16
parent.appendChild(iconInst);
```

## Rectangles (Dividers, Decorative)

```javascript
const divider = figma.createRectangle();
divider.name = 'Divider';
divider.resize(200, 1);
divider.fills = [{ type: 'SOLID', color: { r: 0.898, g: 0.906, b: 0.922 } }];
divider.layoutSizingHorizontal = 'FILL';
parent.appendChild(divider);
```
