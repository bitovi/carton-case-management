# Compose Pages in Figma

Orchestrate the composition of full-page Figma frames from built component instances. After Phase 6 builds all individual components, this phase assembles them into viewport-sized page screens that represent each route of the application.

## Inputs

- **`pages.json`**: `.temp/react-to-figma/component-hierarchy/pages.json` — per-route resolved component trees with props
- **`pages.md`**: `.temp/react-to-figma/component-hierarchy/pages.md` — human-readable page manifest
- **Component Figma results**: `.temp/react-to-figma/components/*/figma-result.md` — Figma node IDs from Phase 6
- **Design tokens**: `.temp/react-to-figma/design-tokens.json`, `.temp/react-to-figma/css-figma-map.json`
- **Figma variable map**: `.temp/react-to-figma/figma-variables-map.json` — CSS var → Figma variable ID (from Phase 5)
- **Dev server URL**: Required for verification screenshots

## Output

- **Per-page Figma results**: `.temp/react-to-figma/pages/{RouteName}/page-figma-result.md`
- **Per-page verification**: `.temp/react-to-figma/pages/{RouteName}/verification.md`

## Prerequisites

- Phase 6 must be complete — all components in `build-order.md` must have `figma-result.md` files
- Phase 5 must be complete — `figma-variables-map.json` must exist
- The Figma file must have a "Screens" page (created by Phase 5, or at the start of this phase if missing)
- Dev server must be running (for verification screenshots)

## Procedure

### Step 1: Verify prerequisites

1. Read `pages.json` and confirm it has page entries.
2. Read `build-order.md` and for each component, check that `.temp/react-to-figma/components/{Name}/figma-result.md` exists. If any are missing, report which components lack Figma results and stop.
3. Build a lookup map: `componentName → figmaNodeId` from all `figma-result.md` files.

### Step 2: Create Figma "Screens" page

Using the `use_figma` MCP tool, check if a "Screens" page exists in the Figma file. If not, create one.

### Step 3: Process each page

Read `pages.json` and iterate over each route entry. Convert route to a safe directory name for output (e.g., `/cases/1` → `cases-1`, `/` → `root`).

**For each page**:

1. **Check idempotency**: If `.temp/react-to-figma/pages/{RouteName}/page-figma-result.md` exists, skip this page.

2. **Build the page frame**: Read `.claude/skills/react-to-figma/7-compose-pages/1-prompt.build-page-frame.md` and launch as a subagent:

   ```typescript
   const buildPrompt = readFile('.claude/skills/react-to-figma/7-compose-pages/1-prompt.build-page-frame.md')

   runSubagent({
     description: `Build page frame for ${route}`,
     prompt: `
       ${buildPrompt}

       ## Page Context
       - Route: ${route}
       - Page tree (from pages.json): ${JSON.stringify(pageEntry.tree)}
       - Layout components: ${JSON.stringify(pagesJson.layoutComponents)}
       - Component → Figma node ID map: ${JSON.stringify(componentFigmaMap)}
       - Design tokens: .temp/react-to-figma/design-tokens.json
       - CSS-Figma map: .temp/react-to-figma/css-figma-map.json
       - Figma page: "Screens"
       - Viewport: 1440×900
       - Output: .temp/react-to-figma/pages/${routeName}/page-figma-result.md
     `
   })
   ```

3. **Verify the page frame**: Read `.claude/skills/react-to-figma/7-compose-pages/2-prompt.verify-page-frame.md` and launch as a subagent:

   ```typescript
   const verifyPrompt = readFile('.claude/skills/react-to-figma/7-compose-pages/2-prompt.verify-page-frame.md')

   runSubagent({
     description: `Verify page frame for ${route}`,
     prompt: `
       ${verifyPrompt}

       ## Verification Context
       - Route: ${route}
       - Dev server URL: ${devServerUrl}
       - Page Figma result: .temp/react-to-figma/pages/${routeName}/page-figma-result.md
       - Output: .temp/react-to-figma/pages/${routeName}/verification.md
     `
   })
   ```

4. **One-time rebuild**: If verification fails with major issues, re-run step 2 once with the verification feedback appended.

5. **Log completion**: `"Page ${route} — ${status}"`

### Step 4: Report

After all pages are processed, return a summary:

```
Page composition complete.

Pages built: {count}/{total}
Pages skipped (already built): {skippedCount}
Pages passed verification: {passCount}
Pages with issues: {issueCount}

Layout components used: {layoutComponents}
Figma page: "Screens"
```
