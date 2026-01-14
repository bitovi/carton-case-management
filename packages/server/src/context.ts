import { prisma } from '@carton/shared';
import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';

export async function createContext({ req, res }: CreateExpressContextOptions) {
  // Extract userId from cookie (set by auto-login middleware)
  const userId = req.cookies?.userId as string | undefined;

  return {
    req,
    res,
    prisma,
    userId,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
