import { describe, it, expect } from 'vitest';
import { appRouter } from './router.js';
import type { Context } from './context.js';

describe('appRouter', () => {
  it('health check returns ok status', async () => {
    const mockContext: Context = {
      prisma: {} as any,
    } as Context;

    const caller = appRouter.createCaller(mockContext);
    const result = await caller.health();

    expect(result.status).toBe('ok');
    expect(result.timestamp).toBeDefined();
    expect(typeof result.timestamp).toBe('string');
  });
});
