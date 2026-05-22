# Build Default Variant

Build a single Figma component from a structured build plan. This agent reads ONLY the build plan and reference files — no raw component inputs.

## Before You Start

Read these reference files in `2-implement-in-figma/reference/`:
1. `figma-use-rules.md` — Critical rules for every `use_figma` call
2. `figma-gotchas.md` — Silent bugs to avoid
3. `figma-component-patterns.md` — Component and instance creation patterns
4. `figma-variable-binding.md` — How to bind design tokens
5. `tailwind-figma-map.md` — Tailwind CSS → Figma property translation
6. `fix-sizing.md` — The `fixSizing()` function (mandatory after every build)

## Inputs

| Input | Description |
|-------|-------------|
| `build-plan.md` | Structured plan: frame tree, instance manifest, style properties, variable bindings, text overrides, fonts |
| `fileKey` | Figma file key |
| `parentFrameId` | Node ID of the container frame to append into |

## Output

Write `default-variant/figma-result.md` to the component directory.

## Procedure

### 1. Read the build plan

Parse `build-plan.md` and extract:
- **Frame tree** — the hierarchical node structure to create
- **Instance manifest** — child master node IDs and usage counts
- **Style properties** — per-node layout, fills, strokes, radius, spacing
- **Variable bindings** — which properties bind to which variable IDs
- **Text nodes** — characters, font, size, color
- **Instance text overrides** — what text to set on each instance
- **Fonts required** — which font styles to load

### 2. Prepare the use_figma script

Before writing the `use_figma` call:

1. **Inline variable data** — the plugin sandbox has no filesystem access. Embed the relevant variable IDs from the build plan as a JSON literal:
   ```javascript
   const variableMap = {
     "bg-card": { variableId: "VariableID:5:30" },
     "border-border": { variableId: "VariableID:5:14" },
     // ... only entries used by this component
   };
   ```

2. **Inline the instance manifest** as a lookup:
   ```javascript
   const masters = {
     "EditableTitle": "1199:2",
     "Icon/Mail": "10:22",
     // ... all entries from the manifest
   };
   ```

3. **Plan call splitting** — if the frame tree has >10 nodes, split across multiple `use_figma` calls. Return all node IDs from each call.

### 3. Execute use_figma calls

Follow the frame tree top-down. For each node in the tree:

**COMPONENT (root)**:
```javascript
const comp = figma.createComponent();
comp.name = '{componentName}';
comp.layoutMode = '{from build plan}';
comp.primaryAxisSizingMode = 'AUTO';
comp.counterAxisSizingMode = 'AUTO';
comp.itemSpacing = {from plan};
comp.paddingTop = {from plan};
comp.paddingBottom = {from plan};
comp.paddingLeft = {from plan};
comp.paddingRight = {from plan};
```

**FRAME (wrapper)**:
```javascript
const frame = figma.createFrame();
frame.name = '{from plan}';
frame.layoutMode = '{from plan}';
frame.primaryAxisSizingMode = 'AUTO';
frame.counterAxisSizingMode = 'AUTO';
frame.itemSpacing = {from plan};
frame.fills = []; // transparent unless plan specifies fills
parent.appendChild(frame);
```

**INSTANCE**:
```javascript
const master = figma.getNodeById(masters['{childName}']);
const inst = master.createInstance();
// If master is a component set, select variant:
// inst.setProperties({ State: 'Rest' });
parent.appendChild(inst);
```

**TEXT override on instance**:
```javascript
const textNode = inst.findOne(n => n.type === 'TEXT' && n.characters === '{findBy}');
await figma.loadFontAsync(textNode.fontName);
textNode.characters = '{characters from plan}';
// Do NOT override fontSize, fontName, lineHeight, or fills
```

**TEXT node (standalone)**:
```javascript
const text = figma.createText();
text.characters = '{from plan}';
text.fontSize = {from plan};
text.fontName = { family: 'Inter', style: '{from plan}' };
text.lineHeight = { value: {from plan}, unit: 'PIXELS' };
text.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
// Bind text color variable if specified in plan
parent.appendChild(text);
```

**RECTANGLE (divider)**:
```javascript
const rect = figma.createRectangle();
rect.name = '{from plan}';
rect.resize({w}, {h});
rect.fills = [{ type: 'SOLID', color: {from plan} }];
rect.layoutSizingHorizontal = 'FILL'; // if plan says so
parent.appendChild(rect);
```

**ICON instance**:
```javascript
const iconMaster = figma.getNodeById(masters['Icon/{name}']);
const iconInst = iconMaster.createInstance();
iconInst.resize({w}, {h}); // from plan, e.g. 16,16
parent.appendChild(iconInst);
```

### 4. Bind variables

For each entry in the build plan's variable bindings:

```javascript
const figmaVar = await figma.variables.getVariableByIdAsync('{variableId}');

// COLOR variables (fills, strokes, text fills):
node.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }]; // placeholder
node.setBoundVariable('fills', 0, figmaVar);

// FLOAT variables (radius):
node.setBoundVariable('topLeftRadius', figmaVar);
node.setBoundVariable('topRightRadius', figmaVar);
node.setBoundVariable('bottomLeftRadius', figmaVar);
node.setBoundVariable('bottomRightRadius', figmaVar);
```

For properties WITHOUT a variable ID, use the fallback RGB from the plan:
```javascript
node.fills = [{ type: 'SOLID', color: { r: 0.886, g: 0.910, b: 0.941 } }];
```

### 5. fixSizing and append

```javascript
fixSizing(comp);
parentFrame.appendChild(comp);
return JSON.stringify({ name: comp.name, id: comp.id });
```

Include the `fixSizing()` function from `reference/fix-sizing.md` in every `use_figma` call that creates components.

### 6. Write figma-result.md

Write to `{componentDir}/default-variant/figma-result.md`:

```markdown
# Figma Result: {componentName} (default variant)

## Component
- **Node ID**: {nodeId}
- **Name**: {figmaName}
- **Parent Frame**: {parentFrameId}

## Instance Manifest Used

| Child | Master Node ID | Instance Count |
|-------|---------------|----------------|
| {name} | {nodeId} | {count} |

## Variable Bindings Applied

| Property | Variable ID | Bound |
|----------|-------------|-------|
| fills[0] | VariableID:5:30 | yes |
| cornerRadius | VariableID:5:40 | yes |
| strokes[0] | — | no (hardcoded) |
```

## Error Handling

| Scenario | Action |
|----------|--------|
| `use_figma` fails | Diagnose error, fix script, retry once. If still fails, return as `failed`. |
| Master node ID invalid | Report which child is broken. Do not substitute. |
| Font not available | Fall back to `{ family: 'Inter', style: 'Regular' }`. |
| Too many nodes for one call | Split into multiple `use_figma` calls. Build shell first, add children in subsequent calls. |
