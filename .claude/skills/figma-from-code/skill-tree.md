# figma-from-code — Full Skill Tree

```
figma-from-code (Orchestrator)
│
├── Phase 0a — Component Discovery ───────────────────────────────────
│   └── Skill: figma-from-code-discovery-components
│       ├── 1. mkdir -p .temp/figma-from-code/
│       ├── 2. curl → verify dev server
│       ├── 3. node map-components.js --crawl --max-crawl 30
│       ├── 4. node normalize-component-map.js (align names w/ Figma conventions)
│       ├── 5. Read component-map.json (tiers, tree, componentCount)
│       ├── 6. get_metadata → match Figma components by name
│       │   └── use_figma → read-only inspection (pages, variable collections)
│       ├── 6b. Seed .figma/figma.json per matched component
│       ├── 7. Write updated component-map.json (with figmaNodeId per component)
│       ├── 8. Report (tiers, existing vs missing components)
│       └── → Orchestrator merges: buildOrder, builtComponents, preExistingComponents
│
├── Phase 0b — Icon & Asset Discovery ────────────────────────────────
│   └── Skill: figma-from-code-discovery-assets
│       ├── 1. mkdir -p .temp/figma-from-code/
│       ├── 2. node extract-icons.js --scan {sourceDir}
│       ├── 3. Read icons.json (totalIcons, totalAssets, componentsWithIcons)
│       ├── 4. Report
│       └── → Orchestrator merges: iconDiscovery (icons[], assets[])
│
├── Phase 1 — Tokens (Variables) ─────────────────────────────────────
│   └── Skill: figma-setup-variables
│       ├── Read CSS → parse custom properties from :root
│       ├── Read tailwind.config.js (optional — color mappings, radius, spacing)
│       ├── use_figma → create Palette collection (raw color scales, scopes=[])
│       ├── use_figma → create Semantic collection (aliases, scoped by usage)
│       ├── use_figma → create Spacing collection (radius + spacing floats)
│       └── → Orchestrator verifies via use_figma, updates state
│
├── Phase 2 — File Structure ─────────────────────────────────────────
│   ├── Skill: figma-setup-file-structure
│   │   ├── use_figma → rename/create pages (Foundations, Components, Screens)
│   │   ├── use_figma → Color Palette frame (query Palette vars → swatch rows)
│   │   ├── use_figma → Semantic Colors frame (query Semantic vars → grouped swatches)
│   │   └── use_figma → Spacing Scale frame (spacing bars + radius samples)
│   ├── Orchestrator: use_figma → create Icons frame + tier frames on Components page
│   ├── Orchestrator: use_figma → create Screens container on Screens page
│   ├── get_screenshot → verify Foundations page
│   └── → Save all frame IDs to state.json → figmaNodes
│
├── Phase 2.5 — Pre-capture Reference Material ───────────────────────
│   └── Skill: figma-from-code-precapture
│       ├── curl → verify dev server
│       ├── node browser-server.js & → shared Playwright WebSocket server
│       ├── Build manifest files per route group (from component-map + Component App Map)
│       ├── Dispatch parallel HAIKU subagents (one per route group):
│       │   └── Each subagent:
│       │       ├── node screenshot.js --batch {group}-screenshots.json
│       │       ├── node extract-text.js --batch {group}-text.json
│       │       └── Write precapture-{group}.json
│       ├── Dispatch precapture-screens agent (full-page screenshots per route)
│       └── → Orchestrator reads results, logs failures, updates state
│
├── Phase 3 — Build Components (tier by tier) ────────────────────────
│   └── Skill: figma-from-code-build-tier
│       │
│       ├── PREAMBLE: Icon & Asset Components
│       │   ├── Read icons.json
│       │   ├── Filter already-built (from builtComponents)
│       │   ├── use_figma → createNodeFromSvg per icon (~7/batch)
│       │   ├── use_figma → createNodeFromSvg per SVG asset
│       │   └── Merge new IDs into builtComponents
│       │
│       └── PER TIER (sequential — each tier depends on lower tiers):
│           ├── Filter already-built components
│           ├── Dispatch parallel OPUS subagents (one per component):
│           │   └── Skill: figma-from-code-build-component (full 7-step workflow)
│           │       │
│           │       ├── Step 1: Analyze ─────────────────────────────────
│           │       │   ├── 1a. Layout, sizing intent (fill/fixed/hug per axis)
│           │       │   ├── 1b. Variants (cva, conditional classes, :hover/:focus/:disabled)
│           │       │   ├── 1c. Icon usage (lucide imports → Icon/{Name}, sizes)
│           │       │   ├── 1d. Instance reuse (child components in builtComponents)
│           │       │   ├── 1e. PREREQ GATE: node check-prereqs.js → all children exist?
│           │       │   ├── 1f. Plan text content (exact strings from text.json)
│           │       │   ├── 1g. node inspect-styles.js → computed-styles.json
│           │       │   │   └── → state-hover.png, state-focus.png, state-disabled.png, states.json
│           │       │   └── 1h. Write .figma/code.json (git log → lastCommit, full analysis snapshot)
│           │       │
│           │       ├── Step 2: Build ───────────────────────────────────
│           │       │   ├── 2-pre. Resolve instance manifest from code.json.childComponents
│           │       │   ├── 2a/2b. use_figma → createComponent (single) or combineAsVariants (set)
│           │       │   │   ├── Resolve masters → createInstance per child usage
│           │       │   │   ├── Override text inside instances (findOne + loadFontAsync + setCharacters)
│           │       │   │   ├── Build layout shell (direction, padding, spacing, fills, strokes)
│           │       │   │   └── fixSizing() + appendChild to parent frame
│           │       │   └── 2f. use_figma → enumerate INSTANCE nodes → write .figma/figma.json
│           │       │
│           │       ├── Step 3: Screenshot ──────────────────────────────
│           │       │   ├── 3a. Resolve variant for screenshot (if COMPONENT_SET)
│           │       │   └── 3b. get_screenshot → figma.png
│           │       │
│           │       ├── Step 4: Compare ─────────────────────────────────
│           │       │   ├── 4a. INSTANCE GATE: node check-instances.js
│           │       │   │   └── (code.json.childComponents vs figma.json.dependencies)
│           │       │   ├── 4b. Sizing sanity check (use_figma → read width/height/sizing modes)
│           │       │   └── 4c. node compare.js → diff.png, comparison.json (matchPct, verdict)
│           │       │
│           │       ├── Step 5: Fix Loop (up to 3 iterations) ──────────
│           │       │   ├── 5a. Diagnose (read diff.png + app.png + figma.png + source)
│           │       │   ├── 5b. use_figma → targeted property fix
│           │       │   ├── 5c. Re-enumerate (2f) → re-gate (4a) → re-screenshot (3b) → re-compare (4c)
│           │       │   └── 5d. match → exit | mismatch → next iteration | 3rd → exit
│           │       │
│           │       ├── Step 6: Finalize Tracking ──────────────────────
│           │       │   ├── Verify .figma/code.json + .figma/figma.json exist
│           │       │   ├── Refresh updatedAt on figma.json
│           │       │   └── Sanity-check invariants (names, fileKey, nodeId, dependencies array)
│           │       │
│           │       └── Step 7: Return ─────────────────────────────────
│           │           └── Write build-results/{ComponentName}.json
│           │
│           ├── Orchestrator: collect results → write build-tier{N}.json
│           ├── Orchestrator: merge nodeIds into builtComponents
│           ├── get_screenshot → spot-check tier frame (verify varied heights)
│           └── CHECKPOINT with user before next tier
│
├── Phase 4 — Build Screens ──────────────────────────────────────────
│   └── Skill: figma-from-code-build-screens (per screen, parallel OPUS subagents)
│       ├── Step 0: PREREQ GATE — verify all key components exist in builtComponents
│       ├── Step 1: Analyze screen
│       │   ├── 1a. Page composition (layout direction, 1440×900 FIXED)
│       │   ├── 1b. Component instances (builtComponents lookup, variant props, sizing classes)
│       │   ├── 1c. Icon usage on page chrome
│       │   ├── 1d. Plan text content from text.json
│       │   ├── 1e. Pre-existing screen check
│       │   └── 1f. node inspect-styles.js (page root computed styles)
│       ├── Step 2: use_figma → build screen
│       │   ├── 2a. Create 1440×900 frame (FIXED both axes, clipsContent)
│       │   ├── 2b. createInstance per component (resolve COMPONENT_SET variants)
│       │   ├── 2c. Region frames for nested layout (sidebar + main, etc.)
│       │   └── 2d-2e. Tailwind mapping + color resolution
│       ├── Step 3: get_screenshot → figma.png
│       ├── Step 4: Compare
│       │   ├── 4a. Sizing sanity check (1440×900, FIXED modes, region count)
│       │   └── 4b. Pixel diff (node compare.js → diff.png, comparison.json)
│       ├── Step 5: Fix loop (up to 3 iterations)
│       ├── Step 6: Write figma-screen.json to page source folder
│       ├── Step 7: Return result
│       └── → Orchestrator: write build-screens.json, checkpoint
│
└── Phase 5 — Validate + Fix ─────────────────────────────────────────
    ├── Reference: figma-from-code-validator
    │   ├── Phase 1: Inventory
    │   │   ├── 1a. Read state.json
    │   │   ├── 1b. use_figma → query all COMPONENT_SET + COMPONENT nodes
    │   │   ├── 1c. Classify via Component App Map (url, selector, click, figmaVariant)
    │   │   └── 1d. curl → verify dev server
    │   ├── Phase 1e: Variant Resolution
    │   │   └── use_figma → resolve specific variant nodeId per component set
    │   ├── Phase 2: Screenshots (parallel SONNET subagents, one per tier)
    │   │   └── Each subagent, per component:
    │   │       ├── 2a. Check pre-built app screenshot (reuse from Phase 2.5)
    │   │       ├── 2b. node screenshot.js (capture if missing)
    │   │       ├── 2b-text. node extract-text.js → use_figma injectText (if missing)
    │   │       ├── 2c. use_figma → auditNode (strokeAlign, multiple fills)
    │   │       ├── 2d. get_screenshot(variantNodeId) → figma.png
    │   │       └── 2e. node compare.js → diff.png, comparison.json
    │   ├── Phase 3: Structural checks
    │   │   └── use_figma → verify variables, pages, screen sizes
    │   ├── Phase 4: Write report.md
    │   └── Phase 5: Fix loop (up to 3 iterations)
    │       ├── 5a. Identify defects from report
    │       ├── 5b. use_figma → fix each defective component
    │       ├── 5c. get_screenshot + compare.js → re-evaluate
    │       └── 5d. Update report (Fixed / Still Defective)
    │
    ├── Orchestrator: use_figma → cleanup Components page layout (move strays, re-stack)
    ├── Orchestrator: kill browser-server.js
    └── FINAL CHECKPOINT: validation summary + overall verdict
```

## Legend

| Symbol | Meaning |
|--------|---------|
| `HAIKU subagents` | Pre-capture agents (fast, no judgment needed) |
| `OPUS subagents` | Component + screen builds (creative work) |
| `SONNET subagents` | Validation screenshots (defined capture flow) |
| `use_figma` | Figma MCP plugin call (works in subagents) |
| `get_screenshot` | Figma MCP screenshot (works in subagents) |
| `get_metadata` | Figma MCP metadata (file-level, read-only) |
| `node *.js` | Shell script (Playwright, pixel diff, etc.) |
| `PREREQ GATE` | Hard reject if child components missing |
| `INSTANCE GATE` | Hard reject if design-system instances missing |
| `CHECKPOINT` | Pause for user confirmation |
