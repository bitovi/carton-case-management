import { describe, it, expect, vi, beforeEach } from 'vitest';
import { appRouter } from './router.js';
import type { Context } from './context.js';
import { TRPCError } from '@trpc/server';
import type { Request, Response } from 'express';

describe('appRouter', () => {
  let mockPrisma: Record<string, Record<string, ReturnType<typeof vi.fn>>>;
  let mockContext: Context;

  beforeEach(() => {
    mockPrisma = {
      user: {
        findUnique: vi.fn(),
        findMany: vi.fn(),
      },
      customer: {
        findMany: vi.fn(),
      },
      case: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
      comment: {
        create: vi.fn(),
      },
    };

    mockContext = {
      req: {} as Request,
      res: {} as Response,
      prisma: mockPrisma,
      userId: undefined,
    } as unknown as Context;
  });

  describe('health', () => {
    it('returns ok status with timestamp', async () => {
      const caller = appRouter.createCaller(mockContext);
      const result = await caller.health();

      expect(result.status).toBe('ok');
      expect(result.timestamp).toBeDefined();
      expect(typeof result.timestamp).toBe('string');
      expect(result.formatted).toBeDefined();
    });
  });

  describe('auth', () => {
    describe('me', () => {
      it('returns user data when authenticated', async () => {
        const mockUser = {
          id: 'user-1',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
        };

        mockContext.userId = 'user-1';
        mockPrisma.user.findUnique.mockResolvedValue(mockUser);

        const caller = appRouter.createCaller(mockContext);
        const result = await caller.auth.me();

        expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
          where: { id: 'user-1' },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        });
        expect(result).toEqual(mockUser);
      });

      it('throws UNAUTHORIZED when not authenticated', async () => {
        mockContext.userId = undefined;

        const caller = appRouter.createCaller(mockContext);

        await expect(caller.auth.me()).rejects.toThrow(TRPCError);
        await expect(caller.auth.me()).rejects.toMatchObject({
          code: 'UNAUTHORIZED',
        });
      });

      it('throws NOT_FOUND when user does not exist', async () => {
        mockContext.userId = 'user-1';
        mockPrisma.user.findUnique.mockResolvedValue(null);

        const caller = appRouter.createCaller(mockContext);

        await expect(caller.auth.me()).rejects.toThrow(TRPCError);
        await expect(caller.auth.me()).rejects.toMatchObject({
          code: 'NOT_FOUND',
        });
      });
    });
  });

  describe('user', () => {
    describe('list', () => {
      it('returns all users', async () => {
        const mockUsers = [
          {
            id: 'user-1',
            email: 'user1@example.com',
            firstName: 'User',
            lastName: 'One',
            username: 'user1',
            dateJoined: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 'user-2',
            email: 'user2@example.com',
            firstName: 'User',
            lastName: 'Two',
            username: 'user2',
            dateJoined: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ];

        mockPrisma.user.findMany.mockResolvedValue(mockUsers);

        const caller = appRouter.createCaller(mockContext);
        const result = await caller.user.list();

        expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            username: true,
            dateJoined: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: {
            lastName: 'asc',
          },
        });
        expect(result).toEqual(mockUsers);
      });
    });

    describe('getById', () => {
      it('returns user by id', async () => {
        const mockUser = {
          id: 'user-1',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          username: 'testuser',
          dateJoined: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          createdCases: [],
        };

        mockPrisma.user.findUnique.mockResolvedValue(mockUser);

        const caller = appRouter.createCaller(mockContext);
        const result = await caller.user.getById({ id: 'user-1' });

        expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
          where: { id: 'user-1' },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            username: true,
            dateJoined: true,
            createdAt: true,
            updatedAt: true,
            createdCases: {
              select: {
                id: true,
                title: true,
                status: true,
                priority: true,
                createdAt: true,
                updatedAt: true,
              },
              orderBy: {
                createdAt: 'desc',
              },
            },
          },
        });
        expect(result).toEqual(mockUser);
      });
    });
  });

  describe('customer', () => {
    describe('list', () => {
      it('returns all customers ordered by lastName', async () => {
        const mockCustomers = [
          {
            id: 'customer-1',
            firstName: 'Customer',
            lastName: 'A',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 'customer-2',
            firstName: 'Customer',
            lastName: 'B',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ];

        mockPrisma.customer.findMany.mockResolvedValue(mockCustomers);

        const caller = appRouter.createCaller(mockContext);
        const result = await caller.customer.list();

        expect(mockPrisma.customer.findMany).toHaveBeenCalledWith({
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            email: true,
            dateJoined: true,
            satisfactionRate: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: {
            lastName: 'asc',
          },
        });
        expect(result).toEqual(mockCustomers);
      });
    });
  });

  describe('case', () => {
    describe('list', () => {
      it('returns all cases without filters', async () => {
        const mockCases = [
          {
            id: 'case-1',
            title: 'Test Case',
            customer: { id: 'customer-1', firstName: 'Customer', lastName: 'A' },
            creator: { id: 'user-1', firstName: 'User', lastName: '1', email: 'user1@example.com' },
            assignee: { id: 'user-1', firstName: 'User', lastName: '1', email: 'user1@example.com' },
          },
        ];

        mockPrisma.case.findMany.mockResolvedValue(mockCases);

        const caller = appRouter.createCaller(mockContext);
        const result = await caller.case.list();

        expect(mockPrisma.case.findMany).toHaveBeenCalledWith({
          where: {},
          include: {
            customer: {
              select: { id: true, firstName: true, lastName: true },
            },
            creator: {
              select: { id: true, firstName: true, lastName: true, email: true },
            },
            assignee: {
              select: { id: true, firstName: true, lastName: true, email: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        });
        expect(result).toEqual(mockCases);
      });

      it('filters cases by status', async () => {
        mockPrisma.case.findMany.mockResolvedValue([]);

        const caller = appRouter.createCaller(mockContext);
        await caller.case.list({ status: 'TO_DO' });

        expect(mockPrisma.case.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            where: { status: 'TO_DO' },
          })
        );
      });

      it('filters cases by assignedTo', async () => {
        mockPrisma.case.findMany.mockResolvedValue([]);

        const caller = appRouter.createCaller(mockContext);
        await caller.case.list({ assignedTo: 'user-1' });

        expect(mockPrisma.case.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            where: { assignedTo: 'user-1' },
          })
        );
      });

      it('filters cases by both status and assignedTo', async () => {
        mockPrisma.case.findMany.mockResolvedValue([]);

        const caller = appRouter.createCaller(mockContext);
        await caller.case.list({ status: 'IN_PROGRESS', assignedTo: 'user-1' });

        expect(mockPrisma.case.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            where: { status: 'IN_PROGRESS', assignedTo: 'user-1' },
          })
        );
      });
    });

    describe('getById', () => {
      it('returns case with comments', async () => {
        const mockCase = {
          id: 'case-1',
          title: 'Test Case',
          customer: { id: 'customer-1', firstName: 'Customer', lastName: 'A' },
          creator: { id: 'user-1', firstName: 'User', lastName: '1', email: 'user1@example.com' },
          assignee: { id: 'user-1', firstName: 'User', lastName: '1', email: 'user1@example.com' },
          comments: [
            {
              id: 'comment-1',
              content: 'Test comment',
              author: { id: 'user-1', firstName: 'User', lastName: 'One', email: 'user1@example.com' },
            },
          ],
        };

        mockPrisma.case.findUnique.mockResolvedValue(mockCase);

        const caller = appRouter.createCaller(mockContext);
        const result = await caller.case.getById({ id: 'case-1' });

        expect(mockPrisma.case.findUnique).toHaveBeenCalledWith({
          where: { id: 'case-1' },
          include: {
            customer: {
              select: { id: true, firstName: true, lastName: true },
            },
            creator: {
              select: { id: true, firstName: true, lastName: true, email: true },
            },
            assignee: {
              select: { id: true, firstName: true, lastName: true, email: true },
            },
            comments: {
              include: {
                author: {
                  select: { id: true, firstName: true, lastName: true, email: true },
                },
              },
              orderBy: { createdAt: 'desc' },
            },
          },
        });
        expect(result).toEqual(mockCase);
      });
    });

    describe('create', () => {
      it('creates a case when authenticated', async () => {
        const input = {
          title: 'New Case',
          description: 'Description',
          customerId: 'customer-1',
          createdBy: 'employee-1',
          priority: 'MEDIUM' as const,
        };

        const mockCreatedCase = {
          id: 'case-1',
          ...input,
        };

        mockContext.userId = 'user-1';
        mockPrisma.case.create.mockResolvedValue(mockCreatedCase);

        const caller = appRouter.createCaller(mockContext);
        const result = await caller.case.create(input);

        expect(mockPrisma.case.create).toHaveBeenCalledWith({
          data: {
            ...input,
          },
        });
        expect(result).toEqual(mockCreatedCase);
      });

      it('creates case with optional assignedTo', async () => {
        const input = {
          title: 'New Case',
          description: 'Description',
          customerId: 'customer-1',
          createdBy: 'employee-1',
          assignedTo: 'employee-2',
        };

        mockContext.userId = 'user-1';
        mockPrisma.case.create.mockResolvedValue({ id: 'case-1', ...input });

        const caller = appRouter.createCaller(mockContext);
        await caller.case.create(input);

        expect(mockPrisma.case.create).toHaveBeenCalledWith({
          data: {
            ...input,
          },
        });
      });
    });

    describe('update', () => {
      it('updates a case when authenticated', async () => {
        const input = {
          id: 'case-1',
          title: 'Updated Title',
          status: 'IN_PROGRESS' as const,
        };

        const mockUpdatedCase = {
          ...input,
          updatedAt: expect.any(Date),
        };

        mockContext.userId = 'user-1';
        mockPrisma.case.update.mockResolvedValue(mockUpdatedCase);

        const caller = appRouter.createCaller(mockContext);
        const result = await caller.case.update(input);

        expect(mockPrisma.case.update).toHaveBeenCalledWith({
          where: { id: 'case-1' },
          data: {
            title: 'Updated Title',
            status: 'IN_PROGRESS',
            updatedAt: expect.any(Date),
          },
        });
        expect(result).toEqual(mockUpdatedCase);
      });

      it('updates case with nullable assignedTo', async () => {
        mockContext.userId = 'user-1';
        mockPrisma.case.update.mockResolvedValue({});

        const caller = appRouter.createCaller(mockContext);
        await caller.case.update({
          id: 'case-1',
          assignedTo: null,
        });

        expect(mockPrisma.case.update).toHaveBeenCalledWith({
          where: { id: 'case-1' },
          data: {
            assignedTo: null,
            updatedAt: expect.any(Date),
          },
        });
      });
    });

    describe('delete', () => {
      it('deletes a case', async () => {
        const mockDeletedCase = { id: 'case-1' };
        mockPrisma.case.delete.mockResolvedValue(mockDeletedCase);

        const caller = appRouter.createCaller(mockContext);
        const result = await caller.case.delete({ id: 'case-1' });

        expect(mockPrisma.case.delete).toHaveBeenCalledWith({
          where: { id: 'case-1' },
        });
        expect(result).toEqual(mockDeletedCase);
      });
    });
  });

  describe('comment', () => {
    describe('create', () => {
      it('creates a comment when authenticated', async () => {
        const input = {
          caseId: 'case-1',
          content: 'Test comment',
        };

        const mockCreatedComment = {
          id: 'comment-1',
          ...input,
          authorId: 'user-1',
          author: {
            id: 'user-1',
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
          },
        };

        mockContext.userId = 'user-1';
        mockPrisma.comment.create.mockResolvedValue(mockCreatedComment);

        const caller = appRouter.createCaller(mockContext);
        const result = await caller.comment.create(input);

        expect(mockPrisma.comment.create).toHaveBeenCalledWith({
          data: {
            ...input,
            authorId: 'user-1',
          },
          include: {
            author: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        });
        expect(result).toEqual(mockCreatedComment);
      });

      it('throws UNAUTHORIZED when not authenticated', async () => {
        mockContext.userId = undefined;

        const caller = appRouter.createCaller(mockContext);

        await expect(
          caller.comment.create({
            caseId: 'case-1',
            content: 'Test comment',
          })
        ).rejects.toThrow(TRPCError);
        await expect(
          caller.comment.create({
            caseId: 'case-1',
            content: 'Test comment',
          })
        ).rejects.toMatchObject({
          code: 'UNAUTHORIZED',
        });
      });
    });
  });
});
