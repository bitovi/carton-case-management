import { z } from 'zod';
import { router, publicProcedure } from './trpc.js';
import { formatDate, richTextDocumentSchema, serializeToPlainText } from '@carton/shared';
import { TRPCError } from '@trpc/server';

export const appRouter = router({
  health: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString(), formatted: formatDate(new Date()) };
  }),

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

  case: router({
    list: publicProcedure
      .input(
        z
          .object({
            status: z.enum(['TO_DO', 'IN_PROGRESS', 'COMPLETED', 'CLOSED']).optional(),
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
    }),
    create: publicProcedure
      .input(
        z.object({
          title: z.string().min(1),
          description: z.string().min(1),
          createdBy: z.string(),
          assignedTo: z.string().optional(),
          caseNumber: z.string(),
          customerName: z.string(),
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
          status: z.enum(['TO_DO', 'IN_PROGRESS', 'COMPLETED', 'CLOSED']).optional(),
          customerName: z.string().optional(),
          assigneeId: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;

        // Validate rich text if description is provided
        if (data.description) {
          try {
            // Parse JSON to rich text document
            const parsed = JSON.parse(data.description);

            // Validate structure with Zod schema
            const validated = richTextDocumentSchema.parse(parsed);

            // Count characters (plain text only, no formatting)
            const charCount = serializeToPlainText(validated).length;

            // Enforce 10,000 character hard limit
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
            // Re-throw TRPCErrors as-is
            if (error instanceof TRPCError) {
              throw error;
            }
            // Handle JSON parse errors and Zod validation errors
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'Invalid rich text format',
            });
          }
        }

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

  // Comment routes
  comment: router({
    create: publicProcedure
      .input(
        z.object({
          caseId: z.string(),
          content: z.string().min(1),
          authorId: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return ctx.prisma.comment.create({
          data: input,
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
      }),
  }),
});

export type AppRouter = typeof appRouter;
