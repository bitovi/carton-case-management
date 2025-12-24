# Quickstart: tRPC + React Query

**Audience**: Developers working on the Carton Case Management application  
**Time to Complete**: 15-30 minutes  
**Prerequisites**: Basic React and TypeScript knowledge

## What You'll Learn

- How to fetch data using tRPC queries
- How to create/update data using tRPC mutations
- How to test components using tRPC hooks
- How to use React Query DevTools for debugging

## Prerequisites

All packages are already installed:

- `@tanstack/react-query` v5.62.14
- `@trpc/react-query` v11.0.0
- `@trpc/client` v11.0.0

The tRPC client is already configured in `packages/client/src/lib/trpc.tsx`.

## Part 1: Your First Query (5 minutes)

### Step 1: Import the tRPC client

```typescript
import { trpc } from '../lib/trpc';
```

### Step 2: Use a query hook in your component

```typescript
export function MyCases() {
  const { data, isLoading, error } = trpc.case.list.useQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data?.map((caseItem) => (
        <li key={caseItem.id}>{caseItem.title}</li>
      ))}
    </ul>
  );
}
```

### Step 3: Run the app and see it work

```bash
npm run dev
```

Navigate to your component and watch the data load! ✨

**What just happened?**

- React Query automatically handled the loading state
- The data was cached for future renders
- Full TypeScript autocomplete for `data` properties
- Error handling built-in

## Part 2: Fetch Data with Parameters (5 minutes)

### Fetch a single item by ID

```typescript
export function CaseDetail({ caseId }: { caseId: string }) {
  const { data: caseItem, isLoading } = trpc.case.getById.useQuery(
    { id: caseId }, // Input parameter
    {
      enabled: !!caseId, // Only run when caseId exists
    }
  );

  if (isLoading) return <div>Loading case...</div>;
  if (!caseItem) return <div>Case not found</div>;

  return (
    <div>
      <h1>{caseItem.title}</h1>
      <p>{caseItem.description}</p>
    </div>
  );
}
```

**Key Points:**

- First argument is the input (must match router schema)
- Second argument is React Query options (optional)
- `enabled` option controls when the query runs
- Full type safety on input and output

## Part 3: Create Data with Mutations (10 minutes)

### Step 1: Set up the mutation

```typescript
import { trpc } from '../lib/trpc';
import { useState } from 'react';

export function CreateCase() {
  const [title, setTitle] = useState('');
  const utils = trpc.useUtils(); // For cache invalidation

  const createCase = trpc.case.create.useMutation({
    onSuccess: () => {
      // Invalidate the case list to trigger refetch
      utils.case.list.invalidate();

      // Clear the form
      setTitle('');

      alert('Case created!');
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  // Component rendering below...
}
```

### Step 2: Handle form submission

```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  createCase.mutate({
    title,
    description: 'New case description',
  });
};
```

### Step 3: Render the form

```typescript
return (
  <form onSubmit={handleSubmit}>
    <input
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      disabled={createCase.isLoading}
      placeholder="Case title"
    />

    <button type="submit" disabled={createCase.isLoading}>
      {createCase.isLoading ? 'Creating...' : 'Create Case'}
    </button>

    {createCase.isError && (
      <div className="error">{createCase.error.message}</div>
    )}
  </form>
);
```

**What's happening here?**

- `useMutation()` returns a mutation object
- `mutate()` triggers the mutation
- `isLoading` indicates mutation in progress
- `onSuccess` invalidates the cache so the list refetches
- Form inputs are disabled during mutation

## Part 4: Cache Invalidation Patterns (5 minutes)

After a mutation, you need to update the cache. Here are the common patterns:

### Pattern 1: Invalidate and Refetch

```typescript
const createCase = trpc.case.create.useMutation({
  onSuccess: () => {
    // Invalidate specific query
    utils.case.list.invalidate();

    // Or invalidate all case queries
    utils.case.invalidate();
  },
});
```

### Pattern 2: Optimistic Update

```typescript
const updateCase = trpc.case.update.useMutation({
  onMutate: async (updatedData) => {
    // Cancel ongoing queries
    await utils.case.list.cancel();

    // Save snapshot of previous data
    const previousCases = utils.case.list.getData();

    // Optimistically update the cache
    utils.case.list.setData(undefined, (old) =>
      old?.map((c) => (c.id === updatedData.id ? { ...c, ...updatedData } : c))
    );

    return { previousCases };
  },

  onError: (err, updatedData, context) => {
    // Rollback on error
    if (context?.previousCases) {
      utils.case.list.setData(undefined, context.previousCases);
    }
  },

  onSettled: () => {
    // Always refetch to ensure consistency
    utils.case.list.invalidate();
  },
});
```

### Pattern 3: Update Cache Directly

```typescript
const createCase = trpc.case.create.useMutation({
  onSuccess: (newCase) => {
    // Add new case to the cache without refetching
    utils.case.list.setData(undefined, (old) => (old ? [...old, newCase] : [newCase]));
  },
});
```

**When to use which?**

- **Invalidate**: Simplest, safest - use by default
- **Optimistic Update**: For instant UI feedback on updates
- **Direct Update**: When you have the exact new data (e.g., after create)

## Part 5: Testing Your Components (10 minutes)

### Step 1: Create test utilities

Create `packages/client/src/test/utils.ts`:

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@carton/server/src/router';

export const trpc = createTRPCReact<AppRouter>();

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, cacheTime: 0 },
      mutations: { retry: false },
    },
  });
}

export function createTrpcWrapper() {
  const queryClient = createTestQueryClient();
  const trpcClient = trpc.createClient({
    links: [httpBatchLink({ url: 'http://localhost:3001/trpc' })],
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </trpc.Provider>
    );
  };
}

export function renderWithTrpc(ui: React.ReactElement) {
  return render(ui, { wrapper: createTrpcWrapper() });
}
```

### Step 2: Write a test

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { renderWithTrpc } from '../test/utils';
import { MyCases } from './MyCases';

const server = setupServer();

beforeAll(() => server.listen());
afterAll(() => server.close());

describe('MyCases', () => {
  it('displays cases when loaded', async () => {
    server.use(
      http.get('http://localhost:3001/trpc/case.list', () => {
        return HttpResponse.json({
          result: {
            data: [
              { id: '1', title: 'Test Case', description: 'Test' },
            ],
          },
        });
      })
    );

    renderWithTrpc(<MyCases />);

    await waitFor(() => {
      expect(screen.getByText('Test Case')).toBeInTheDocument();
    });
  });
});
```

**Key Testing Points:**

- Use MSW to mock HTTP responses
- Always use `waitFor` for async assertions
- Each test gets a fresh QueryClient
- Mock at the network level, not the tRPC client

## Part 6: Debugging with DevTools (5 minutes)

### Step 1: Install DevTools (if not already)

```bash
cd packages/client
npm install --save-dev @tanstack/react-query-devtools
```

### Step 2: Add DevTools to your app

In `packages/client/src/lib/trpc.tsx`:

```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export function TrpcProvider({ children }: { children: React.ReactNode }) {
  // ... existing code ...

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
        {import.meta.env.DEV && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
```

### Step 3: Use the DevTools

Run your app and look for the React Query icon in the bottom-left corner:

- Click to open the DevTools panel
- See all active queries and their states
- Inspect cached data
- Manually trigger refetches
- View query timelines

**DevTools Features:**

- 🔍 View all queries and their current state
- 📊 See cache data in real-time
- ⏱️ Query execution timeline
- 🔄 Manually refetch or invalidate queries
- 🐛 Debug cache behavior

## Common Patterns Cheat Sheet

### Basic Query

```typescript
const { data, isLoading, error } = trpc.procedure.useQuery(input);
```

### Query with Options

```typescript
const { data } = trpc.procedure.useQuery(input, {
  staleTime: 60000, // Fresh for 1 minute
  enabled: someCondition, // Conditional execution
  refetchInterval: 5000, // Auto-refetch every 5s
});
```

### Basic Mutation

```typescript
const mutation = trpc.procedure.useMutation({
  onSuccess: (data) => {
    /* ... */
  },
  onError: (error) => {
    /* ... */
  },
});

mutation.mutate(input);
```

### Invalidate Cache

```typescript
const utils = trpc.useUtils();

utils.procedure.invalidate(); // Invalidate specific procedure
utils.invalidate(); // Invalidate all
```

### Access Utils

```typescript
const utils = trpc.useUtils();

// Get cached data
const data = utils.procedure.getData(input);

// Set cached data
utils.procedure.setData(input, newData);

// Refetch immediately
utils.procedure.refetch(input);
```

## Next Steps

1. **Read Full Examples**: See detailed patterns in:
   - [Query Examples](./contracts/query-example.tsx)
   - [Mutation Examples](./contracts/mutation-example.tsx)
   - [Test Examples](./contracts/test-example.test.tsx)

2. **Explore the Router**: Check `packages/server/src/router.ts` to see all available procedures

3. **Official Docs**:
   - [tRPC Docs](https://trpc.io/docs)
   - [React Query Docs](https://tanstack.com/query/latest/docs/react/overview)

4. **Practice**: Try adding a new feature:
   - Add a search query with parameters
   - Create a mutation with optimistic updates
   - Write tests for your new components

## Troubleshooting

### Query not running?

- Check the `enabled` option - is it false?
- Is your input undefined? Some queries need valid input

### Cache not updating after mutation?

- Did you call `utils.*.invalidate()` in `onSuccess`?
- Check DevTools to see if the cache invalidated

### TypeScript errors?

- Regenerate types: `npm run dev` in server package
- Check that input matches router schema
- Ensure tRPC client is properly typed with `AppRouter`

### Tests failing?

- Are you using `waitFor` for async assertions?
- Is MSW properly mocking the endpoint?
- Did you create a fresh QueryClient for the test?

## Summary

You now know how to:

- ✅ Fetch data with tRPC queries
- ✅ Create/update data with mutations
- ✅ Manage cache invalidation
- ✅ Test components using tRPC hooks
- ✅ Debug with React Query DevTools

**The key benefits:**

- Full TypeScript type safety
- Automatic loading/error states
- Built-in caching and deduplication
- No manual API client code needed

Happy coding! 🚀
