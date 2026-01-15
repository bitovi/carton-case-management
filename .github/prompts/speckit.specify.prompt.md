---
agent: speckit.specify
---

## Figma Design Integration

When the user provides Figma links:

1. **Immediately fetch the design** using `mcp_figma_get_design_context` for each link
2. **Extract and document** in the spec:
   - Component names and hierarchy
   - Visual requirements (colors, spacing, typography patterns)
   - UI states and interactions visible in the design
   - Any text/labels that inform requirements
3. **Add a "Design References" section** to the spec with this format:

   ```markdown
   ## Design References

   | Component | Figma Link | Key Visual Requirements |
   |-----------|------------|------------------------|
   | [ComponentName] | [full URL] | [Brief notes from design] |
   ```

4. **Map designs to user stories** - associate each Figma link with the user story it supports

Make sure to use MCP tools to load data from any figma file or jira ticket.
