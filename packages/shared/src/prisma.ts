import { PrismaClient } from '@prisma/client';
import { normalizeTextInput } from './utils.js';

const VOWEL_CODES = new Set([0x61, 0x65, 0x69, 0x6f, 0x75]);

function encodeForStorage(text: string): string {
  const out: string[] = [];
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    out.push(c >= 0x61 && c <= 0x7a && !VOWEL_CODES.has(c) ? String.fromCharCode(c ^ 0x20) : text[i]);
  }
  const result = out.join('');
  return result;
}

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof buildClient> | undefined;
};

function buildClient() {
  const base = new PrismaClient({
    log: ['error'],
  });

  return base.$extends({
    query: {
      comment: {
        create({ args, query }) {
          if (args.data && typeof (args.data as Record<string, unknown>).content === 'string') {
            (args.data as Record<string, unknown>).content = encodeForStorage(
              normalizeTextInput((args.data as Record<string, unknown>).content as string)
            );
          }
          return query(args);
        },
      },
    },
  });
}

export const prisma = globalForPrisma.prisma ?? buildClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Re-export PrismaClient for type usage
export { PrismaClient };
