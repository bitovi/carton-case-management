# 6 Get Component Context and Implement in Figma
## 6.1 Get Component Context
### ALT 6.1.3 Capture Variant Screenshots — JSON Computed Styles

**Begin your response by outputting the heading lines above verbatim.**

> **Status**: Planning notes only — not called by any orchestrator.
>
> This documents the proposed `.styles.json` output format for `capture-storybook-variants.js`
> to enable programmatic CSS diffing between variants.

## Current Output

The capture script outputs `.styles.md` per variant — a human-readable indented text format:

```
span .inline-flex items-center justify-center (49x24)
  width: 49px
  height: 24px
  padding-top: 3px
  background-color: rgb(15, 23, 42)
  color: rgb(248, 250, 252)
  border-top-left-radius: 8px
```

**Problem**: This format requires LLM parsing to diff. Subtle differences get missed
in long files. Not suitable for programmatic comparison.

## Proposed: Dual Output

The capture script would output BOTH formats per variant:
- `{ExportName}.styles.md` — unchanged, for human/LLM reading
- `{ExportName}.styles.json` — structured, for script-based diffing

## `.styles.json` Schema

```json
{
  "variant": "VariantDestructive",
  "timestamp": "2025-05-22T...",
  "nodes": [
    {
      "path": "0",
      "tag": "div",
      "classes": [""],
      "bounds": { "width": 81, "height": 58 },
      "styles": {
        "width": "81px",
        "height": "58px",
        "padding-top": "16px",
        "padding-right": "16px",
        "padding-bottom": "16px",
        "padding-left": "16px",
        "display": "block",
        "color": "rgb(2, 6, 23)",
        "background-color": "rgba(0, 0, 0, 0)"
      },
      "children": [
        {
          "path": "0.0",
          "tag": "span",
          "classes": ["inline-flex", "items-center", "justify-center"],
          "bounds": { "width": 49, "height": 24 },
          "styles": {
            "width": "49px",
            "height": "24px",
            "min-height": "24px",
            "padding-top": "3px",
            "padding-right": "8px",
            "padding-bottom": "3px",
            "padding-left": "8px",
            "gap": "6px",
            "display": "inline-flex",
            "flex-direction": "row",
            "align-items": "center",
            "justify-content": "center",
            "color": "rgb(255, 255, 255)",
            "background-color": "rgb(220, 38, 38)",
            "border-top-left-radius": "8px",
            "border-top-right-radius": "8px",
            "border-bottom-right-radius": "8px",
            "border-bottom-left-radius": "8px",
            "font-size": "12px",
            "font-weight": "600",
            "line-height": "16px"
          },
          "children": [
            {
              "path": "0.0.0",
              "tag": "span",
              "classes": [],
              "bounds": { "width": 33, "height": 16 },
              "styles": {
                "font-size": "12px",
                "font-weight": "600",
                "color": "rgb(255, 255, 255)"
              },
              "children": []
            }
          ]
        }
      ]
    }
  ]
}
```

## Key Design Decisions

### Node matching by `path` not class name

Nodes are identified by `path` (e.g., `"0.0.1"` = root > first child > second child).
Class names may change between variants (that's the whole point of variant diffing),
so they can't be used as stable identifiers.

### Include ALL computed properties, not just non-default

The current `.styles.md` filters out `none`, `auto`, `0px`, `rgba(0,0,0,0)`.
The JSON version should include ALL values for Figma-relevant properties so that:
- A property going FROM a value TO `transparent` is detected as a diff
- A property going FROM `0px` TO `8px` is detected

### Properties to capture

Same `FIGMA_CSS_PROPS` list already used by the capture script, but don't filter out
"default" values. The diff script handles relevance.

## Changes to `capture-storybook-variants.js`

In the `captureVariant` function, after the existing `cssContent` extraction,
add a second `page.evaluate` that returns a JSON structure:

```javascript
const cssJson = await page.evaluate((cssProps) => {
  const root = document.querySelector('#storybook-root')
    || document.querySelector('#root')
    || document.body;

  function extract(el, depth, pathPrefix) {
    if (!el || el.nodeType !== 1 || depth > 8) return null;
    const cs = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    const styles = {};
    for (const prop of cssProps) {
      styles[prop] = cs.getPropertyValue(prop);
    }
    const children = [];
    for (let i = 0; i < el.children.length; i++) {
      const child = extract(el.children[i], depth + 1, pathPrefix + '.' + i);
      if (child) children.push(child);
    }
    return {
      path: pathPrefix,
      tag: el.tagName.toLowerCase(),
      classes: el.className
        ? el.className.split(' ').filter(Boolean).slice(0, 5)
        : [],
      bounds: {
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      },
      styles,
      children,
    };
  }

  return extract(root, 0, '0');
}, FIGMA_CSS_PROPS);

const jsonPath = path.join(outputDir, `${exportName}.styles.json`);
fs.writeFileSync(
  jsonPath,
  JSON.stringify(
    {
      variant: exportName,
      timestamp: new Date().toISOString(),
      nodes: [cssJson],
    },
    null,
    2
  )
);
```

## New Script Needed: `diff-variant-styles.js`

Companion script that takes two `.styles.json` files and outputs a structured diff:

```bash
node diff-variant-styles.js \
  --default VariantPrimary.styles.json \
  --variant VariantDestructive.styles.json
```

Output:
```json
{
  "default": "VariantPrimary",
  "variant": "VariantDestructive",
  "diffs": [
    {
      "path": "0.0",
      "tag": "span",
      "property": "background-color",
      "defaultValue": "rgb(15, 23, 42)",
      "variantValue": "rgb(220, 38, 38)"
    },
    {
      "path": "0.0",
      "tag": "span",
      "property": "color",
      "defaultValue": "rgb(248, 250, 252)",
      "variantValue": "rgb(255, 255, 255)"
    }
  ],
  "structuralChanges": [
    {
      "type": "added",
      "path": "0.0.1",
      "tag": "svg",
      "description": "New child element (icon)"
    }
  ]
}
```

The diff script should:
- Match nodes by `path` position
- Detect added/removed children (structural changes)
- Normalize RGB for comparison (strip whitespace)
- Ignore Storybook wrapper node (root `div` with margin/padding from centering)
- Output both property diffs and structural diffs
