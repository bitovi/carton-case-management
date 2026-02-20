# KendoUI MCP Server Integration Guide

## Overview

The `kendo-react-assistant` MCP server provides intelligent assistance when implementing KendoUI components. This guide explains how to use it effectively in this project.

## What the MCP Server Does

The `kendo-react-assistant` MCP server helps with:

1. **Component Recommendation**: Suggests which KendoUI component best fits your use case
2. **API Guidance**: Shows correct props, configurations, and best practices
3. **Code Generation**: Creates code examples and patterns
4. **Troubleshooting**: Helps debug KendoUI-specific issues
5. **Performance Optimization**: Advises on data handling and rendering

## Activating the MCP Server

### Prerequisites

Before using the MCP server:

1. Verify KendoUI packages are installed:
   ```bash
   npm list @progress/kendo-react-common
   ```

2. Check your working directory is set to workspace root:

3. Ensure you have network access to KendoUI documentation

### When Using the Skill

When you invoke the `kendo-component` skill, the MCP server should be automatically available. If not:

1. Explicitly mention "use the kendo-react-assistant MCP server" in your request
2. This signals Copilot to activate the server
3. The agent will then have access to KendoUI-specific guidance

## Example Interaction Pattern

### Step 1: Describe Your Need

```
I need to build a data grid component that displays customer cases with:
- Sortable columns (case ID, customer name, status, created date)
- Filterable by status (open, closed, pending)
- Row selection (multiple rows)
- Pagination (50 items per page)
- Inline status editing
```

### Step 2: Get Component Recommendation

Using the MCP server, ask:
```
Which KendoUI component should I use for this? Should I use:
1. Grid component with built-in filtering/sorting?
2. Custom table with KendoUI dropdowns?
3. Combination of components?

What props would I need to configure?
```

### Step 3: Request Code Pattern

```
Show me a code example of a KendoUI Grid with:
- Data fetched from tRPC hook
- Sorting configuration
- Filter state management
- Row selection tracking
```

### Step 4: Troubleshoot Implementation

If you hit issues:
```
My KendoUI Grid is re-rendering too much when filters change.
What's the best way to handle filter state to avoid unnecessary renders?
```

## Common MCP Server Queries

### Query 1: Component Selection
```
I want to build [FEATURE]. Should I use KendoUI, Shadcn UI, or custom HTML?
If KendoUI, which component?
```

**Expected Response**: Recommendation with pros/cons and configuration hints

### Query 2: Props Configuration
```
I'm using the KendoUI [ComponentName]. How do I configure:
- [Feature 1]
- [Feature 2]
- [Feature 3]

What are the props and type signatures?
```

**Expected Response**: Relevant props with types and examples

### Query 3: Integration Pattern
```
How do I integrate KendoUI [Component] with:
- tRPC data fetching via React Query
- Tailwind CSS styling
- Zod validation
```

**Expected Response**: Code pattern showing integration

### Query 4: Performance Optimization
```
My KendoUI Grid with [large dataset] is slow. What are the best practices for:
- Virtual scrolling
- Virtualization
- Data loading strategy
```

**Expected Response**: Performance patterns and configuration

## Tips for Effective MCP Queries

1. **Be Specific**: Instead of "KendoUI Grid", describe your exact use case
2. **Show Context**: Include your tech stack (React, tRPC, React Query, etc.)
3. **Ask About Alternatives**: "Should I use KendoUI or Shadcn for this?"
4. **Request Examples**: Ask for code examples, not just explanations
5. **Mention Constraints**: "We need WCAG compliance" or "Must support offline"

## Integration with Project Tech Stack

### With tRPC Data Fetching

```
MCP Query:
"How do I connect a KendoUI Grid to tRPC data fetching with React Query?
- tRPC router at packages/server/src/router.ts
- React Query v5
- Pagination needed (50 items/page)
- Loading and error states"
```

### With Shadcn UI Components

```
MCP Query:
"Can I combine KendoUI Grid with Shadcn UI Button components?
Show me how to replace KendoUI's action buttons with customized Shadcn Buttons."
```

### With Tailwind CSS Styling

```
MCP Query:
"How do I theme a KendoUI component with Tailwind CSS?
Our project uses:
- Tailwind v3
- Dark mode support
- Custom color tokens"
```

## When NOT to Use the MCP Server

- For general TypeScript/React questions (use standard TypeScript docs)
- For project-specific patterns (use existing code or `component-reuse` skill)
- For Figma-specific questions (use Figma MCP server directly)
- For tRPC/database questions (use `cross-package-types` skill)

## Fallback: Manual Documentation

If the MCP server is unavailable, reference:

1. [KendoUI React Documentation](https://www.telerik.com/kendo-react-ui/components/)
2. [KendoUI API Reference](https://www.telerik.com/kendo-react-ui/api/)
3. [Project Examples](./examples/) in this skill folder
4. Existing KendoUI usage in the codebase (if any)

## Example: Full Workflow with MCP

### Task: Build a Case Filtering Component

1. **Skill Activation**
   - User: "I need to build a case filter component with KendoUI"
   - Copilot loads `kendo-component` skill
   - MCP server becomes available

2. **Component Selection**
   - Query: "What KendoUI component should I use for a multi-filter interface?"
   - Response: Recommendations with prop suggestions

3. **Design Review** (if design available)
   - Query: "Here's my Figma design [URL]. Which KendoUI components match?"
   - Response: Component matches with configuration hints

4. **Implementation**
   - Follow `create-react-modlet` structure
   - Use MCP for props and configuration
   - Reference code examples from MCP responses

5. **Integration**
   - Query: "How do I connect this filter to tRPC router for case queries?"
   - Response: Integration pattern with examples

6. **Verification**
   - Run tests: `npm test`
   - Check Storybook: `npm run storybook`
   - Visual test in browser

## Troubleshooting MCP Issues

### MCP Server Not Responding

**Symptom**: Agent doesn't use `kendo-react-assistant` capabilities

**Solution**:
1. Explicitly mention "kendo-react-assistant MCP server" in request
2. Include a direct KendoUI question to activate context
3. Try: "Use kendo-react-assistant to recommend a component for [task]"

### Outdated Recommendations

**Symptom**: MCP suggests old KendoUI version patterns

**Solution**:
1. Specify your KendoUI version: "Using KendoUI React v6.x"
2. Ask for latest patterns: "What's the current best practice for [feature]?"
3. Reference documentation date if needed

### Context Too Large

**Symptom**: Agent runs out of context before implementation

**Solution**:
1. Ask shorter, more focused MCP queries
2. Get a simple code pattern, then adapt it yourself
3. Break into multiple smaller queries

## Related Guides

- [Component Reuse Skill](../component-reuse/SKILL.md) - Check before using MCP for new components
- [Create React Modlet Skill](../create-react-modlet/SKILL.md) - Structure your KendoUI components
- [Figma Design Skill](../figma-design-react/SKILL.md) - When your KendoUI design comes from Figma
- [Validate Implementation Skill](../validate-implementation/SKILL.md) - Verify KendoUI component quality
