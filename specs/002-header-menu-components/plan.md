# Implementation Plan: Responsive Header and Menu Components

**Branch**: `002-header-menu-components` | **Date**: December 29, 2025 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/002-header-menu-components/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Create responsive Header and Menu List navigation components for the Carton Case Management application. The Header will display the Carton logo, application name (responsive text), and user avatar with dropdown. The Menu List will provide vertical sidebar navigation on desktop and horizontal navigation on mobile, starting with a single home page navigation item. All components must follow Figma design specifications, support keyboard accessibility, and integrate with the existing React + TypeScript + tRPC stack.

## Technical Context

**Language/Version**: TypeScript 5.x (via Node.js runtime in devcontainer)  
**Primary Dependencies**: React 18, Vite, tRPC, React Query, Shadcn UI, Tailwind CSS  
**Storage**: N/A (UI components only, no data persistence required)  
**Testing**: Vitest (unit/integration), Playwright (E2E), Storybook (component development)  
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge), responsive viewports from 320px to 1920px+
**Project Type**: Web application (monorepo with client/server packages)  
**Performance Goals**:

- Dropdown menu opens within 200ms
- Navigation completes within 1s on standard networks
- Visual feedback on hover/interaction within 100ms
- Smooth responsive transitions without layout shift
  **Constraints**:
- Must integrate with existing React Router navigation
- Must follow Figma design specifications with 95% accuracy
- Components must be keyboard accessible (WCAG 2.1 AA)
- No breaking changes to existing application structure
  **Scale/Scope**:
- 2 new React components (Header, MenuList)
- Storybook stories for each component
- Unit tests for component logic
- E2E tests for navigation flows
- Integration with existing client package structure

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Initial Check (Pre-Phase 0) ✅

- ✅ **Type Safety First**: Components will be TypeScript with strict typing, no `any` types
- ✅ **API Contract Integrity**: N/A - No API changes required (frontend-only components)
- ✅ **Test-Informed Development**:
  - Unit tests for component logic (dropdown open/close, responsive behavior)
  - Storybook stories for all component variants
  - E2E tests for navigation flows (header logo click, menu item click)
- ✅ **Component Development Standards**:
  - Storybook required for Header and MenuList components
  - Stories must demonstrate desktop/mobile variants, interactive states
  - Components isolated and testable with prop overrides
  - Shadcn UI patterns for consistency
  - WCAG 2.1 AA accessibility (keyboard navigation, ARIA labels)
- ✅ **E2E Testing for User Flows**:
  - E2E test for header logo navigation to home page
  - E2E test for menu list item navigation
  - E2E test for user avatar dropdown interaction
- ✅ **Architecture Compliance**:
  - Components in `packages/client/src/components/`
  - No server imports, only shared types if needed
  - Proper workspace structure maintained
- ✅ **Code Quality**:
  - ESLint compliance enforced
  - Prettier formatting applied
  - TypeScript strict mode enabled

**Initial Violations**: None

### Post-Phase 1 Re-Check ✅

After completing research and design phases:

- ✅ **Type Safety**: All component interfaces defined in `data-model.md` with strict TypeScript types
- ✅ **Component Contracts**: Detailed contracts created for Header and MenuList in `/contracts/` directory
- ✅ **Testing Strategy**: Multi-layer testing approach documented (Vitest + Storybook + Playwright)
- ✅ **Accessibility**: WCAG 2.1 AA compliance requirements documented with specific ARIA attributes
- ✅ **Architecture**: Component structure follows monorepo client package organization
- ✅ **Dependencies**: All new dependencies align with existing stack (Shadcn UI, React Router, Lucide icons)

**Technology Decisions**:

- React Router `Link` component for navigation (existing pattern)
- Shadcn UI Dropdown Menu for accessible dropdown (consistent with stack)
- Tailwind CSS responsive utilities for mobile/desktop layouts (existing pattern)
- Inline SVG for logo (simple, performant, no extra dependencies)
- Local React state for dropdown (`useState`)

**Final Violations**: None - all constitutional requirements met

**Justification**: N/A - no violations to justify

**Risk Assessment**: Low

- UI-only feature with no database or API changes
- All patterns and technologies align with existing codebase
- Comprehensive testing strategy covers all interaction flows
- Accessibility built-in from the start with Shadcn UI primitives

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
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
│   │   │   ├── layout/          # NEW: Layout components
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Header.stories.tsx
│   │   │   │   ├── Header.test.tsx
│   │   │   │   ├── MenuList.tsx
│   │   │   │   ├── MenuList.stories.tsx
│   │   │   │   ├── MenuList.test.tsx
│   │   │   │   └── index.ts     # Export barrel
│   │   │   └── ui/              # Existing Shadcn UI components
│   │   ├── assets/              # NEW: Static assets
│   │   │   └── logo.svg         # Carton logo SVG
│   │   ├── pages/
│   │   │   └── HomePage.tsx     # Updated to include Header + MenuList
│   │   └── App.tsx              # Updated to include Header on all pages
│   └── public/
├── server/                       # No changes
└── shared/                       # No changes

tests/
└── e2e/
    └── navigation.spec.ts        # NEW: Navigation E2E tests
```

**Structure Decision**: This is a web application frontend feature. Components will be placed in a new `layout/` directory under `packages/client/src/components/` to distinguish navigation/layout components from reusable UI primitives. The Header will be integrated at the App.tsx level to appear on all pages, while MenuList will be included in the layout structure. Static assets (logo SVG) will go in `src/assets/`.

## Complexity Tracking

**No violations** - This section not applicable.

This feature fully complies with the project constitution. No complexity justifications needed.

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |
