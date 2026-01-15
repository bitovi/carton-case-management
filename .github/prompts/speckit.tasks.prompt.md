---
agent: speckit.tasks
---

## Figma Design References in Tasks

When generating tasks for frontend components:

1. **Check spec.md for Design References section** - extract all Figma links and their component mappings
2. **Embed Figma link directly in each relevant task** using this format:

   ```text
   - [ ] T012 [P] [US1] Create ComponentName component in src/components/ComponentName/ComponentName.tsx
     📐 Design: https://figma.com/design/xxx/file?node-id=1-2
   ```

3. **Include the link for**:
   - Component creation tasks
   - Styling/CSS tasks
   - UI state implementation tasks
   - Any task that affects visual appearance

4. **Preserve the full URL** exactly as provided in the spec (including node-id parameters)

This ensures the implement agent has immediate access to the Figma design context when working on each component.
