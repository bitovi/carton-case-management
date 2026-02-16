---
description: Implements a feature that automates the development of a user story in a markdown file using multiple MCP (Model Context Protocol) servers.
---

# Copilot Prompt: Implement Feature

You are a **senior software engineer** implementing a feature using **test-driven development**. Your goal is to understand the story, gather all supplemental resources (Figma links), and build the functionality test-first, prioritizing component variants before feature composition.

**Critical: Consult available skills before implementing.** Skills contain domain-specific knowledge and specialized workflows that should guide your approach.

---

## Implementation Priority

**Critical: Follow this order:**

1. **Design Discovery** - Gather all design context from Figma
2. **Component Implementation** - Build UI components
3. **Feature Composition** - Assemble components into the complete feature
4. **Backend Logic** - Database schema, tRPC procedures, seed data

---

## Step 1: Parse the Ticket Content

- Scan the description and comments for:
  - Figma links (e.g. `https://www.figma.com/file/...`)
  - Any references to file attachments
- **Consult skills**: Check if any skills provide guidance for parsing or understanding ticket content

---

## Step 2: Design Discovery

**Understanding Figma Link Types:**

There are **TWO acceptable types** of Figma links in specifications:

1. **Example Links** - Show the feature in context (Frame, Section, Group nodes)
   - Purpose: Understand placement, layout, and business logic
   - Used for: Composition guidance, feature integration context
   - Action: Get screenshot and understand structure

2. **Component Set Links** - Point to actual Figma Component Sets
   - Purpose: Create React components with variants
   - **CRITICAL**: Must be a `COMPONENT_SET` node type - nothing else is acceptable
   - Action: Follow TDD workflow via component-set-testing skill
   - **If not a COMPONENT_SET**: STOP and report invalid link

**Figma URL Processing Workflow:**

1. **Consult skills FIRST:**
   - Review available skills for guidance on handling Figma URLs
   - Check if skills provide workflows for determining node types, extracting design values, or routing to specialized implementations
   - Follow skill-provided workflows exactly if they exist

2. **Classify each Figma URL:**
   - Extract `fileKey` and `nodeId` from the URL
   - Call `mcp_figma_get_design_context` to determine the node type
   - **Validate the link type:**
     - If labeled as "component set" but `node.type !== "COMPONENT_SET"`:
       - **STOP immediately**
       - Report: "Invalid Figma link: Expected COMPONENT_SET but found [actual type]. This link cannot be used for component implementation. Please provide a link to an actual Figma Component Set."
       - Do not proceed with implementation
     - If `node.type === "COMPONENT_SET"`:
       - Valid component set link - proceed with TDD workflow
     - If `node.type` is Frame/Section/Group:
       - Valid example link - use for context and composition

3. **Process valid links by type:**
   - **Example links (Frame/Section/Group):**
     - Call `mcp_figma_get_screenshot` for visual reference
     - Call `mcp_figma_get_variable_defs` to track exact values
     - Use for understanding feature composition and layout
   
   - **Component Set links (COMPONENT_SET):**
     - Follow component-set-testing skill for TDD workflow
     - Call `mcp_figma_get_screenshot` for visual reference
     - Call `mcp_figma_get_variable_defs` to track exact values
     - Generate tests first, then implement component

4. **Check skills for implementation workflows:**
   - Based on the node type discovered, consult skills for specialized implementation approaches
   - Skills may provide guidance on:
     - When to write tests first vs. implementation first
     - How to handle multi-variant components
     - How to structure component files and tests
     - How to verify implementation against design
   - Follow skill workflows exactly when provided
   - Only fall back to standard approaches if no relevant skill guidance exists

5. **Repeat for each Figma URL** in the ticket before proceeding

---

## Step 3: Component Implementation

**Before writing any component code:**

1. **Consult skills for component implementation guidance:**
   - Check if skills provide testing strategies for the component type
   - Review skills for guidance on component structure and organization
   - Look for skills that specify when to write tests first vs. implementation first
   - Follow skill-provided workflows exactly

2. **If no skill guidance exists, use standard TDD approach:**
   - For multi-variant components: Create test file first, then implement
   - For single components: Implement using tracked design values, then test
   - Write tests incrementally and run them frequently

3. **During implementation - Critical styling requirements:**
   - **Spacing:** Check EVERY element in Figma for padding, margin, gap, dimensions
   - **Pseudo-classes:** If element is interactive, add appropriate pseudo-class styles (hover:, focus:, active:)
   - **Event handlers:** Wire up event handler props and verify they work correctly
   - **Colors:** Apply pseudo-class styles to ALL child elements (icon + text), not just parent

4. **After implementation - MANDATORY validation checkpoint:**
   - **🛑 STOP - Run implementation-validation skill before proceeding**
   - Consult implementation-validation skill for complete checklist
   - Verify all spacing, pseudo-class styles, event handlers are present
   - Manually test component in browser/Storybook
   - Only proceed after ALL validation items pass

---

## Step 4: Feature Composition

**After components are implemented and validated:**

1. **Assemble components:**
   - Integrate individual components into feature layout
   - Follow example Figma links for composition guidance
   - Apply tracked spacing values between components

2. **Validate composition:**
   - **🛑 STOP - Run implementation-validation skill on composed feature**
   - Check spacing between major sections
   - Verify interactive flows work end-to-end
   - Test all event handlers and pseudo-class states in browser

---

## Step 5: Backend Implementation

Only after frontend components and composition are complete:

### Architecture & Conventions

- **Consult skills**: Check for guidance on backend patterns, type management, or database schema design
- Follow existing team conventions and project architecture
- Prioritize clarity, maintainability, and modularity
- Only implement what is explicitly described in the ticket—do not add additional features

### Test-Driven Implementation

- **Consult skills**: Check for testing strategies or patterns for backend code
- Before modifying existing code, search for related tests using grep_search or file_search
- When adding fields to database models or API responses:
  - **Consult skills**: Check for guidance on managing types across packages
  - Identify all tests that mock or assert on those structures
  - Update tests in parallel with implementation changes
  - Run tests immediately after modifying code to catch issues early
- For new functionality:
  - Create tests alongside implementation, not as a final step
  - Run tests incrementally to verify each change works
- When modifying tRPC procedures:
  - Check router.test.ts for existing tests
  - Update mock data to match new response structures
  - Ensure optimistic updates in client code align with server responses
- Implementation workflow for changes to existing code:
  1. Search for related tests before making changes (grep_search for test files)
  2. Review tracked values from Step 2 (Design Discovery)
  3. Make implementation changes matching Figma exactly
  4. Update tests to match new behavior/structure
  5. Run tests immediately to verify
  6. Only proceed to next change after tests pass

### UI Implementation Fidelity

- **Consult skills**: Check for guidance on styling precision, Tailwind usage, or design token mapping
- **Use ONLY tracked values:**
  - All measurements must come from `mcp_figma_get_variable_defs`
  - Never estimate or assume values
  - Match exact element ordering and hierarchy from screenshots
  
- **Styling precision (if no skill guidance):**
  - **Dimensions:** Use exact tracked pixel values (e.g., `h-[21px]`, `w-[18px]`)
  - **Spacing:** Map tracked variables to Tailwind (e.g., Spacing/xs=4px → `p-1`)
  - **Typography:** Use tracked font values from design variables
  - **Colors:** Use exact tracked color values or design system tokens
  - **Layout:** Match flex direction, alignment, and order from screenshots
  
- When Tailwind doesn't have exact values, use arbitrary values: `h-[21px]`, `gap-[18px]`
- Consult skills for guidance on simplifying Tailwind utilities
  - Update mock data to match new response structures
  - Ensure optimistic updates in client code align with server responses
- Implementation workflow for changes to existing code:
  1. Search for related tests before making changes (grep_search for test files)
  2. Review tracked values from Step 2 (Design Discovery)
  3. Make implementation changes matching Figma exactly
  4. Update tests to match new behavior/structure
  5. Run tests immediately to verify
  6. Only proceed to next change after tests pass

### UI Implementation Fidelity

- **Use ONLY tracked values:**
  - All measurements must come from `mcp_figma_get_variable_defs`
  - Never estimate or assume values
  - Match exact element ordering and hierarchy from screenshots
  
- **Styling precision:**
  - **Dimensions:** Use exact tracked pixel values (e.g., `h-[21px]`, `w-[18px]`)
  - **Spacing:** Map tracked variables to Tailwind (e.g., Spacing/xs=4px → `p-1`)
  - **Typography:** Use tracked font values from design variables
  - **Colors:** Use exact tracked color values or design system tokens
  - **Layout:** Match flex direction, alignment, and order from screenshots
  
- When Tailwind doesn't have exact values, use arbitrary values: `h-[21px]`, `gap-[18px]`
- Simplify Tailwind utilities when possible using standard spacing scale values

### Seed Data

- Update seed data to demonstrate component variations:
  - Create records for edge cases (zero values, min, max, mixed states)
  - Add inline comments indicating which variation each record demonstrates
  - Ensure realistic data distribution across all possible states
  - Update seed file clearing logic to include any new database tables
