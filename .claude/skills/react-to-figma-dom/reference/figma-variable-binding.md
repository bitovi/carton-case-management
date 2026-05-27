# Figma Variable Binding Patterns

How to bind Figma variables to node properties via `use_figma`. Variables connect design tokens (colors, spacing, radius) to component properties so changes propagate globally.

## Resolving Variables

```javascript
const figmaVar = await figma.variables.getVariableByIdAsync('VariableID:123:1');
```

Always resolve by ID (from `figma-variables-map.json`), never by name.

## Color Variables (fills, strokes, text)

Color variables bind to paint arrays by index. You must set a placeholder paint FIRST, then bind the variable to it.

### Fills

```javascript
// 1. Set placeholder fill (color values don't matter — variable overrides them)
comp.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
// 2. Bind variable to fills[0]
comp.setBoundVariable('fills', 0, figmaVar);
```

### Strokes

```javascript
comp.strokes = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
comp.setBoundVariable('strokes', 0, figmaVar);
```

### Text Fills

```javascript
textNode.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
textNode.setBoundVariable('fills', 0, figmaVar);
```

## Float Variables (radius, spacing)

Float variables bind directly to a property name (no index).

### Corner Radius

```javascript
const radiusVar = await figma.variables.getVariableByIdAsync(variableMap['var(--radius)'].id);
comp.setBoundVariable('topLeftRadius', radiusVar);
comp.setBoundVariable('topRightRadius', radiusVar);
comp.setBoundVariable('bottomLeftRadius', radiusVar);
comp.setBoundVariable('bottomRightRadius', radiusVar);
```

### Spacing

```javascript
const gapVar = await figma.variables.getVariableByIdAsync(variableMap['var(--spacing-4)'].id);
comp.setBoundVariable('itemSpacing', gapVar);
comp.setBoundVariable('paddingTop', gapVar);
```

## Color Resolution Chain

When building a component, resolve Tailwind color classes to Figma variables using this chain:

1. **Check `figma-variables-map.json`** — look up the Tailwind class (e.g., `bg-primary`, `text-muted-foreground`, `border-input`). If found, bind the variable by ID.
2. **Check `css-figma-map.json`** — maps CSS custom properties to Figma variable paths. If the CSS variable name is found, use the mapped variable.
3. **Fallback to `design-tokens.json`** — extract the resolved RGB value and hardcode it.
4. **Fallback to computed styles** — use the resolved RGB value from `dom.json` computed styles and convert to 0–1 range.

### Inline the variable map

The `use_figma` sandbox has no filesystem access. Read `figma-variables-map.json` BEFORE the call and inline only the relevant entries:

```javascript
// Outside use_figma: read and filter
const fullMap = JSON.parse(fs.readFileSync('.temp/react-to-figma/figma-variables-map.json'));
const relevantVars = {};
for (const cls of componentTailwindClasses) {
  if (fullMap[cls]) relevantVars[cls] = fullMap[cls];
}

// Inside use_figma: inline as literal
const variableMap = {
  "bg-primary": { "figmaPath": "Semantic/primary", "variableId": "VariableID:5:20" },
  "text-primary-foreground": { "figmaPath": "Semantic/primary-foreground", "variableId": "VariableID:5:21" }
};
```

## Important Rules

- Paint `color` is `{r, g, b}` — NO alpha field. Use paint-level `opacity` instead
- Variable-bound color values internally use `{r, g, b, a}` — this is a different API path, don't confuse with paint colors
- Always set a placeholder paint BEFORE binding — `setBoundVariable` on an empty fills array throws
- Variable binding is idempotent — re-binding the same variable is safe
