# KendoUI Component Skill - Complete Overview

## ✅ What Was Created

A complete, production-ready skill for building UI components with KendoUI React, including MCP server integration for both `kendo-react-assistant` and conditional Figma MCP activation.

## 📊 Skill Structure

```
.github/skills/kendo-component/
│
├── SKILL.md (main entry point)
│   ├── What KendoUI is and when to use it
│   ├── MCP server integration overview
│   ├── Complete 11-step workflow
│   ├── Step-by-step implementation guide (Steps 0-11)
│   ├── Common patterns (4 examples)
│   ├── Related skills
│   └── Troubleshooting guide
│
├── README.md (navigation guide)
│   ├── Quick start instructions
│   ├── When to use each file
│   ├── Typical workflows (with/without Figma)
│   ├── Prerequisites
│   ├── Related skills
│   └── Learning path
│
├── MCP_ACTIVATION_GUIDE.md (scenario detection)
│   ├── When to activate kendo-react-assistant (always)
│   ├── When to activate Figma MCP (conditional)
│   ├── Scenario flowchart
│   ├── URL pattern detection
│   ├── Example requests for each scenario
│   ├── Activation checklist
│   └── Troubleshooting
│
├── KENDO_MCP_GUIDE.md (MCP server usage)
│   ├── What the kendo-react-assistant does
│   ├── Prerequisites and activation
│   ├── Example interaction patterns
│   ├── Common MCP queries
│   ├── Tips for effective prompts
│   ├── When NOT to use MCP
│   ├── Fallback: manual documentation
│   └── Full workflow example
│
├── IMPLEMENTATION_CHECKLIST.md (project tracking)
│   ├── Pre-implementation checks
│   ├── Project setup
│   ├── Implementation requirements
│   ├── Stories and documentation
│   ├── Testing verification
│   ├── Integration checks
│   ├── Verification gate
│   ├── Figma integration (if applicable)
│   ├── Quality gate
│   ├── Post-implementation
│   └── Common pitfalls to avoid
│
├── templates/
│   ├── KendoGridTemplate.tsx (data grid template)
│   │   ├── Complete TypeScript props interface
│   │   ├── Pagination, sorting, filtering
│   │   ├── Row selection
│   │   ├── Data state management
│   │   └── Ready to copy and customize
│   │
│   └── KendoFormTemplate.tsx (form template)
│       ├── Complete TypeScript props interface
│       ├── Multiple field types
│       ├── Validation logic
│       ├── Error handling
│       ├── Submit state
│       └── Ready to copy and customize
│
└── examples/
    └── README.md (example guidelines)
        ├── Structure for adding examples
        ├── Template for example documentation
        ├── Planned examples list
        ├── Contributing guidelines
        └── How to use examples
```

## 🔄 MCP Server Integration

### Automatic Activation Logic

```
User Request for KendoUI Component
    ↓
┌─────────────────────────────────────┐
│ kendo-react-assistant               │ ← Always activated
│ (component recommendations, props)  │
└─────────────────────────────────────┘
    ↓
    Has Figma URL/Design Link?
    ↓
    ├─→ YES
    │   └─→ Activate Figma MCP Server
    │       (extract design, tokens, screenshots)
    │
    └─→ NO
        └─→ Continue with kendo-react-assistant only
```

### Server Responsibilities

**kendo-react-assistant MCP:**
- ✅ Recommends which KendoUI component to use
- ✅ Suggests correct props and configurations
- ✅ Generates code examples
- ✅ Advises on best practices
- ✅ Helps troubleshoot KendoUI-specific issues
- ✅ Suggests performance optimizations

**Figma MCP (Optional):**
- ✅ Extracts design context from Figma URL
- ✅ Generates component screenshots
- ✅ Provides design tokens and variables
- ✅ Enables Code Connect mapping

## 🎯 How to Use the Skill

### For New Users

1. **Start:** Read [README.md](./README.md) for navigation
2. **Learn:** Read [SKILL.md](./SKILL.md) for complete workflow
3. **Implement:** Follow [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md)
4. **Reference:** Use templates and MCP guides

### For Experienced Builders

1. **Check:** Use [MCP_ACTIVATION_GUIDE.md](./MCP_ACTIVATION_GUIDE.md) to detect scenario
2. **Query:** Follow [KENDO_MCP_GUIDE.md](./KENDO_MCP_GUIDE.md) for prompts
3. **Copy:** Grab template from [templates/](./templates/)
4. **Verify:** Work through [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md)

### For Each Scenario

**Scenario 1: KendoUI without design**
```
1. README.md (nav)
2. SKILL.md (workflow)
3. MCP_ACTIVATION_GUIDE.md (Scenario 1)
4. KENDO_MCP_GUIDE.md (query patterns)
5. templates/ (copy)
6. IMPLEMENTATION_CHECKLIST.md (verify)
```

**Scenario 2: KendoUI with Figma design**
```
1. README.md (nav)
2. SKILL.md (workflow)
3. MCP_ACTIVATION_GUIDE.md (Scenario 2)
4. Extract Figma via MCP
5. KENDO_MCP_GUIDE.md (query patterns)
6. templates/ (copy)
7. IMPLEMENTATION_CHECKLIST.md (verify)
8. Code Connect mapping
```

**Scenario 3: Convert from Shadcn to KendoUI**
```
1. README.md (nav)
2. SKILL.md (workflow)
3. MCP_ACTIVATION_GUIDE.md (Scenario 3)
4. KENDO_MCP_GUIDE.md (migration patterns)
5. templates/ (reference)
6. IMPLEMENTATION_CHECKLIST.md (verify)
```

## 📋 Key Features of the Skill

| Feature | Implementation | File |
|---------|-----------------|------|
| **Main Documentation** | Complete workflow with all steps | SKILL.md |
| **MCP Activation** | Scenarios and detection logic | MCP_ACTIVATION_GUIDE.md |
| **MCP Usage** | Query patterns and examples | KENDO_MCP_GUIDE.md |
| **Navigation** | Quick start and file reference | README.md |
| **Verification** | Implementation checklist | IMPLEMENTATION_CHECKLIST.md |
| **Code Templates** | Grid and form templates | templates/ |
| **Examples** | Framework for adding examples | examples/ |

## 🚀 Implementation Workflow

```
┌──────────────────────────────────────────────────────────┐
│ STEP 0: Activate MCP Servers                            │
├──────────────────────────────────────────────────────────┤
│ Check: kendo-react-assistant always active             │
│ Check: Figma MCP if design URL provided                │
└──────────────────────────────────────────────────────────┘
    ↓
┌──────────────────────────────────────────────────────────┐
│ STEP 1: Analyze Requirements                            │
├──────────────────────────────────────────────────────────┤
│ What component? What features? Design available?       │
└──────────────────────────────────────────────────────────┘
    ↓
┌──────────────────────────────────────────────────────────┐
│ STEP 2: Component Reuse Check                           │
├──────────────────────────────────────────────────────────┤
│ Does similar component already exist?                  │
│ Use component-reuse skill                              │
└──────────────────────────────────────────────────────────┘
    ↓
┌──────────────────────────────────────────────────────────┐
│ STEP 3: Extract Design (if Figma)                       │
├──────────────────────────────────────────────────────────┤
│ Use Figma MCP to get context, screenshots, tokens     │
└──────────────────────────────────────────────────────────┘
    ↓
┌──────────────────────────────────────────────────────────┐
│ STEP 4: Select KendoUI Component                        │
├──────────────────────────────────────────────────────────┤
│ Query kendo-react-assistant for recommendation         │
└──────────────────────────────────────────────────────────┘
    ↓
┌──────────────────────────────────────────────────────────┐
│ STEPS 5-9: Build Component                              │
├──────────────────────────────────────────────────────────┤
│ 5. Create modlet structure (create-react-modlet)       │
│ 6. Implement using template                            │
│ 7. Configure theming                                   │
│ 8. Create Storybook stories                            │
│ 9. Create unit tests                                   │
└──────────────────────────────────────────────────────────┘
    ↓
┌──────────────────────────────────────────────────────────┐
│ STEP 10: Verify Implementation                          │
├──────────────────────────────────────────────────────────┤
│ Run tests, type check, manual testing                  │
│ Use IMPLEMENTATION_CHECKLIST.md                        │
└──────────────────────────────────────────────────────────┘
    ↓
┌──────────────────────────────────────────────────────────┐
│ STEP 11: Code Connect (if Figma)                        │
├──────────────────────────────────────────────────────────┤
│ Map component to Figma design                          │
│ Use figma-connect-component skill                      │
└──────────────────────────────────────────────────────────┘
    ↓
✅ Component Ready to Commit
```

## 🔗 Integration with Other Skills

This skill works with:

| Skill | When | How |
|-------|------|-----|
| `component-reuse` | Before building | Check if component exists |
| `create-react-modlet` | Step 5 | Folder structure |
| `figma-design-react` | Design analysis | Analyze Figma designs |
| `figma-component-sync` | Verification | Keep design in sync |
| `figma-connect-component` | Step 11 | Code Connect mapping |
| `validate-implementation` | Verification | Quality checks |
| `cross-package-types` | Integration | Type safety |

## 📚 What's Included

✅ **Documentation**
- Main skill documentation (SKILL.md)
- MCP integration guidance (KENDO_MCP_GUIDE.md, MCP_ACTIVATION_GUIDE.md)
- Navigation guide (README.md)
- Implementation checklist (IMPLEMENTATION_CHECKLIST.md)

✅ **Code Templates**
- Data grid template (KendoGridTemplate.tsx)
- Form template (KendoFormTemplate.tsx)
- Ready to copy and customize

✅ **Framework for Examples**
- Example structure guidelines
- Planned examples list
- Contributing guidelines

✅ **MCP Integration**
- Automatic kendo-react-assistant activation
- Conditional Figma MCP activation
- Scenario detection logic
- MCP query patterns

## 🎓 Learning Path

For best results:

1. **First Implementation:** Follow complete [SKILL.md](./SKILL.md) from start to finish
2. **Subsequent Implementations:** Use [MCP_ACTIVATION_GUIDE.md](./MCP_ACTIVATION_GUIDE.md) + [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md)
3. **Complex Tasks:** Combine with related skills (component-reuse, figma-component-sync, etc.)
4. **Advanced Use:** Leverage MCP servers for guidance on non-obvious patterns

## ✨ Key Highlights

| Aspect | Benefit |
|--------|---------|
| **MCP Integration** | Intelligent component recommendations, no trial/error |
| **Conditional Figma Activation** | Automatic design extraction when URL provided |
| **Complete Workflow** | 11-step process covers all aspects |
| **Code Templates** | Jump-start implementation with proven patterns |
| **Comprehensive Checklist** | Quality gates ensure nothing is missed |
| **Navigation Guides** | Quick reference for files and resources |
| **Integration with Project Skills** | Works seamlessly with component-reuse, Figma skills, etc. |

## 🚀 Ready to Use

The skill is complete and ready for immediate use. No additional setup required beyond:

1. ✅ Having kendo-react-assistant MCP server available
2. ✅ Having Figma MCP server available (for design workflows)
3. ✅ KendoUI packages installed in the project

---

**Skill Status:** ✅ Complete and Production-Ready
**Last Updated:** 2026-02-20
**Created For:** carton-case-management project
**Maintained By:** Development Team
