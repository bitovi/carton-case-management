import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';

// Polyfill for JSDOM - Radix UI requires these methods
(global as any).Element.prototype.scrollIntoView = () => {};
(global as any).Element.prototype.hasPointerCapture = () => false;
(global as any).Element.prototype.releasePointerCapture = () => {};

// ResizeObserver polyfill for Radix UI components (Tooltip, Popover, etc.)
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
(global as any).ResizeObserver = ResizeObserverMock;

export const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));

afterEach(() => server.resetHandlers());

afterAll(() => server.close());
