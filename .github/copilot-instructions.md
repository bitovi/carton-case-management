# Copilot Instructions for Carton Case Management

## Modlet Pattern for Components

When creating new React components, hooks, utilities, or any module, **always follow the modlet pattern**. A modlet is a self-contained folder that houses everything related to a specific module that isn't shared by other modules.

### Modlet Types

**Non-Visual Modlets** (hooks, utilities, helpers):

- `index.ts` - Re-export entry point (required)
- Main module file (e.g., `useMyHook.ts`, `myHelper.ts`) (required)
- Test file (`<modlet-name>.test.ts`) (required)
- `types.ts` - Custom types/interfaces (optional)

**Visual Modlets** (components):

- All files from non-visual modlets (required)
- Storybook story file (`<modlet-name>.stories.tsx`) (required)

### Core Rules

1. **Folder naming**: Name the modlet folder after its main export (e.g., `/MyComponent` exports `MyComponent`)
2. **index.ts only re-exports**: Never define logic in `index.ts`, only re-export from within the modlet
3. **Tests are mandatory**: Every modlet must have tests in `<modlet-name>.test.<file-type>`
4. **Stories for visual modlets**: All visual components must have Storybook stories
5. **Sub-organization**: Additional components go in `/components` subfolder, hooks in `/hooks`, helpers in `/helpers` - each as its own modlet

### Creation Process

1. **Plan with todos**: Use `manage_todo_list` to track:
   - Create modlet folder
   - Add `index.ts` with re-exports
   - Add main module file
   - Add test file
   - (Visual) Add story file
   - (If needed) Add `types.ts`
   - (If needed) Create sub-modlet folders

2. **Create all required files** according to modlet type

3. **Verify** (add as separate todos):
   - Run tests to ensure they pass
   - (Visual) Open Storybook to verify story renders
   - Run `npm run typecheck`
   - Verify modlet imports work from `index.ts`

### Examples

**Non-Visual Modlet:**

```
useCounter/
├── index.ts              # export { useCounter } from './useCounter'
├── useCounter.ts         # Hook implementation
├── useCounter.test.ts    # Tests
└── types.ts              # (optional) Types
```

**Visual Modlet:**

```
Button/
├── index.ts              # export { Button } from './Button'
├── Button.tsx            # Component implementation
├── Button.test.tsx       # Tests
├── Button.stories.tsx    # Storybook stories
└── types.ts              # (optional) Types
```

**With Sub-organization:**

```
ComplexForm/
├── index.ts
├── ComplexForm.tsx
├── ComplexForm.test.tsx
├── ComplexForm.stories.tsx
├── types.ts
├── components/
│   └── FormField/        # Sub-modlet with same structure
└── hooks/
    └── useFormValidation/ # Sub-modlet with same structure
```

### Quality Checklist

Before completing any modlet:

- [ ] Folder name matches main export
- [ ] index.ts exists and only contains re-exports
- [ ] Main module file exists
- [ ] Test file exists and passes
- [ ] (Visual only) Story file exists and renders in Storybook
- [ ] Types file exists if custom types are defined
- [ ] Sub-folders follow modlet structure
- [ ] `npm run typecheck` passes
- [ ] Modlet can be imported from its `index.ts`

### Common Mistakes to Avoid

- ❌ Missing `index.ts` file
- ❌ Defining logic directly in `index.ts` instead of re-exporting
- ❌ Skipping tests
- ❌ Missing Storybook stories for visual components
- ❌ Not verifying tests pass after creation
- ❌ Folder name doesn't match main export name
