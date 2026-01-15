---
agent: speckit.implement
---

## Figma Design Implementation

When implementing frontend components:

1. **Check each task for a Figma link** (marked with 📐 Design:)
2. **If a Figma link exists**, use `mcp_figma_get_design_context` to fetch fresh design context BEFORE implementing
3. **Apply design specifications**:
   - Match exact colors, spacing, and typography from the Figma design
   - Implement all UI states visible in the design (hover, active, disabled, etc.)
   - Follow component hierarchy and naming from the design
   - Use CSS variables or theme tokens that map to Figma variables when available
4. **If design context is unclear**, use `mcp_figma_get_screenshot` to visualize the component
5. **Document any deviations** from the design with reasoning in code comments
