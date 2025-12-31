# Implementation Plan: Rich Text Case Description

**Branch**: `003-rich-text-description` | **Date**: 2025-12-30 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-rich-text-description/spec.md`

**Note**: This plan is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement a rich text editor for case descriptions using Slate.js React components. The editor will support text formatting (bold, italic, underline), lists (bulleted/numbered), headings (Heading 2), and hyperlinks. The formatted content will be stored as structured data in the database and rendered appropriately in both edit and read-only modes. The design will match the Figma mockup with a formatting toolbar. The implementation enforces a 10,000 character hard limit with validation.

## Technical Context

**Language/Version**: TypeScript 5.7.2  
**Primary Dependencies**:

- Frontend: React 18.3, Slate.js (slate, slate-react, slate-history), Vite 6.0, TanStack Query 5.62
- Backend: tRPC 10.45, Prisma 6.2, Zod 3.24
- Testing: Vitest 2.1, Playwright 1.49, React Testing Library

**Storage**: SQLite via Prisma ORM (Case.description field will store JSON stringified rich text)  
**Testing**: Vitest (unit/integration), Playwright (E2E), React Testing Library (component)  
**Target Platform**: Web application (React SPA + Node.js tRPC server)  
**Project Type**: Monorepo with separate client/server/shared packages  
**Performance Goals**:

- Rich text editor responsive with no typing lag up to 10,000 characters
- Case description rendering < 500ms
- Save operation < 1 second

**Constraints**:

- 10,000 character hard limit on descriptions
- Must match Figma design for toolbar and editor appearance
- No legacy plain text migration needed (fresh database)
- Keyboard shortcuts must not override browser defaults

**Scale/Scope**:

- Single rich text editor component
- Updates to 1 Prisma model (Case)
- Updates to 1 tRPC route (case.update)
- 3 new React components (RichTextEditor, RichTextToolbar, RichTextRenderer)
- Approximately 800-1200 lines of new code

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Core Principles Compliance

**✅ I. Type Safety First**

- Slate.js types will be used for editor state
- Zod schema for rich text JSON validation
- Shared types for rich text structure in `packages/shared/src/richText.ts`
- Prisma schema update for description field (remains String, stores JSON)

**✅ II. API Contract Integrity**

- Update `case.update` mutation in `packages/server/src/router.ts`
- Zod schema validates rich text structure before save
- tRPC ensures type safety between client/server
- No breaking changes to existing API contracts

**✅ III. Test-Informed Development**

- Unit tests: RichText validation utilities, serialization/deserialization
- Integration tests: tRPC case.update with rich text payload
- E2E test: Edit case description with formatting, save, verify persistence
- Component tests: RichTextEditor toolbar interactions

**✅ IV. Component Development Standards**

- Use existing `Button` from `packages/client/src/ui/` for toolbar
- Create RichTextEditor as new component with Storybook stories
- Stories demonstrate: empty state, formatted content, character limit, error states
- Follow Shadcn UI patterns for styling consistency

**✅ V. E2E Testing for User Flows**

- New E2E test: `tests/e2e/rich-text-description.spec.ts`
- Test scenarios: Format text, create lists, insert links, save, verify rendering
- Test character limit enforcement
- Test mobile responsive rendering

### Technical Standards Compliance

**✅ Architecture Compliance**

- Maintain monorepo structure: client, server, shared packages
- Rich text types in `packages/shared/src/richText.ts`
- No cross-contamination between client and server
- Prisma migration for any schema changes

**✅ Code Quality**

- ESLint compliance required
- Prettier formatting enforced
- TypeScript strict mode maintained
- Absolute imports for better refactoring

**✅ Performance & Security**

- Zod validation for rich text structure (XSS prevention)
- Input sanitization in Slate editor
- Character limit validation (10,000 chars)
- No SQL injection risk (Prisma ORM)

### Constitution Violations

**None** - This feature fully complies with all constitutional requirements.

## Project Structure

### Documentation (this feature)

```text
specs/003-rich-text-description/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   ├── rich-text-types.md
│   ├── case-update-mutation.md
│   └── rich-text-editor-component.md
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
packages/
├── client/
│   └── src/
│       ├── components/
│       │   ├── CaseDetails/
│       │   │   └── components/
│       │   │       └── CaseInformation/
│       │   │           ├── CaseInformation.tsx          # UPDATE: Replace Textarea with RichTextEditor
│       │   │           ├── CaseInformation.test.tsx     # UPDATE: Add rich text tests
│       │   │           └── CaseInformation.stories.tsx  # UPDATE: Add rich text stories
│       │   └── RichText/                                 # NEW: Rich text components
│       │       ├── RichTextEditor.tsx                    # NEW: Main editor component
│       │       ├── RichTextEditor.test.tsx               # NEW: Editor tests
│       │       ├── RichTextEditor.stories.tsx            # NEW: Editor stories
│       │       ├── RichTextToolbar.tsx                   # NEW: Formatting toolbar
│       │       ├── RichTextRenderer.tsx                  # NEW: Read-only renderer
│       │       ├── RichTextRenderer.test.tsx             # NEW: Renderer tests
│       │       ├── plugins/                              # NEW: Slate plugins
│       │       │   ├── withLinks.ts                      # NEW: Link plugin
│       │       │   ├── withLists.ts                      # NEW: List plugin
│       │       │   └── withFormatting.ts                 # NEW: Formatting plugin
│       │       └── utils/                                # NEW: Editor utilities
│       │           ├── serialization.ts                  # NEW: JSON <-> Slate conversion
│       │           ├── characterCount.ts                 # NEW: Character counting
│       │           └── validation.ts                     # NEW: Content validation
│       └── ui/
│           └── [existing shadcn components]              # USE: Button, DropdownMenu, etc.
├── server/
│   ├── prisma/
│   │   ├── schema.prisma                                 # UPDATE: Case.description type annotation
│   │   └── migrations/                                   # NEW: Migration if schema changes
│   └── src/
│       ├── router.ts                                     # UPDATE: case.update validation
│       └── router.test.ts                                # UPDATE: Add rich text tests
└── shared/
    └── src/
        ├── richText.ts                                   # NEW: Shared rich text types
        └── types.ts                                      # UPDATE: Add RichTextContent type

tests/
└── e2e/
    └── rich-text-description.spec.ts                     # NEW: E2E tests for rich text editing
```

**Structure Decision**: Web application (monorepo) structure selected. This feature follows the existing pattern with separate client, server, and shared packages. The rich text components are organized under `packages/client/src/components/RichText/` as a new feature module. Shared types are centralized in `packages/shared/src/richText.ts` following the constitution's requirement for separate files per functionality. The existing `CaseInformation` component will be updated to use the new `RichTextEditor` component instead of the current `Textarea`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**No violations** - This feature fully complies with the constitution. No complexity tracking needed.
