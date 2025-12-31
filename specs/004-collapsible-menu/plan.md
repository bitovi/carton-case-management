# Implementation Plan: Collapsible Navigation Menu

**Branch**: `004-collapsible-menu` | **Date**: December 30, 2025 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-collapsible-menu/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Add collapsible/expandable functionality to the desktop navigation menu, allowing users to toggle between expanded (icons + text) and collapsed (icons only) states. The feature extends the existing MenuList component with a collapse/expand control at the bottom, displays "Cases" text label in expanded state, defaults to collapsed state on page load, and maintains the existing mobile navigation unchanged. State is transient and resets on each page load.

## Technical Context

**Language/Version**: TypeScript 5.7.2  
**Primary Dependencies**: React 18.3, Vite 4.x, Tailwind CSS, Radix UI (Shadcn), React Router 7.1, Lucide React (icons)  
**Storage**: None (transient component state only, no persistence required)  
**Testing**: Vitest (unit/component), Playwright (E2E), Storybook (component development)  
**Target Platform**: Modern web browsers (desktop 1024px+, mobile <1024px)
**Project Type**: Web application (monorepo: client/server/shared packages)  
**Performance Goals**: <300ms transition animation, <1 second toggle response time  
**Constraints**: Desktop-only feature (lg breakpoint 1024px+), zero regression on mobile, smooth animations  
**Scale/Scope**: Single component enhancement (MenuList), 8 menu items, transient state (defaults to collapsed)

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Type Safety First

- ✅ TypeScript with strict mode - MenuList component already uses strict typing
- ✅ No `any` types - will use proper types for menu state and props
- ✅ Shared types in `packages/shared` - menu state type will be defined there if needed for future backend integration
- ✅ Type assertions avoided - using proper type guards and inference

### API Contract Integrity

- ✅ N/A - No API changes required (localStorage-based feature)
- ✅ No breaking changes to existing MenuList component interface
- ✅ Backward compatible - existing MenuList usage remains unchanged

### Test-Informed Development

- ✅ Component tests required - MenuList component behavior with collapse/expand
- ✅ E2E tests required - Playwright test for collapse/expand user flow
- ✅ Storybook stories required - Update MenuList stories to show expanded/collapsed states
- ✅ Unit tests for state management - Simple useState hook logic

### Component Development Standards

- ✅ Shadcn UI components - Use existing button/icon components from UI library
- ✅ Storybook required - Update MenuList.stories.tsx with new states
- ✅ Isolated development - Stories will demonstrate both expanded and collapsed states
- ✅ Accessibility - WCAG 2.1 AA compliance (keyboard navigation, ARIA labels)

### E2E Testing for User Flows

- ✅ Feature completeness - E2E test for collapse/expand toggle
- ✅ Persistence test - Verify state persists across page refresh
- ✅ User-centric scenarios - Test from desktop user perspective
- ✅ Mobile regression test - Ensure mobile navigation unchanged

**GATE STATUS**: ✅ PASS - All constitutional requirements satisfied, no violations to justify

**Post-Phase 1 Re-evaluation**: ✅ CONFIRMED

- Type safety maintained throughout design (useMenuState hook, MenuListProps)
- No API changes (localStorage-based, no backend impact)
- Full test coverage planned (Vitest + Playwright + Storybook)
- Shadcn UI patterns followed (Lucide icons, existing button patterns)
- Accessibility requirements met (ARIA, keyboard navigation)
- All constitutional gates remain GREEN

---

## Project Structure

### Documentation (this feature)

```text
specs/004-collapsible-menu/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
packages/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   └── MenuList/
│   │   │       ├── MenuList.tsx        # [MODIFY] Add collapse/expand logic
│   │   │       ├── MenuList.stories.tsx # [CREATE] Add Storybook stories
│   │   │       └── types.ts            # [NO CHANGES] Existing types sufficient
│   │   └── ui/
│   │       └── [existing Shadcn components] # [USE] button, icons
│   └── tests/
│       └── components/
│           └── MenuList.test.tsx       # [CREATE] Component tests
├── shared/
│   └── [NO CHANGES]
└── server/
    └── [NO CHANGES]

tests/
└── e2e/
    └── collapsible-menu.spec.ts        # [CREATE] E2E test for feature
```

**Structure Decision**: Web application monorepo structure. All changes are client-side only in the `packages/client` directory. The MenuList component will be enhanced with collapse/expand functionality using simple React useState for transient state management. No persistence mechanism needed.

---

## Phase 0: Research & Discovery
