# Batch Process All Leaf Components: Identify Variants + Generate Variant Stories

**Goal**: Run the variant identification and story generation prompts for all 27 leaf components sequentially, with progress tracking.

## Workflow

### Step 1: Discover All Leaf Components
Read `.temp/react-to-figma/component-hierarchy/leaf-components.md` and extract every component name (both UI Library and Project Components).

Expected output: A list of 27 component names.

### Step 2: Create Todo List
Use `manage_todo_list` to create one todo entry for each leaf component with status `not-started`. Each todo should follow the pattern:
```
"{ComponentName}: identify-variants + generate-stories"
```

For example:
- `AccordionContent: identify-variants + generate-stories`
- `AccordionTrigger: identify-variants + generate-stories`
- `Alert: identify-variants + generate-stories`
- ... (27 total)

### Step 3: Process Todos Sequentially
For each todo with status `not-started` (in order):

1. **Mark the todo as `in-progress`** using `manage_todo_list`
2. **Run Prompt 1 (Identify Variants)** for the component:
   - Subagent: Default agent
   - Prompt path: `.claude/skills/react-to-figma-dom/6-get-component-context-and-implement-in-figma/1-get-component-context/1-prompt.identify-variants.md`
   - Pass component name as context/parameter
3. **Run Prompt 2 (Generate Variant Stories)** for the same component:
   - Subagent: Default agent  
   - Prompt path: `.claude/skills/react-to-figma-dom/6-get-component-context-and-implement-in-figma/1-get-component-context/2-prompt.generate-variant-stories.md`
   - Pass component name as context/parameter
4. **Mark the todo as `completed`** using `manage_todo_list`

### Step 4: Repeat Until All Complete
Continue processing todos until all 27 have status `completed`. Do NOT pause or yield back to the user — keep going automatically.

## Key Notes

- **Sequential execution**: Run each component's two prompts in sequence (identify-variants THEN generate-stories for Component A, then move to Component B)
- **No stopping**: Once todos are created in Step 2, automatically execute all of them in Step 3-4 without waiting for user input
- **Progress visibility**: Update todo list after each component completes so the user can see progress if they check back
- **Component names matter**: Pass the exact component name (e.g., "AccordionContent", "Badge", "BaseEditable") to each subagent call

## Expected Output

- 27 components processed
- For each component: Variants identified + variant story generation completed
- Progress tracked in todo list (all marked `completed` at the end)
- Output files created in `.temp/react-to-figma/components/{ComponentName}/` for each

---

**Status**: Ready to begin. Start with Step 1: Reading leaf-components.md to discover all components.
