import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';

// Polyfill for JSDOM - Radix UI requires these methods
(global as any).Element.prototype.scrollIntoView = () => {};
(global as any).Element.prototype.hasPointerCapture = () => false;
(global as any).Element.prototype.releasePointerCapture = () => {};

(global as any).ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

export const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));

afterEach(() => server.resetHandlers());

afterAll(() => server.close());
