import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll, vi } from 'vitest';

const SUPPRESSED_ERRORS = [
  'not wrapped in act(...)',
  'validateDOMNesting',
  'requires a `DialogTitle`',
];

const SUPPRESSED_WARNINGS = [
  'Missing `Description` or `aria-describedby={undefined}`',
];

const originalConsoleError = console.error.bind(console);
console.error = (...args: Parameters<typeof console.error>) => {
  if (typeof args[0] === 'string' && SUPPRESSED_ERRORS.some((w) => args[0].includes(w))) return;
  originalConsoleError(...args);
};

const originalConsoleWarn = console.warn.bind(console);
console.warn = (...args: Parameters<typeof console.warn>) => {
  if (typeof args[0] === 'string' && SUPPRESSED_WARNINGS.some((w) => args[0].includes(w))) return;
  originalConsoleWarn(...args);
};
import { setupServer } from 'msw/node';

// Polyfill for JSDOM - Radix UI requires these methods
(global as any).Element.prototype.scrollIntoView = () => {};
(global as any).Element.prototype.hasPointerCapture = () => false;
(global as any).Element.prototype.releasePointerCapture = () => {};

// Polyfill for JSDOM - window.matchMedia is not implemented
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

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
