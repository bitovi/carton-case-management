# Figma Plugin API Reference

Concise reference for the Plugin API surface used via `use_figma`. Covers variables, nodes, and key methods.

---

## Variables API — `figma.variables`

### Collections

```javascript
figma.variables.createVariableCollection("Name")     // → VariableCollection
// Collection starts with 1 mode named "Mode 1"

// VariableCollection properties:
collection.name                    // get/set name
collection.modes                   // Array<{modeId: string, name: string}>
collection.variableIds             // string[] — IDs of variables in this collection
collection.defaultModeId           // string

// VariableCollection methods:
collection.addMode("Dark")                // → modeId string
collection.removeMode(modeId)
collection.renameMode(modeId, "Light")
```

### Variables

```javascript
figma.variables.createVariable("name", collection, "COLOR")
//                                       ^ collection object (passing ID string is deprecated)
// resolvedType: "COLOR" | "FLOAT" | "STRING" | "BOOLEAN"

// Variable properties:
variable.name                      // get/set name
variable.resolvedType              // read-only type
variable.codeSyntax                // {WEB?: string, ANDROID?: string, iOS?: string}
variable.scopes                    // VariableScope[] — get/set
variable.valuesByMode              // Record<modeId, value> — read-only
variable.variableCollectionId      // string — read-only
variable.id                        // string — read-only
variable.key                       // string — for library imports

// Variable methods:
variable.setValueForMode(modeId, value)
variable.setVariableCodeSyntax("WEB", "var(--my-var)")
variable.remove()
```

### Variable Aliases

```javascript
figma.variables.createVariableAlias(variable)
// → { type: 'VARIABLE_ALIAS', id: variable.id }
// Pass the returned alias object to setValueForMode
```

### Lookup Methods

```javascript
await figma.variables.getVariableByIdAsync(id)             // → Variable | null
await figma.variables.getVariableCollectionByIdAsync(id)   // → VariableCollection | null
await figma.variables.getLocalVariablesAsync(type?)        // → Variable[]
await figma.variables.getLocalVariableCollectionsAsync()   // → VariableCollection[]
await figma.variables.importVariableByKeyAsync(key)        // → Variable (from libraries)
```

### Paint Variable Binding

```javascript
figma.variables.setBoundVariableForPaint(paint, "color", variable)
// ⚠️ Returns a NEW paint object — must reassign!
const boundPaint = figma.variables.setBoundVariableForPaint(paint, "color", colorVar);
node.fills = [boundPaint];

figma.variables.setBoundVariableForEffect(effect, field, variable)
// Also returns a NEW effect — must reassign
```

---

## Node Creation

```javascript
figma.createFrame()                   // → FrameNode
figma.createComponent()              // → ComponentNode
figma.createText()                   // → TextNode
figma.createRectangle()              // → RectangleNode
figma.createEllipse()                // → EllipseNode
figma.createLine()                   // → LineNode
figma.createVector()                 // → VectorNode
figma.createBooleanOperation()       // → BooleanOperationNode
figma.createNodeFromSvg(svgString)   // → FrameNode containing SVG paths
figma.createPage()                   // → PageNode
```

### Efficient API (prefer these)

```javascript
figma.createAutoLayout()             // → FrameNode with auto-layout pre-enabled
// Saves setting layoutMode manually
```

---

## Node Properties — Key Reference

### Layout

```javascript
node.layoutMode = 'VERTICAL' | 'HORIZONTAL' | 'NONE'
node.primaryAxisSizingMode = 'FIXED' | 'AUTO'
node.counterAxisSizingMode = 'FIXED' | 'AUTO'
node.layoutSizingHorizontal = 'FIXED' | 'FILL' | 'HUG'  // only inside auto-layout parent
node.layoutSizingVertical = 'FIXED' | 'FILL' | 'HUG'
node.layoutWrap = 'NO_WRAP' | 'WRAP'
node.itemSpacing = number
node.counterAxisSpacing = number     // only when layoutWrap = 'WRAP'
node.paddingTop / paddingBottom / paddingLeft / paddingRight = number
node.primaryAxisAlignItems = 'MIN' | 'MAX' | 'CENTER' | 'SPACE_BETWEEN'
node.counterAxisAlignItems = 'MIN' | 'MAX' | 'CENTER' | 'BASELINE'
// ⚠️ No 'STRETCH' value — use 'MIN' + child FILL instead
```

### Sizing

```javascript
node.resize(width, height)           // ⚠️ Resets BOTH sizing modes to FIXED
node.width / node.height             // read-only after resize
```

### Fills & Strokes

```javascript
node.fills = [{ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }]
// ⚠️ color is {r, g, b} — NO alpha. Use paint-level opacity:
node.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0.5 }]

node.strokes = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }]
node.strokeWeight = number
node.strokeAlign = 'INSIDE' | 'OUTSIDE' | 'CENTER'
// ⚠️ Always use 'OUTSIDE' — 'INSIDE' causes issues
```

### Variable Binding on Nodes

```javascript
node.setBoundVariable('fills', 0, variable)     // bind fills[0] color
node.setBoundVariable('strokes', 0, variable)   // bind strokes[0] color
node.setBoundVariable('topLeftRadius', variable) // float variable binding
node.setBoundVariable('itemSpacing', variable)
node.setBoundVariable('paddingTop', variable)
```

### Text

```javascript
// ⚠️ MUST load font before any text operations
await figma.loadFontAsync({ family: 'Inter', style: 'Regular' })

textNode.characters = "Hello"
textNode.fontSize = 14
textNode.fontName = { family: 'Inter', style: 'Regular' }
textNode.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }]
```

### Components & Instances

```javascript
const comp = figma.createComponent()
comp.name = 'MyComponent'

const instance = comp.createInstance()
parent.appendChild(instance)

// Component sets (variants)
figma.combineAsVariants([comp1, comp2, ...], parentFrame)
// ⚠️ Stacks everything at (0,0) — must set WRAP layout after

// Set variant properties on an instance
instance.setProperties({ 'Variant': 'primary', 'Size': 'large' })
```

### Mode Binding

```javascript
// Set explicit variable mode for a collection on a node
node.setExplicitVariableModeForCollection(collection, modeId)
// ⚠️ Pass collection OBJECT, not ID string
// Without this, all nodes use the default (first) mode
```

---

## Page Operations

```javascript
figma.root.children                   // All pages
figma.currentPage                     // Get/set current page
figma.currentPage = page              // Switch to a page

const page = figma.createPage()
page.name = "My Page"
```

---

## Plugin Data

```javascript
// ⚠️ getPluginData/setPluginData are NOT supported in use_figma sandbox
// Use getSharedPluginData/setSharedPluginData instead:
node.getSharedPluginData('namespace', 'key')
node.setSharedPluginData('namespace', 'key', 'value')

// Works on: nodes, variables, collections
collection.setSharedPluginData('dsb', 'key', 'collection/palette')
variable.setSharedPluginData('dsb', 'key', 'primitive/gray/950')
```

---

## Unsupported in `use_figma` Sandbox

- `require()` / `import` — no module system
- `fs`, `path`, `http` — no Node.js APIs
- `console.log()` — NOT an output channel (use `return`)
- `figma.notify()` — throws in sandbox
- `getPluginData()` / `setPluginData()` — use `getSharedPluginData()` instead
- IIFE wrappers — code is auto-wrapped in async context
