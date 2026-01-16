# Implementation Plan: Inline Editable Components

**Branch**: `004-inline-edit-components` | **Date**: 2026-01-14 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-inline-edit-components/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a comprehensive library of inline editable components with a composable `BaseEditable` foundation that manages state transitions (rest → interest → edit), keyboard/mouse interactions, validation, and async save handling. Replace existing `EditableSelect` and `EditableTitle` components with the new architecture.

## Technical Context

**Language/Version**: TypeScript 5.x, React 18.3.x  
**Primary Dependencies**: Shadcn UI components (Input, Select, Button), Radix UI primitives, Lucide icons, Tailwind CSS, Zod (validation)  
**Storage**: N/A (components are presentational; save handled by consumer callbacks)  
**Testing**: Vitest (unit/component tests), Storybook (visual/interactive), Playwright (E2E)  
**Target Platform**: Web (Vite bundled SPA)  
**Project Type**: web (monorepo with client/server/shared packages)  
**Performance Goals**: State transitions < 100ms, save feedback immediate (optimistic)  
**Constraints**: WCAG 2.1 AA accessibility, no layout shift during save (only during edit/error)  
**Scale/Scope**: 8 component variants, 2 existing components to migrate, ~6 usage sites

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Status | Notes |
|-----------|-------------|--------|-------|
| I. Type Safety First | Strict TypeScript, no `any`, Zod validation | ✅ PASS | Components use generics, Zod for validation prop |
| II. API Contract Integrity | N/A for presentational components | ✅ PASS | No API changes; save handled by consumer |
| III. Test-Informed Development | Unit tests, Storybook, E2E for pages | ✅ PASS | Will add tests + stories for all components |
| IV. Component Development Standards | Shadcn UI first, Storybook required | ✅ PASS | Uses existing Shadcn primitives (Input, Select, Button) |
| V. E2E Testing for User Flows | E2E for critical user flows | ✅ PASS | Migration will preserve existing E2E coverage |

**Pre-Phase 0 Gate**: ✅ PASSED - No violations. Proceed to research.

### Post-Design Re-evaluation (Phase 1 Complete)

| Principle | Status | Verification |
|-----------|--------|--------------|
| I. Type Safety | ✅ PASS | Generic `BaseEditable<T>`, typed props, Zod/function validation |
| II. API Contract | ✅ PASS | No server changes; component-only feature |
| III. Testing | ✅ PASS | Test + story requirements documented in quickstart.md |
| IV. Components | ✅ PASS | All variants use existing Shadcn UI (Input, Select, Button, etc.) |
| V. E2E | ✅ PASS | Existing E2E tests cover case detail pages; migration preserves coverage |

**Post-Design Gate**: ✅ PASSED - Design adheres to all constitutional principles.

## Project Structure

### Documentation (this feature)

```text
specs/004-inline-edit-components/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── base-editable-api.md
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

**Pattern**: Each component follows the **modlet pattern** (see `.github/instructions/client.instructions.md`):

```text
ComponentName/
├── ComponentName.tsx          # Main component
├── ComponentName.test.tsx     # Unit tests (Vitest)
├── ComponentName.stories.tsx  # Storybook stories
├── index.ts                   # Public exports (barrel)
├── types.ts                   # TypeScript types (optional, if complex)
└── components/                # Sub-components (optional)
```

```text
packages/client/src/components/
├── inline-edit/                    # NEW: Grouping folder (kebab-case)
│   ├── BaseEditable/               # Modlet (PascalCase)
│   │   ├── BaseEditable.tsx
│   │   ├── BaseEditable.test.tsx
│   │   ├── BaseEditable.stories.tsx
│   │   ├── types.ts
│   │   └── index.ts
│   ├── EditableText/               # Modlet (PascalCase)
│   │   ├── EditableText.tsx
│   │   ├── EditableText.test.tsx
│   │   ├── EditableText.stories.tsx
│   │   └── index.ts
│   ├── EditableTextarea/           # Modlet
│   ├── EditableSelect/             # Modlet
│   ├── EditableDate/               # Modlet
│   ├── EditableNumber/             # Modlet
│   ├── EditableCurrency/           # Modlet
│   ├── EditablePercent/            # Modlet
│   ├── EditableTitle/              # Modlet
│   ├── types.ts                    # Shared types for all inline-edit components
│   └── index.ts                    # Barrel export for all components
├── common/
│   ├── EditableSelect/             # DEPRECATED: To be removed after migration
│   └── EditableTitle/              # DEPRECATED: To be removed after migration
└── CaseDetails/components/
    ├── CaseEssentialDetails/       # MIGRATE: Update imports
    └── CaseInformation/            # MIGRATE: Update imports
```

**Structure Decision**: New components in `packages/client/src/components/inline-edit/` following:
- **Grouping folder**: `inline-edit/` uses kebab-case (non-component folder)
- **Component folders**: Each component uses PascalCase and follows the **modlet pattern**
- **Required files per modlet**: `ComponentName.tsx`, `ComponentName.test.tsx`, `ComponentName.stories.tsx`, `index.ts`
- **Optional files**: `types.ts` (for complex types), `components/` subfolder (for sub-components)

## Figma Design References

**⚠️ CRITICAL**: Before implementing ANY component, fetch its Figma design via MCP to ensure pixel-perfect implementation.

**Branch**: `mPCNrycLkhncmjlVoYTBzT` (all designs are on this branch)

| Component | Node ID | MCP Command | Key Design Notes |
|-----------|---------|-------------|------------------|
| All Components Overview | 1109-12982 | `mcp_figma_get_design_context` nodeId=`1109-12982` fileKey=`mPCNrycLkhncmjlVoYTBzT` | Complete component library |
| BaseEditable | 1252-9022 | `mcp_figma_get_design_context` nodeId=`1252-9022` fileKey=`mPCNrycLkhncmjlVoYTBzT` | Rest/Hover states, label+content layout |
| EditableText | 1261-9396 | `mcp_figma_get_design_context` nodeId=`1261-9396` fileKey=`mPCNrycLkhncmjlVoYTBzT` | 3 states, check/x icon buttons |
| EditableSelect | 1065-13212 | `mcp_figma_get_design_context` nodeId=`1065-13212` fileKey=`mPCNrycLkhncmjlVoYTBzT` | 3 states, **auto-save** (no buttons) |
| EditableDate | 1252-8939 | `mcp_figma_get_design_context` nodeId=`1252-8939` fileKey=`mPCNrycLkhncmjlVoYTBzT` | 3 states, calendar icon, **auto-save** |
| EditableNumber | 1252-9102 | `mcp_figma_get_design_context` nodeId=`1252-9102` fileKey=`mPCNrycLkhncmjlVoYTBzT` | 3 states, check/x buttons |
| EditableCurrency | 1252-9136 | `mcp_figma_get_design_context` nodeId=`1252-9136` fileKey=`mPCNrycLkhncmjlVoYTBzT` | 3 states, $ prefix inside input |
| EditablePercent | 1252-9231 | `mcp_figma_get_design_context` nodeId=`1252-9231` fileKey=`mPCNrycLkhncmjlVoYTBzT` | 3 states, % suffix inside input |
| EditableTextarea | 853-1802 | `mcp_figma_get_design_context` nodeId=`853-1802` fileKey=`mPCNrycLkhncmjlVoYTBzT` | **2 states only** (no Hover), Save/Cancel text buttons |

### Implementation Workflow

1. **Before coding each component**: Run the MCP command to fetch latest Figma design
2. **Extract visual specs**: Typography, colors, spacing, border-radius from Figma output
3. **Match exactly**: Ensure implementation matches Figma pixel-for-pixel
4. **Verify in Storybook**: Compare story output to Figma design visually

## Complexity Tracking

> No constitution violations requiring justification.
