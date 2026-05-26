# react-to-figma-dom

Deterministic DOM-to-Figma translation pipeline. A drop-in replacement for Phase 6 of `react-to-figma` that converts React components into Figma by capturing the live DOM + computed CSS from Storybook, translating it into a Figma IR (JSON), then generating executable `use_figma` code.

## How it fits into `react-to-figma`

This skill is a **drop-in replacement for Phase 6** of the `react-to-figma` pipeline. Phases 1-5 and Phase 7 are unchanged:

```
Phase 1: Find hierarchy           ← shared (unchanged)
Phase 2: Extract design tokens    ← shared (unchanged)
Phase 3: Extract assets           ← shared (unchanged)
Phase 4: Discover story patterns  ← shared (unchanged)
Phase 5: Setup Figma file         ← shared (unchanged)
Phase 6: Build components         ← THIS SKILL (replaces react-to-figma/6-*)
Phase 7: Compose pages            ← shared (unchanged)
```

To swap in this skill, use:
- `react-to-figma-dom/6-get-component-context-and-implement-in-figma/prompt.md` instead of
- `react-to-figma/6-get-component-context-and-implement-in-figma/prompt.md`

The interface is identical — same inputs, same outputs, same `figma-result.md` and `verification.md`.

## How it differs from `react-to-figma` Phase 6

The original Phase 6 uses AI prompts to analyze captured HTML/CSS and reason about how to build Figma nodes. This skill replaces that reasoning with deterministic scripts:

| Step | `react-to-figma` Phase 6 | `react-to-figma-dom` Phase 6 |
|------|--------------------------|------------------------------|
| 6.1-6.4 Get context | Identify variants → stories → capture → analyze | **Same** (shared prompts) |
| 6.5 Capture | `capture-storybook-variants.js` (HTML/CSS markdown) | `capture-dom.js` (structured JSON + fiber walk, no .md files) |
| 6.5 Build plan | AI prompt analyzes screenshots + HTML | `dom-to-figma-ir.js` (deterministic) |
| 6.5 Build in Figma | AI prompt writes `use_figma` from scratch | `ir-to-figma-code.js` (deterministic) + thin agent relay |
| 6.5 Verify/Fix | Script + AI | Same (unchanged) |

AI is only invoked for:
- Variant identification and story generation (still requires semantic understanding)
- Calling `use_figma` MCP tool (agent relay — no creative reasoning)
- Fix loops when verification fails (the ~5% that needs judgment)

## Prompt Structure

```
.claude/skills/react-to-figma-dom/
├── SKILL.md                                          # This file
└── 6-get-component-context-and-implement-in-figma/   # Drop-in Phase 6 replacement
    ├── prompt.md                                     # Per-component orchestrator (matches react-to-figma interface)
    ├── 1-get-component-context/                      # Shared with react-to-figma (copied)
    │   ├── 1-prompt.identify-variants.md
    │   ├── 2-prompt.generate-variant-stories.md
    │   ├── 3-prompt.capture-variant-screenshots.md   # DOM-aware variant (uses capture-dom.js)
    │   ├── 4-prompt.analyze-figma-variants.md
    │   ├── capture-dom.js                            # DOM capture script
    │   └── alts/
    │       ├── 1-prompt.identify-variants-alt.md
    │       └── 3-prompt.capture-variant-screenshots-alt.md
    └── 2-implement-in-figma/                         # DOM pipeline replaces prompt-based approach
        ├── prompt.md                                 # DOM build orchestrator
        ├── 1-prompt.build-all.md                     # Build all variants
        ├── 2-prompt.verify.md                        # Verify all variants
        ├── 3-prompt.fix.md                           # Fix failing variants
        ├── scripts/
        │   ├── css-to-figma.js                       # CSS → Figma property mapper
        │   ├── dom-to-figma-ir.js                    # DOM → Figma IR generator
        │   ├── ir-to-figma-code.js                   # IR → use_figma code generator
        │   ├── compare.js                            # Pixel diff (pixelmatch + pngjs)
        │   └── verify-variants.js                    # Multi-variant verification
        └── reference/
            ├── figma-component-patterns.md
            ├── figma-gotchas.md
            ├── figma-use-rules.md
            ├── figma-variable-binding.md
            ├── fix-sizing.md
            └── tailwind-figma-map.md
```

## DOM Pipeline

```
[Storybook iframe]
       │
       ▼
capture-dom.js ──► variants/{Name}/dom.json + fiber-dom-map.json + screenshot.png + html.md + styles.md
       │
       ▼
dom-to-figma-ir.js ──► variants/{Name}/figma-ir.json
       │
       ▼
ir-to-figma-code.js ──► variants/{Name}/build-script.js
       │
       ▼
Agent calls use_figma with generated code
       │
       ▼
verify-variants.js + compare.js ──► variants/{Name}/figma.png + composite.png + comparison.json
       │
       ▼ (only if FAIL)
AI fix loop patches mapper or codegen
```

## Scripts

Scripts live in `6-get-component-context-and-implement-in-figma/`:
- Capture: `1-get-component-context/capture-dom.js`
- DOM pipeline: `2-implement-in-figma/scripts/`

| Script | Purpose | Inputs | Outputs |
|--------|---------|--------|---------|
| `capture-dom.js` | Capture structured DOM, CSS, fiber data, screenshot from Storybook | Storybook URL, component name | `variants/{Name}/dom.json`, `fiber-dom-map.json`, `screenshot.png`, `html.md`, `styles.md` |
| `css-to-figma.js` | Pure function library: CSS properties → Figma properties | Computed style object | Figma node properties |
| `dom-to-figma-ir.js` | Walk DOM tree, apply CSS mapper, detect instances | `dom.json`, `fiber-dom-map.json`, variable maps | `figma-ir.json` |
| `ir-to-figma-code.js` | Generate `use_figma` JavaScript from IR | `figma-ir.json` | `build-script.js` (one or more chunks) |
| `compare.js` | Pixel diff two PNGs (pixelmatch + pngjs) | imageA, imageB, outputDir | `diff.png`, `composite.png`, `comparison.json` |
| `verify-variants.js` | Batch verification runner | `verify-manifest.json` | Per-variant `figma.png`, `composite.png`, `comparison.json` + `verification-results.json` |

## Dependencies

- Storybook must be running (for capture)
- Playwright (for browser automation in capture-dom.js)
- pixelmatch + pngjs (for pixel comparison — pure JS, no native deps)
- Phases 1-5 from `react-to-figma` (component hierarchy, design tokens, assets, Figma file setup)
- `figma-variables-map.json` and `figma-icons-map.json` from Phase 5

## Usage

Use the Phase 6 orchestrator in the main `react-to-figma` pipeline:

```
skillDir = ".claude/skills/react-to-figma-dom/6-get-component-context-and-implement-in-figma"

runSubagent({
  prompt: read("{skillDir}/prompt.md"),
  context: { componentName, fileKey, parentFrameId, builtComponents }
})
```

## Output Directory

When used as Phase 6, outputs go to `.temp/react-to-figma/components/{Name}/` (same location as the original):
```
{ComponentName}/
  screenshots/
    {VariantName}.dom.json          # Structured DOM tree
    {VariantName}.fiber-dom-map.json # Fiber → DOM correlation
    {VariantName}.png               # Screenshot
    {VariantName}.html.md           # Human-readable HTML (debug)
    {VariantName}.styles.md         # Human-readable CSS (debug)
  default-variant/
    {VariantName}.figma-ir.json     # Figma intermediate representation
    {VariantName}.build-script.js   # Generated use_figma code
    figma-result.md                 # Build result
    verification.md                 # Verification result
  {OtherVariant}.figma-ir.json      # IR for remaining variants
  {OtherVariant}.build-script.js    # Code for remaining variants
  figma-result.md                   # Final component/set result
  verification.md                   # Final verification
```
