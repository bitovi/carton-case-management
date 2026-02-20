---
name: component-reuse
description: Ensure existing UI components are reused before creating new ones. Use when implementing any UI from Figma designs, tickets, or mockups. Requires a component audit to search the codebase before creating new components. If a component doesn't exist, delegates to figma-implement-component skill.
---

# Skill: Component Reuse

Ensures existing components are discovered and reused before creating new ones to prevent duplicates and maintain design system consistency.

## Required Before Creating Components

Complete the audit process and output the audit table before creating any new component files.

## When to Use

- Before implementing UI elements from Figma designs
- When tickets require adding UI components
- Before creating any new component file

## When Not to Use

- For non-UI code (APIs, utilities, hooks)
- When explicitly told to create new components regardless of existing ones

## Key Principles

1. Figma layer names ≠ actual component names
2. Let Figma Code Connect reveal existing components - don't guess names
3. Use existing components directly, avoid wrapper components
4. CodeConnectSnippets indicate the component already exists in the codebase

## Workflow

```
1. Extract all Figma URLs from Jira ticket
2. Call get_design_context on each link
3. Extract component names from CodeConnectSnippets
4. Search exact names first (remove spaces)
5. Search variations only if exact search fails
6. Output audit table
7. Reuse existing or delegate to figma-implement-component
```

## Step-by-Step Process

### Step 0: Extract Figma Links

When working from a Jira ticket, extract all Figma URLs:
- Ticket description
- Supporting Artifacts section
- Comments or attachments

Example format:
```
- https://www.figma.com/design/FILE_KEY?node-id=123-456 (Feature Button)
- https://www.figma.com/design/FILE_KEY?node-id=789-012 (Feature Active)
```

### Step 1: Get Design Context for Each Link

Call `mcp_figma_get_design_context` for every Figma URL:

```javascript
mcp_figma_get_design_context({ 
  nodeId: "123-456",
  clientFrameworks: "react",
  clientLanguages: "typescript"
})
```

Each screen may reference different components via Code Connect.

### Step 2: Extract Component Names

Look for CodeConnectSnippet elements in each response:

```jsx
<CodeConnectSnippet data-name="Feature Dialog">
  <FeatureDialog open={true} onOpenChange={() => {}} />
</CodeConnectSnippet>
```

Extract from each snippet:
1. Component tag name (e.g., `FeatureDialog`) - most important
2. The `data-name` attribute (e.g., "Feature Dialog")
3. Any imports at the top

Create a list of all unique component names found across all Figma links.

### Step 3: Search Exact Names

For every component found in CodeConnectSnippets, search using the exact name (remove spaces from data-name):

- "Feature Dialog" → Search: `FeatureDialog`
- "Feature Trigger" → Search: `FeatureTrigger`

```bash
grep_search "FeatureDialog" --includePattern="**/*.tsx"
file_search "**/FeatureDialog/**"
semantic_search "FeatureDialog component implementation"
```

### Step 4: Search Variations (Only if Exact Search Failed)

If exact name search found nothing, try variations:

- "Feature Dialog" → Try: `FeatureModal`, `Feature`, `Dialog`
- "Feature Trigger" → Try: `FeatureButton`, `TriggerButton`

Search common synonyms:
- Trigger → Button, Toggle, Activator
- Sheet → Dialog, Modal, Drawer, Panel
- Dialog → Modal, Popup, Overlay

```bash
grep_search "Feature.*Button|Feature.*Trigger" --isRegexp=true --includePattern="**/*.tsx"
semantic_search "feature trigger button component"
```

### Step 5: Output Audit Table

Output this table before creating any components:
```
| Figma Screen | Figma Component | CodeConnect Name | Exact Search | Variation Search | Location | Action |
|--------------|-----------------|------------------|--------------|------------------|----------|--------|
| 123-456 | Feature Trigger | FeatureTrigger | NOT FOUND | Found as FeatureButton | common/FeatureButton/ | REUSE |
| 789-012 | Feature Sheet | FeatureDialog | FOUND | N/A | common/FeatureDialog/ | WRAP |
| 345-678 | Custom Widget | CustomWidget | NOT FOUND | NOT FOUND | NOT FOUND | CREATE |
```

Column definitions:
- **Figma Screen**: Node ID from Figma URL
- **Figma Component**: The `data-name` from CodeConnectSnippet
- **CodeConnect Name**: Component tag (e.g., `<FeatureTrigger>`)
- **Exact Search**: Did searching the CodeConnect name find anything?
- **Variation Search**: What variation/synonym search succeeded?
- **Location**: Path to existing component
- **Action**: REUSE (use directly), WRAP (create domain wrapper), or CREATE (new component)

**How to determine Action**:
- **REUSE**: Component is domain-specific or already scoped (e.g., `CaseCard`, `CustomerForm`)
- **WRAP**: Component is generic/common and needs domain logic (e.g., `FiltersDialog`, `ConfirmationDialog`)
- **CREATE**: Component doesn't exist after exhaustive search

### Step 6: Take Action

For components marked REUSE:
- Import and use the existing component directly
- Adapt props as needed
- No wrapper needed

For components marked WRAP:
- Create a domain-specific wrapper in the domain's `components/` folder
- The wrapper encapsulates domain logic (hooks, state, data fetching)
- The wrapper passes domain data to the generic component
- Example: `FeatureGenericComponent` wraps `GenericComponent` + `useFeatureData()`
- See "Domain Wrapper Components" in copilot-instructions.md for full pattern

For components marked CREATE:
- Answer these questions first:
  1. What similar components did you find?
  2. Why can't they be used or extended?
  3. What specific functionality is missing?
- If you cannot answer all three, reuse an existing component
- Otherwise, invoke the `figma-implement-component` skill

### Warning Signs to Stop

Do not create components that:
- Have generic names (Button, Input, Modal, Card, Alert, Dialog)
- Serve common UI purposes (feedback, navigation, forms)
- Look similar to something you've seen elsewhere

Check existing components first. These almost certainly already exist.

### What Not to Create

| If Figma says... | Don't create... | Check for... |
|------------------|-----------------|--------------|
| Notification | Notification.tsx | Alert, Toast, Snackbar, Banner |
| Popup | Popup.tsx | Dialog, Modal, Overlay, Sheet |
| Input Field | InputField.tsx | Input, TextField, TextInput |
| Action Button | ActionButton.tsx | Button (with variant prop) |

## Integration with Other Skills

This skill acts as a gate before implementation:
```
User Request → component-reuse (audit) → figma-implement-component (if CREATE) → Implementation
```

## Examples

### Example 1: Feature Component Audit

Step 0: Extract links from ticket
```
1. node-id=123-456 (Feature Button)
2. node-id=789-012 (Feature Active)
```

Step 1: Get context for both links
```javascript
mcp_figma_get_design_context({ nodeId: "123-456" }) // No CodeConnect
mcp_figma_get_design_context({ nodeId: "789-012" }) // Returns FeatureDialog
```

Step 2: Extract names
```
- FeatureDialog (from CodeConnect)
- FeatureTrigger (from layer name)
```

Step 3: Search exact
```
FeatureDialog → FOUND at common/FeatureDialog/
FeatureTrigger → NOT FOUND
```

Step 4: Search variations
```
FeatureButton → FOUND at common/FeatureButton/
```

Step 5: Audit table
```
| Screen | Component | CodeConnect | Exact | Variation | Location | Action |
| 789-012 | Feature Panel | GenericDialog | FOUND | N/A | common/GenericDialog/ | WRAP |
| 123-456 | Feature Trigger | FeatureTrigger | NOT FOUND | FeatureButton | common/FeatureButton/ | REUSE |
```

Step 6: 
- For GenericDialog: Create FeatureGenericDialog wrapper in Feature domain
- For FeatureButton: Import and use directly

### Example 2: Component Already Exists

Figma shows "Notification" → CodeConnect shows `<Alert variant="success" />`

Search "Alert" → Found at obra/Alert/

Action: REUSE Alert, don't create Notification

### Example 3: Generic Component Needs Domain Wrapper

Figma shows "Feature Panel" → CodeConnect shows `<GenericDialog />`

Search "GenericDialog" → Found at common/GenericDialog/

Analysis: GenericDialog is generic (accepts any data/config), but FeatureName needs specific:
- Domain-specific data sources
- Custom validation logic
- useFeatureData hook for state management

Action: WRAP
- Create FeatureGenericDialog in FeatureName/components/
- Use useFeatureData hook
- Pass data to GenericDialog

Result:
```tsx
// FeatureName/components/FeatureGenericDialog/FeatureGenericDialog.tsx
export function FeatureGenericDialog({ open, onOpenChange }) {
  const { data, handleAction, handleClear } = useFeatureData();
  return (
    <GenericDialog
      open={open}
      onOpenChange={onOpenChange}
      data={data}
      onAction={handleAction}
      onClear={handleClear}
    />
  );
}
```

### Example 4: Component Missing

Figma shows "Custom Component" → No CodeConnect

Search "CustomComponent" → NOT FOUND
Search "Custom", "Component" → NOT FOUND

Action: Create via figma-implement-component skill

## Common Mistakes

### Not checking Figma first
Incorrect: See "feature" mentioned → Create FeatureButton
Correct: Extract Figma links → Call get_design_context → Check CodeConnect → Search exact names

### Calling get_design_context on only one link
Incorrect: Ticket has 3 links → Check first one only
Correct: Call get_design_context on all 3 links

### Searching variations before exact names
Incorrect: CodeConnect shows "FeatureTrigger" → Search "feature button badge"
Correct: Search exact "FeatureTrigger" first → Then try variations

### Creating before auditing
Incorrect: Need feature button → Create FeatureButton.tsx
Correct: Run audit → Output table → Confirm missing → Then create

### Ignoring CodeConnectSnippets
Incorrect: See `<FeatureDialog />` in CodeConnect → Create new FeatureDialog
Correct: CodeConnect presence means it exists → Search for it → Reuse it

### Searching only one term
Incorrect: Search "FeatureDialog" → Not found → Create it
Correct: Search "FeatureDialog" → "FeatureModal" → "Dialog" → Semantic search → Then decide

## Quality Checklist

Before proceeding to implementation:

- [ ] Extracted all Figma links from ticket
- [ ] Called get_design_context on every link
- [ ] Identified all CodeConnectSnippets
- [ ] Searched exact names first
- [ ] Searched variations only after exact search failed
- [ ] Output the audit table
- [ ] For REUSE: Verified component meets requirements
- [ ] For CREATE: Confirmed exhaustive search found nothing
- [ ] No duplicates: Not creating what exists with different name