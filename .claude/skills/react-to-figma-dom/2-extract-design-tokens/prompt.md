# Extract Design Tokens

Extract design tokens from the codebase and prepare a mapping to Figma variable names. This runs once before any component building starts.

Uses `resolve-colors.js` to pre-compute all CSS variable values to hex/sRGB (eliminating color-space math during Figma builds) and produce machine-readable JSON alongside human-readable markdown.

## Inputs

- **Source root**: The project source root path (passed by parent), e.g. `packages/client/src`
- **Output directory**: `.temp/react-to-figma/`

## Procedure

### 1. Run the extraction script

```bash
node .claude/skills/react-to-figma-dom/2-extract-design-tokens/resolve-colors.js <sourceRoot> --output .temp/react-to-figma
```

The script reads:
- `<sourceRoot>/index.css` — CSS custom properties from `:root` / `@layer base`
- Tailwind default typography and font-weight scales

It outputs:
| File | Format | Purpose |
|------|--------|---------|
| `design-tokens.json` | JSON | Machine-readable: all tokens with resolved hex values, Figma paths, collection assignments, scoping metadata |
| `css-figma-map.json` | JSON | Reverse lookup: CSS variable/class → Figma variable path (used by Phase 6 build agents) |
| `design-tokens.md` | Markdown | Human-readable tables for review |

### 2. Validate script output

Check:
- `design-tokens.json` exists and contains `tokens` array with entries
- No tokens have `resolved: null` for color categories (palette, semantic) — this means the color value couldn't be parsed
- Border-radius tokens have `resolvedPx` values
- `css-figma-map.json` has entries for both `var(--<name>)` and `bg-<name>` / `text-<name>` patterns

If the script fails or is unavailable, fall back to the manual procedure in the "Fallback" section below.

### 3. Review and supplement

After the script runs, review the output for:
- **Missing tokens**: CSS variables the script didn't parse (unusual formats, nested calc expressions)
- **Dark mode tokens**: `.dark` class overrides (not extracted by default — note them for future Figma mode support)
- **Framework-specific tokens**: Any tokens from theme config files not covered by the CSS variables

Add any missing tokens directly to the JSON files.

### 4. Return summary

```
Design token extraction complete.
- Framework: {Tailwind CSS + CSS Custom Properties}
- Tokens: {count from design-tokens.json}
- Palette colors: {count}
- Semantic colors: {count}
- Border radius: {count}
- Shadows: {count}
- Typography: {font sizes + font weights}
- Figma map entries: {count from css-figma-map.json}
- Output: .temp/react-to-figma/design-tokens.json
- Output: .temp/react-to-figma/css-figma-map.json
- Output: .temp/react-to-figma/design-tokens.md
```

## Figma Variable Collections

The script organizes tokens into three Figma variable collections, following the figma-from-code pattern:

### Palette (Primitive Colors)
- **Content**: Brand color families with shade scales (gray/50-950, teal/50-950, etc.)
- **Figma path format**: `Palette/{family}/{shade}` (e.g., `Palette/teal/500`)
- **Scoping**: `ALL_FILLS`, `STROKE_COLOR` — appears in all fill and stroke pickers
- **Purpose**: Raw color values that semantic tokens reference

### Semantic (UI Colors)
- **Content**: Background, foreground, primary, secondary, destructive, sidebar, chart, border variants, interactive states
- **Figma path format**: `Semantic/{name}` or `Semantic/{group}/{name}` (e.g., `Semantic/sidebar/accent`)
- **Scoping**: `FRAME_FILL`, `SHAPE_FILL`, `TEXT_FILL`, `STROKE_COLOR` — appears in relevant pickers only
- **Purpose**: Theme-level tokens that components should bind to (not raw palette colors)

### Numbers (Non-color Values)
- **Content**: Border-radius values (from CSS variables + Tailwind config)
- **Figma path format**: `Numbers/border-radius/{name}` (e.g., `Numbers/border-radius/default`)
- **Scoping**: `CORNER_RADIUS`
- **Purpose**: Numeric tokens for consistent component sizing

### Effects (Not variable collections)
- Shadows are stored as descriptive strings, not Figma variables
- They become Figma effect styles, not variables
- Path format: `Effects/shadow/{name}`

## JSON Schema

### design-tokens.json

```json
{
  "schemaVersion": "react-to-figma-tokens@1",
  "sourceFile": "...",
  "extractedAt": "...",
  "summary": { "totalTokens": 157, "paletteColors": 89, ... },
  "collections": {
    "Palette": { "name": "Palette", "description": "...", "scoping": [...], "tokenCount": 89 },
    "Semantic": { ... },
    "Numbers": { ... }
  },
  "tokens": [
    {
      "cssVar": "--teal-500",
      "name": "teal-500",
      "rawValue": "#01a6ae",
      "category": "palette",
      "figmaCollection": "Palette",
      "figmaPath": "Palette/teal/500",
      "figmaType": "COLOR",
      "figmaScoping": ["ALL_FILLS", "STROKE_COLOR"],
      "resolved": { "hex": "#01a6ae", "opacity": 1 },
      "resolvedPx": null
    }
  ],
  "tailwindExtensions": { "borderRadius": [...], "shadows": [...], "typography": [...], "fontWeights": [...] }
}
```

### css-figma-map.json

```json
{
  "var(--primary)": "Semantic/primary",
  "--primary": "Semantic/primary",
  "bg-primary": "Semantic/primary",
  "text-primary": "Semantic/primary",
  "border-primary": "Semantic/primary",
  "rounded-lg": "Numbers/border-radius/lg",
  "text-sm": "Typography/font-size/sm",
  "font-semibold": "Typography/font-weight/semibold",
  "shadow-xs": "Effects/shadow/xs"
}
```

## Fallback: Manual Extraction

If the script cannot be run, follow these steps manually:

### Discover token sources

Search for files that define design tokens:

| File pattern | What to extract |
|-------------|----------------|
| `index.css`, `globals.css`, `app.css` | `@layer base { :root { --* } }` blocks |
| `tailwind.config.{js,ts,mjs}` | `theme.extend.*` — colors, spacing, borderRadius, boxShadow, fontSize |
| `theme.{ts,js}`, `tokens.{ts,js}` | Exported token objects |

### Categorize and resolve

For each token:
1. Determine category (palette color, semantic color, border-radius, shadow, typography)
2. Resolve the actual computed value (hex for colors, px for sizes)
3. Assign a Figma variable path using the collection scheme above
4. Write the results as markdown tables to `design-tokens.md`
