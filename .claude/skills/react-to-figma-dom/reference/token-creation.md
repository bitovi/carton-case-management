# Token Creation Reference

Distilled from Figma's official MCP server guide. Copy-paste-ready patterns for creating variable collections, variables, aliases, scopes, and code syntax via `use_figma`.

---

## 1. Collection Architecture

### Standard Pattern (our project uses this)

Separate primitives from semantics. Single mode for primitives, single mode for our semantic layer (no dark mode yet).

```
Collection: "Palette"    modes: ["Value"]       ← raw hex values
  gray/950 = #192627
  teal/500 = #019AAF

Collection: "Semantic"   modes: ["Value"]       ← aliases to Palette (or raw values)
  primary = alias Palette/teal/500
  foreground = alias Palette/gray/950

Collection: "Numbers"    modes: ["Value"]       ← spacing, radius values
  border-radius/lg = 16
  spacing/4 = 16
```

### Key Points

- Each collection starts with 1 default mode named "Mode 1" — always rename it
- Mode limits are plan-dependent: Free = 1, Professional = up to 4, Org/Enterprise = 40+
- Duplicate variable names DON'T throw — Figma silently creates a second variable with the same name. Always check for existence before creating.

---

## 2. Creating Collections + Modes

### Creating a Primitives Collection

```javascript
const primColl = figma.variables.createVariableCollection("Palette");
primColl.renameMode(primColl.modes[0].modeId, "Value");
const modeId = primColl.modes[0].modeId;

return {
  collectionId: primColl.id,
  modeId,
  name: primColl.name
};
```

### Creating a Spacing/Numbers Collection (single mode)

```javascript
const numbersColl = figma.variables.createVariableCollection("Numbers");
numbersColl.renameMode(numbersColl.modes[0].modeId, "Value");
const modeId = numbersColl.modes[0].modeId;

return {
  collectionId: numbersColl.id,
  modeId
};
```

---

## 3. Creating All Variable Types

### COLOR Variables

Values use `{r, g, b, a}` — all 0–1 range, includes alpha. This is different from paint colors which use `{r, g, b}` with no alpha.

```javascript
function hexToRgb(hex) {
  const c = hex.replace('#', '');
  return {
    r: parseInt(c.slice(0, 2), 16) / 255,
    g: parseInt(c.slice(2, 4), 16) / 255,
    b: parseInt(c.slice(4, 6), 16) / 255
  };
}

const primitiveColors = [
  { name: 'gray/950', hex: '#192627' },
  { name: 'teal/500', hex: '#019AAF' },
];

const created = [];
for (const { name, hex } of primitiveColors) {
  const v = figma.variables.createVariable(name, primColl, 'COLOR');
  const rgb = hexToRgb(hex);
  v.setValueForMode(modeId, { r: rgb.r, g: rgb.g, b: rgb.b, a: 1 });
  v.scopes = [];  // primitives: hide from pickers
  created.push({ name, id: v.id });
}

return { created, count: created.length };
```

### FLOAT Variables (spacing, radius)

```javascript
const spacingTokens = [
  { name: 'spacing/4', value: 16, scope: 'GAP' },
  { name: 'border-radius/lg', value: 16, scope: 'CORNER_RADIUS' },
];

const created = [];
for (const { name, value, scope } of spacingTokens) {
  const v = figma.variables.createVariable(name, numbersColl, 'FLOAT');
  v.setValueForMode(modeId, value);
  v.scopes = [scope];
  created.push({ name, value, id: v.id });
}

return { created, count: created.length };
```

### STRING Variables (font family, style)

```javascript
const v = figma.variables.createVariable('family/sans', typoColl, 'STRING');
v.setValueForMode(modeId, 'Inter');
v.scopes = ['FONT_FAMILY'];
```

### BOOLEAN Variables

BOOLEAN variables have NO scopes (scopes are not supported for BOOLEAN type).

```javascript
const v = figma.variables.createVariable('feature-flags/beta', coll, 'BOOLEAN');
v.setValueForMode(modeId, false);
```

---

## 4. Variable Aliasing (VARIABLE_ALIAS)

Aliases point semantic variables to primitive variables. Use `figma.variables.createVariableAlias(variable)` which takes a Variable object and returns `{type: 'VARIABLE_ALIAS', id: variable.id}`.

```javascript
// Look up the primitive variable
const allVars = await figma.variables.getLocalVariablesAsync();
const primVar = allVars.find(v => v.name === 'teal/500' && v.variableCollectionId === primCollId);

// Create semantic alias
const semanticVar = figma.variables.createVariable('primary', semanticColl, 'COLOR');
semanticVar.setValueForMode(modeId, figma.variables.createVariableAlias(primVar));
semanticVar.scopes = ['FRAME_FILL', 'SHAPE_FILL', 'TEXT_FILL', 'STROKE_COLOR'];
```

**Key API points:**
- `figma.variables.createVariableAlias(variable)` takes a Variable **object**, not an ID string
- The aliased variable MUST have the same `resolvedType` as the semantic variable
- Alias value shape: `{ type: 'VARIABLE_ALIAS', id: '<variableId>' }`
- Never duplicate raw values in the semantic layer — always alias when possible

---

## 5. Variable Scopes — Reference Table

Scopes control where variables appear in the Figma property panel pickers.

| Scope | Where it appears |
|-------|-----------------|
| `ALL_SCOPES` | Everywhere (avoid — too noisy) |
| `ALL_FILLS` | All fill pickers |
| `FRAME_FILL` | Frame background fill |
| `SHAPE_FILL` | Shape fill |
| `TEXT_FILL` | Text color |
| `STROKE_COLOR` | Stroke/border color |
| `CORNER_RADIUS` | Border radius input |
| `GAP` | Auto-layout gap |
| `WIDTH_HEIGHT` | Width/height |
| `OPACITY` | Opacity slider |
| `FONT_FAMILY` | Font family picker |
| `FONT_STYLE` | Font style picker (Regular, Bold, etc.) |
| `FONT_SIZE` | Font size input |
| `LINE_HEIGHT` | Line height input |
| `LETTER_SPACING` | Letter spacing input |
| `PARAGRAPH_SPACING` | Paragraph spacing |
| `PARAGRAPH_INDENT` | Paragraph indent |
| `EFFECT_FLOAT` | Effect values (blur, shadow offsets) |
| `EFFECT_COLOR` | Effect color (shadow color) |

**Best practice:**
- Primitives: `scopes = []` (empty — hidden from all pickers)
- Semantic colors: targeted scopes only (e.g., `['FRAME_FILL', 'SHAPE_FILL', 'TEXT_FILL']`)
- Never use `ALL_SCOPES` unless explicitly approved

---

## 6. Code Syntax

Set platform-specific code syntax so designers see the CSS variable name in Dev Mode:

```javascript
v.setVariableCodeSyntax('WEB', 'var(--color-primary)');
v.setVariableCodeSyntax('ANDROID', 'R.color.primary');
v.setVariableCodeSyntax('iOS', 'Color.primary');
```

---

## 7. Batching Strategy

For our project (~157 tokens):

| Collection | Token Count | Batch Size | Calls |
|-----------|-------------|------------|-------|
| Palette | 89 | 30 | 3 |
| Semantic | 59 | 30 | 2 |
| Numbers | 9 | 30 | 1 |
| **Total** | **157** | | **6** |

First batch of each collection creates the collection and returns `collectionId`. Subsequent batches reuse the collection ID.

---

## 8. Idempotency — Check-Before-Create

### For Collections

```javascript
const existing = await figma.variables.getLocalVariableCollectionsAsync();
let coll = existing.find(c => c.name === 'Palette');

if (coll) {
  return { status: 'already_exists', collectionId: coll.id };
}

coll = figma.variables.createVariableCollection('Palette');
coll.renameMode(coll.modes[0].modeId, 'Value');

return { status: 'created', collectionId: coll.id };
```

### For Variables

Check by name within a collection (names should be unique per collection):

```javascript
const allVars = await figma.variables.getLocalVariablesAsync();
const existing = allVars.find(v => v.name === 'gray/950' && v.variableCollectionId === collId);

if (existing) {
  return { status: 'already_exists', id: existing.id, name: existing.name };
}

// ... create the variable ...
```

---

## 9. Validation

Run after creating all variables to verify everything was created correctly:

```javascript
const collections = await figma.variables.getLocalVariableCollectionsAsync();
const allVars = await figma.variables.getLocalVariablesAsync();

const summary = collections.map(c => {
  const vars = allVars.filter(v => v.variableCollectionId === c.id);
  return {
    name: c.name,
    id: c.id,
    modes: c.modes.map(m => m.name),
    variableCount: vars.length,
    sampleVariables: vars.slice(0, 3).map(v => v.name)
  };
});

return {
  collectionCount: collections.length,
  totalVariables: allVars.length,
  collections: summary
};
```
