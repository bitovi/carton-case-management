import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { appRouter } from './router.js';
import type { Context } from './context.js';
import { PrismaClient } from '@prisma/client';
import { CaseStatus } from '@carton/shared/types';

// Create a test Prisma client
const prisma = new PrismaClient();

// Sample test data
const testUser = {
  email: 'test@example.com',
  name: 'Test User',
};

const testCase = {
  title: '#TEST-001',
  description: 'Test case description',
  status: CaseStatus.OPEN,
  caseType: 'Test Type',
  customerName: 'Test Customer',
};

let createdUserId: string;
let createdCaseId: string;

describe('appRouter', () => {
  beforeAll(async () => {
    // Create test user
    const user = await prisma.user.create({ data: testUser });
    createdUserId = user.id;

    // Create test case
    const caseData = await prisma.case.create({
      data: {
        ...testCase,
        createdBy: createdUserId,
      },
    });
    createdCaseId = caseData.id;
  });

  afterAll(async () => {
    // Clean up test data
    if (createdCaseId) {
      await prisma.case.delete({ where: { id: createdCaseId } }).catch(() => {});
    }
    if (createdUserId) {
      await prisma.user.delete({ where: { id: createdUserId } }).catch(() => {});
    }
    await prisma.$disconnect();
  });

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

  describe('cases router', () => {
    const createContext = (): Context => ({
      prisma,
    });

    describe('cases.list', () => {
      it('should return a list of cases', async () => {
        const caller = appRouter.createCaller(createContext());
        const result = await caller.cases.list();

        expect(result).toHaveProperty('cases');
        expect(result).toHaveProperty('total');
        expect(Array.isArray(result.cases)).toBe(true);
        expect(typeof result.total).toBe('number');
        expect(result.cases.length).toBeGreaterThan(0);
      });

      it('should filter cases by status', async () => {
        const caller = appRouter.createCaller(createContext());
        const result = await caller.cases.list({ status: CaseStatus.OPEN });

        expect(result.cases.every((c) => c.status === CaseStatus.OPEN)).toBe(true);
      });

      it('should respect limit parameter', async () => {
        const caller = appRouter.createCaller(createContext());
        const result = await caller.cases.list({ limit: 2 });

        expect(result.cases.length).toBeLessThanOrEqual(2);
      });

      it('should return case fields as specified in contract', async () => {
        const caller = appRouter.createCaller(createContext());
        const result = await caller.cases.list({ limit: 1 });

        if (result.cases.length > 0) {
          const caseItem = result.cases[0];
          expect(caseItem).toHaveProperty('id');
          expect(caseItem).toHaveProperty('title');
          expect(caseItem).toHaveProperty('caseType');
          expect(caseItem).toHaveProperty('status');
          expect(caseItem).toHaveProperty('customerName');
          expect(caseItem).toHaveProperty('updatedAt');
        }
      });
    });

    describe('cases.getById', () => {
      it('should return full case details with includes', async () => {
        const caller = appRouter.createCaller(createContext());
        const result = await caller.cases.getById({ id: createdCaseId });

        expect(result).toHaveProperty('id', createdCaseId);
        expect(result).toHaveProperty('title');
        expect(result).toHaveProperty('description');
        expect(result).toHaveProperty('status');
        expect(result).toHaveProperty('caseType');
        expect(result).toHaveProperty('customerName');
        expect(result).toHaveProperty('creator');
        expect(result).toHaveProperty('comments');
        expect(Array.isArray(result.comments)).toBe(true);
      });

      it('should include creator details', async () => {
        const caller = appRouter.createCaller(createContext());
        const result = await caller.cases.getById({ id: createdCaseId });

        expect(result.creator).toHaveProperty('id');
        expect(result.creator).toHaveProperty('name');
        expect(result.creator).toHaveProperty('email');
      });

      it('should throw NOT_FOUND for invalid case ID', async () => {
        const caller = appRouter.createCaller(createContext());
        const invalidId = '00000000-0000-0000-0000-000000000000';

        await expect(caller.cases.getById({ id: invalidId })).rejects.toThrow('not found');
      });
    });

    describe('cases.addComment', () => {
      it('should add a comment to a case', async () => {
        const caller = appRouter.createCaller(createContext());
        const content = 'Test comment content';

        const result = await caller.cases.addComment({
          caseId: createdCaseId,
          content,
        });

        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('content', content);
        expect(result).toHaveProperty('caseId', createdCaseId);
        expect(result).toHaveProperty('author');
        expect(result.author).toHaveProperty('id');
        expect(result.author).toHaveProperty('name');
        expect(result.author).toHaveProperty('email');

        // Clean up comment
        await prisma.comment.delete({ where: { id: result.id } });
      });

      it('should throw NOT_FOUND for invalid case ID', async () => {
        const caller = appRouter.createCaller(createContext());
        const invalidId = '00000000-0000-0000-0000-000000000000';

        await expect(
          caller.cases.addComment({
            caseId: invalidId,
            content: 'Test comment',
          })
        ).rejects.toThrow('not found');
      });

      it('should reject empty comment content', async () => {
        const caller = appRouter.createCaller(createContext());

        await expect(
          caller.cases.addComment({
            caseId: createdCaseId,
            content: '',
          })
        ).rejects.toThrow();
      });
    });
  });
});
