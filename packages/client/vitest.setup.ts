import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll, beforeEach, vi } from 'vitest';
import { setupServer } from 'msw/node';

const SUPPRESSED_WARNINGS = [
  'DialogTitle',
  'Missing `Description` or `aria-describedby={undefined}`',
  'code that causes React state updates should be wrapped into act',
  'validateDOMNesting',
];

const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeEach(() => {
  console.error = vi.fn((...args: unknown[]) => {
    const message = args[0]?.toString() ?? '';
    if (SUPPRESSED_WARNINGS.some((w) => message.includes(w))) return;
    originalConsoleError(...args);
  });
  console.warn = vi.fn((...args: unknown[]) => {
    const message = args[0]?.toString() ?? '';
    if (SUPPRESSED_WARNINGS.some((w) => message.includes(w))) return;
    originalConsoleWarn(...args);
  });
});

afterEach(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

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

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));

afterEach(() => server.resetHandlers());

afterAll(() => server.close());
