# Data Model: Rich Text Case Description

**Feature**: 003-rich-text-description  
**Date**: 2025-12-30  
**Phase**: 1 - Design & Contracts

## Overview

This document defines the data entities and their relationships for the rich text case description feature. The rich text content follows Slate.js's document model, which represents a tree structure of nodes with text leaves.

---

## Entity: Case (Updated)

The existing Case entity will continue to store the description field as a String, but the content will now be a JSON-stringified Slate.js document structure.

### Prisma Schema (No Changes Required)

```prisma
model Case {
  id           String     @id @default(uuid())
  caseNumber   String     @unique
  title        String
  description  String     // Stores JSON stringified rich text
  customerName String
  status       CaseStatus @default(TO_DO)
  createdBy    String
  assignedTo   String?
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt

  creator  User      @relation("CreatedBy", fields: [createdBy], references: [id])
  assignee User?     @relation("AssignedTo", fields: [assignedTo], references: [id])
  comments Comment[]
}
```

**Field Changes**:

- `description`: No type change (remains String), but content semantics change from plain text to JSON string
- **Migration**: Not required - existing plain text descriptions will be read as-is (treated as single paragraph)
- **Validation**: Enforced by Zod schema on mutation input

**Storage Format**:

```typescript
// Before (plain text):
'Customer reports login issue with error message';

// After (JSON string of Slate document):
"[{\"type\":\"paragraph\",\"children\":[{\"text\":\"Customer reports \",\"bold\":false},{\"text\":\"login issue\",\"bold\":true},{\"text\":\" with error message\",\"bold\":false}]}]";
```

---

## Entity: RichTextContent (New Type)

Represents the structured format of rich text content following Slate.js conventions.

### TypeScript Definition (Shared)

Location: `packages/shared/src/richText.ts`

```typescript
// Base types
export type BaseElement = {
  children: Descendant[];
};

export type Descendant = Element | Text;

// Text leaf node with formatting marks
export type FormattedText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean; // Optional: P4 priority
  code?: boolean; // Optional: P4 priority
};

export type Text = FormattedText;

// Element nodes
export type ParagraphElement = BaseElement & {
  type: 'paragraph';
};

export type HeadingElement = BaseElement & {
  type: 'heading-two';
};

export type BulletedListElement = BaseElement & {
  type: 'bulleted-list';
};

export type NumberedListElement = BaseElement & {
  type: 'numbered-list';
};

export type ListItemElement = BaseElement & {
  type: 'list-item';
};

export type LinkElement = BaseElement & {
  type: 'link';
  url: string;
};

export type CodeBlockElement = BaseElement & {
  type: 'code-block'; // Optional: P4 priority
};

export type Element =
  | ParagraphElement
  | HeadingElement
  | BulletedListElement
  | NumberedListElement
  | ListItemElement
  | LinkElement
  | CodeBlockElement;

// Root document type
export type RichTextDocument = Descendant[];
```

### Validation Rules

Enforced by Zod schema in `packages/server/src/router.ts`:

```typescript
import { z } from 'zod';

const textSchema = z.object({
  text: z.string(),
  bold: z.boolean().optional(),
  italic: z.boolean().optional(),
  underline: z.boolean().optional(),
  strikethrough: z.boolean().optional(),
  code: z.boolean().optional(),
});

const baseElementSchema = z.object({
  children: z.array(z.lazy(() => descendantSchema)),
});

const paragraphSchema = baseElementSchema.extend({
  type: z.literal('paragraph'),
});

const headingSchema = baseElementSchema.extend({
  type: z.literal('heading-two'),
});

const bulletedListSchema = baseElementSchema.extend({
  type: z.literal('bulleted-list'),
});

const numberedListSchema = baseElementSchema.extend({
  type: z.literal('numbered-list'),
});

const listItemSchema = baseElementSchema.extend({
  type: z.literal('list-item'),
});

const linkSchema = baseElementSchema.extend({
  type: z.literal('link'),
  url: z.string().url(),
});

const codeBlockSchema = baseElementSchema.extend({
  type: z.literal('code-block'),
});

const elementSchema = z.union([
  paragraphSchema,
  headingSchema,
  bulletedListSchema,
  numberedListSchema,
  listItemSchema,
  linkSchema,
  codeBlockSchema,
]);

const descendantSchema: z.ZodType<Descendant> = z.union([elementSchema, textSchema]);

export const richTextDocumentSchema = z.array(descendantSchema);
```

### Character Limit Validation

```typescript
import { type RichTextDocument } from '@carton/shared/richText';

function serializeToPlainText(nodes: RichTextDocument): string {
  return nodes.map((node) => Node.string(node)).join('\n');
}

function validateCharacterCount(nodes: RichTextDocument): boolean {
  const plainText = serializeToPlainText(nodes);
  return plainText.length <= 10000;
}
```

---

## Data Flow

### Save Flow

```
User edits in RichTextEditor
  ↓
Slate.js maintains document state (RichTextDocument)
  ↓
User clicks Save button
  ↓
Client: Validate character count (< 10,000)
  ↓
Client: JSON.stringify(slateDocument)
  ↓
tRPC mutation: case.update({ id, description: jsonString })
  ↓
Server: Zod validation (structure + character count)
  ↓
Server: Prisma update (stores JSON string in description field)
  ↓
Server: Return updated case
  ↓
Client: Invalidate queries, update UI
```

### Load Flow

```
User navigates to case details page
  ↓
Client: tRPC query case.getById({ id })
  ↓
Server: Prisma findUnique (returns case with description string)
  ↓
Client: Receive description (JSON string or plain text)
  ↓
Client: Try JSON.parse(description)
  ├─ Success: Use parsed Slate document
  └─ Fail: Convert plain text to Slate paragraph
  ↓
RichTextEditor or RichTextRenderer displays content
```

---

## Example Documents

### Empty Document

```typescript
const emptyDocument: RichTextDocument = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];
```

### Simple Formatted Text

```typescript
const formattedDocument: RichTextDocument = [
  {
    type: 'paragraph',
    children: [
      { text: 'Customer reports ' },
      { text: 'login issue', bold: true },
      { text: ' with ' },
      { text: 'error message', italic: true, underline: true },
      { text: '.' },
    ],
  },
];
```

### Document with Lists and Heading

```typescript
const complexDocument: RichTextDocument = [
  {
    type: 'heading-two',
    children: [{ text: 'Issue Summary' }],
  },
  {
    type: 'paragraph',
    children: [
      { text: 'Customer cannot ' },
      { text: 'log in', bold: true },
      { text: ' to their account.' },
    ],
  },
  {
    type: 'heading-two',
    children: [{ text: 'Steps Taken' }],
  },
  {
    type: 'numbered-list',
    children: [
      {
        type: 'list-item',
        children: [{ text: 'Verified account is active' }],
      },
      {
        type: 'list-item',
        children: [{ text: 'Tested password reset' }],
      },
      {
        type: 'list-item',
        children: [{ text: 'Checked server logs' }],
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      { text: 'See ' },
      {
        type: 'link',
        url: 'https://docs.example.com/troubleshooting',
        children: [{ text: 'troubleshooting guide' }],
      },
      { text: ' for more details.' },
    ],
  },
];
```

### Document with Code Block (Optional)

```typescript
const documentWithCode: RichTextDocument = [
  {
    type: 'paragraph',
    children: [{ text: 'Error message from logs:' }],
  },
  {
    type: 'code-block',
    children: [{ text: 'Error: Invalid credentials\nStatus: 401 Unauthorized' }],
  },
];
```

---

## Relationships

**Case ← RichTextContent**

- One-to-one relationship
- Case.description field contains serialized RichTextContent
- No separate database table for RichTextContent (embedded as JSON)

**User → Case (via comments)**

- Not affected by this feature
- Comments remain plain text (separate enhancement possible in future)

---

## Validation Summary

| Validation         | Layer           | Rule                                                     |
| ------------------ | --------------- | -------------------------------------------------------- |
| Character count    | Client + Server | Plain text length ≤ 10,000                               |
| Empty content      | Client + Server | Must have at least one non-empty text node               |
| Document structure | Server          | Must match Zod schema (valid node types)                 |
| Link URLs          | Server          | Must be valid URLs                                       |
| Nested structure   | Server          | Lists contain list-items, list-items contain text/inline |
| Text marks         | Server          | Only supported marks (bold, italic, etc.)                |

---

## Migration Strategy

**No migration required** - The database schema doesn't change. Existing plain text descriptions will:

1. Be read as-is when loaded
2. Be converted to Slate format (single paragraph) on first edit
3. Be saved as JSON string on save

Backward compatibility maintained:

- Old clients reading new data: See JSON string (degraded but not broken)
- New clients reading old data: Convert plain text to rich text seamlessly

---

## Performance Considerations

**Storage Size**:

- Plain text: ~100 bytes for typical description
- Rich text JSON: ~150-200 bytes for same content (50-100% overhead)
- Max size: ~15-20 KB for 10,000 character limit (acceptable for SQLite String field)

**Query Performance**:

- No impact on query performance (no schema changes)
- JSON string stored as regular text
- SQLite JSON functions NOT used (client-side parsing)

**Parse Performance**:

- JSON.parse() is fast (<1ms for typical documents)
- Occurs client-side only (no server-side parsing)
- Cached after initial load (React state)

---

## Next Steps

With the data model defined, proceed to create API contracts in the `contracts/` directory:

1. `rich-text-types.md` - Type definitions and examples
2. `case-update-mutation.md` - tRPC mutation contract
3. `rich-text-editor-component.md` - Component API contract
