---
agent: figma-sync
description: Check a component against its Figma design and identify differences
---

# Figma Component Sync

When asked to sync or check a component against Figma:

## Step 1: Setup

1. **Identify the component path** from user input
2. **Create temp directory**: `.temp/component-updates/{component-name}/`
3. **Read the component's README.md** to find the Figma source URL

## Step 2: Fetch Figma Context

1. **Parse the Figma URL** to extract:
   - `fileKey`: The ID after `/design/` (e.g., `7QW0kJ07DcM36mgQUJ5Dtj`)
   - `nodeId`: The `node-id` parameter, convert `-` to `:` (e.g., `1261-9396` → `1261:9396`)

2. **Call `mcp_figma_get_design_context`** with:
   ```
   fileKey: extracted fileKey
   nodeId: extracted nodeId (with colon format)
   ```

3. **Save the output** to `.temp/component-updates/{component-name}/figma-context.md`

4. **Check parent folder** for README.md with additional Figma links and fetch those too

## Step 3: Analyze Current Implementation

1. **Read the component's .tsx file**
2. **Document current styling**:
   - Colors (Tailwind classes or CSS values)
   - Typography (font sizes, weights)
   - Spacing (padding, margin, gap)
   - Shadows
   - Border radius
   - Sizing

3. **Save analysis** to `.temp/component-updates/{component-name}/current-implementation.md`

## Step 4: Generate Comparison

Create `.temp/component-updates/{component-name}/comparison.md` with:

1. **Summary of Figma design** (from context)
2. **Summary of current implementation**
3. **Table of differences** with columns:
   - Category
   - Figma Design
   - Current Code
   - Impact (Low/Medium/High)

4. **Decision checkboxes** for each difference:
   ```markdown
   ### Difference {N}: {description}
   - Figma: {figma value}
   - Code: {current value}

   **Decision:**
   - [ ] 🔧 IMPLEMENT - Update code to match Figma
   - [ ] ✅ ACCEPT - Keep current, add to accepted deviations
   - [ ] ⏭️ SKIP - Decide later

   **Reason (if accepting):** 
   ```

5. **List previously accepted deviations** from README.md (if any)

## Step 5: Prompt User

After creating comparison.md, tell the user:

```
📋 Figma sync analysis complete for {ComponentName}!

I've created a comparison report at:
`.temp/component-updates/{component-name}/comparison.md`

**Next steps:**
1. Open the comparison.md file
2. Review each difference
3. Check ONE box per difference (IMPLEMENT, ACCEPT, or SKIP)
4. Add a reason for any ACCEPT decisions
5. Save the file

Then tell me: "Apply figma sync for {component-name}"
```

## Step 6: Apply Decisions (when user asks)

When user says "apply figma sync for {component}":

1. **Read the comparison.md**
2. **Parse decisions**:
   - Find checked boxes `[x]`
   - Extract the decision type (IMPLEMENT/ACCEPT/SKIP)

3. **For IMPLEMENT decisions**:
   - Generate implementation plan
   - Make code changes
   - Run tests

4. **For ACCEPT decisions**:
   - Add to README.md under "## Accepted Design Deviations"
   - Include the reason provided

5. **Clean up** `.temp/component-updates/{component-name}/` when done
