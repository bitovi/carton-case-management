import { describe, it, expect, vi } from 'vitest';
import { appRouter } from './router.js';
import type { Context } from './context.js';
import type { RichTextDocument } from '@carton/shared';

describe('appRouter', () => {
  it('health check returns ok status', async () => {
    const mockContext: Context = {
      prisma: {} as any,
    } as Context;

    const caller = appRouter.createCaller(mockContext);
    const result = await caller.health();

    expect(result.status).toBe('ok');
    expect(result.timestamp).toBeDefined();
    expect(typeof result.timestamp).toBe('string');
  });

  describe('case.update with rich text validation', () => {
    it('should accept valid rich text description', async () => {
      const validDocument: RichTextDocument = [
        {
          type: 'paragraph',
          children: [{ text: 'This is ' }, { text: 'bold', bold: true }, { text: ' text.' }],
        },
      ];

      const mockUpdate = vi.fn().mockResolvedValue({
        id: 'test-id',
        description: JSON.stringify(validDocument),
      });

      const mockContext: Context = {
        prisma: {
          case: {
            update: mockUpdate,
          },
        } as any,
      } as Context;

      const caller = appRouter.createCaller(mockContext);
      const result = await caller.case.update({
        id: 'test-id',
        description: JSON.stringify(validDocument),
      });

      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: 'test-id' },
        data: { description: JSON.stringify(validDocument) },
      });
      expect(result).toBeDefined();
    });

    it('should reject description exceeding 10,000 character limit', async () => {
      const longText = 'a'.repeat(10001);
      const longDocument: RichTextDocument = [
        { type: 'paragraph', children: [{ text: longText }] },
      ];

      const mockContext: Context = {
        prisma: {
          case: {
            update: vi.fn(),
          },
        } as any,
      } as Context;

      const caller = appRouter.createCaller(mockContext);

      await expect(
        caller.case.update({
          id: 'test-id',
          description: JSON.stringify(longDocument),
        })
      ).rejects.toThrow(/exceeds 10,000 character limit/);
    });

    it('should reject empty description', async () => {
      const emptyDocument: RichTextDocument = [{ type: 'paragraph', children: [{ text: '' }] }];

      const mockContext: Context = {
        prisma: {
          case: {
            update: vi.fn(),
          },
        } as any,
      } as Context;

      const caller = appRouter.createCaller(mockContext);

      await expect(
        caller.case.update({
          id: 'test-id',
          description: JSON.stringify(emptyDocument),
        })
      ).rejects.toThrow(/cannot be empty/);
    });

    it('should reject invalid JSON', async () => {
      const mockContext: Context = {
        prisma: {
          case: {
            update: vi.fn(),
          },
        } as any,
      } as Context;

      const caller = appRouter.createCaller(mockContext);

      await expect(
        caller.case.update({
          id: 'test-id',
          description: 'not valid json{',
        })
      ).rejects.toThrow(/Invalid rich text format/);
    });

    it('should reject malformed rich text structure', async () => {
      const malformedDocument = [{ type: 'invalid-type', children: [{ text: 'test' }] }];

      const mockContext: Context = {
        prisma: {
          case: {
            update: vi.fn(),
          },
        } as any,
      } as Context;

      const caller = appRouter.createCaller(mockContext);

      await expect(
        caller.case.update({
          id: 'test-id',
          description: JSON.stringify(malformedDocument),
        })
      ).rejects.toThrow(/Invalid rich text format/);
    });

    it('should accept document at exactly 10,000 characters', async () => {
      const text = 'a'.repeat(10000);
      const maxDocument: RichTextDocument = [{ type: 'paragraph', children: [{ text }] }];

      const mockUpdate = vi.fn().mockResolvedValue({
        id: 'test-id',
        description: JSON.stringify(maxDocument),
      });

      const mockContext: Context = {
        prisma: {
          case: {
            update: mockUpdate,
          },
        } as any,
      } as Context;

      const caller = appRouter.createCaller(mockContext);
      const result = await caller.case.update({
        id: 'test-id',
        description: JSON.stringify(maxDocument),
      });

      expect(mockUpdate).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should accept description with lists and links', async () => {
      const complexDocument: RichTextDocument = [
        { type: 'heading-two', children: [{ text: 'Title' }] },
        {
          type: 'bulleted-list',
          children: [
            { type: 'list-item', children: [{ text: 'Item 1' }] },
            { type: 'list-item', children: [{ text: 'Item 2' }] },
          ],
        },
        {
          type: 'paragraph',
          children: [
            { text: 'Visit ' },
            {
              type: 'link',
              url: 'https://example.com',
              children: [{ text: 'our site' }],
            },
          ],
        },
      ];

      const mockUpdate = vi.fn().mockResolvedValue({
        id: 'test-id',
        description: JSON.stringify(complexDocument),
      });

      const mockContext: Context = {
        prisma: {
          case: {
            update: mockUpdate,
          },
        } as any,
      } as Context;

      const caller = appRouter.createCaller(mockContext);
      const result = await caller.case.update({
        id: 'test-id',
        description: JSON.stringify(complexDocument),
      });

      expect(mockUpdate).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should not validate when description is not provided', async () => {
      const mockUpdate = vi.fn().mockResolvedValue({
        id: 'test-id',
        status: 'IN_PROGRESS',
      });

      const mockContext: Context = {
        prisma: {
          case: {
            update: mockUpdate,
          },
        } as any,
      } as Context;

      const caller = appRouter.createCaller(mockContext);
      const result = await caller.case.update({
        id: 'test-id',
        status: 'IN_PROGRESS',
      });

      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: 'test-id' },
        data: { status: 'IN_PROGRESS' },
      });
      expect(result).toBeDefined();
    });
  });
});
