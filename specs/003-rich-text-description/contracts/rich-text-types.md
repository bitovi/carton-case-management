# Contract: Rich Text Types

**Location**: `packages/shared/src/richText.ts`  
**Purpose**: Shared TypeScript types for rich text content structure  
**Consumers**: Client (RichTextEditor, RichTextRenderer), Server (validation)

## Type Definitions

### Core Types

```typescript
/**
 * Base element type with children
 */
export type BaseElement = {
  children: Descendant[];
};

/**
 * Union type for all node types (elements and text)
 */
export type Descendant = Element | Text;

/**
 * Text leaf node with optional formatting marks
 */
export type FormattedText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean; // Optional: Lower priority
  code?: boolean; // Optional: Lower priority
};

export type Text = FormattedText;
```

### Element Types

```typescript
/**
 * Paragraph element - basic block container
 */
export type ParagraphElement = BaseElement & {
  type: 'paragraph';
};

/**
 * Heading level 2 element
 */
export type HeadingElement = BaseElement & {
  type: 'heading-two';
};

/**
 * Unordered (bulleted) list container
 */
export type BulletedListElement = BaseElement & {
  type: 'bulleted-list';
};

/**
 * Ordered (numbered) list container
 */
export type NumberedListElement = BaseElement & {
  type: 'numbered-list';
};

/**
 * List item - child of list elements
 */
export type ListItemElement = BaseElement & {
  type: 'list-item';
};

/**
 * Hyperlink element with URL
 */
export type LinkElement = BaseElement & {
  type: 'link';
  url: string;
};

/**
 * Code block element (optional feature)
 */
export type CodeBlockElement = BaseElement & {
  type: 'code-block';
};

/**
 * Union of all element types
 */
export type Element =
  | ParagraphElement
  | HeadingElement
  | BulletedListElement
  | NumberedListElement
  | ListItemElement
  | LinkElement
  | CodeBlockElement;
```

### Document Type

```typescript
/**
 * Root document type - array of top-level nodes
 */
export type RichTextDocument = Descendant[];
```

### Utility Types

```typescript
/**
 * Type guard to check if node is an Element
 */
export function isElement(node: Descendant): node is Element {
  return 'type' in node && 'children' in node;
}

/**
 * Type guard to check if node is Text
 */
export function isText(node: Descendant): node is Text {
  return 'text' in node;
}

/**
 * Type guard for specific element types
 */
export function isParagraph(element: Element): element is ParagraphElement {
  return element.type === 'paragraph';
}

export function isHeading(element: Element): element is HeadingElement {
  return element.type === 'heading-two';
}

export function isList(element: Element): element is BulletedListElement | NumberedListElement {
  return element.type === 'bulleted-list' || element.type === 'numbered-list';
}

export function isLink(element: Element): element is LinkElement {
  return element.type === 'link';
}
```

## Example Documents

### Minimal Document

```typescript
const minimal: RichTextDocument = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];
```

### Formatted Text

```typescript
const formatted: RichTextDocument = [
  {
    type: 'paragraph',
    children: [
      { text: 'This is ' },
      { text: 'bold', bold: true },
      { text: ' and ' },
      { text: 'italic', italic: true },
      { text: ' text.' },
    ],
  },
];
```

### Lists

```typescript
const withLists: RichTextDocument = [
  {
    type: 'paragraph',
    children: [{ text: 'Shopping list:' }],
  },
  {
    type: 'bulleted-list',
    children: [
      { type: 'list-item', children: [{ text: 'Apples' }] },
      { type: 'list-item', children: [{ text: 'Bananas' }] },
      { type: 'list-item', children: [{ text: 'Oranges' }] },
    ],
  },
  {
    type: 'paragraph',
    children: [{ text: 'Steps:' }],
  },
  {
    type: 'numbered-list',
    children: [
      { type: 'list-item', children: [{ text: 'Go to store' }] },
      { type: 'list-item', children: [{ text: 'Buy items' }] },
      { type: 'list-item', children: [{ text: 'Return home' }] },
    ],
  },
];
```

### Links

```typescript
const withLinks: RichTextDocument = [
  {
    type: 'paragraph',
    children: [
      { text: 'Visit our ' },
      {
        type: 'link',
        url: 'https://example.com/docs',
        children: [{ text: 'documentation' }],
      },
      { text: ' for more info.' },
    ],
  },
];
```

### Headings

```typescript
const withHeadings: RichTextDocument = [
  {
    type: 'heading-two',
    children: [{ text: 'Problem Description' }],
  },
  {
    type: 'paragraph',
    children: [{ text: 'Customer reported the following issue...' }],
  },
  {
    type: 'heading-two',
    children: [{ text: 'Resolution Steps' }],
  },
  {
    type: 'numbered-list',
    children: [
      { type: 'list-item', children: [{ text: 'Step 1' }] },
      { type: 'list-item', children: [{ text: 'Step 2' }] },
    ],
  },
];
```

## Validation Rules

### Structure Rules

1. **Document must be an array** of Descendant nodes
2. **Top-level nodes** can only be: paragraph, heading, list, code-block
3. **List children** must be list-item elements only
4. **List-item children** can contain text or inline elements (links)
5. **Text nodes** cannot have children
6. **Element nodes** must have children array

### Text Mark Rules

1. **Supported marks**: bold, italic, underline, strikethrough (optional), code (optional)
2. **Mark values** must be boolean or undefined
3. **Multiple marks** can be applied to same text node
4. **Empty text** is allowed (represents cursor position)

### Link Rules

1. **URL field** is required and must be valid URL string
2. **Link children** should be text nodes (no nested elements)
3. **Link text** should be non-empty for accessibility

### Character Count

1. **Count method**: Serialize to plain text, measure length
2. **Maximum**: 10,000 characters
3. **Counting rules**:
   - Text content only (no markup)
   - Newlines between blocks count as 1 character
   - Links count as display text (not URL)
   - List markers don't count

## Type Safety

These types ensure:

- ✅ Compile-time type checking in TypeScript
- ✅ Editor autocomplete for all node types
- ✅ Type guards for safe node manipulation
- ✅ Shared contract between client and server
- ✅ Slate.js compatibility (extends Slate base types)

## Breaking Changes

Changes to these types are **BREAKING CHANGES** and require:

1. Major version bump
2. Migration plan for existing data
3. Backward compatibility strategy
4. Update to Zod validation schemas

## Usage Examples

### Client (Editor)

```typescript
import { type RichTextDocument, type Element } from '@carton/shared/richText';
import { createEditor, Descendant } from 'slate';

const [value, setValue] = useState<RichTextDocument>([
  { type: 'paragraph', children: [{ text: '' }] },
]);

const editor = createEditor();
```

### Server (Validation)

```typescript
import { type RichTextDocument } from '@carton/shared/richText';
import { richTextDocumentSchema } from './validation';

const document = JSON.parse(descriptionString) as RichTextDocument;
const isValid = richTextDocumentSchema.safeParse(document);
```

### Serialization

```typescript
import { type RichTextDocument } from '@carton/shared/richText';

// To JSON string (for storage)
const jsonString = JSON.stringify(document);

// From JSON string (for loading)
const document: RichTextDocument = JSON.parse(jsonString);
```
