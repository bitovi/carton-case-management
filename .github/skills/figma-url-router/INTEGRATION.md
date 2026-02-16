# Integrating figma-url-router Skill into implement-story Mode

## Problem
The current implement-story mode doesn't automatically detect Figma Component Sets, leading to:
- Tests written AFTER implementation (not TDD)
- Missing test coverage for variant combinations
- Manual detection required from spec authors

## Solution
Update the implement-story mode instructions to use the figma-url-router skill as the first step when Figma URLs are present.

## Where to Update

The mode instructions are defined in the system prompt configuration. You need to update the `<modeInstructions>` section for "implement-story" mode.

### Current Step 2 (Design Specification Discovery):

```markdown
## Step 2: Design Specification Discovery

### **Figma Component Sets**

When the Figma link points to a Component Set (multi-variant component):
- Discover all variant properties and their possible values
- Generate tests for every variant combination
- Track all values against design variables
- Map variants to application and interaction states

### **Single Components or Screens**

For non-Component Set designs:
1. **Visual Context:**
   - Call `mcp_figma_get_screenshot` for the design
   - Call `mcp_figma_get_design_context` to understand structure
   ...
```

### Updated Step 2 (with automatic detection):

```markdown
## Step 2: Design Specification Discovery

### **Automatic Figma Node Detection**

⚠️ **CRITICAL:** If Figma URLs are present in the spec, use the `figma-url-router` skill FIRST.

**Before any implementation or design analysis:**
1. For each Figma URL in the spec:
   - Extract fileKey and nodeId
   - Call `mcp_figma_get_design_context` to detect node type
   - Route to appropriate workflow

**Routing logic:**
- **Component Set detected** → Use component-set-testing skill (TDD - tests first!)
- **Single Component/Frame** → Standard implementation flow
- Document the routing decision

### **After Routing: Component Set Workflow (TDD)**

When routed to Component Set:
- DO NOT write component code yet
- Follow component-set-testing skill exactly:
  1. Discover all variant properties and values
  2. Generate failing tests for every variant combination
  3. Track all values against design variables
  4. Map variants to application and interaction states
  5. Write tests FIRST (they should fail)
  6. Then implement component to pass tests

### **After Routing: Standard Component Workflow**

For non-Component Set designs:
1. **Visual Context:**
   - Call `mcp_figma_get_screenshot` for the design
   - Call `mcp_figma_get_design_context` to understand structure
   ...
```

## Benefits

1. **No manual detection**: Agent automatically identifies Component Sets
2. **Enforces TDD**: Component Sets always get tests-first approach
3. **Consistent workflow**: Same process every time
4. **Spec simplicity**: Authors don't need to know Figma terminology

## Example Flow

**Before (manual):**
```
Spec has Figma URL → Agent assumes single component → Implements → Tests after
```

**After (automatic):**
```
Spec has Figma URL 
→ Agent uses figma-url-router skill
→ Detects COMPONENT_SET
→ Routes to component-set-testing skill
→ Writes tests first (TDD)
→ Then implements
```

## Checklist for Integration

- [ ] Add figma-url-router to skills registry
- [ ] Update mode instructions Step 2
- [ ] Test with known Component Set URL
- [ ] Test with single component URL
- [ ] Verify TDD is followed for Component Sets
- [ ] Document in team workflow docs

## Testing the Integration

Use this spec to test:

```markdown
# Test: Automatic Component Set Detection

As a developer, I want to verify the figma-url-router automatically detects Component Sets.

Designs:
- Test component: https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/Carton?node-id=1109-10911

Acceptance Criteria:
GIVEN the agent sees the Figma URL
THEN it should automatically detect if it's a Component Set
AND route to the appropriate workflow
AND write tests first if it's a Component Set

Developer Notes:
- Do not manually specify node type
- Let the agent figure it out
```

Expected behavior:
1. Agent sees Figma URL
2. Calls figma-url-router skill
3. Detects type via `mcp_figma_get_design_context`
4. Routes appropriately
5. If Component Set: writes tests BEFORE component
