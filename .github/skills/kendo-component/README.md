# KendoUI Component Building Skill

This directory contains comprehensive documentation and templates for building UI components with KendoUI React in this project.

## 📁 Directory Structure

```
kendo-component/
├── SKILL.md                      # Main skill definition (start here)
├── README.md                     # This file
├── KENDO_MCP_GUIDE.md           # Detailed MCP server integration
├── MCP_ACTIVATION_GUIDE.md      # When/how to activate MCP servers
├── IMPLEMENTATION_CHECKLIST.md  # Step-by-step implementation checklist
├── templates/                    # Code templates for common patterns
│   ├── KendoGridTemplate.tsx    # Data grid component template
│   └── KendoFormTemplate.tsx    # Form component template
└── examples/                     # Example implementations (future)
    └── README.md
```

## 🚀 Quick Start

### 1. **What is this skill for?**

This skill teaches how to build UI components using **KendoUI React**, a professional component library for enterprise applications. Use this skill when:

- Converting components from Shadcn UI to KendoUI
- Implementing complex data-driven features (grids, forms, schedules)
- Working with designs that specify KendoUI components
- Needing advanced interactive features beyond basic HTML/Shadcn

### 2. **What MCP servers does it use?**

| Server | When | Purpose |
|--------|------|---------|
| **kendo-react-assistant** | Always | KendoUI component recommendations, API guidance, code patterns |
| **Figma MCP** | Optional | Design extraction (if you have a Figma URL) |

### 3. **How to use this skill**

Start with this order:

1. **Read [SKILL.md](./SKILL.md)** (main skill definition)
   - Overview of KendoUI and when to use it
   - Complete implementation workflow
   - Best practices and patterns

2. **Check [MCP_ACTIVATION_GUIDE.md](./MCP_ACTIVATION_GUIDE.md)** (scenario detection)
   - Does your request include a Figma URL?
   - Which MCP servers should be activated?
   - How to format Figma URLs correctly

3. **Follow [KENDO_MCP_GUIDE.md](./KENDO_MCP_GUIDE.md)** (using the MCP servers)
   - How to query the kendo-react-assistant
   - Tips for effective MCP prompts
   - Troubleshooting MCP issues

4. **Use [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md)** (track progress)
   - Pre-implementation checks
   - Testing and verification
   - Quality gates before commit

5. **Reference [templates/](./templates/)** (copy starting code)
   - Grid component template
   - Form component template
   - Customize for your use case

## 📚 File Descriptions

### SKILL.md
**The main documentation** for building KendoUI components. Contains:
- What KendoUI is and when to use it
- Complete 11-step workflow
- Step-by-step implementation guide
- Common patterns and examples
- Troubleshooting guide

### MCP_ACTIVATION_GUIDE.md
**Determines which MCP servers to activate** based on your request:
- Scenario analysis flowchart
- URL pattern detection
- When Figma MCP is needed
- Example requests for different scenarios
- Activation checklist

### KENDO_MCP_GUIDE.md
**How to use the kendo-react-assistant MCP server** effectively:
- What the server can do
- Prerequisites and setup
- Example interaction patterns
- Common queries and expected responses
- Tips for effective prompts
- Fallback resources if server unavailable

### IMPLEMENTATION_CHECKLIST.md
**Step-by-step verification checklist** for component implementation:
- Pre-implementation setup
- Implementation requirements
- Testing and verification
- Quality gates
- Common pitfalls to avoid

### Templates

#### KendoGridTemplate.tsx
Ready-to-use template for data grid components:
- Pagination configuration
- Sorting setup
- Filtering support
- Row selection
- Data state management

**Use when:**
- Building table/grid components
- Need sorting/filtering/paging
- Displaying relational data

#### KendoFormTemplate.tsx
Ready-to-use template for form components:
- Multiple field types
- Validation logic
- Error handling
- Submit state management
- Field-level error display

**Use when:**
- Building form components
- Need validation
- Creating data entry interfaces

## 🔄 Typical Workflow

### Without Figma Design
```
1. Analyze requirements
2. Query kendo-react-assistant MCP for component recommendation
3. Review KendoUI documentation for selected component
4. Use template or create modlet structure
5. Implement component
6. Create tests and Storybook stories
7. Verify with checklist
8. Commit
```

### With Figma Design
```
1. Extract design context from Figma using Figma MCP
2. Analyze design specifications
3. Query kendo-react-assistant for KendoUI matching
4. Use template or create modlet structure
5. Implement component matching design
6. Create tests and Storybook stories
7. Create Code Connect mapping to Figma
8. Verify visual alignment with design
9. Verify with checklist
10. Commit
```

## ✅ Prerequisites

Before implementing a KendoUI component, ensure:

1. **KendoUI packages installed:**
   ```bash
   npm list @progress/kendo-react-common
   ```

2. **TypeScript environment ready:**
   - TypeScript 5.x configured
   - `npm run typecheck` works

3. **React Query available:**
   - For data fetching if needed
   - React Query 5.x installed

4. **Project dependencies:**
   - Tailwind CSS for styling
   - tRPC for API (if needed)

## 🎯 When to Use Each File

| File | When to Use |
|------|------------|
| **SKILL.md** | Always start here for overview and complete workflow |
| **MCP_ACTIVATION_GUIDE.md** | Understand which servers to activate for your request |
| **KENDO_MCP_GUIDE.md** | Learn how to query the kendo-react-assistant effectively |
| **IMPLEMENTATION_CHECKLIST.md** | Track progress during implementation |
| **templates/** | Copy and customize starting code |

## 🔗 Related Skills

Use these skills together with kendo-component:

- **[component-reuse](../component-reuse/SKILL.md)** - Check before building new components
- **[create-react-modlet](../create-react-modlet/SKILL.md)** - Component folder structure
- **[figma-design-react](../figma-design-react/SKILL.md)** - Analyze Figma designs
- **[figma-component-sync](../figma-component-sync/SKILL.md)** - Keep components in sync with Figma
- **[figma-connect-component](../figma-connect-component/SKILL.md)** - Map components to Figma
- **[validate-implementation](../validate-implementation/SKILL.md)** - Quality verification
- **[cross-package-types](../cross-package-types/SKILL.md)** - Type safety across packages

## 📖 Examples

### Example 1: Simple Data Grid
**Request:** "Create a KendoUI grid to display cases"

**Files to read:**
1. [SKILL.md](./SKILL.md) - Workflow overview
2. [MCP_ACTIVATION_GUIDE.md](./MCP_ACTIVATION_GUIDE.md) - Scenario 1 (no Figma)
3. [templates/KendoGridTemplate.tsx](./templates/KendoGridTemplate.tsx) - Copy template
4. [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md) - Track progress

### Example 2: Form from Figma
**Request:** "Build this KendoUI form component from Figma: [URL]"

**Files to read:**
1. [SKILL.md](./SKILL.md) - Workflow overview
2. [MCP_ACTIVATION_GUIDE.md](./MCP_ACTIVATION_GUIDE.md) - Scenario 2 (with Figma)
3. [KENDO_MCP_GUIDE.md](./KENDO_MCP_GUIDE.md) - Using MCP servers
4. [templates/KendoFormTemplate.tsx](./templates/KendoFormTemplate.tsx) - Copy template
5. [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md) - Track progress

### Example 3: Convert from Shadcn to KendoUI
**Request:** "Convert this table component to KendoUI"

**Files to read:**
1. [SKILL.md](./SKILL.md) - Workflow overview
2. [MCP_ACTIVATION_GUIDE.md](./MCP_ACTIVATION_GUIDE.md) - Scenario 3 (conversion)
3. [KENDO_MCP_GUIDE.md](./KENDO_MCP_GUIDE.md) - Getting migration guidance
4. [templates/KendoGridTemplate.tsx](./templates/KendoGridTemplate.tsx) - Reference template
5. [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md) - Track progress

## 🛠️ Tools and Commands

Use these while implementing:

```bash
# Type checking
npm run typecheck

# Run tests
npm test

# Lint code
npm run lint

# Start Storybook
npm run storybook

# Start dev server
npm run dev

# Database commands (if needed)
npm run db:generate
```

## ⚠️ Common Mistakes

- ❌ Using KendoUI without checking Shadcn UI alternatives
- ❌ Not organizing component as a modlet
- ❌ Forgetting Storybook stories for variants
- ❌ Skipping tests
- ❌ Not using MCP server for guidance (trial and error instead)
- ❌ Mixing Tailwind with KendoUI theme classes
- ❌ Ignoring accessibility
- ❌ Not handling loading/error/empty states

## 📞 Support

If you get stuck:

1. **Check [SKILL.md](./SKILL.md)** - Comprehensive guide with troubleshooting
2. **Query the MCP server** - Use [KENDO_MCP_GUIDE.md](./KENDO_MCP_GUIDE.md) to get unstuck
3. **Run the checklist** - [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md) catches most issues
4. **Reference templates** - Copy and adapt existing patterns
5. **Read related skills** - Cross-reference for component structure, type safety, Figma integration

## 🎓 Learning Path

For best results, follow this progression:

1. **First Time:** Read full [SKILL.md](./SKILL.md) carefully
2. **Second Time:** Skim SKILL.md, check MCP activation guide
3. **Routine:** Use checklist, reference templates, query MCP as needed
4. **Advanced:** Combine with other skills (component-reuse, figma-component-sync, etc.)

---

**Last Updated:** 2026-02-20  
**Skill Status:** Complete and ready for use  
**Questions?** Open the relevant guide file or check related skills for integration patterns.
