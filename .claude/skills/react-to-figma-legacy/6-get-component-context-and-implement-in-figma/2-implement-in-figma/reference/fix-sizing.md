# fixSizing() — Mandatory After Every Build

Call `fixSizing()` on every component/component set BEFORE appending to the parent frame. This corrects frames whose height was locked by a `resize()` call during construction.

## The Function

```javascript
function fixSizing(node, depth = 0) {
  if (depth > 10 || !node) return;
  const hasLayout =
    (node.type === 'COMPONENT' || node.type === 'FRAME' || node.type === 'COMPONENT_SET') &&
    node.layoutMode &&
    node.layoutMode !== 'NONE';
  if (hasLayout) {
    if (node.layoutMode === 'VERTICAL') node.primaryAxisSizingMode = 'AUTO';
    node.counterAxisSizingMode = 'AUTO';
  }
  const children = 'children' in node ? node.children : [];
  for (const child of children) fixSizing(child, depth + 1);
}
```

## Usage Rules

1. Call `fixSizing(comp)` AFTER building all children and BEFORE `parentFrame.appendChild(comp)`
2. For component sets: call `fixSizing(v)` on each variant BEFORE `combineAsVariants`, AND call `fixSizing(set)` on the set AFTER combining
3. During construction, always set `counterAxisSizingMode = 'AUTO'` before adding children:

```javascript
// CORRECT — height grows with content
comp.primaryAxisSizingMode = 'AUTO';
comp.counterAxisSizingMode = 'AUTO';
```

## Why This Is Needed

`resize()` silently resets BOTH `primaryAxisSizingMode` and `counterAxisSizingMode` to `'FIXED'`. If you call `resize()` at any point during construction (even to set an initial width hint), the sizing modes get locked. `fixSizing()` walks the tree and restores `'AUTO'` sizing so components properly hug their content.

Without `fixSizing()`, all components appear as thin strips because their height is locked to whatever value `resize()` set.
