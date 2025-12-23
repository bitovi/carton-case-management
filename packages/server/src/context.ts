import { PrismaClient } from '@prisma/client';
import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';

const prisma = new PrismaClient();

export async function createContext({ req, res }: CreateExpressContextOptions) {
  return {
    req,
    res,
    prisma,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
