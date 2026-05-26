# 6 Get Component Context and Implement in Figma
## 6.2 Implement in Figma
### 6.2.1 Implement First Variant
#### 6.2.1.3 Verify Default Variant

**Begin your response by outputting the heading lines above verbatim.**

Screenshot the built Figma component, run a pixel diff against the React reference, then analyze all three images together to identify exactly what is different.

## Inputs

| Input | Description |
|-------|-------------|
| `default-variant/figma-result.md` | Node ID and instance manifest from the build step |
| `screenshots/{defaultScreenshot}` | React reference PNG for the default variant |
| `analysis.md` | Expected children list and component structure |
| `builtComponents` | Map of `{componentName: nodeId}` for child components |
| `componentDir` | Path to the component's `.temp/react-to-figma/components/{Name}/` directory |
| `fileKey` | Figma file key |

## Output

Write `default-variant/verification.md` to the component directory.

## Procedure

### 1. Screenshot the Figma component

Read `default-variant/figma-result.md` → get the node ID.

Use the Figma MCP `get_screenshot` tool to capture the Figma component:
- `fileKey`: from input
- `nodeId`: from figma-result.md
- Get the screenshot at 2x scale

The `get_screenshot` response includes an asset URL (e.g. `https://www.figma.com/api/mcp/asset/{id}`). Download it to disk:

```bash
curl -s -o "{componentDir}/default-variant/figma.png" "{assetUrl}"
```

### 2. Check text content

Read `screenshots/{defaultScreenshot}.html.md` (the `.html.md` file matching the screenshot name, without the `.png` extension). Extract all text content from the HTML structure.

Use `use_figma` to read the Figma component's text nodes:

```javascript
const node = figma.getNodeById('{nodeId}');
const textNodes = node.findAll(n => n.type === 'TEXT');
return JSON.stringify(textNodes.map(t => ({ name: t.name, characters: t.characters })));
```

Compare: for each text node in the React HTML, there should be a matching Figma text node with the same content. Record mismatches (e.g., Figma has "Label" but React has "Error").

### 3. Run pixel diff

Run `compare.js` from the scripts directory with the React reference and Figma screenshot:

```bash
node .claude/skills/react-to-figma/6-get-component-context-and-implement-in-figma/2-implement-in-figma/scripts/compare.js \
  "{componentDir}/screenshots/{defaultScreenshot}" \
  "{componentDir}/default-variant/figma.png" \
  "{componentDir}/default-variant/diff"
```

This writes:
- `default-variant/diff/diff.png` — red pixels highlight every difference
- `default-variant/diff/comparison.json` — match %, border match %, verdict
- `default-variant/diff/source-a.png` — copy of React reference
- `default-variant/diff/source-b.png` — copy of Figma result

Read `comparison.json` to get the pixel-level stats.

### 4. Analyze all three images together

View all three images:
1. `screenshots/{defaultScreenshot}` — React reference
2. `default-variant/figma.png` — Figma result
3. `default-variant/diff/diff.png` — Pixel diff (red = different)

Use the diff image as a guide: red regions tell you exactly **where** differences are. Then inspect the React reference and Figma result images at those regions to understand **what** is different.

For each red region in the diff, identify:
- Which visual element is it? (background, border, text, icon, spacing gap, shadow...)
- What does the React reference show at that region? (color, shape, content)
- What does the Figma result show instead?
- Which Figma node is responsible? (from `analysis.md` children list or `figma-result.md`)

### 5. Instance integrity check

For each entry in `figma-result.md` instance manifest:
```javascript
const node = figma.getNodeById('{instanceNodeId}');
return JSON.stringify({
  type: node.type,
  masterComponentId: node.type === 'INSTANCE' ? node.mainComponent.id : null,
  visible: node.visible,
  width: node.width,
  height: node.height
});
```
Compare master ID against `builtComponents` — should match.

### 6. Write verification.md

```markdown
# Verification: {componentName} (default variant)

## Verdict: {PASS | PARTIAL | FAIL}

## Pixel Diff Stats

| Metric | Value |
|--------|-------|
| Overall match | {matchPct}% |
| Border match | {borderMatchPct}% |
| Diff pixels | {diffPixels} / {totalPixels} |
| Script verdict | {verdict} |

## Differences Found

{Describe each difference identified from the three-image analysis. Be specific.}

### Difference 1: {short title, e.g. "Background color wrong"}
- **Where**: {region in the image — e.g., "entire background", "left border stripe", "icon area"}
- **Figma node**: {node name or ID from analysis.md / figma-result.md}
- **Expected** (React): {exact description — color hex, text content, size, shape}
- **Actual** (Figma): {what Figma is rendering instead}
- **Fix**: {specific actionable instruction — e.g., "Set fills[0] to variable VariableID:5:30" or "Set layoutMode to HORIZONTAL"}

### Difference 2: ...

## Instance Integrity

| Instance | Master ID | Status |
|----------|-----------|--------|
| {instanceName} | {masterComponentId} | {OK / WRONG_MASTER / MISSING} |

## Images

- React reference: `screenshots/{filename}`
- Figma result: `default-variant/figma.png`
- Pixel diff: `default-variant/diff/diff.png`
```

## Verdict Rules

| Verdict | Criteria |
|---------|----------|
| **PASS** | No meaningful differences. Minor pixel-level noise acceptable (±2px anti-aliasing, slight color shift from variable binding). match% ≥ 90. |
| **PARTIAL** | 1-2 fixable differences (wrong color, missing text override, sizing off by >4px). No structural problems. match% ≥ 75. |
| **FAIL** | 3+ differences, OR any structural issue (missing children, wrong layout direction, component is empty/collapsed, wrong component instanced). match% < 75. |
