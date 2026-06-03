import { prisma } from '@carton/shared';
import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { TRPCError } from '@trpc/server';

export async function createContext({ req, res }: CreateExpressContextOptions) {
  // Extract userId from cookie (set by auto-login middleware)
  const userId = req.cookies?.uid as string | undefined;
  const debugMode = process.env.DEBUG === 'true';
  console.log('Creating context, debugMode:', debugMode);

  return {
    req,
    res,
    prisma,
    userId,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
