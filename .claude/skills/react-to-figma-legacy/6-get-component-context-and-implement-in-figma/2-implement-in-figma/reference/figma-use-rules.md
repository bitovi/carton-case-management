# Figma `use_figma` Critical Rules

Distilled rules for using the `use_figma` MCP tool effectively. Read before every build call.

## Call Structure

1. Each `use_figma` call runs JavaScript in the Figma Plugin sandbox
2. The sandbox has NO filesystem access — inline all data as JSON literals
3. Keep each call to ~10 operations max (create/modify nodes). Split larger builds across multiple calls
4. Return ALL created node IDs from every call — you cannot recover IDs later
5. Calls are sequential — never issue parallel `use_figma` calls

## Pre-Flight Checklist

Before every `use_figma` call, verify:

- [ ] All node IDs being referenced were returned by a previous call (not hardcoded)
- [ ] Color values use 0–1 range (`{ r: 0.5, g: 0.5, b: 0.5 }`), not 0–255
- [ ] Font is loaded before setting characters: `await figma.loadFontAsync({ family: 'Inter', style: 'Regular' })`
- [ ] `resize()` calls happen BEFORE setting sizing modes (resize resets them to FIXED)
- [ ] No `x`/`y` positioning inside auto-layout parents
- [ ] `strokeAlign` is `'OUTSIDE'` (never `'INSIDE'`)
- [ ] Paint `color` uses `{r, g, b}` only — no `a` field on paint colors

## Font Loading

Always load fonts before creating or modifying text:

```javascript
await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
await figma.loadFontAsync({ family: 'Inter', style: 'Semi Bold' });
await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });
```

Load ALL font styles you'll use at the TOP of the `use_figma` call — not inline during node creation.

## Auto-Layout Creation Pattern

```javascript
const frame = figma.createFrame();
frame.layoutMode = 'VERTICAL';
frame.primaryAxisSizingMode = 'AUTO';
frame.counterAxisSizingMode = 'AUTO';
frame.itemSpacing = 8;
frame.paddingTop = 16;
frame.paddingBottom = 16;
frame.paddingLeft = 16;
frame.paddingRight = 16;
frame.fills = []; // transparent by default
```

## Sizing Modes

- Set `resize()` FIRST, then set sizing modes — `resize()` resets both to FIXED
- `layoutSizingHorizontal = 'FILL'` only works when node is already appended to an auto-layout parent
- HUG parent + FILL child = child collapses. Parent must be FIXED or FILL for child FILL to work
- To set hug: `primaryAxisSizingMode = 'AUTO'` (along main axis) or `counterAxisSizingMode = 'AUTO'` (cross axis)

## Component Creation

```javascript
const comp = figma.createComponent();
comp.name = 'MyComponent';
comp.layoutMode = 'VERTICAL';
comp.primaryAxisSizingMode = 'AUTO';
comp.counterAxisSizingMode = 'AUTO';
```

## Instance Creation

```javascript
const master = figma.getNodeById('nodeId');
const instance = master.createInstance();
parent.appendChild(instance);
```

To set variant properties on an instance of a component set:
```javascript
instance.setProperties({ 'Variant': 'primary', 'Size': 'large' });
```

## Variable Binding

```javascript
const figmaVar = await figma.variables.getVariableByIdAsync('VariableID:123:1');

// Color variable on fills
comp.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
comp.setBoundVariable('fills', 0, figmaVar);

// Color variable on strokes
comp.strokes = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
comp.setBoundVariable('strokes', 0, figmaVar);

// Float variable (radius, spacing)
comp.setBoundVariable('topLeftRadius', figmaVar);
comp.setBoundVariable('itemSpacing', figmaVar);
```

## Text Node Rules

- Text nodes do NOT support padding — wrap in a frame
- Always load font before `setCharacters()`
- `lineHeight` must be `{ value: N, unit: 'PIXELS' }` object, not a bare number
- `letterSpacing` must be `{ value: N, unit: 'PIXELS' }` object

## Common Errors to Avoid

| Error | Cause | Fix |
|-------|-------|-----|
| Paint `a` field | `color: { r, g, b, a }` in fills/strokes | Remove `a` — use `opacity` on the paint object instead |
| FILL child collapses | Parent is HUG/AUTO | Make parent FIXED or FILL |
| resize resets sizing | Called `resize()` after setting sizing mode | Call `resize()` first, then set modes |
| x/y ignored | Setting position in auto-layout parent | Remove x/y — auto-layout manages positioning |
| strokeAlign INSIDE | Using default or INSIDE | Always set `'OUTSIDE'` |
| `counterAxisAlignItems: 'STRETCH'` | Not a valid value | Use `'MIN'` + child FILL instead |
