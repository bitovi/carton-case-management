import { z } from 'zod';
import { router, publicProcedure } from './trpc.js';
import { formatDate, casePrioritySchema, caseStatusSchema } from '@carton/shared';
import { TRPCError } from '@trpc/server';

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
          firstName: true,
          lastName: true,
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
          firstName: true,
          lastName: true,
          username: true,
          email: true,
          dateJoined: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          lastName: 'asc',
        },
      });
    }),
    getById: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
          email: true,
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

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      return user;
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
        return ctx.prisma.user.create({
          data: {
            ...input,
            password: 'hashed_password_here', // In production, use bcrypt
          },
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
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        return ctx.prisma.user.update({
          where: { id },
          data,
        });
      }),
    delete: publicProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
      return ctx.prisma.user.delete({
        where: { id: input.id },
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
        return ctx.prisma.case.findMany({
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
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            assignee: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
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
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          assignee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          comments: {
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
          assignedTo: z.string().optional(),
          customerId: z.string(),
          priority: casePrioritySchema.optional(),
          createdBy: z.string(), // User ID
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
          status: caseStatusSchema.optional(),
          priority: casePrioritySchema.optional(),
          customerId: z.string().optional(),
          assignedTo: z.string().nullable().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        return ctx.prisma.case.update({
          where: { id },
          data: {
            ...data,
            updatedAt: new Date(),
          },
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
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        });
      }),
  }),

  reaction: router({
    // Toggle a reaction (create, update, or delete)
    toggle: publicProcedure
      .input(
        z.object({
          entityType: z.enum(['CASE', 'COMMENT']),
          entityId: z.string(),
          type: z.enum(['UP', 'DOWN']),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (!ctx.userId) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Must be logged in to react',
          });
        }

        // Check if user already has a reaction for this entity
        const existingReaction = await ctx.prisma.reaction.findUnique({
          where: {
            userId_entityType_entityId: {
              userId: ctx.userId,
              entityType: input.entityType,
              entityId: input.entityId,
            },
          },
        });

        // If clicking the same reaction type, remove it (toggle off)
        if (existingReaction && existingReaction.type === input.type) {
          await ctx.prisma.reaction.delete({
            where: { id: existingReaction.id },
          });
          return { action: 'removed' as const, type: input.type };
        }

        // If user has a different reaction, update it (switch)
        if (existingReaction && existingReaction.type !== input.type) {
          await ctx.prisma.reaction.update({
            where: { id: existingReaction.id },
            data: { type: input.type },
          });
          return { action: 'switched' as const, type: input.type };
        }

        // Otherwise, create a new reaction
        await ctx.prisma.reaction.create({
          data: {
            userId: ctx.userId,
            entityType: input.entityType,
            entityId: input.entityId,
            type: input.type,
          },
        });
        return { action: 'created' as const, type: input.type };
      }),

    // Get reaction statistics for an entity
    getByEntity: publicProcedure
      .input(
        z.object({
          entityType: z.enum(['CASE', 'COMMENT']),
          entityId: z.string(),
        })
      )
      .query(async ({ ctx, input }) => {
        const reactions = await ctx.prisma.reaction.findMany({
          where: {
            entityType: input.entityType,
            entityId: input.entityId,
          },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        });

        const upReactions = reactions.filter((r) => r.type === 'UP');
        const downReactions = reactions.filter((r) => r.type === 'DOWN');

        const userReaction = ctx.userId
          ? reactions.find((r) => r.userId === ctx.userId)
          : null;

        return {
          upvotes: upReactions.length,
          downvotes: downReactions.length,
          upvoters: upReactions.map((r) => `${r.user.firstName} ${r.user.lastName}`),
          downvoters: downReactions.map((r) => `${r.user.firstName} ${r.user.lastName}`),
          userVote: userReaction ? (userReaction.type === 'UP' ? ('up' as const) : ('down' as const)) : ('none' as const),
        };
      }),

    // Get reaction statistics for multiple entities (batch query)
    getByEntities: publicProcedure
      .input(
        z.object({
          entityType: z.enum(['CASE', 'COMMENT']),
          entityIds: z.array(z.string()),
        })
      )
      .query(async ({ ctx, input }) => {
        const reactions = await ctx.prisma.reaction.findMany({
          where: {
            entityType: input.entityType,
            entityId: { in: input.entityIds },
          },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        });

        // Group reactions by entity ID
        const reactionsByEntity = input.entityIds.map((entityId) => {
          const entityReactions = reactions.filter((r) => r.entityId === entityId);
          const upReactions = entityReactions.filter((r) => r.type === 'UP');
          const downReactions = entityReactions.filter((r) => r.type === 'DOWN');
          const userReaction = ctx.userId
            ? entityReactions.find((r) => r.userId === ctx.userId)
            : null;

          return {
            entityId,
            upvotes: upReactions.length,
            downvotes: downReactions.length,
            upvoters: upReactions.map((r) => `${r.user.firstName} ${r.user.lastName}`),
            downvoters: downReactions.map((r) => `${r.user.firstName} ${r.user.lastName}`),
            userVote: userReaction ? (userReaction.type === 'UP' ? ('up' as const) : ('down' as const)) : ('none' as const),
          };
        });

        return reactionsByEntity;
      }),
  }),
});

export type AppRouter = typeof appRouter;
