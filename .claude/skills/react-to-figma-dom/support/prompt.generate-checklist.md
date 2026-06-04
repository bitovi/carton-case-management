# Generate Pipeline Checklist

Read the build order and route list, then generate `checklist.md` with the full pipeline execution plan.

## Inputs

| Variable | Description |
|----------|-------------|
| `pipelineDir` | Root output directory (e.g., `.temp/react-to-figma-dom/`) |
| `skillDir` | Skill root directory (e.g., `.claude/skills/react-to-figma-dom/`) |
| `sourceRoot` | React source root (e.g., `packages/client/src`) |
| `storybookUrl` | Storybook URL (e.g., `http://localhost:6006`) |
| `devServerUrl` | Dev server URL (e.g., `http://localhost:5173`) |
| `figmaFileKey` | Target Figma file key |

## Procedure

### 1. Read build order

Read `{pipelineDir}/component-hierarchy/build-order.md`. Parse the table rows to extract component names in topological order (Level 0 = leaves first). Build a flat ordered list of component names.

### 2. Get route list

Run the query-pages script to get the deduplicated route list:

```bash
node {skillDir}/scripts/query-pages.js \
  --pages-json {pipelineDir}/component-hierarchy/pages.json \
  --routes
```

If `pages.json` does not exist, use an empty route list and skip Phase G.

Parse the output: one route per line. Strip any trailing parenthetical instance counts (e.g., `/cases/:id  (5 instances)` → `/cases/:id`).

### 3. Write checklist

Write `{pipelineDir}/checklist.md` with this exact format:

```markdown
# Pipeline Checklist
Generated: {ISO timestamp}
Skill dir: {skillDir}
Pipeline dir: {pipelineDir}
Source root: {sourceRoot}
Storybook URL: {storybookUrl}
Dev server URL: {devServerUrl}
Figma file key: {figmaFileKey}

Components (build-order): {comma-separated list, leaves first}
Pages: {comma-separated route list}

## Phase B: Tokens, Assets, Patterns
- [ ] B.1 | 2-extract-design-tokens/prompt.md |
- [ ] B.2 | 3-extract-assets/prompt.md |
- [ ] B.3 | 4-discover-story-patterns/prompt.md |

## Phase C.1: Identify Variants [PARALLEL]
{For each component in build-order, emit 1 line:}
- [ ] C.1.{n} | 6-capture-dom-from-stories/1-prompt.identify-variants-for-a-component.md | componentName={Name}

## Phase C.2: Generate Stories [PARALLEL]
{For each component in build-order, emit 1 line:}
- [ ] C.2.{n} | 6-capture-dom-from-stories/2-prompt.generate-stories-for-a-component.md | componentName={Name}

## Phase C.3: Capture DOM (batch)
- [ ] C.3 | 6-capture-dom-from-stories/3-prompt.capture-dom-for-a-component.md |

## Phase D: Build Scripts (per component, build-order)
{For each component in build-order, emit 1 line:}
- [ ] D.{n}   | 7-generate-build-scripts/1-prompt.diff-and-classify-for-a-component.md | componentName={Name}
{After all components, emit 2 lines:}
- [ ] D.{n+1} | 7-generate-build-scripts/2-prompt.generate-build-scripts-for-all-components.md |
- [ ] D.{n+2} | 7-generate-build-scripts/3-prompt.prioritize-page-variants.md |

## Phase E: Figma Setup
- [ ] E.1 | 5-setup-figma-file/prompt.md | figmaFileKey={figmaFileKey}

## Phase F: Build, Verify & Fix Components (build-order, leaves first)
{For each component in build-order, emit 3 lines:}
- [ ] F.{n}   | 8-batch-build/prompts/build-a-component.md  | componentName={Name}, figmaFileKey={figmaFileKey}
- [ ] F.{n+1} | 8-batch-build/prompts/verify-a-component.md | componentName={Name}, figmaFileKey={figmaFileKey}
- [ ] F.{n+2} | 8-batch-build/prompts/fix-a-component.md    | componentName={Name}, figmaFileKey={figmaFileKey}

## Phase G: Compose & Verify Pages
{For each route, emit 2 lines:}
- [ ] G.{n}   | 8-batch-build/prompts/build-a-page-frame.md  | route={route}, figmaFileKey={figmaFileKey}
- [ ] G.{n+1} | 8-batch-build/prompts/verify-a-page-frame.md | route={route}, figmaFileKey={figmaFileKey}

## ★ HUMAN CHECKPOINT — Review pages in Figma before continuing
```

### 4. Report

Print the following summary and respond with `PASS`:

```
Checklist generated: {pipelineDir}/checklist.md
  {B_count} token/asset/pattern steps
  {C_count} DOM capture steps ({component_count} components × 2 parallel waves + 1 batch capture)
    C.1: {component_count} identify-variant items [PARALLEL]
    C.2: {component_count} generate-stories items [PARALLEL]
    C.3: 1 batch capture-dom item (single browser session)
  {D_count} build script steps ({component_count} components × 2 + 1)
  {E_count} Figma setup step
  {F_count} build/verify/fix steps ({component_count} components × 3)
  {G_count} page compose steps ({page_count} pages × 2)
  Total: {total} checklist items
```

If any error occurs (missing build-order, script failure), respond with `FAIL: <one-line reason>`.
