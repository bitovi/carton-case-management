---
name: component-reuse
description: Ensure existing UI components are reused before creating new ones. Use when implementing any UI from Figma designs, tickets, or mockups. Requires a component audit to search the codebase before creating new components. If a component doesn't exist, delegates to figma-implement-component skill.
---

# Skill: Component Reuse

This skill ensures existing components are discovered and reused before creating new ones. It prevents duplicate components and maintains design system consistency.

## No Component Creation Without Audit

**You must not create any new component file until you have:**

1. Completed the full audit process below
2. Output the audit table showing your search results
3. Confirmed no existing component can serve the same purpose


## When to Use

- Before implementing any UI element from a Figma design
- When a ticket or task requires adding UI components to a page
- Before creating any new component file
- When you see a component name in Figma that might already exist in the codebase

## When NOT to Use

- For non-UI code (APIs, utilities, hooks)
- When explicitly told to create a new component regardless of existing ones

## Why This Matters

Figma layer names ≠ actual component names. Tickets requesting UI features often need **behavior systems** using existing components, not new UI components.

**Anti-pattern:** Creating wrapper components like:
```tsx
export function NewComponent(props) { return <ExistingComponent {...props} />; }
```
**Instead:** Use ExistingComponent directly in your system.

## Workflow Overview
```
┌─────────────────────────────────────────────────────────────────┐
│ 1. EXTRACT - List all components referenced in the design      │
├─────────────────────────────────────────────────────────────────┤
│ 2. SEARCH - For each component, search codebase thoroughly     │
├─────────────────────────────────────────────────────────────────┤
│ 3. DOCUMENT - Output audit results before any implementation   │
├─────────────────────────────────────────────────────────────────┤
│ 4. DECIDE - Reuse existing OR delegate to figma-implement      │
└─────────────────────────────────────────────────────────────────┘
```

## Step-by-Step Instructions

### Step 1: Extract Component References

Before writing any UI code, identify all components needed:

1. **From Figma designs**: Check component names, annotations, and linked design system references
2. **From ticket/requirements**: Note any UI elements mentioned
3. **From mockups/screenshots**: Identify recognizable UI patterns

Create a list of all components you'll need to implement.

### Step 2: Check What Component Figma Actually Uses 

Call `mcp_com_figma_mcp_get_metadata` first:
```javascript
mcp_com_figma_mcp_get_metadata({ nodeId, fileKey })
```

Response shows the real component:
```xml
<instance name="ComponentName" />
```

**If it says `name="ComponentName"`, search for ComponentName in your codebase, not the Figma layer name.**

### Step 3: Search the Codebase

For **each component** identified (using the **metadata name**, not the Figma layer name), perform a thorough search:

**Search strategies (use ALL of these):**

1. **Exact name**: Search for the exact component name from Figma
2. **Design system prefix**: If the project uses a prefix (e.g., `Acme`, `DS`), search with and without it
3. **Synonyms and related terms**: Search for functionally equivalent names
   - Notification → Alert, Toast, Snackbar, Message, Banner
   - Modal → Dialog, Popup, Overlay
   - Input → TextField, TextInput, Field
   - Dropdown → Select, Combobox, Picker
   - Card → Panel, Tile, Container
   - Vote → Like, Thumbs, Rating, Reaction
4. **Partial matches**: Search for root words (e.g., "button" finds "IconButton", "ButtonGroup")

**⚠️ IMPORTANT: Ignore Deprecated Components**

If you find a component prefixed with `Old` (e.g., `OldAlertDialog`, `OldTextarea`, `OldButton`), **DO NOT use it**. These are deprecated components being phased out.

- Mark as `NOT FOUND` in your audit
- Proceed to CREATE the new version using `figma-implement-component`
- Example: Finding `OldAlertDialog` means you should implement `AlertDialog` as a new component

**Search locations:**

- `components/` directory and subdirectories
- `obra/` directory
- `common/` directory
- Feature-specific component folders
- Any design system or shared component folders
- `packages/` in monorepos

**Search commands:**
```bash
# Search for component files
find . -type f -name "*.tsx" | xargs grep -l "ComponentName"

# Search for exports
grep -r "export.*ComponentName" --include="*.ts" --include="*.tsx"

# Search in common component directories
ls -la src/components/
ls -la packages/*/src/components/
```

### Step 4: Get Implementation Details

Call `get_design_context` for props and styling details.

CodeConnectSnippets confirm component choice:
```jsx
<ComponentName prop1="value" prop2="..." />
```

**You must output this audit table before creating any component files.**

If you do not output this table, STOP and output it now.

```
## Component Audit Results

| Figma Component | Search Terms Used | Codebase Match | Action |
|-----------------|-------------------|----------------|--------|
| Toast | toast, alert, notification, snackbar | src/components/Alert/Alert.tsx | REUSE |
| Action Button | button, action-button, cta | src/components/Button/Button.tsx | REUSE |
| AlertDialog | alert, dialog, alert-dialog | src/components/obra/OldAlertDialog (DEPRECATED) | CREATE |
| User Card | card, user-card, profile-card | NOT FOUND | CREATE |
```

### Step 4: Take Action

**For components marked REUSE:**
- Import and use the existing component
- Adapt props as needed to match the design
- Do NOT create a wrapper or duplicate

**For components marked CREATE:**

**Before creating, you must answer these questions:**

1. What existing components did you find that are similar?
2. Why can't any of them be used or extended?
3. What specific functionality is missing that requires a new component?

If you cannot answer all three questions, GO BACK and reuse an existing component.

Only after answering these questions:
- Invoke the `figma-implement-component` skill
- Wait for component creation to complete
- Then use the newly created component


Stop if you're about to create a component that:

- Has a generic/common name (Button, Input, Modal, Card, Alert, Dialog, etc.)
- Serves a common UI purpose (feedback, navigation, form input, layout, interaction)
- Looks similar to something you've seen elsewhere in the codebase

**These almost certainly already exist.** If you found ANY component in similar directories, CHECK IT FIRST before creating anything new.

### Specific Examples of What NOT to Create

| If Figma says... | DO NOT create... | Instead, check for... |
|------------------|------------------|----------------------|
| Notification | Notification.tsx | Alert, Toast, Snackbar, Banner |
| Popup | Popup.tsx | Dialog, Modal, Overlay, Sheet |
| Input Field | InputField.tsx | Input, TextField, TextInput |
| Action Button | ActionButton.tsx | Button (with variant prop) |
| Vote Widget | VoteWidget.tsx | VoteButton, Like, Rating, Thumbs |

## Integration with Other Skills

This skill works as a **gate** before other implementation skills:
```
User Request → component-reuse (audit) → Implementation
                                      ↓
                         figma-implement-component (if CREATE)
```

When implementing features from tickets:
1. Run component-reuse audit FIRST
2. For missing components, delegate to figma-implement-component
3. Continue with feature implementation using existing + newly created components

## Examples

### Example 1: Notification Already Exists as Alert

**Figma shows**: "Notification" component for success messages

**Audit process**:
```
Search: "notification" → No results
Search: "alert" → Found src/components/Alert/Alert.tsx
Search: "toast" → Found src/components/Alert/Alert.tsx (same file)

Reviewing Alert.tsx... supports: success, error, warning, info variants
This matches the Notification functionality needed.
```

**Audit output**:
```
| Figma Component | Search Terms Used | Codebase Match | Action |
|-----------------|-------------------|----------------|--------|
| Notification | notification, alert, toast | src/components/Alert/Alert.tsx | REUSE |
```

**Action**: Import and use Alert component, do NOT create Notification.

### Example 2: Found Deprecated "Old" Component

**Figma shows**: "AlertDialog" component in Obra design system

**Audit process**:
```
Search: "alertdialog" → Found src/components/obra/OldAlertDialog/
Search: "alert-dialog" → Found src/components/obra/OldAlertDialog/
Search: "dialog" → Found src/components/obra/Dialog/, OldAlertDialog/

Reviewing OldAlertDialog... component is prefixed with "Old" - DEPRECATED
Must implement the new AlertDialog component instead.
```

**Audit output**:
```
| Figma Component | Search Terms Used | Codebase Match | Action |
|-----------------|-------------------|----------------|--------|
| AlertDialog | alertdialog, alert-dialog, dialog | src/components/obra/OldAlertDialog (DEPRECATED) | CREATE |
```

**Action**: Invoke `figma-implement-component` skill to create the new AlertDialog component.

### Example 3: Component Genuinely Missing

**Figma shows**: "Rating Stars" component

**Audit process**:
```
Search: "rating" → No results
Search: "stars" → No results  
Search: "score" → No results
Search: "review" → No results
Searched components/, ui/, packages/ → Nothing similar found
```

**Audit output**:
```
| Figma Component | Search Terms Used | Codebase Match | Action |
|-----------------|-------------------|----------------|--------|
| Rating Stars | rating, stars, score, review | NOT FOUND | CREATE |
```

**Action**: Invoke `figma-implement-component` skill to create RatingStars component.

## Common Mistakes to Avoid

1. **Searching only the exact Figma name** - Always search synonyms
2. **Creating before searching** - The audit MUST complete before any file creation
3. **Assuming "not found" after one search** - Use multiple search strategies
4. **Creating wrappers** - If a component exists, use it directly; don't wrap it
5. **Ignoring design system folders** - Check for shared/common component libraries
6. **Using "Old" prefixed components** - These are deprecated; create the new version instead

## Quality Checklist

Before proceeding to implementation:

- [ ] Listed all components needed from the design
- [ ] Searched using at least 3 different terms per component
- [ ] Checked all likely directories for existing components
- [ ] Output the audit table with clear REUSE/CREATE decisions
- [ ] For REUSE: Verified the existing component meets the design requirements
- [ ] For CREATE: Ready to invoke figma-implement-component skill