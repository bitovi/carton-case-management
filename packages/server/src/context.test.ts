import { describe, it, expect, vi } from 'vitest';
import type { Request, Response } from 'express';
import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';

// Mock @carton/shared prisma export
vi.mock('@carton/shared', () => ({
  prisma: {
    $connect: vi.fn(),
    $disconnect: vi.fn(),
  },
}));

import { createContext } from './context.js';

const mockInfo = {
  calls: [],
  isBatchCall: false,
  accept: null,
  type: 'query' as const,
  connectionParams: null,
  signal: new AbortController().signal,
  url: null,
};

describe('createContext', () => {
  it('creates context with userId from cookies', async () => {
    const mockRequest = {
      cookies: {
        userId: 'user-123',
      },
    } as Partial<Request>;

    const mockResponse = {} as Partial<Response>;

    const opts = {
      req: mockRequest as Request,
      res: mockResponse as Response,
      info: mockInfo,
    } as CreateExpressContextOptions;

    const context = await createContext(opts);

    expect(context).toHaveProperty('req');
    expect(context).toHaveProperty('res');
    expect(context).toHaveProperty('prisma');
    expect(context).toHaveProperty('userId');
    expect(context.userId).toBe('user-123');
    expect(context.req).toBe(mockRequest);
    expect(context.res).toBe(mockResponse);
  });

  it('creates context with undefined userId when no cookies', async () => {
    const mockRequest = {
      cookies: undefined,
    } as Partial<Request>;

    const mockResponse = {} as Partial<Response>;

    const opts = {
      req: mockRequest as Request,
      res: mockResponse as Response,
      info: mockInfo,
    } as CreateExpressContextOptions;

    const context = await createContext(opts);

    expect(context.userId).toBeUndefined();
    expect(context.prisma).toBeDefined();
  });

  it('creates context with undefined userId when cookies object exists but no userId', async () => {
    const mockRequest = {
      cookies: {},
    } as Partial<Request>;

    const mockResponse = {} as Partial<Response>;

    const opts = {
      req: mockRequest as Request,
      res: mockResponse as Response,
      info: mockInfo,
    } as CreateExpressContextOptions;

    const context = await createContext(opts);

    expect(context.userId).toBeUndefined();
    expect(context.prisma).toBeDefined();
  });

  it('includes prisma client in context', async () => {
    const mockRequest = {
      cookies: { userId: 'user-456' },
    } as Partial<Request>;

    const mockResponse = {} as Partial<Response>;

    const opts = {
      req: mockRequest as Request,
      res: mockResponse as Response,
      info: mockInfo,
    } as CreateExpressContextOptions;

    const context = await createContext(opts);

    expect(context.prisma).toBeDefined();
    expect(typeof context.prisma).toBe('object');
  });

  it('preserves req and res objects in context', async () => {
    const mockRequest = {
      cookies: { userId: 'user-789' },
      headers: { 'content-type': 'application/json' },
      method: 'GET',
    } as Partial<Request>;

    const mockResponse = {
      statusCode: 200,
    } as Partial<Response>;

    const opts = {
      req: mockRequest as Request,
      res: mockResponse as Response,
      info: mockInfo,
    } as CreateExpressContextOptions;

    const context = await createContext(opts);

    expect(context.req).toBe(mockRequest);
    expect(context.res).toBe(mockResponse);
    expect(context.req.headers).toEqual({ 'content-type': 'application/json' });
    expect(context.req.method).toBe('GET');
  });
});
