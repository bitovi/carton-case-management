import { describe, it, expect } from 'vitest';
import {
  serializeToPlainText,
  validateCharacterCount,
  getCharacterCount,
  richTextDocumentSchema,
  textSchema,
  paragraphSchema,
  headingSchema,
  bulletedListSchema,
  numberedListSchema,
  type RichTextDocument,
} from './richText';

describe('richText utilities', () => {
  describe('serializeToPlainText', () => {
    it('should serialize empty paragraph to empty string', () => {
      const document: RichTextDocument = [{ type: 'paragraph', children: [{ text: '' }] }];
      expect(serializeToPlainText(document)).toBe('');
    });

    it('should serialize plain text without formatting', () => {
      const document: RichTextDocument = [
        { type: 'paragraph', children: [{ text: 'Hello world' }] },
      ];
      expect(serializeToPlainText(document)).toBe('Hello world');
    });

    it('should serialize formatted text ignoring marks', () => {
      const document: RichTextDocument = [
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
      expect(serializeToPlainText(document)).toBe('This is bold and italic text.');
    });

    it('should serialize multiple paragraphs with newlines between them', () => {
      const document: RichTextDocument = [
        { type: 'paragraph', children: [{ text: 'First paragraph' }] },
        { type: 'paragraph', children: [{ text: 'Second paragraph' }] },
      ];
      expect(serializeToPlainText(document)).toBe('First paragraph\nSecond paragraph');
    });

    it('should serialize lists extracting text from list items', () => {
      const document: RichTextDocument = [
        {
          type: 'bulleted-list',
          children: [
            { type: 'list-item', children: [{ text: 'Item 1' }] },
            { type: 'list-item', children: [{ text: 'Item 2' }] },
          ],
        },
      ];
      expect(serializeToPlainText(document)).toBe('Item 1\nItem 2');
    });

    it('should serialize nested lists correctly', () => {
      const document: RichTextDocument = [
        {
          type: 'numbered-list',
          children: [
            { type: 'list-item', children: [{ text: 'First' }] },
            {
              type: 'list-item',
              children: [{ text: 'Second' }],
            },
          ],
        },
      ];
      expect(serializeToPlainText(document)).toContain('First');
      expect(serializeToPlainText(document)).toContain('Second');
    });

    it('should serialize links using display text not URL', () => {
      const document = [
        {
          type: 'paragraph',
          children: [
            { text: 'Visit ' },
            {
              type: 'link',
              url: 'https://example.com/very/long/url',
              children: [{ text: 'docs' }],
            },
          ],
        },
      ] as RichTextDocument;
      const result = serializeToPlainText(document);
      expect(result).toContain('docs');
      expect(result).not.toContain('https://example.com');
    });

    it('should serialize headings like regular text', () => {
      const document: RichTextDocument = [
        { type: 'heading-two', children: [{ text: 'Title' }] },
        { type: 'paragraph', children: [{ text: 'Content' }] },
      ];
      expect(serializeToPlainText(document)).toBe('Title\nContent');
    });
  });

  describe('getCharacterCount', () => {
    it('should return 0 for empty document', () => {
      const document: RichTextDocument = [{ type: 'paragraph', children: [{ text: '' }] }];
      expect(getCharacterCount(document)).toBe(0);
    });

    it('should count characters in plain text', () => {
      const document: RichTextDocument = [{ type: 'paragraph', children: [{ text: 'Hello' }] }];
      expect(getCharacterCount(document)).toBe(5);
    });

    it('should count formatted text ignoring marks', () => {
      const document: RichTextDocument = [
        {
          type: 'paragraph',
          children: [{ text: 'Bold', bold: true }, { text: 'Normal' }],
        },
      ];
      expect(getCharacterCount(document)).toBe(10); // "BoldNormal"
    });

    it('should count newlines between blocks', () => {
      const document: RichTextDocument = [
        { type: 'paragraph', children: [{ text: 'A' }] },
        { type: 'paragraph', children: [{ text: 'B' }] },
      ];
      expect(getCharacterCount(document)).toBe(3); // "A\nB"
    });

    it('should handle complex nested structure', () => {
      const document: RichTextDocument = [
        { type: 'heading-two', children: [{ text: 'Title' }] },
        {
          type: 'bulleted-list',
          children: [{ type: 'list-item', children: [{ text: 'Item' }] }],
        },
      ];
      expect(getCharacterCount(document)).toBeGreaterThan(0);
    });
  });

  describe('validateCharacterCount', () => {
    it('should return true for empty document', () => {
      const document: RichTextDocument = [{ type: 'paragraph', children: [{ text: '' }] }];
      expect(validateCharacterCount(document)).toBe(true);
    });

    it('should return true for document within limit', () => {
      const document: RichTextDocument = [
        { type: 'paragraph', children: [{ text: 'Short text' }] },
      ];
      expect(validateCharacterCount(document, 10000)).toBe(true);
    });

    it('should return false for document exceeding limit', () => {
      const longText = 'a'.repeat(10001);
      const document: RichTextDocument = [{ type: 'paragraph', children: [{ text: longText }] }];
      expect(validateCharacterCount(document, 10000)).toBe(false);
    });

    it('should return true for document at exact limit', () => {
      const text = 'a'.repeat(10000);
      const document: RichTextDocument = [{ type: 'paragraph', children: [{ text }] }];
      expect(validateCharacterCount(document, 10000)).toBe(true);
    });

    it('should respect custom max length', () => {
      const document: RichTextDocument = [{ type: 'paragraph', children: [{ text: '12345' }] }];
      expect(validateCharacterCount(document, 5)).toBe(true);
      expect(validateCharacterCount(document, 4)).toBe(false);
    });
  });

  describe('Zod schemas', () => {
    describe('textSchema', () => {
      it('should validate plain text', () => {
        const result = textSchema.safeParse({ text: 'Hello' });
        expect(result.success).toBe(true);
      });

      it('should validate text with bold mark', () => {
        const result = textSchema.safeParse({ text: 'Bold', bold: true });
        expect(result.success).toBe(true);
      });

      it('should validate text with multiple marks', () => {
        const result = textSchema.safeParse({
          text: 'Formatted',
          bold: true,
          italic: true,
          underline: true,
        });
        expect(result.success).toBe(true);
      });

      it('should reject text without text field', () => {
        const result = textSchema.safeParse({ bold: true });
        expect(result.success).toBe(false);
      });

      it('should allow optional marks', () => {
        const result = textSchema.safeParse({
          text: 'Test',
          strikethrough: true,
          code: true,
        });
        expect(result.success).toBe(true);
      });
    });

    describe('paragraphSchema', () => {
      it('should validate paragraph with text children', () => {
        const result = paragraphSchema.safeParse({
          type: 'paragraph',
          children: [{ text: 'Content' }],
        });
        expect(result.success).toBe(true);
      });

      it('should reject paragraph without children', () => {
        const result = paragraphSchema.safeParse({ type: 'paragraph' });
        expect(result.success).toBe(false);
      });

      it('should reject wrong type', () => {
        const result = paragraphSchema.safeParse({
          type: 'heading',
          children: [{ text: 'Test' }],
        });
        expect(result.success).toBe(false);
      });
    });

    describe('headingSchema', () => {
      it('should validate heading-two', () => {
        const result = headingSchema.safeParse({
          type: 'heading-two',
          children: [{ text: 'Title' }],
        });
        expect(result.success).toBe(true);
      });
    });

    describe('bulletedListSchema', () => {
      it('should validate bulleted list with list items', () => {
        const result = bulletedListSchema.safeParse({
          type: 'bulleted-list',
          children: [{ type: 'list-item', children: [{ text: 'Item' }] }],
        });
        expect(result.success).toBe(true);
      });
    });

    describe('numberedListSchema', () => {
      it('should validate numbered list', () => {
        const result = numberedListSchema.safeParse({
          type: 'numbered-list',
          children: [{ type: 'list-item', children: [{ text: 'Item' }] }],
        });
        expect(result.success).toBe(true);
      });
    });

    describe('richTextDocumentSchema', () => {
      it('should validate empty document', () => {
        const document = [{ type: 'paragraph', children: [{ text: '' }] }];
        const result = richTextDocumentSchema.safeParse(document);
        expect(result.success).toBe(true);
      });

      it('should validate document with mixed content', () => {
        const document = [
          { type: 'heading-two', children: [{ text: 'Title' }] },
          {
            type: 'paragraph',
            children: [{ text: 'Some ' }, { text: 'bold', bold: true }, { text: ' text.' }],
          },
          {
            type: 'bulleted-list',
            children: [
              { type: 'list-item', children: [{ text: 'Item 1' }] },
              { type: 'list-item', children: [{ text: 'Item 2' }] },
            ],
          },
        ];
        const result = richTextDocumentSchema.safeParse(document);
        expect(result.success).toBe(true);
      });

      it('should reject malformed document', () => {
        const document = [{ type: 'invalid', children: [] }];
        const result = richTextDocumentSchema.safeParse(document);
        expect(result.success).toBe(false);
      });

      it('should reject document without children', () => {
        const document = [{ type: 'paragraph' }];
        const result = richTextDocumentSchema.safeParse(document);
        expect(result.success).toBe(false);
      });
    });
  });
});
