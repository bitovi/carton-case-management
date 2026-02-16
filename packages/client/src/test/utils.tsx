import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { trpc } from '../lib/trpc';
import { httpBatchLink } from '@trpc/client';
import { ToastProvider } from '../components/obra/Toast';

export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

export function createTrpcWrapper(queryClient?: QueryClient) {
  const testQueryClient = queryClient || createTestQueryClient();
  
  const trpcClient = trpc.createClient({
    links: [
      httpBatchLink({
        url: 'http://localhost:3000/trpc',
        fetch(url, options) {
          return globalThis.fetch(url, {
            ...options,
            signal: undefined,
          });
        },
      }),
    ],
  });

  return function TrpcWrapper({ children }: { children: ReactNode }) {
    return (
      <BrowserRouter>
        <trpc.Provider client={trpcClient} queryClient={testQueryClient}>
          <QueryClientProvider client={testQueryClient}>
            <ToastProvider>
              {children}
            </ToastProvider>
          </QueryClientProvider>
        </trpc.Provider>
      </BrowserRouter>
    );
  };
}

export function createMemoryRouterWrapper(initialEntries: string[], queryClient?: QueryClient) {
  const testQueryClient = queryClient || createTestQueryClient();
  
  const trpcClient = trpc.createClient({
    links: [
      httpBatchLink({
        url: 'http://localhost:3000/trpc',
        fetch(url, options) {
          return globalThis.fetch(url, {
            ...options,
            signal: undefined,
          });
        },
      }),
    ],
  });

  return function TrpcWrapper({ children }: { children: ReactNode }) {
    return (
      <MemoryRouter initialEntries={initialEntries}>
        <trpc.Provider client={trpcClient} queryClient={testQueryClient}>
          <QueryClientProvider client={testQueryClient}>
            <ToastProvider>
              {children}
            </ToastProvider>
          </QueryClientProvider>
        </trpc.Provider>
      </MemoryRouter>
    );
  };
}

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
