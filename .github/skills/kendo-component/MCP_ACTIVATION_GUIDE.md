# MCP Server Activation Guide

This guide explains when and how the MCP servers are activated for KendoUI component implementation.

## Overview

When implementing KendoUI components, this skill automatically determines which MCP servers are needed:

```
User Request
    ↓
┌─────────────────────────────────────────┐
│ Check Request for Figma URL or Design   │
└─────────────────────────────────────────┘
    ↓
    ├─→ Has Figma URL/Link?
    │   ├─→ YES: Activate kendo-react-assistant + figma MCP
    │   └─→ NO: Activate kendo-react-assistant only
    ↓
Proceed with Implementation
```

## Scenario 1: KendoUI Component WITHOUT Design

**User Request:**
```
"Create a KendoUI data grid component for displaying cases with sorting and filtering"
```

**MCP Servers Activated:**
- ✅ `kendo-react-assistant` (always)
- ❌ Figma server (not needed)

**Workflow:**
1. Query MCP for KendoUI Grid recommendations
2. Get props configuration advice
3. Implement using templates and guidance
4. Use MCP for troubleshooting

**Example MCP Query:**
```
"I'm building a case data grid with:
- Sorting by date, status, ID
- Filtering by status
- Row selection (multiple)
- Pagination

Which KendoUI components and props should I use?"
```

## Scenario 2: KendoUI Component WITH Figma Design

**User Request:**
```
"Implement this KendoUI component from Figma: https://figma.com/design/abc123/Design?node-id=10:20"
```

**MCP Servers Activated:**
- ✅ `kendo-react-assistant` (always)
- ✅ Figma MCP server (design provided)

**Workflow:**
1. Activate Figma server
2. Extract design context from Figma URL
3. Get screenshot for visual reference
4. Extract design tokens (colors, spacing)
5. Query KendoUI MCP for matching components
6. Implement component
7. Create Code Connect mapping
8. Verify visual alignment with design

**Example MCP Queries:**

Step 1: Figma extraction
```
Use Figma MCP:
- mcp_figma_get_design_context with node-id=10:20
- mcp_figma_get_screenshot for visual reference
- mcp_figma_get_variable_defs for design tokens
```

Step 2: KendoUI recommendation
```
"I have a Figma design showing a data table with:
- [variants from design]
- [interactive states]
- [styling details]

Which KendoUI component should I use?
How do I configure it to match the design?"
```

## Scenario 3: Converting Component to KendoUI

**User Request:**
```
"Convert this Shadcn UI component to use KendoUI Grid instead: [component path]. 
Here's the Figma design I want to match: [Figma URL]"
```

**MCP Servers Activated:**
- ✅ `kendo-react-assistant`
- ✅ Figma MCP server
- ✅ (Read existing component for reference)

**Workflow:**
1. Read existing component
2. Extract design context from Figma
3. Query KendoUI MCP for migration path
4. Plan component changes
5. Implement using KendoUI
6. Update Code Connect mapping

## Detecting Figma URLs

The following patterns trigger Figma MCP activation:

### Pattern 1: Full Figma Design URL
```
https://figma.com/design/{fileKey}/{fileName}?node-id={nodeId}
```
✅ **Activates Figma MCP**

Example:
```
https://figma.com/design/abc123DEF456/Case-Management?node-id=1234:5678
```

### Pattern 2: Figma File URL (with branch)
```
https://figma.com/design/{fileKey}/branch/{branchKey}/{fileName}
```
✅ **Activates Figma MCP**

### Pattern 3: Figma Prototype URL
```
https://figma.com/proto/{protoKey}/...
```
⚠️ **Requires design file URL instead**

### Pattern 4: Mentioned Figma but no URL
```
"Use the KendoUI component from my Figma design"
```
❌ **Does NOT activate Figma MCP - ask for URL**

### Pattern 5: File path to local design
```
"I have a Figma file at /designs/case-grid.fig"
```
❌ **Does NOT activate - need Figma URL**

## MCP Query Examples by Scenario

### Scenario 1: Pure KendoUI (no Figma)

```markdown
Using kendo-react-assistant MCP:

"I'm implementing a case management data grid component with these requirements:
- Display 50-100 cases in a table
- Users can sort by: date, status, customer name
- Users can filter by: status (open/closed), date range
- Allow selecting multiple rows for bulk actions
- Show loading state while fetching
- Handle empty state when no cases match filter

Which KendoUI component should I use for this?
What props do I need to configure?
Can you show me a code example?"
```

### Scenario 2: KendoUI from Figma

```markdown
Step 1 - Extract from Figma:
Using Figma MCP: mcp_figma_get_design_context

Step 2 - Query KendoUI:
Using kendo-react-assistant MCP:

"I have a Figma design component showing:
- A data table with 4 columns: ID, Name, Status, Date
- Th table has 3 states: default/unfocused, focused on a row, row selected
- Sortable headers (show up/down arrow on hover)
- Filterable status column (shows dropdown on click)
- Pagination at bottom: 'Page 1 of 5'

This is what the design shows: [include excerpt from Figma design context]

Which KendoUI component best matches this design?
How should I configure it to look identical to the Figma design?"
```

### Scenario 3: Conversion from Shadcn to KendoUI

```markdown
I'm converting a component from Shadcn UI to KendoUI.

Current component uses:
- Shadcn Table (custom wrapper around HTML table)
- Shadcn Button for row actions
- Shadcn Input for filters
- Custom sorting/pagination logic

Desired outcome:
- Replace with KendoUI Grid
- Keep Shadcn Buttons for actions
- Keep design matching Figma: [URL]

What's the migration path?
How do I replace the custom table with KendoUI Grid while keeping Shadcn components?"
```

## Activation Checklist

Before starting implementation, verify:

- [ ] **KendoUI Request Identified** - User wants to use KendoUI
- [ ] **MCP Availability** - kendo-react-assistant server available
- [ ] **Figma URL Check** - Does request include design link?
  - [ ] If YES: Verify URL format is correct
  - [ ] If YES: Note the node ID for Figma extraction
  - [ ] If NO: Proceed with KendoUI MCP only
- [ ] **Context Ready** - Required information available
  - [ ] Component requirements documented
  - [ ] Design specifications available (if Figma)
  - [ ] Integration requirements understood

## What Each MCP Server Does

| Server | When Active | Purpose |
|--------|-------------|---------|
| `kendo-react-assistant` | Always for KendoUI | Recommends KendoUI components, suggests props, generates code patterns, advises on best practices |
| Figma MCP | When Figma URL provided | Extracts design context, generates screenshots, provides design tokens and variable definitions |

## Troubleshooting Server Activation

### Problem: Figma MCP not activating despite URL provided

**Solutions:**
1. Verify URL format: Should start with `https://figma.com/design/`
2. Check URL includes node-id: `?node-id=123:456`
3. Extract node ID explicitly: "Node ID is 10:20"
4. Try copying URL again - may contain typos

### Problem: kendo-react-assistant not responding

**Solutions:**
1. Explicitly mention: "Use kendo-react-assistant MCP server"
2. Ask a direct KendoUI question to activate context
3. Try: "What KendoUI component should I use for [task]?"
4. Check if server is available in your Copilot/Claude context

### Problem: Both servers active but slow response

**Solutions:**
1. Ask shorter, more focused questions
2. Break into multiple smaller MCP queries
3. Get simple guidance first, then adapt yourself
4. Provide more context upfront to reduce clarifying questions

## Next Steps After Activation

Once MCP servers are activated:

1. **For design-driven work:**
   - Extract Figma design context first
   - Analyze design specifications
   - Get KendoUI recommendations
   - Proceed with modlet structure

2. **For feature-driven work:**
   - Query KendoUI MCP for component recommendation
   - Review props and configuration
   - Create modlet structure
   - Proceed with implementation

3. **For conversion work:**
   - Read existing component
   - Extract Figma design (if available)
   - Get migration guidance from both MCPs
   - Plan replacement strategy
   - Execute conversion

## See Also

- [SKILL.md](./SKILL.md) - Main skill documentation
- [KENDO_MCP_GUIDE.md](./KENDO_MCP_GUIDE.md) - Detailed MCP usage guide
- [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md) - Component implementation checklist
