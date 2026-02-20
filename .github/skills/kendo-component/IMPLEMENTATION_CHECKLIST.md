# KendoUI Component Implementation Checklist

Use this checklist to ensure your KendoUI component implementation meets all project requirements.

## Pre-Implementation

- [ ] **Request Analysis**
  - [ ] Understand the component requirements
  - [ ] Identify data sources (props, tRPC, static)
  - [ ] List all required states and variants
  - [ ] Note any design references (Figma URL, mockups)

- [ ] **Component Reuse Check**
  - [ ] Search existing components in `packages/client/src/components/`
  - [ ] Review related components in other features
  - [ ] Decision: New component, wrapper, or extension

- [ ] **Design Analysis** (if Figma URL provided)
  - [ ] Extract Figma design context using MCP
  - [ ] Document design specifications
  - [ ] Identify KendoUI component mapping
  - [ ] Note any custom styling requirements

- [ ] **KendoUI Selection**
  - [ ] Query MCP server for component recommendation
  - [ ] Review KendoUI documentation for selected component
  - [ ] Verify component supports required features
  - [ ] Check dependency requirements (`@progress/kendo-react-*`)

## Project Setup

- [ ] **Package Dependencies**
  - [ ] Required KendoUI packages installed
    - [ ] `@progress/kendo-react-common`
    - [ ] Feature-specific package (e.g., `@progress/kendo-react-grid`)
  - [ ] Run `npm list @progress/kendo-react-*` to verify
  - [ ] All peer dependencies satisfied

- [ ] **License Configuration** (if applicable)
  - [ ] KendoUI license key configured in project
  - [ ] Community vs. licensed features documented
  - [ ] Trial/evaluation period understood

## Implementation

- [ ] **Modlet Structure**
  - [ ] Created folder: `packages/client/src/components/ComponentName/`
  - [ ] Created: `index.ts` (re-exports only)
  - [ ] Created: `ComponentName.tsx` (implementation)
  - [ ] Created: `types.ts` (TypeScript interfaces)
  - [ ] Created: `ComponentName.css` (styling)
  - [ ] Optional: `hooks/` subfolder for custom hooks
  - [ ] Optional: `components/` subfolder for sub-components

- [ ] **Component Implementation**
  - [ ] Props interface defined with all required props
  - [ ] Default values set for optional props
  - [ ] KendoUI component imported correctly
  - [ ] Component renders without errors
  - [ ] All props passed through to KendoUI
  - [ ] Event handlers properly implemented
  - [ ] Error states handled
  - [ ] Loading states handled (if applicable)
  - [ ] Empty states handled (if applicable)

- [ ] **Styling**
  - [ ] Tailwind CSS classes used in component/template
  - [ ] KendoUI theme CSS included (if needed)
  - [ ] Custom CSS in `ComponentName.css` doesn't conflict
  - [ ] Responsive design verified
  - [ ] Dark mode support (if project uses it)
  - [ ] Hover states accessible
  - [ ] Focus states visible for keyboard users

- [ ] **Accessibility**
  - [ ] KendoUI component is WCAG 2.1 AA compliant
  - [ ] ARIA labels added where needed
  - [ ] Keyboard navigation works
  - [ ] Screen reader tested with component
  - [ ] Color contrast meets WCAG standards
  - [ ] Tab order is logical

- [ ] **TypeScript**
  - [ ] Props interface fully typed
  - [ ] No `any` types (unless unavoidable)
  - [ ] Return type specified for component
  - [ ] Custom hooks typed correctly
  - [ ] `npm run typecheck` passes

## Stories and Documentation

- [ ] **Storybook Stories**
  - [ ] Created: `ComponentName.stories.tsx`
  - [ ] Default variant story created
  - [ ] All design variants covered
  - [ ] State variations included (loading, error, empty)
  - [ ] Interactive controls added via argTypes
  - [ ] Stories render without errors
  - [ ] Stories match design intent

- [ ] **Component Documentation**
  - [ ] Created: `README.md` (if complex component)
  - [ ] Usage examples provided
  - [ ] Props documented
  - [ ] Design rationale explained
  - [ ] Integration patterns shown
  - [ ] Known limitations noted
  - [ ] Accessibility features documented

## Testing

- [ ] **Unit Tests**
  - [ ] Created: `ComponentName.test.tsx`
  - [ ] Test file runs without errors
  - [ ] Default render tested
  - [ ] Props affect rendering correctly
  - [ ] Event handlers called on user interaction
  - [ ] Loading state tested
  - [ ] Error state tested
  - [ ] Empty state tested
  - [ ] Edge cases covered

- [ ] **Test Coverage**
  - [ ] Critical paths covered
  - [ ] User interactions tested
  - [ ] Props combinations tested
  - [ ] Coverage report shows reasonable coverage (>70%)

- [ ] **Storybook Verification**
  - [ ] All stories load in Storybook
  - [ ] Stories render correctly
  - [ ] Interactions work as expected
  - [ ] Responsive design verified in Storybook

## Integration

- [ ] **Type System Integration**
  - [ ] Types exported from `index.ts`
  - [ ] Types importable from package: `import { ComponentNameProps } from '@/components/ComponentName'`
  - [ ] No circular dependencies

- [ ] **API Integration** (if using tRPC)
  - [ ] Data fetching implemented
  - [ ] React Query cache configured
  - [ ] Error states handled
  - [ ] Loading states handled
  - [ ] Empty states handled

- [ ] **Exports**
  - [ ] Component exported from modlet's `index.ts`
  - [ ] Types exported from modlet's `index.ts`
  - [ ] Parent component index updated (if in subdirectory)
  - [ ] Component importable from full path

## Verification

- [ ] **Type Checking**
  - [ ] `npm run typecheck` passes
  - [ ] No TypeScript errors in IDE

- [ ] **Linting**
  - [ ] `npm run lint` passes
  - [ ] No ESLint errors or warnings
  - [ ] Code style consistent

- [ ] **Testing**
  - [ ] `npm test` passes for component
  - [ ] All tests pass
  - [ ] No console warnings/errors in test output

- [ ] **Build**
  - [ ] Component builds successfully
  - [ ] No build warnings
  - [ ] Bundle size reasonable

- [ ] **Manual Testing**
  - [ ] Component works as intended in browser
  - [ ] Responsive design works on mobile/tablet/desktop
  - [ ] Keyboard navigation functional
  - [ ] Screen reader announces content correctly

## Figma Integration (if applicable)

- [ ] **Code Connect** (if designed in Figma)
  - [ ] Created: `ComponentName.figma.tsx`
  - [ ] Figma URL correct in mapping
  - [ ] Props mapped to variants
  - [ ] Example component includes all variants
  - [ ] Code Connect runs without errors

- [ ] **Design Sync**
  - [ ] Component matches Figma design
  - [ ] All variants from Figma implemented
  - [ ] Colors match design tokens
  - [ ] Typography matches design
  - [ ] Spacing matches design

- [ ] **Documentation**
  - [ ] README includes Figma source URL
  - [ ] Design-to-code mapping documented
  - [ ] Any deviations from design explained

## Quality Gate

- [ ] **Pre-Commit Checklist**
  - [ ] All above sections completed
  - [ ] Tests passing: `npm test`
  - [ ] Types checking: `npm run typecheck`
  - [ ] Linting passing: `npm run lint`
  - [ ] Storybook loads correctly
  - [ ] Manual testing in browser complete

## Post-Implementation

- [ ] **Code Review Preparation**
  - [ ] Component documented in README
  - [ ] Example usage shown
  - [ ] Design decisions explained
  - [ ] Any non-obvious patterns documented

- [ ] **Documentation Update**
  - [ ] ARCHITECTURE.md updated (if needed)
  - [ ] Component added to component library documentation
  - [ ] Example added to project examples

- [ ] **Performance Optimization**
  - [ ] React.memo considered for expensive renders
  - [ ] Memoized callbacks where appropriate
  - [ ] Virtual scrolling enabled for large lists
  - [ ] Data loading optimized

## Common Pitfalls to Avoid

- [ ] ❌ Using KendoUI without checking for existing Shadcn component
- [ ] ❌ Not setting default props on all KendoUI properties
- [ ] ❌ Forgetting accessibility features
- [ ] ❌ Missing error and loading states
- [ ] ❌ Not testing with keyboard navigation
- [ ] ❌ Ignoring TypeScript strict mode
- [ ] ❌ Mixing Tailwind CSS with KendoUI theme classes
- [ ] ❌ Not creating Storybook stories for variants
- [ ] ❌ Hardcoding data instead of using props
- [ ] ❌ Skipping unit tests

## Resources

- [KendoUI React Documentation](https://www.telerik.com/kendo-react-ui/components/)
- [Project Component Guidelines](../create-react-modlet/SKILL.md)
- [Type Safety Guide](../cross-package-types/SKILL.md)
- [Accessibility Standards](../validate-implementation/SKILL.md)
- [Figma Integration](../figma-connect-component/SKILL.md)
