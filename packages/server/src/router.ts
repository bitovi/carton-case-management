import { z } from 'zod';
import { router, publicProcedure } from './trpc.js';
import { formatDate, casePrioritySchema, caseStatusSchema, voteTypeSchema } from '@carton/shared';
import { TRPCError } from '@trpc/server';
import type { VoteType, VoteSummary, VoteResponse } from '@carton/shared';

export const appRouter = router({
  health: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString(), formatted: formatDate(new Date()) };
  }),

  auth: router({
    me: publicProcedure.query(async ({ ctx }) => {
      if (!ctx.userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Not authenticated',
        });
      }

      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.userId },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      return user;
    }),
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

  customer: router({
    list: publicProcedure.query(async ({ ctx }) => {
      return ctx.prisma.customer.findMany({
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
    }),
    getById: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
      const customer = await ctx.prisma.customer.findUnique({
        where: { id: input.id },
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
          cases: {
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

      if (!customer) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Customer not found',
        });
      }

      return customer;
    }),
    create: publicProcedure
      .input(
        z.object({
          firstName: z.string().min(1),
          lastName: z.string().min(1),
          username: z.string().min(1),
          email: z.string().email(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return ctx.prisma.customer.create({
          data: input,
        });
      }),
    update: publicProcedure
      .input(
        z.object({
          id: z.string(),
          firstName: z.string().optional(),
          lastName: z.string().optional(),
          username: z.string().optional(),
          email: z.string().email().optional(),
          satisfactionRate: z.number().min(0).max(5).nullable().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        return ctx.prisma.customer.update({
          where: { id },
          data,
        });
      }),
    delete: publicProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
      return ctx.prisma.customer.delete({
        where: { id: input.id },
      });
    }),
  }),

  case: router({
    list: publicProcedure
      .input(
        z
          .object({
            status: caseStatusSchema.optional(),
            assignedTo: z.string().optional(),
          })
          .optional()
      )
      .query(async ({ ctx, input }) => {
        const cases = await ctx.prisma.case.findMany({
          where: {
            ...(input?.status ? { status: input.status } : {}),
            ...(input?.assignedTo ? { assignedTo: input.assignedTo } : {}),
          },
          include: {
            customer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
            creator: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            updater: {
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
            votes: {
              select: {
                userId: true,
                voteType: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        });

        // Calculate vote summary for each case
        return cases.map((caseData) => {
          const likes = caseData.votes.filter((v) => v.voteType === 'LIKE').length;
          const dislikes = caseData.votes.filter((v) => v.voteType === 'DISLIKE').length;
          const userVote = ctx.userId
            ? caseData.votes.find((v) => v.userId === ctx.userId)?.voteType ?? null
            : null;

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { votes, ...caseWithoutVotes } = caseData;

          return {
            ...caseWithoutVotes,
            voteSummary: {
              likes,
              dislikes,
              userVote,
            },
          };
        });
      }),
    getById: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
      const caseData = await ctx.prisma.case.findUnique({
        where: { id: input.id },
        include: {
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          updater: {
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
          votes: {
            select: {
              userId: true,
              voteType: true,
            },
          },
        },
      });

      if (!caseData) {
        return null;
      }

      // Calculate vote summary
      const likes = caseData.votes.filter((v) => v.voteType === 'LIKE').length;
      const dislikes = caseData.votes.filter((v) => v.voteType === 'DISLIKE').length;
      const userVote = ctx.userId
        ? caseData.votes.find((v) => v.userId === ctx.userId)?.voteType ?? null
        : null;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { votes, ...caseWithoutVotes } = caseData;

      return {
        ...caseWithoutVotes,
        voteSummary: {
          likes,
          dislikes,
          userVote,
        },
      };
    }),
    create: publicProcedure
      .input(
        z.object({
          title: z.string().min(1),
          description: z.string().min(1),
          assignedTo: z.string().optional(),
          customerId: z.string(),
          priority: casePrioritySchema.optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (!ctx.userId) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Not authenticated',
          });
        }

        return ctx.prisma.case.create({
          data: {
            ...input,
            createdBy: ctx.userId,
            updatedBy: ctx.userId,
          },
        });
      }),
    update: publicProcedure
      .input(
        z.object({
          id: z.string(),
          title: z.string().optional(),
          description: z.string().optional(),
          status: caseStatusSchema.optional(),
          priority: casePrioritySchema.optional(),
          customerId: z.string().optional(),
          assignedTo: z.string().nullable().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (!ctx.userId) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Not authenticated',
          });
        }

        const { id, ...data } = input;
        return ctx.prisma.case.update({
          where: { id },
          data: {
            ...data,
            updatedBy: ctx.userId,
            updatedAt: new Date(),
          },
        });
      }),
    delete: publicProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
      return ctx.prisma.case.delete({
        where: { id: input.id },
      });
    }),
    vote: publicProcedure
      .input(
        z.object({
          caseId: z.string(),
          voteType: voteTypeSchema,
        })
      )
      .mutation(async ({ ctx, input }): Promise<VoteResponse> => {
        // Check authentication
        if (!ctx.userId) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Not authenticated',
          });
        }

        const { caseId, voteType } = input;

        // Use upsert for atomic operation to handle concurrent votes
        const existingVote = await ctx.prisma.caseVote.findUnique({
          where: {
            user_case_vote: {
              userId: ctx.userId,
              caseId,
            },
          },
        });

        let action: 'created' | 'changed' | 'removed';

        if (!existingVote) {
          // Create new vote
          await ctx.prisma.caseVote.create({
            data: {
              userId: ctx.userId,
              caseId,
              voteType,
            },
          });
          action = 'created';
        } else if (existingVote.voteType === voteType) {
          // Remove vote (user clicked same button)
          await ctx.prisma.caseVote.delete({
            where: {
              id: existingVote.id,
            },
          });
          action = 'removed';
        } else {
          // Change vote (user clicked different button)
          await ctx.prisma.caseVote.update({
            where: {
              id: existingVote.id,
            },
            data: {
              voteType,
            },
          });
          action = 'changed';
        }

        // Fetch updated vote summary
        const caseData = await ctx.prisma.case.findUnique({
          where: { id: caseId },
          include: {
            votes: {
              select: {
                userId: true,
                voteType: true,
              },
            },
          },
        });

        if (!caseData) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Case not found',
          });
        }

        const likes = caseData.votes.filter((v) => v.voteType === 'LIKE').length;
        const dislikes = caseData.votes.filter((v) => v.voteType === 'DISLIKE').length;
        const userVote = caseData.votes.find((v) => v.userId === ctx.userId)?.voteType ?? null;

        const voteSummary: VoteSummary = {
          likes,
          dislikes,
          userVote,
        };

        return {
          action,
          voteSummary,
        };
      }),
  }),

  // Comment routes
  comment: router({
    create: publicProcedure
      .input(
        z.object({
          caseId: z.string(),
          content: z.string().min(1),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (!ctx.userId) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Not authenticated',
          });
        }

        return ctx.prisma.comment.create({
          data: {
            ...input,
            authorId: ctx.userId,
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
      }),
  }),
});

export type AppRouter = typeof appRouter;
