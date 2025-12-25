import { z } from 'zod';
import { router, publicProcedure } from './trpc.js';
import { TRPCError } from '@trpc/server';
import {
  listCasesSchema,
  getCaseByIdSchema,
  createCommentSchema,
  CaseStatus,
} from '@carton/shared';
import { formatDate } from '@carton/shared';

export const appRouter = router({
  health: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString(), formatted: formatDate(new Date()) };
  }),

  // User routes
  user: router({
    list: publicProcedure.query(async ({ ctx }) => {
      return ctx.prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    }),
    getById: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
      return ctx.prisma.user.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    }),
  }),

  // Case routes
  case: router({
    list: publicProcedure
      .input(
        z
          .object({
            status: z.string().optional(),
            assignedTo: z.string().optional(),
          })
          .optional()
      )
      .query(async ({ ctx, input }) => {
        return ctx.prisma.case.findMany({
          where: {
            ...(input?.status && { status: input.status }),
            ...(input?.assignedTo && { assignedTo: input.assignedTo }),
          },
          include: {
            creator: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            assignee: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        });
      }),
    getById: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
      return ctx.prisma.case.findUnique({
        where: { id: input.id },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          assignee: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    }),
    create: publicProcedure
      .input(
        z.object({
          title: z.string().min(1),
          description: z.string().min(1),
          createdBy: z.string(),
          assignedTo: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return ctx.prisma.case.create({
          data: input,
        });
      }),
    update: publicProcedure
      .input(
        z.object({
          id: z.string(),
          title: z.string().optional(),
          description: z.string().optional(),
          status: z.string().optional(),
          assignedTo: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        return ctx.prisma.case.update({
          where: { id },
          data,
        });
      }),
    delete: publicProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
      return ctx.prisma.case.delete({
        where: { id: input.id },
      });
    }),
  }),

  // Cases routes (for case details feature)
  cases: router({
    list: publicProcedure.input(listCasesSchema).query(async ({ ctx, input }) => {
      const where = input?.status ? { status: input.status } : undefined;

      const [cases, total] = await Promise.all([
        ctx.prisma.case.findMany({
          where,
          take: input?.limit ?? 50,
          skip: input?.offset ?? 0,
          orderBy: { updatedAt: 'desc' },
          select: {
            id: true,
            title: true,
            caseType: true,
            status: true,
            customerName: true,
            updatedAt: true,
          },
        }),
        ctx.prisma.case.count({ where }),
      ]);

      return { cases, total };
    }),

    getById: publicProcedure.input(getCaseByIdSchema).query(async ({ ctx, input }) => {
      const caseData = await ctx.prisma.case.findUnique({
        where: { id: input.id },
        include: {
          creator: {
            select: { id: true, name: true, email: true },
          },
          assignee: {
            select: { id: true, name: true, email: true },
          },
          comments: {
            include: {
              author: {
                select: { id: true, name: true, email: true },
              },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      if (!caseData) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Case with id ${input.id} not found`,
        });
      }

      return caseData;
    }),

    addComment: publicProcedure.input(createCommentSchema).mutation(async ({ ctx, input }) => {
      // In MVP, use first user as author (no auth yet)
      const author = await ctx.prisma.user.findFirst();
      if (!author) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'No users found in database',
        });
      }

      // Verify case exists
      const caseExists = await ctx.prisma.case.findUnique({
        where: { id: input.caseId },
      });

      if (!caseExists) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Case with id ${input.caseId} not found`,
        });
      }

      // Create comment and update case timestamp
      const comment = await ctx.prisma.comment.create({
        data: {
          content: input.content,
          caseId: input.caseId,
          authorId: author.id,
        },
        include: {
          author: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      // Update case's updatedAt timestamp
      await ctx.prisma.case.update({
        where: { id: input.caseId },
        data: { updatedAt: new Date() },
      });

      return comment;
    }),
  }),
});

export type AppRouter = typeof appRouter;
