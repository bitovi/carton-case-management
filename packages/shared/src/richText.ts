import { z } from 'zod';
import { Node } from 'slate';

/**
 * Base element type with children
 */
export type BaseElement = {
  children: Descendant[];
};

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

/**
 * Paragraph element - basic block container
 */
export type ParagraphElement = BaseElement & {
  type: 'paragraph';
};

/**
 * Heading level 1 element
 */
export type HeadingOneElement = BaseElement & {
  type: 'heading-one';
};

/**
 * Heading level 2 element
 */
export type HeadingTwoElement = BaseElement & {
  type: 'heading-two';
};

/**
 * Heading level 3 element
 */
export type HeadingThreeElement = BaseElement & {
  type: 'heading-three';
};

/**
 * Heading level 4 element
 */
export type HeadingFourElement = BaseElement & {
  type: 'heading-four';
};

/**
 * Heading level 5 element
 */
export type HeadingFiveElement = BaseElement & {
  type: 'heading-five';
};

/**
 * Heading level 6 element
 */
export type HeadingSixElement = BaseElement & {
  type: 'heading-six';
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
  | HeadingOneElement
  | HeadingTwoElement
  | HeadingThreeElement
  | HeadingFourElement
  | HeadingFiveElement
  | HeadingSixElement
  | BulletedListElement
  | NumberedListElement
  | ListItemElement
  | CodeBlockElement;

/**
 * Union type for all node types (elements and text)
 */
export type Descendant = Element | Text;

/**
 * Root document type - array of top-level nodes
 */
export type RichTextDocument = Descendant[];

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

export function isHeading(
  element: Element
): element is
  | HeadingOneElement
  | HeadingTwoElement
  | HeadingThreeElement
  | HeadingFourElement
  | HeadingFiveElement
  | HeadingSixElement {
  return (
    element.type === 'heading-one' ||
    element.type === 'heading-two' ||
    element.type === 'heading-three' ||
    element.type === 'heading-four' ||
    element.type === 'heading-five' ||
    element.type === 'heading-six'
  );
}

export function isList(element: Element): element is BulletedListElement | NumberedListElement {
  return element.type === 'bulleted-list' || element.type === 'numbered-list';
}

// Zod Validation Schemas

export const textSchema = z.object({
  text: z.string(),
  bold: z.boolean().optional(),
  italic: z.boolean().optional(),
  underline: z.boolean().optional(),
  strikethrough: z.boolean().optional(),
  code: z.boolean().optional(),
});

// Define descendant schema type first to allow forward reference
type DescendantSchema = z.ZodType<Descendant>;

// Declare base element schema with lazy children to avoid circular dependency
const baseElementSchema = z.object({
  children: z.array(z.lazy(() => descendantSchema)),
});

export const paragraphSchema = baseElementSchema.extend({
  type: z.literal('paragraph'),
});

export const headingOneSchema = baseElementSchema.extend({
  type: z.literal('heading-one'),
});

export const headingTwoSchema = baseElementSchema.extend({
  type: z.literal('heading-two'),
});

export const headingThreeSchema = baseElementSchema.extend({
  type: z.literal('heading-three'),
});

export const headingFourSchema = baseElementSchema.extend({
  type: z.literal('heading-four'),
});

export const headingFiveSchema = baseElementSchema.extend({
  type: z.literal('heading-five'),
});

export const headingSixSchema = baseElementSchema.extend({
  type: z.literal('heading-six'),
});

export const bulletedListSchema = baseElementSchema.extend({
  type: z.literal('bulleted-list'),
});

export const numberedListSchema = baseElementSchema.extend({
  type: z.literal('numbered-list'),
});

export const listItemSchema = baseElementSchema.extend({
  type: z.literal('list-item'),
});

export const codeBlockSchema = baseElementSchema.extend({
  type: z.literal('code-block'),
});

// Create lazy descendant schema for recursive validation
const descendantSchema: DescendantSchema = z.lazy(() =>
  z.union([
    textSchema,
    paragraphSchema,
    headingOneSchema,
    headingTwoSchema,
    headingThreeSchema,
    headingFourSchema,
    headingFiveSchema,
    headingSixSchema,
    bulletedListSchema,
    numberedListSchema,
    listItemSchema,
    codeBlockSchema,
    // linkSchema, (removed)
  ])
);

// Union schema for all heading types
export const headingSchema = z.union([
  headingOneSchema,
  headingTwoSchema,
  headingThreeSchema,
  headingFourSchema,
  headingFiveSchema,
  headingSixSchema,
]);

export const elementSchema = z.union([
  paragraphSchema,
  headingOneSchema,
  headingTwoSchema,
  headingThreeSchema,
  headingFourSchema,
  headingFiveSchema,
  headingSixSchema,
  bulletedListSchema,
  numberedListSchema,
  listItemSchema,
  codeBlockSchema,
]);

export { descendantSchema };

export const richTextDocumentSchema = z.array(descendantSchema);

/**
 * Serialize rich text document to plain text for character counting
 * @param document - The rich text document
 * @returns Plain text representation
 */
export function serializeToPlainText(document: RichTextDocument): string {
  function serializeNode(node: Descendant): string {
    if (isText(node)) {
      return node.text;
    }
    if (node.type === 'bulleted-list' || node.type === 'numbered-list') {
      // Join list items with newlines
      return node.children.map(serializeNode).join('\n');
    }
    if (node.type === 'list-item') {
      // List item: join its children as plain text
      return node.children.map(serializeNode).join('');
    }
    if (node.type === 'paragraph' || node.type.startsWith('heading')) {
      // Paragraphs and headings: join children as plain text
      return node.children.map(serializeNode).join('');
    }
    // if (node.type === 'link') { ... } (removed)
    // Fallback for other elements
    if ('children' in node) {
      return node.children.map(serializeNode).join('');
    }
    return '';
  }
  return document.map(serializeNode).join('\n');
}

/**
 * Validate character count is within limit
 * @param document - The rich text document
 * @param maxLength - Maximum allowed characters (default: 10000)
 * @returns True if within limit
 */
export function validateCharacterCount(
  document: RichTextDocument,
  maxLength: number = 10000
): boolean {
  const plainText = serializeToPlainText(document);
  return plainText.length <= maxLength;
}

/**
 * Get character count from rich text document
 * @param document - The rich text document
 * @returns Number of characters
 */
export function getCharacterCount(document: RichTextDocument): number {
  const plainText = serializeToPlainText(document);
  return plainText.length;
}
