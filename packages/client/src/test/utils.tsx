import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { trpc } from '../lib/trpc';
import { httpBatchLink } from '@trpc/client';

/**
 * Creates a test-specific QueryClient with appropriate defaults for testing
 * Disables retries and cacheTime to make tests deterministic
 */
export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Don't retry failed queries in tests
        gcTime: 0, // Don't cache data between tests
        staleTime: 0, // Always refetch in tests
      },
      mutations: {
        retry: false, // Don't retry failed mutations in tests
      },
    },
  });
}

/**
 * Creates a test tRPC client wrapper component
 * Use this with MSW to mock API responses in tests
 * 
 * @param queryClient - Optional QueryClient instance (creates new one if not provided)
 * @returns A wrapper component that provides tRPC context to test components
 * 
 * @example
 * ```tsx
 * const TrpcWrapper = createTrpcWrapper();
 * render(<MyComponent />, { wrapper: TrpcWrapper });
 * ```
 */
export function createTrpcWrapper(queryClient?: QueryClient) {
  const testQueryClient = queryClient || createTestQueryClient();
  
  // Create a test tRPC client that points to the local server
  // MSW will intercept these requests
  const trpcClient = trpc.createClient({
    links: [
      httpBatchLink({
        url: 'http://localhost:3000/trpc',
        // Fix AbortSignal issues in tests
        fetch(url, options) {
          // Use globalThis.fetch to avoid ESLint errors
          return globalThis.fetch(url, {
            ...options,
            signal: undefined, // Remove signal to avoid AbortSignal errors in tests
          });
        },
      }),
    ],
  });

  // Return a wrapper component
  return function TrpcWrapper({ children }: { children: ReactNode }) {
    return (
      <BrowserRouter>
        <trpc.Provider client={trpcClient} queryClient={testQueryClient}>
          <QueryClientProvider client={testQueryClient}>
            {children}
          </QueryClientProvider>
        </trpc.Provider>
      </BrowserRouter>
    );
  };
}

/**
 * Custom render function that wraps components with tRPC provider
 * Automatically handles QueryClient and tRPC setup for tests
 * 
 * @param ui - The component to render
 * @param options - Optional render options, including custom queryClient
 * @returns Render result from @testing-library/react
 * 
 * @example
 * ```tsx
 * const { getByText } = renderWithTrpc(<HomePage />);
 * ```
 * 
 * @example With custom queryClient
 * ```tsx
 * const queryClient = createTestQueryClient();
 * const { getByText } = renderWithTrpc(<HomePage />, { queryClient });
 * ```
 */
export function renderWithTrpc(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { queryClient?: QueryClient }
) {
  const { queryClient, ...renderOptions } = options || {};
  const TrpcWrapper = createTrpcWrapper(queryClient);

  return render(ui, {
    wrapper: TrpcWrapper,
    ...renderOptions,
  });
}
