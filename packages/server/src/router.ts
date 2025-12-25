import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { router, publicProcedure } from './trpc.js';
import { formatDate } from '@carton/shared';
import { getClaimInput, getClaimsListInput, addCommentInput } from '@carton/shared';

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

  // Claim detail procedures
  getClaim: publicProcedure.input(getClaimInput).query(async ({ ctx, input }) => {
    const claim = await ctx.prisma.case.findUnique({
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
        comments: {
          include: {
            author: {
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
        },
      },
    });

    if (!claim) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Claim not found',
      });
    }

    return claim;
  }),

  getClaimsList: publicProcedure.input(getClaimsListInput).query(async ({ ctx, input }) => {
    const limit = input?.limit ?? 20;

    return ctx.prisma.case.findMany({
      select: {
        id: true,
        title: true,
        caseNumber: true,
        status: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: limit,
    });
  }),

  addComment: publicProcedure.input(addCommentInput).mutation(async ({ ctx, input }) => {
    // TODO: In production, get authorId from authenticated user context
    // For now, we'll use the first user from the database
    const firstUser = await ctx.prisma.user.findFirst();
    if (!firstUser) {
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
        message: 'Case not found',
      });
    }

    // Create comment
    const comment = await ctx.prisma.comment.create({
      data: {
        content: input.content,
        authorId: firstUser.id,
        caseId: input.caseId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return comment;
  }),
});

export type AppRouter = typeof appRouter;
