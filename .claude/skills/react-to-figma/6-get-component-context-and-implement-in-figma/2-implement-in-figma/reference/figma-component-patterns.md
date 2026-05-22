# Figma Component Creation Patterns

Patterns for creating components, component sets (with variants), and working with instances via `use_figma`.

## Single Component

```javascript
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

### 1. Create individual variant components

Each variant is a separate `createComponent()` call. Name format: `Property1=value1, Property2=value2`.

```javascript
const variants = [];

for (const combo of variantCombos) {
  const v = figma.createComponent();
  v.name = Object.entries(combo).map(([k, val]) => `${k}=${val}`).join(', ');
  
  // Apply base layout
  v.layoutMode = 'HORIZONTAL';
  v.primaryAxisSizingMode = 'AUTO';
  v.counterAxisSizingMode = 'AUTO';
  
  // Apply per-variant overrides (fills, radius, sizing, etc.)
  // ...
  
  // Build children (instances + text nodes)
  // ...
  
  fixSizing(v);
  variants.push(v);
}
```

### 2. Combine into a set

```javascript
const set = figma.combineAsVariants(variants, parentFrame);
set.name = 'MyComponent';

// MUST set layout on the set — combineAsVariants stacks everything at (0,0)
set.layoutMode = 'HORIZONTAL';
set.layoutWrap = 'WRAP';
set.primaryAxisSizingMode = 'AUTO';
set.counterAxisSizingMode = 'AUTO';
set.itemSpacing = 16;
set.counterAxisSpacing = 16;
set.paddingTop = 16;
set.paddingBottom = 16;
set.paddingLeft = 16;
set.paddingRight = 16;

// Fix sizing on all variants within the set
for (const v of set.children) fixSizing(v);
fixSizing(set);

return {
  name: set.name,
  id: set.id,
  variants: set.children.map(c => ({ name: c.name, id: c.id }))
};
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
