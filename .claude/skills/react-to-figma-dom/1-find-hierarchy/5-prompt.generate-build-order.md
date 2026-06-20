# Generate Build Order and Hierarchy Diagram

Read all per-component analysis files, build a dependency graph, perform a topological sort (leaves first), and produce a level-grouped build order and a Mermaid hierarchy diagram.

## Inputs

- **Children graph**: `.temp/react-to-figma-dom/component-hierarchy/children-graph.json` — produced by `extract-children.js`
- **Barrel map**: `.temp/react-to-figma-dom/component-hierarchy/barrel-map.md`

## Procedure

### 1. Read component dependencies

Read `children-graph.json`. For each component in `components`, extract:
- Component name (object key)
- Source type (`sourceType` field)
- Leaf flag (`leaf` field)
- List of children (`children` array)

### 2. Resolve aliases

Use the barrel map to normalize component references. If a child in one analysis references a name that the barrel map resolves to another component's canonical name, unify them.

For example, if `Sidebar` renders `<Button>` and the barrel map shows `Button → src/components/ui/button.tsx`, and there's an analysis for `Button` at that path, connect them.

### 3. Build dependency graph

Create a directed graph where:
- Each node is a component
- An edge `A → B` means "A renders B" (A depends on B being built first)

Track edges as: `{ parent: string, child: string, relationship: string }`

### 4. Detect issues

**Circular dependencies**: If the graph contains cycles, record them as warnings. For the topological sort, break cycles by removing the edge from the component with the most dependents (it's likely a layout/wrapper component).

**Orphan components**: Components that appear in no other component's children AND have no children of their own. These may be entry points (e.g., pages) or unused components. Flag them but include them in the build order.

**Unresolved references**: Children referenced in analysis files that don't match any discovered component. These may be:
- Components missed in discovery
- Typos or renamed components
- Third-party components not in the npm scan

Record these as warnings.

### 5. Topological sort

Perform a topological sort of the dependency graph (reverse — leaves first).

Group components by **level**:
- **Level 0**: Components with no children (leaves) — these can be built first
- **Level 1**: Components whose children are ALL Level 0
- **Level 2**: Components whose children are ALL Level 0 or Level 1
- **Level N**: Components whose children are ALL Level N-1 or below

Within each level, sort alphabetically for stability.

### 6. Write `build-order.json`

Write to `.temp/react-to-figma-dom/component-hierarchy/build-order.json`:

```json
{
  "totalComponents": 42,
  "totalLevels": 5,
  "leafComponents": 12,
  "levels": [
    {
      "level": 0,
      "description": "Leaves (build first)",
      "components": [
        { "name": "Badge", "path": "src/components/ui/badge.tsx", "sourceType": "ui-library" },
        { "name": "ChevronDown", "path": "lucide-react", "sourceType": "npm" },
        { "name": "Input", "path": "src/components/ui/input.tsx", "sourceType": "ui-library" },
        { "name": "Label", "path": "src/components/ui/label.tsx", "sourceType": "ui-library" }
      ]
    },
    {
      "level": 1,
      "components": [
        { "name": "Button", "path": "src/components/ui/button.tsx", "sourceType": "ui-library", "dependencies": ["Badge"] },
        { "name": "FormField", "path": "src/components/common/FormField.tsx", "sourceType": "project", "dependencies": ["Input", "Label"] },
        { "name": "NavItem", "path": "src/components/Sidebar/NavItem.tsx", "sourceType": "project", "dependencies": ["ChevronDown"] }
      ]
    }
  ],
  "warnings": {
    "circularDependencies": [],
    "orphanComponents": [],
    "unresolvedReferences": []
  }
}
```

### 7. Write `hierarchy.md`

Write the Mermaid diagram to `.temp/react-to-figma-dom/component-hierarchy/hierarchy.md`:

```markdown
# Component Hierarchy

```mermaid
graph TD
    classDef project fill:#e8f4f8,stroke:#2196F3
    classDef uiLib fill:#e8f8e8,stroke:#4CAF50
    classDef npm fill:#f8f0e8,stroke:#FF9800
    classDef leaf fill:#fff3e0,stroke:#FF5722,stroke-width:2px

    App:::project --> Layout:::project
    Layout --> Sidebar:::project
    Layout --> Header:::project
    Sidebar --> Button:::uiLib
    Sidebar -->|"list"| NavItem:::project
    Sidebar -.->|"isAdmin"| AdminPanel:::project
    Header --> Button
    NavItem --> ChevronDown:::npm
    Button --> Badge:::leaf
```
``​`

#### Mermaid style guide

| Relationship | Arrow style | Label |
|-------------|-------------|-------|
| renders | `A --> B` | (none) |
| routes | `A -->│"route: /path"│ B` | route path |
| conditional | `A -.-> B` | condition expression |
| list | `A -->│"list"│ B` | "list" |
| wraps | `A -->│"wraps"│ B` | "wraps" |
| prop-injection | `A -..-> B` | prop name |

| Source type | Class | Style |
|-------------|-------|-------|
| project | `project` | Blue border |
| ui-library | `uiLib` | Green border |
| npm | `npm` | Orange border |
| leaf (any type) | `leaf` | Thick orange-red border |

**Diagram size**: If the graph has more than 50 nodes, produce two diagrams:
1. **Overview**: Only Level 2+ components (collapse leaves and Level 1 into counts on edges, e.g., `Sidebar -->|"5 children"| ...`)
2. **Full**: All components

### 8. Return summary

Return to the parent orchestrator:

```
Build order complete.
- Total components: {count}
- Levels: {count}
- Leaf components (Level 0): {count}
- Circular dependencies: {count}
- Orphan components: {count}
- Unresolved references: {count}
- Outputs:
  - .temp/react-to-figma-dom/component-hierarchy/build-order.json
  - .temp/react-to-figma-dom/component-hierarchy/hierarchy.md
```
