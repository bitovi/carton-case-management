# tRPC React Query - Testing Example

This file demonstrates best practices for testing components that use tRPC + React Query.

## Test Utilities Setup

First, create reusable test utilities in `packages/client/src/test/utils.ts`:

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@carton/server/src/router';
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

// Create trpc instance for testing
export const trpc = createTRPCReact<AppRouter>();

/**
 * Creates a fresh QueryClient for each test
 * - Disables retries for faster tests
 * - No cache time to ensure clean state
 */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
    logger: {
      log: console.log,
      warn: console.warn,
      error: () => {}, // Suppress error logs in tests
    },
  });
}

/**
 * Creates a wrapper component with tRPC and QueryClient providers
 * Use this as the wrapper option in render() or renderHook()
 */
export function createTrpcWrapper(options: { baseUrl?: string } = {}) {
  const queryClient = createTestQueryClient();
  const trpcClient = trpc.createClient({
    links: [
      httpBatchLink({
        url: options.baseUrl ?? 'http://localhost:3001/trpc',
      }),
    ],
  });

  return function TrpcWrapper({ children }: { children: React.ReactNode }) {
    return (
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </trpc.Provider>
    );
  };
}

/**
 * Custom render function that includes tRPC wrapper
 */
export function renderWithTrpc(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, {
    wrapper: createTrpcWrapper(),
    ...options,
  });
}
```

## Testing Queries with MSW

Use Mock Service Worker (already installed) to mock API responses:

```typescript
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { renderWithTrpc } from '../test/utils';
import { CaseList } from './CaseList';

// Setup MSW server
const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('CaseList Component', () => {
  it('displays loading state initially', () => {
    // Delay the response to keep loading state visible
    server.use(
      http.get('http://localhost:3001/trpc/case.list', async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return HttpResponse.json({ result: { data: [] } });
      })
    );

    renderWithTrpc(<CaseList />);
    
    expect(screen.getByText(/Loading cases/i)).toBeInTheDocument();
  });

  it('displays cases when data loads', async () => {
    // Mock successful response
    server.use(
      http.get('http://localhost:3001/trpc/case.list', () => {
        return HttpResponse.json({
          result: {
            data: [
              {
                id: '1',
                title: 'Test Case 1',
                description: 'Description 1',
                status: 'OPEN',
                creator: { name: 'John Doe' },
                assignee: null,
              },
              {
                id: '2',
                title: 'Test Case 2',
                description: 'Description 2',
                status: 'CLOSED',
                creator: { name: 'Jane Smith' },
                assignee: { name: 'Bob Johnson' },
              },
            ],
          },
        });
      })
    );

    renderWithTrpc(<CaseList />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Test Case 1')).toBeInTheDocument();
    });

    expect(screen.getByText('Test Case 2')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText(/Creator: John Doe/i)).toBeInTheDocument();
  });

  it('displays error message when query fails', async () => {
    // Mock error response
    server.use(
      http.get('http://localhost:3001/trpc/case.list', () => {
        return HttpResponse.json(
          {
            error: {
              message: 'Database connection failed',
              code: -32603,
            },
          },
          { status: 500 }
        );
      })
    );

    renderWithTrpc(<CaseList />);

    await waitFor(() => {
      expect(screen.getByText(/Error loading cases/i)).toBeInTheDocument();
    });
    
    expect(screen.getByText(/Database connection failed/i)).toBeInTheDocument();
  });

  it('displays empty state when no cases exist', async () => {
    server.use(
      http.get('http://localhost:3001/trpc/case.list', () => {
        return HttpResponse.json({ result: { data: [] } });
      })
    );

    renderWithTrpc(<CaseList />);

    await waitFor(() => {
      expect(screen.getByText(/No cases found/i)).toBeInTheDocument();
    });
  });
});
```

## Testing Mutations

```typescript
import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { renderWithTrpc } from '../test/utils';
import { CreateCaseForm } from './CreateCaseForm';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('CreateCaseForm Component', () => {
  it('creates a case when form is submitted', async () => {
    const user = userEvent.setup();
    
    // Mock successful mutation
    server.use(
      http.post('http://localhost:3001/trpc/case.create', async ({ request }) => {
        const body = await request.json();
        
        return HttpResponse.json({
          result: {
            data: {
              id: 'new-case-id',
              title: body.title,
              description: body.description,
              status: 'OPEN',
              createdAt: new Date().toISOString(),
            },
          },
        });
      })
    );

    renderWithTrpc(<CreateCaseForm />);

    // Fill out form
    await user.type(screen.getByLabelText(/title/i), 'New Test Case');
    await user.type(screen.getByLabelText(/description/i), 'Test description');
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /create case/i }));

    // Check loading state
    expect(screen.getByRole('button', { name: /creating/i })).toBeInTheDocument();

    // Wait for success (component should navigate, but in test we can check mutation state)
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /creating/i })).not.toBeInTheDocument();
    });
  });

  it('displays error when mutation fails', async () => {
    const user = userEvent.setup();
    
    // Mock failed mutation
    server.use(
      http.post('http://localhost:3001/trpc/case.create', () => {
        return HttpResponse.json(
          {
            error: {
              message: 'Title must be unique',
              code: 'BAD_REQUEST',
            },
          },
          { status: 400 }
        );
      })
    );

    renderWithTrpc(<CreateCaseForm />);

    await user.type(screen.getByLabelText(/title/i), 'Duplicate Title');
    await user.click(screen.getByRole('button', { name: /create case/i }));

    await waitFor(() => {
      expect(screen.getByText(/Title must be unique/i)).toBeInTheDocument();
    });
  });

  it('disables form inputs while mutation is in progress', async () => {
    const user = userEvent.setup();
    
    // Mock slow mutation
    server.use(
      http.post('http://localhost:3001/trpc/case.create', async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return HttpResponse.json({ result: { data: { id: '1' } } });
      })
    );

    renderWithTrpc(<CreateCaseForm />);

    const titleInput = screen.getByLabelText(/title/i);
    const submitButton = screen.getByRole('button', { name: /create case/i });

    await user.type(titleInput, 'Test');
    await user.click(submitButton);

    // Inputs should be disabled during mutation
    expect(titleInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });
});
```

## Testing Cache Invalidation

```typescript
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { renderWithTrpc } from '../test/utils';
import { CaseListWithCreate } from './CaseListWithCreate';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Cache Invalidation', () => {
  it('refetches list after creating a new case', async () => {
    const user = userEvent.setup();
    let cases = [
      { id: '1', title: 'Existing Case', description: '', status: 'OPEN' },
    ];

    // Mock list query that returns current cases array
    server.use(
      http.get('http://localhost:3001/trpc/case.list', () => {
        return HttpResponse.json({ result: { data: cases } });
      }),
      
      // Mock create mutation that adds to cases array
      http.post('http://localhost:3001/trpc/case.create', async ({ request }) => {
        const body = await request.json();
        const newCase = {
          id: '2',
          title: body.title,
          description: body.description,
          status: 'OPEN',
        };
        cases = [...cases, newCase];
        
        return HttpResponse.json({ result: { data: newCase } });
      })
    );

    renderWithTrpc(<CaseListWithCreate />);

    // Wait for initial list to load
    await waitFor(() => {
      expect(screen.getByText('Existing Case')).toBeInTheDocument();
    });

    // Create new case
    await user.type(screen.getByLabelText(/title/i), 'New Case');
    await user.click(screen.getByRole('button', { name: /create/i }));

    // Wait for new case to appear in list (cache invalidation triggered refetch)
    await waitFor(() => {
      expect(screen.getByText('New Case')).toBeInTheDocument();
    });

    // Both cases should be visible
    expect(screen.getByText('Existing Case')).toBeInTheDocument();
    expect(screen.getByText('New Case')).toBeInTheDocument();
  });
});
```

## Testing with renderHook (for hooks)

```typescript
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { createTrpcWrapper, trpc } from '../test/utils';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('useCaseList hook', () => {
  it('fetches cases successfully', async () => {
    server.use(
      http.get('http://localhost:3001/trpc/case.list', () => {
        return HttpResponse.json({
          result: {
            data: [{ id: '1', title: 'Test Case' }],
          },
        });
      })
    );

    const { result } = renderHook(() => trpc.case.list.useQuery(), {
      wrapper: createTrpcWrapper(),
    });

    // Initially loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();

    // Wait for data
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual([{ id: '1', title: 'Test Case' }]);
  });

  it('handles errors correctly', async () => {
    server.use(
      http.get('http://localhost:3001/trpc/case.list', () => {
        return HttpResponse.json(
          { error: { message: 'Server error', code: -32603 } },
          { status: 500 }
        );
      })
    );

    const { result } = renderHook(() => trpc.case.list.useQuery(), {
      wrapper: createTrpcWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error?.message).toBe('Server error');
  });
});
```

## Integration Test Example

```typescript
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { renderWithTrpc } from '../test/utils';
import { App } from './App';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Full User Flow Integration Test', () => {
  it('complete flow: list cases → create case → view case', async () => {
    const user = userEvent.setup();
    const cases = [
      { id: '1', title: 'Existing Case', description: 'Desc', status: 'OPEN' },
    ];

    // Mock all required endpoints
    server.use(
      http.get('http://localhost:3001/trpc/case.list', () => {
        return HttpResponse.json({ result: { data: cases } });
      }),
      
      http.post('http://localhost:3001/trpc/case.create', async ({ request }) => {
        const body = await request.json();
        const newCase = {
          id: '2',
          title: body.title,
          description: body.description,
          status: 'OPEN',
        };
        cases.push(newCase);
        return HttpResponse.json({ result: { data: newCase } });
      }),
      
      http.get('http://localhost:3001/trpc/case.getById', ({ request }) => {
        const url = new URL(request.url);
        const id = url.searchParams.get('input');
        const caseData = cases.find((c) => c.id === id);
        return HttpResponse.json({ result: { data: caseData } });
      })
    );

    renderWithTrpc(<App />);

    // Step 1: View case list
    await waitFor(() => {
      expect(screen.getByText('Existing Case')).toBeInTheDocument();
    });

    // Step 2: Navigate to create form
    await user.click(screen.getByRole('link', { name: /new case/i }));
    
    // Step 3: Create new case
    await user.type(screen.getByLabelText(/title/i), 'Integration Test Case');
    await user.type(screen.getByLabelText(/description/i), 'Created via test');
    await user.click(screen.getByRole('button', { name: /create/i }));

    // Step 4: Verify redirect to case list with new case
    await waitFor(() => {
      expect(screen.getByText('Integration Test Case')).toBeInTheDocument();
    });

    // Step 5: Click on new case to view details
    await user.click(screen.getByText('Integration Test Case'));

    // Step 6: Verify case details page
    await waitFor(() => {
      expect(screen.getByText('Created via test')).toBeInTheDocument();
    });
  });
});
```

## Best Practices Summary

1. **Always use test QueryClient**: Don't reuse production QueryClient
2. **Disable retries**: Set `retry: false` for faster tests
3. **Use MSW for mocking**: Mock at the network level, not the tRPC client
4. **Test loading states**: Verify loading indicators appear
5. **Test error states**: Verify error messages display correctly
6. **Test cache behavior**: Verify invalidation triggers refetch
7. **Use waitFor**: Always wait for async updates
8. **Clean state**: Each test gets fresh QueryClient
9. **Test user interactions**: Use userEvent for realistic interactions
10. **Integration tests**: Test full flows, not just isolated components
