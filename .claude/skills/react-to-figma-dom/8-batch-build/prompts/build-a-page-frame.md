# Build Page Frame in Figma

Create a viewport-sized Figma frame that composes built component instances into a full page layout, using resolved props from the runtime page tree to set variant properties and text overrides.

## Inputs

- **Route**: The route this page represents (e.g., `/cases/1`)
- **Page tree**: The resolved component tree from `pages.json` — `{ name, props, selector, sourceFile, children }` nodes
- **Layout components**: Array of component names that persist across all routes
- **Component → Figma node ID map**: Maps component names to their Phase 6 Figma component node IDs
- **Figma variable map**: `.temp/react-to-figma-dom/figma-variables-map.json` — CSS var → Figma variable ID (from Phase 5)
- **Design tokens**: `.temp/react-to-figma-dom/design-tokens.json`
- **CSS-Figma map**: `.temp/react-to-figma-dom/css-figma-map.json`
- **Figma page**: The name of the Figma page to build on (e.g., "Screens")
- **Viewport**: Frame dimensions (default: 1440×900)

## Output

- **`page-figma-result.json`**: Written to the output path provided by the parent orchestrator

## Procedure

### 1. Create the page frame

Using the `use_figma` MCP tool:

1. Navigate to the "Screens" page in the Figma file.
2. Create a new frame at the specified viewport size (1440×900).
3. Name the frame using the route: e.g., `Page / /cases/1` or `Page / /tasks/new`.
4. Set the frame's fill to the app's background color from design tokens (look for `--background` or similar in the CSS-Figma map).
5. Set up **auto-layout** on the frame:
   - Direction: **Vertical** (the app renders Header on top, then content below)
   - Sizing: **Fixed** width and height matching the viewport

### 2. Place layout components

Walk the page tree's top-level children. For each **layout component** (name appears in the `layoutComponents` array):

1. Look up the component's Figma node ID from the component map.
2. Create an **instance** of that component inside the page frame.
3. Apply resolved props as overrides:
   - **String props** → set as text overrides on matching text layers
   - **Boolean props** → toggle visibility of conditional layers
   - **Enum-like string props** (e.g., `activeItem="cases"`) → set as variant properties if the component has matching variant axes

Layout component placement order should match the page tree order (typically Header first, then MenuList as a sidebar).

### 3. Place the page content area

After layout components, create a **content container frame** inside the page frame:

1. Set up auto-layout matching the app's content area:
   - For most apps: horizontal auto-layout (sidebar list + main content)
   - Reference the page tree structure to determine the layout direction
2. Set sizing: fill-container width, fill-container height
3. Apply content area background/padding from design tokens if applicable

### 4. Place page-specific components

Walk the non-layout children in the page tree recursively:

For each component node in the tree:

1. **Look up Figma node ID** from the component map. If not found (component wasn't built in Phase 6), log a warning and skip.
2. **Create an instance** of the component in the appropriate container.
3. **Apply resolved props as overrides**:
   - Text content props (strings that look like content: titles, descriptions, status labels) → text overrides
   - Variant-like props (enum strings matching component variant axes) → variant property overrides
   - Numeric props (counts, sizes) → text overrides where applicable
4. **Set sizing on the instance**:
   - Components that should fill available space: set to `FILL` (fill-container)
   - Components with fixed dimensions: leave as `HUG` or set explicit size
   - Reference the page tree's position in the layout to determine sizing behavior
5. **Recurse into children**: If the component has child instances in the page tree, and the Figma component has slots or nested frames, place child instances inside the appropriate slot.

### 5. Handle missing components

If a component in the page tree has no corresponding Figma node ID:

1. Create a **placeholder frame** with the component's name as a text label.
2. Set a distinct background color (e.g., light yellow) to make it visually obvious.
3. Size it reasonably based on siblings.
4. Log the missing component for the verification step.

### 6. Position and arrange

After all components are placed:

1. Verify auto-layout is working correctly (no overlaps, proper spacing).
2. If the page tree implies a split layout (e.g., list on left, detail on right), ensure the content container's auto-layout direction and child sizing match.
3. Apply spacing values from design tokens (`gap`, `padding`).

### 7. Write output

Write `page-figma-result.json`:

```json
{
  "route": "{route}",
  "frameNodeId": "{nodeId}",
  "frameName": "Page / {route}",
  "viewport": { "width": 1440, "height": 900 },
  "figmaPage": "Screens",
  "componentsPlaced": [
    {
      "component": "Header",
      "instanceId": "{instanceId}",
      "propsApplied": {},
      "status": "placed"
    }
  ],
  "missingComponents": [],
  "notes": "{any layout decisions, warnings, or deviations}"
}
```
