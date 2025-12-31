# Quickstart: Rich Text Description Implementation

**Feature**: Rich Text Description Editor  
**Branch**: `003-rich-text-description`  
**Estimated Time**: 8-12 hours

## Prerequisites

- TypeScript 5.7.2
- Node.js 18+
- Existing Carton Case Management codebase
- Figma access to design file (7QW0kJ07DcM36mgQUJ5Dtj, node 14:1638)

## Overview

This feature adds rich text editing capabilities to the case description field using Slate.js. The rich text structure is stored as JSON in the existing Prisma `description` String field.

## Phase 1: Dependencies

### 1.1 Install Slate.js Packages

```bash
cd packages/client
npm install slate slate-react slate-history
npm install -D @types/slate @types/slate-react
```

### 1.2 Verify Existing Dependencies

These should already be installed:

- `@tanstack/react-query` (for tRPC)
- `zod` (for validation)
- `shadcn` UI components (for toolbar buttons)

## Phase 2: Shared Types

### 2.1 Create Type Definitions

**File**: `packages/shared/src/richText.ts`

Copy type definitions from `contracts/rich-text-types.md`:

- `BaseElement`
- `ParagraphElement`
- `HeadingElement`
- `BulletedListElement`
- `NumberedListElement`
- `ListItemElement`
- `LinkElement`
- `CodeBlockElement`
- `FormattedText`
- `Element` (union type)
- `Descendant`
- `RichTextDocument`
- Type guard functions

### 2.2 Export from Shared Package

**File**: `packages/shared/src/index.ts`

```typescript
export * from './richText';
```

### 2.3 Add Zod Schemas

**File**: `packages/shared/src/richText.ts`

Add validation schemas from `contracts/rich-text-types.md`:

- `formattedTextSchema`
- `paragraphSchema`
- `headingSchema`
- `bulletedListSchema`
- `numberedListSchema`
- `listItemSchema`
- `linkSchema`
- `codeBlockSchema`
- `elementSchema`
- `richTextDocumentSchema`

## Phase 3: Server-Side Validation

### 3.1 Update tRPC Router

**File**: `packages/server/src/router.ts`

Modify `case.update` mutation to validate rich text:

```typescript
import { richTextDocumentSchema } from '@carton/shared';

update: protectedProcedure
  .input(
    z.object({
      id: z.string(),
      description: z.string().optional(),
      status: z.string().optional(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    // Validate rich text if description is provided
    if (input.description) {
      try {
        const parsed = JSON.parse(input.description);
        const validated = richTextDocumentSchema.parse(parsed);

        // Count characters
        const charCount = serializeToPlainText(validated).length;
        if (charCount > 10000) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `Description exceeds 10,000 character limit (${charCount} characters)`,
          });
        }

        // Check if empty
        if (charCount === 0) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Description cannot be empty',
          });
        }
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid rich text format',
        });
      }
    }

    return ctx.prisma.case.update({
      where: { id: input.id },
      data: input,
    });
  }),
```

### 3.2 Add Character Count Utility

**File**: `packages/shared/src/richText.ts`

```typescript
export function serializeToPlainText(document: RichTextDocument): string {
  return document.map((node) => Node.string(node)).join('\n');
}
```

### 3.3 Add Tests

**File**: `packages/server/src/router.test.ts`

Add test cases from `contracts/case-update-mutation.md`:

- Valid rich text saves successfully
- Character limit exceeded returns error
- Empty description returns error
- Invalid JSON returns error
- Malformed structure returns error

## Phase 4: Client Components

### 4.1 Create Component Directory

```bash
mkdir -p packages/client/src/components/RichText
mkdir -p packages/client/src/components/RichText/plugins
mkdir -p packages/client/src/components/RichText/utils
```

### 4.2 Create Slate Plugins

**Files to create**:

- `packages/client/src/components/RichText/plugins/withLinks.ts`
- `packages/client/src/components/RichText/plugins/withLists.ts`
- `packages/client/src/components/RichText/plugins/withFormatting.ts`

Reference `research.md` for plugin implementation patterns.

### 4.3 Create Utility Functions

**Files to create**:

- `packages/client/src/components/RichText/utils/serialization.ts`
  - `serializeToJSON()`
  - `deserializeFromJSON()`
  - `createEmptyDocument()`
- `packages/client/src/components/RichText/utils/characterCount.ts`
  - `useCharacterCount()`
  - `getCharacterCount()`
- `packages/client/src/components/RichText/utils/validation.ts`
  - `validateRichText()`

### 4.4 Create RichTextEditor Component

**File**: `packages/client/src/components/RichText/RichTextEditor.tsx`

Implement based on `contracts/rich-text-editor-component.md`:

- Component with props interface
- Slate editor setup with plugins
- Custom renderElement and renderLeaf
- Keyboard shortcut handlers
- Paste handler
- Character count display

### 4.5 Create RichTextToolbar Component

**File**: `packages/client/src/components/RichText/RichTextToolbar.tsx`

Implement toolbar with:

- Format buttons (bold, italic, underline)
- List buttons (bulleted, numbered)
- Link button with dialog
- Heading dropdown
- Optional: Strikethrough, code block buttons

### 4.6 Create RichTextRenderer Component

**File**: `packages/client/src/components/RichText/RichTextRenderer.tsx`

Read-only renderer for displaying saved rich text:

- Parse JSON to Slate document
- Render elements without editor
- Handle all supported element types
- Apply text formatting

### 4.7 Add Component Tests

**Files to create**:

- `packages/client/src/components/RichText/RichTextEditor.test.tsx`
- `packages/client/src/components/RichText/RichTextToolbar.test.tsx`
- `packages/client/src/components/RichText/RichTextRenderer.test.tsx`

Test cases:

- Component rendering
- User interactions (typing, formatting)
- Character count updates
- Character limit enforcement
- Keyboard shortcuts
- Link insertion
- List creation
- Paste handling

### 4.8 Add Storybook Stories

**Files to create**:

- `packages/client/src/components/RichText/RichTextEditor.stories.tsx`

Stories from `contracts/rich-text-editor-component.md`:

- Empty editor
- With content
- With lists
- Near character limit
- Read-only mode
- Disabled mode

## Phase 5: Integration

### 5.1 Update CaseInformation Component

**File**: `packages/client/src/components/CaseDetails/components/CaseInformation/CaseInformation.tsx`

Replace Textarea with RichTextEditor:

```typescript
import { RichTextEditor } from '@/components/RichText/RichTextEditor';
import { type Descendant } from 'slate';

// In component:
const [description, setDescription] = useState<Descendant[]>(
  deserializeFromJSON(caseData.description)
);

// In render:
{isEditing ? (
  <RichTextEditor
    value={description}
    onChange={setDescription}
    placeholder="Enter case description..."
    maxCharacters={10000}
    onSave={handleSave}
  />
) : (
  <RichTextRenderer value={description} />
)}

// In handleSave:
const handleSave = () => {
  updateCase.mutate({
    id: caseId,
    description: serializeToJSON(description),
  });
};
```

### 5.2 Update Integration Tests

**File**: `packages/client/src/components/CaseDetails/components/CaseInformation/CaseInformation.test.tsx`

Add tests:

- Rich text editor renders in edit mode
- Rich text renderer renders in view mode
- Formatting buttons work
- Character count displays
- Save sends JSON to server
- Cancel reverts changes

### 5.3 Update Storybook Stories

**File**: `packages/client/src/components/CaseDetails/components/CaseInformation/CaseInformation.stories.tsx`

Add stories:

- Case with rich text description
- Case with long description
- Case in edit mode

## Phase 6: E2E Tests

### 6.1 Create E2E Test File

**File**: `tests/e2e/rich-text-description.spec.ts`

Test scenarios:

- User can format text (bold, italic, underline)
- User can create lists (bulleted, numbered)
- User can add links
- User can add headings
- Character count updates as user types
- Save is disabled when over character limit
- Rich text is saved and rendered correctly
- Mobile toolbar works

## Phase 7: Verification

### 7.1 Constitution Compliance Checklist

From `.specify/memory/constitution.md`:

- [ ] **Type Safety**: All components use TypeScript with proper types
- [ ] **No `any` Types**: Search codebase for `any` usage
- [ ] **Shared Types**: RichText types in `packages/shared/src/`
- [ ] **API Integrity**: tRPC mutation validates rich text structure
- [ ] **Testing**: Unit tests for components, integration tests for mutations, E2E tests for user flows
- [ ] **Component Standards**: Components in `components/RichText/`, stories in Storybook
- [ ] **Error Handling**: User-friendly error messages for validation failures

### 7.2 Quality Checklist

- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] All E2E tests passing
- [ ] Storybook stories render correctly
- [ ] Component matches Figma design
- [ ] Mobile responsive
- [ ] Keyboard shortcuts work (where not conflicting with browser)
- [ ] Character count accurate
- [ ] Character limit enforced
- [ ] Paste handling works with HTML content
- [ ] No console errors or warnings

### 7.3 Manual Testing

1. **Create new case**: Add rich text description with various formatting
2. **Edit existing case**: Modify description, verify save/cancel
3. **Character limit**: Type 10,000+ characters, verify error
4. **Keyboard shortcuts**: Test Cmd/Ctrl+B, I, U, K, S
5. **Lists**: Create nested lists, indent/outdent
6. **Links**: Add links, edit links, remove links
7. **Paste**: Paste from Word, Google Docs, web pages
8. **Mobile**: Test on mobile device or emulator

## Phase 8: Documentation

### 8.1 Update README

Add section about rich text editing:

- Feature overview
- Supported formatting
- Character limit
- Keyboard shortcuts

### 8.2 Code Comments

Ensure complex logic is documented:

- Plugin functions
- Paste handler
- Character count algorithm
- Validation logic

## Common Issues

### Issue: Slate TypeScript Errors

**Solution**: Install `@types/slate` and `@types/slate-react`, ensure `slate` module augmentation in types file.

### Issue: Character Count Not Updating

**Solution**: Ensure `onChange` prop is called on every editor change, use debouncing if performance issue.

### Issue: Paste Handler Not Working

**Solution**: Verify `onPaste` handler is registered on `Editable` component, check console for errors.

### Issue: Toolbar Buttons Not Working

**Solution**: Ensure Slate editor context is available via `useSlate()` hook, check button event handlers.

### Issue: Tests Failing

**Solution**: Mock Slate editor in tests, use `@testing-library/user-event` for interactions, ensure proper async handling.

## Next Steps

After implementation:

1. Run `/speckit.tasks` to generate detailed task breakdown
2. Follow TDD approach per constitution
3. Create PR with reference to `specs/003-rich-text-description/`
4. Request code review
5. Merge after approval

## Resources

- [Slate.js Documentation](https://docs.slatejs.org/)
- [Figma Design](https://figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj?node-id=14-1638)
- [Specification](./spec.md)
- [Implementation Plan](./plan.md)
- [Research Document](./research.md)
- [Data Model](./data-model.md)
- [Contracts](./contracts/)
