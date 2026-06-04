# Figma Plugin API Gotchas

Critical gotchas when building components with `use_figma`. Each one causes silent visual bugs if ignored.

## 1. `resize()` Resets Sizing Modes

`resize(w, h)` silently sets BOTH `primaryAxisSizingMode` and `counterAxisSizingMode` to `'FIXED'`. 

**Fix:** Always call `resize()` FIRST, then set sizing modes:
```javascript
comp.resize(200, 40);
comp.primaryAxisSizingMode = 'AUTO';
comp.counterAxisSizingMode = 'AUTO';
```

## 2. HUG Parent + FILL Child = Collapse

A parent with `primaryAxisSizingMode = 'AUTO'` (HUG) will collapse a child that uses `layoutSizingHorizontal = 'FILL'`. The child needs the parent to have a fixed or fill size to stretch against.

**Fix:** Parent must be FIXED or FILL for FILL children to work.

## 3. FILL Only Works Inside Auto-Layout

Setting `layoutSizingHorizontal = 'FILL'` on a node that is NOT inside an auto-layout parent throws an error.

**Fix:** Always `appendChild()` to an auto-layout parent BEFORE setting FILL.

## 4. Font Must Be Loaded Before Text Operations

Any operation on text (`characters`, `fontSize`, `fontName`, etc.) requires the font to be loaded first.

**Fix:** Load all needed fonts at the top of every `use_figma` call:
```javascript
await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
```

## 5. Paint Color Has No Alpha

Fill/stroke `color` is `{r, g, b}` — adding `a` throws. For opacity, use the paint's `opacity` field:
```javascript
comp.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0.5 }];
```

**Exception:** Variable-bound colors use `{r, g, b, a}` — this is a different API path.

## 6. `combineAsVariants` Stacks at (0,0)

After `combineAsVariants()`, all variant components overlap at position (0,0) inside the set. The set has no automatic grid layout.

**Fix:** Set WRAP layout with a calculated fixed width to create a grid:
```javascript
const set = figma.combineAsVariants(variants, parentFrame);

const SPACING = 40;
const columns = Math.ceil(Math.sqrt(variants.length));
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

// CRITICAL: Fixed width forces wrapping. HUG/AUTO never wraps.
set.resize(targetWidth, set.height);
set.primaryAxisSizingMode = 'FIXED';
set.counterAxisSizingMode = 'AUTO';
```

**Warning:** Do NOT use `primaryAxisSizingMode = 'AUTO'` with WRAP — auto/HUG sizing means infinite width, so wrapping never triggers. You MUST set a fixed width.

Do NOT use manual x/y positioning — it conflicts with auto-layout and produces unpredictable results.

## 7. `addComponentProperty` Before `combineAsVariants`

Component properties must be added BEFORE calling `combineAsVariants`. The returned key is a string — never hardcode it, always use the returned value.

## 8. `counterAxisAlignItems` Has No STRETCH

Unlike CSS `align-items: stretch`, Figma has no `'STRETCH'` value for `counterAxisAlignItems`.

**Fix:** Use `'MIN'` on the parent + `layoutSizingHorizontal = 'FILL'` on children.

## 9. Text Padding

Text nodes do NOT support padding properties directly.

**Fix:** Wrap text in a zero-fill auto-layout frame:
```javascript
const wrapper = figma.createFrame();
wrapper.layoutMode = 'HORIZONTAL';
wrapper.primaryAxisSizingMode = 'AUTO';
wrapper.counterAxisSizingMode = 'AUTO';
wrapper.paddingLeft = 4;
wrapper.fills = [];
wrapper.appendChild(textNode);
```

## 10. `getPluginData` Not Supported in `use_figma`

`getPluginData()` and `setPluginData()` throw errors in the `use_figma` sandbox.

**Fix:** Use the shared variant: `getSharedPluginData('namespace', 'key')` and `setSharedPluginData('namespace', 'key', 'value')`.

## 11. `setBoundVariableForPaint` Returns a NEW Paint

The return value is a new paint object with the variable bound — the original paint is NOT mutated.

```javascript
// WRONG — ignoring return value, paint unchanged
figma.variables.setBoundVariableForPaint(paint, "color", colorVar);
node.fills = [paint];

// CORRECT — capture the new paint
const boundPaint = figma.variables.setBoundVariableForPaint(paint, "color", colorVar);
node.fills = [boundPaint];
```

## 12. `layoutSizingHorizontal` Only Works Inside Auto-Layout

Setting `layoutSizingHorizontal = 'FILL'` or `'HUG'` on a node that is NOT inside an auto-layout parent will throw.

**Fix:** Always `appendChild()` to an auto-layout parent BEFORE setting `layoutSizingHorizontal` or `layoutSizingVertical`.

## 13. Variable Collection Starts with 1 Mode

A newly created collection already has one mode named "Mode 1". Don't try to add a first mode — rename the existing one:

```javascript
const collection = figma.variables.createVariableCollection("Colors");
// collection.modes = [{ modeId: "...", name: "Mode 1" }]
collection.renameMode(collection.modes[0].modeId, "Light");
const darkModeId = collection.addMode("Dark");
```

## 14. Duplicate Variable Names Don't Error

Figma silently creates a second variable with the same name. Always check for existence before creating:

```javascript
const existing = (await figma.variables.getLocalVariablesAsync())
  .find(v => v.name === 'primary' && v.variableCollectionId === collId);
if (existing) return { id: existing.id, status: 'already_exists' };
```

## 15. `return` Is the Only Output Channel

`console.log()` output is NOT returned to the caller. Use `return { ... }` to pass data back. The code is auto-wrapped in an async function — do NOT wrap in IIFE.

## 16. Page Context Resets Between Calls

Each `use_figma` call starts on whatever page Figma last had active. Always set the page at the start:

```javascript
const page = figma.getNodeById('PAGE_ID');
figma.currentPage = page;
```
```

## 10. x/y Inside Auto-Layout

Setting `x` or `y` on a node inside an auto-layout parent is silently ignored. Auto-layout manages all positioning.

**Fix:** Use padding, spacing, and alignment to position children. Remove all x/y assignments inside auto-layout frames.

## 11. `lineHeight` and `letterSpacing` Must Be Objects

```javascript
// WRONG
text.lineHeight = 20;

// CORRECT
text.lineHeight = { value: 20, unit: 'PIXELS' };
text.letterSpacing = { value: 0, unit: 'PIXELS' };
```

## 12. Colors Are 0–1 Range

Figma uses 0–1 for RGB, not 0–255. Always divide:
```javascript
const color = { r: 226/255, g: 232/255, b: 240/255 };
```

## 13. `strokeAlign` Must Be OUTSIDE

CSS borders are outside the box by default. Always use:
```javascript
comp.strokeAlign = 'OUTSIDE';
```
Using `'INSIDE'` causes double-border visual artifacts.

## 14. Node Type Safety — No `.children` on TEXT/VECTOR

Accessing `.children`, `.layoutMode`, `.itemSpacing`, or any layout property on a TEXT or VECTOR node **throws a TypeError** — it does not return `undefined`.

```javascript
// WRONG — throws "no such property 'children' on TEXT node"
const child = someNode.children[0];

// CORRECT — check type first, or use getNodeById with known IDs
if (someNode.type === 'FRAME' || someNode.type === 'COMPONENT' || someNode.type === 'INSTANCE' || someNode.type === 'GROUP') {
  const child = someNode.children[0];
}
```

**Safe recursive inspection pattern:**
```javascript
function describe(node, depth) {
  const hasChildren = node.type === 'FRAME' || node.type === 'COMPONENT' ||
                      node.type === 'INSTANCE' || node.type === 'GROUP' ||
                      node.type === 'COMPONENT_SET' || node.type === 'SECTION';
  const info = { id: node.id, name: node.name, type: node.type };
  if (depth > 0 && hasChildren && node.children) {
    info.children = node.children.map(c => describe(c, depth - 1));
  }
  return info;
}
```

**Best practice:** Read `figma-nodes.json` (produced by batch-verify) to know the exact tree structure before writing any fix code. Use `figma.getNodeById('{exactId}')` with real IDs instead of indexing into `.children`.
