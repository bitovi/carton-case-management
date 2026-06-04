# Variable & Token API Patterns

Patterns for creating, binding, scoping, aliasing, and discovering variables via `use_figma`.

---

## Creating Variable Collections and Modes

```javascript
const collection = figma.variables.createVariableCollection("MyCollection");

// A new collection starts with 1 mode named "Mode 1" — always rename it
collection.renameMode(collection.modes[0].modeId, "Light");

// Add additional modes (returns the new modeId)
const darkModeId = collection.addMode("Dark");
const lightModeId = collection.modes[0].modeId;
```

**Mode limits are plan-dependent:** Free = 1 mode, Professional = up to 4, Organization/Enterprise = 40+.

---

## Creating Variables (All Types)

`figma.variables.createVariable(name, collection, resolvedType)` — the second argument accepts a collection object or ID string (object preferred).

```javascript
// COLOR — values use {r, g, b, a} (all 0–1 range, includes alpha)
const colorVar = figma.variables.createVariable("my-color", collection, "COLOR");
colorVar.setValueForMode(modeId, { r: 0.2, g: 0.36, b: 0.96, a: 1 });

// FLOAT — for spacing, radii, sizing, numeric values
const floatVar = figma.variables.createVariable("my-spacing", collection, "FLOAT");
floatVar.setValueForMode(modeId, 16);

// STRING — for font families, font style names, any text value
const stringVar = figma.variables.createVariable("my-font", collection, "STRING");
stringVar.setValueForMode(modeId, "Inter");

// BOOLEAN
const boolVar = figma.variables.createVariable("my-flag", collection, "BOOLEAN");
boolVar.setValueForMode(modeId, true);
```

**Note:** Paint colors use `{r, g, b}` (no alpha), but COLOR variable values use `{r, g, b, a}` (with alpha). Don't mix them up.

---

## Binding Variables to Node Properties

### Color variables on fills/strokes

```javascript
// Set a placeholder fill first, then bind
node.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
node.setBoundVariable('fills', 0, colorVariable);

// For strokes
node.strokes = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
node.setBoundVariable('strokes', 0, colorVariable);
```

### Float variables on numeric properties

```javascript
node.setBoundVariable('topLeftRadius', radiusVariable);
node.setBoundVariable('topRightRadius', radiusVariable);
node.setBoundVariable('bottomLeftRadius', radiusVariable);
node.setBoundVariable('bottomRightRadius', radiusVariable);
node.setBoundVariable('itemSpacing', spacingVariable);
node.setBoundVariable('paddingTop', spacingVariable);
```

### Using `setBoundVariableForPaint` (returns NEW paint)

```javascript
// ⚠️ WRONG — ignoring return value
figma.variables.setBoundVariableForPaint(paint, "color", colorVar);
node.fills = [paint];  // paint is unchanged!

// ✅ CORRECT — capture the returned new paint
const boundPaint = figma.variables.setBoundVariableForPaint(paint, "color", colorVar);
node.fills = [boundPaint];
```

---

## Variable Scopes: What They Are and How to Set Them

Scopes control where the variable appears in Figma's property panel pickers.

```javascript
// Semantic variables: targeted scopes
variable.scopes = ["FRAME_FILL", "SHAPE_FILL", "TEXT_FILL"];

// Primitives: hidden from all pickers
variable.scopes = [];

// Border/stroke colors
variable.scopes = ["STROKE_COLOR"];

// Numeric tokens
variable.scopes = ["CORNER_RADIUS"];  // radius
variable.scopes = ["GAP"];            // spacing
```

---

## Variable Aliasing (VARIABLE_ALIAS)

```javascript
// Create an alias: semantic → primitive
const aliasValue = figma.variables.createVariableAlias(primitiveVariable);
// aliasValue = { type: 'VARIABLE_ALIAS', id: primitiveVariable.id }

semanticVariable.setValueForMode(modeId, aliasValue);
```

**Rules:**
- `createVariableAlias` takes a Variable **object**, not an ID string
- The aliased variable MUST have the same `resolvedType`
- Cross-file aliasing is NOT supported — import library variables first

---

## Code Syntax (`setVariableCodeSyntax`)

```javascript
variable.setVariableCodeSyntax('WEB', 'var(--color-primary)');
variable.setVariableCodeSyntax('ANDROID', 'R.color.primary');
variable.setVariableCodeSyntax('iOS', 'Color.primary');
```

---

## Importing Library Variables

```javascript
// Import a variable from a team library by its key
const importedVar = await figma.variables.importVariableByKeyAsync(variableKey);
// Now you can alias to it or bind to nodes
```

---

## Discovering Existing Variables in the File

### List collections with mode info

```javascript
const collections = await figma.variables.getLocalVariableCollectionsAsync();
const results = collections.map(c => ({
  name: c.name,
  id: c.id,
  varCount: c.variableIds.length,
  modes: c.modes.map(m => ({ name: m.name, id: m.modeId }))
}));
return results;
```

### List variables in a specific collection

```javascript
const allVars = await figma.variables.getLocalVariablesAsync();
const collVars = allVars.filter(v => v.variableCollectionId === targetCollectionId);
const result = collVars.map(v => ({
  id: v.id,
  name: v.name,
  resolvedType: v.resolvedType,
  scopes: v.scopes,
  codeSyntax: v.codeSyntax
}));
return { variableCount: result.length, variables: result };
```

### Find a variable by name

```javascript
const allVars = await figma.variables.getLocalVariablesAsync();
const found = allVars.find(v => v.name === 'primary' && v.variableCollectionId === collId);
```

---

## Effect Styles (For Shadows)

```javascript
const style = figma.createEffectStyle();
style.name = "shadow/md";
style.effects = [{
  type: 'DROP_SHADOW',
  color: { r: 0, g: 0, b: 0, a: 0.1 },
  offset: { x: 0, y: 4 },
  radius: 6,
  spread: -1,
  visible: true,
  blendMode: 'NORMAL'
}];

// Apply to a node
node.effectStyleId = style.id;
```
