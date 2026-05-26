# Changelog: SVG Icon Pipeline Fix (2025-05-25)

## Problem

BaseEditable built in Figma with empty 16×16 placeholder frames where icons (Check, X, Loader2) should have been.

## Root Cause

Three failures chained together:

1. **`scripts/capture-dom.js` — SVG className serialized as `{}`**. `el.className` on SVG elements returns an `SVGAnimatedString` object, not a string. The old script stored it as-is, producing `"className": {}` in `dom.json`.

2. **`scripts/capture-dom.js` — No SVG attributes captured**. Path `d` values, `viewBox`, `fill`, `stroke`, and other SVG-specific attributes were never serialized. The IR generator had no data to identify which icon was rendered.

3. **`dom-to-figma-ir.js` — All three icon-detection fallbacks failed**. It tried className string matching (got `{}`), `attrs.class` lookup (old format has no `attrs`), and path `d` signature matching (old format paths have no `attrs.d`). Every path returned `SVG_PLACEHOLDER`.

## Fixes Applied

### `scripts/capture-dom.js`
- **SVG className**: Use `el.className.baseVal` when `className` is an `SVGAnimatedString`.
- **SVG attributes**: Capture `d`, `viewBox`, `fill`, `stroke`, `stroke-width`, `stroke-linecap`, `stroke-linejoin` into an `attrs` object on SVG/path/circle/line/rect/polyline/polygon elements.
- **Fiber DOM tagging**: The fiber walker now tags DOM elements with `data-rtf-component` and `data-rtf-id` attributes (matching the newer capture script's behavior).

### `dom-to-figma-ir.js`
- **rtfComponent lookup**: Check both `attrs['data-rtf-component']` and `domNode['data-rtf-component']` for old-format compatibility.
- **Path `d` fallback**: Try `p.attrs?.d || p.d || ''` instead of only `p.attrs?.d`.
- **Lucide signatures**: Added `'M21 12a9 9': 'Loader2'` and `'M6 18 18 6': 'X'` to `LUCIDE_PATH_SIGNATURES`. Added `LUCIDE_ALIASES` map (`LoaderCircle → Loader2`).

## Verification

Re-ran the full pipeline for BaseEditable (capture → IR → build → Figma):

- 11 variants re-captured — SVG className now `'lucide lucide-check h-4 w-4'` (string, not `{}`)
- IR produces `INSTANCE` nodes (not `SVG_PLACEHOLDER`) for all 3 icons
- Component set `344:6` built in Figma with Check, X, and Loader2 icon instances confirmed present
