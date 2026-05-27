# Build Component in Figma

Read this file completely, then execute the steps exactly as written. No exploration, no analysis, no extra tool calls.

## Inputs (provided by orchestrator)

- **componentName**: (provided in subagent prompt)
- **componentDir**: (provided in subagent prompt)
- **fileKey**: (provided in subagent prompt)
- **maxVariants**: (provided in subagent prompt, default 2)
- **combineTemplate**: `.claude/skills/react-to-figma-dom/6-get-component-context-and-implement-in-figma/2-implement-in-figma/scripts/combine-variants.template.js`

## Exact tool call sequence

You will make exactly these tool calls in this order. No others.

### Step 1: List variants

Run in terminal:
```bash
find "{componentDir}/variants" -name "build-script.js" -maxdepth 2 | sort | head -{maxVariants}
```

This gives you the paths to the first N build scripts. Also count the total:
```bash
find "{componentDir}/variants" -name "build-script.js" -maxdepth 2 | wc -l
```

Record: `selectedVariants` (array of paths) and `totalVariants` (count).

### Step 2: Execute build scripts via use_figma

For each path from Step 1, in order:

1. **read_file** the build-script.js
2. **use_figma** with the file content as-is (fileKey from inputs)
3. Record the variant folder name (parent directory name) and the returned node ID

If use_figma returns an error on any variant, stop and skip to Step 5 with `status: "build_failed"`.

If a variant has chunk files (`build-script.chunk0.js`, `build-script.chunk1.js`, ...) instead of `build-script.js`, execute each chunk sequentially via use_figma.

### Step 3: Combine variants

1. **read_file** the combine template (path above)
2. Replace all `__COMPONENT_NAME__` with the actual componentName
3. **use_figma** with the modified content (fileKey from inputs)
4. Record the `setId` from the response (this is the component set node ID)

### Step 4: Write results

**create_file** `{componentDir}/figma-result.json`:
```json
{
  "componentName": "{componentName}",
  "setNodeId": "{setId from Step 3}",
  "fileKey": "{fileKey}",
  "singleComponent": {true if only 1 variant was built},
  "partialBuild": {true if totalVariants > maxVariants},
  "partialBuiltCount": {number built},
  "totalVariants": {totalVariants from Step 1},
  "variantsBuilt": [
    { "name": "{variant folder name}", "nodeId": "{node ID from use_figma}" }
  ],
  "variantsSkipped": ["{remaining variant folder names}"]
}
```

**create_file** `{componentDir}/figma-result.md`:
```
# Figma Result: {componentName}

## Component Set
- **Set Node ID**: {setId}
- **File Key**: {fileKey}
- **Single Component**: {true/false}
- **Partial Build**: {true/false} ({built} of {total} variants)

## Variants Built

| # | Variant Name | Node ID |
|---|--------------|---------|
| 1 | {exact folder name} | {nodeId} |

## Variants Skipped

| # | Variant Name |
|---|--------------|
| N | {folder name} |
```

The "Variant Name" column must exactly match the variant folder name on disk (including spaces). The verify script uses this to locate `variants/{name}/screenshot.png`.

### Step 5: Report back

Return exactly this (nothing else):
```
status: ok
componentName: {componentName}
variantCount: {number built}
totalVariants: {totalVariants}
setNodeId: {setId or null}
```

Or if failed:
```
status: build_failed
componentName: {componentName}
failedVariant: {name}
error: {error message}
```

## Rules

- Only use these tools: `read_file`, `run_in_terminal` (for the find command in Step 1), `use_figma`, `create_file`
- Never run `ls`, `cat`, `head`, `wc`, or any other exploratory commands beyond Step 1
- Never analyze, compare, or diff build scripts
- Never write Figma API code from scratch — only execute existing files
- Never modify build-script.js content before passing to use_figma
- The orchestrator already cleaned the Figma canvas — do not run any cleanup
