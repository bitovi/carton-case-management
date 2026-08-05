import { setupServer } from 'msw/node';

/**
 * The one MSW server for the whole unit-test suite.
 *
 * `vitest.setup.ts` starts and resets it, so a test only needs `server.use(...)` to add handlers.
 * Do not call `setupServer()` in a test file: a second server intercepts the same requests, and
 * whichever one lacks the handler logs "intercepted a request without a matching request handler"
 * even though the test passed.
 */
export const server = setupServer();
