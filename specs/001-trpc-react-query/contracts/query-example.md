# tRPC React Query - Query Example

This file demonstrates the standard pattern for fetching data using tRPC + React Query.

## Component: CaseList.tsx

```typescript
import { trpc } from '../lib/trpc';
import { Link } from 'react-router-dom';

/**
 * Component that fetches and displays a list of cases
 * Demonstrates: useQuery hook, loading states, error handling, typed data
 */
export function CaseList() {
  // ✅ Destructure query result - provides loading, error, data states
  const { data: cases, isLoading, error, refetch } = trpc.case.list.useQuery();
  
  // Handle loading state - show skeleton or spinner
  if (isLoading) {
    return (
      <div className="container">
        <div className="text-center">Loading cases...</div>
      </div>
    );
  }
  
  // Handle error state - show user-friendly message with retry option
  if (error) {
    return (
      <div className="container">
        <div className="text-red-600">
          Error loading cases: {error.message}
          <button onClick={() => refetch()} className="ml-4 underline">
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  // Handle empty state (optional but good UX)
  if (cases?.length === 0) {
    return (
      <div className="container">
        <p>No cases found.</p>
        <Link to="/cases/new" className="text-blue-600 underline">
          Create your first case
        </Link>
      </div>
    );
  }
  
  // Success state - data is fully typed from tRPC router
  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-4">Cases</h1>
      
      <div className="grid gap-4">
        {cases?.map((caseItem) => (
          <Link
            key={caseItem.id}
            to={`/cases/${caseItem.id}`}
            className="block p-4 border rounded hover:shadow"
          >
            <h2 className="font-semibold">{caseItem.title}</h2>
            <p className="text-gray-600">{caseItem.description}</p>
            <div className="text-sm text-gray-500 mt-2">
              Status: {caseItem.status} | Creator: {caseItem.creator.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

## Query with Parameters

```typescript
import { trpc } from '../lib/trpc';

/**
 * Fetch a single case by ID
 * Demonstrates: query with input parameter
 */
export function CaseDetail({ caseId }: { caseId: string }) {
  const { data: caseItem, isLoading, error } = trpc.case.getById.useQuery(
    { id: caseId }, // Query input - fully typed
    {
      // Optional: query options
      enabled: !!caseId, // Only run query if ID exists
      staleTime: 60000, // Consider fresh for 1 minute
      refetchOnWindowFocus: false, // Don't refetch on window focus
    }
  );
  
  if (isLoading) return <div>Loading case...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!caseItem) return <div>Case not found</div>;
  
  return (
    <div>
      <h1>{caseItem.title}</h1>
      <p>{caseItem.description}</p>
    </div>
  );
}
```

## Query with Auto-Refetch

```typescript
import { trpc } from '../lib/trpc';

/**
 * Dashboard with real-time stats
 * Demonstrates: automatic polling/refetching
 */
export function Dashboard() {
  const { data: stats, isLoading } = trpc.dashboard.stats.useQuery(undefined, {
    refetchInterval: 5000, // Refetch every 5 seconds
    refetchIntervalInBackground: false, // Stop refetching when tab not visible
  });
  
  if (isLoading) return <div>Loading dashboard...</div>;
  
  return (
    <div>
      <h1>Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <StatCard title="Open Cases" value={stats?.openCases ?? 0} />
        <StatCard title="Closed Cases" value={stats?.closedCases ?? 0} />
        <StatCard title="Active Users" value={stats?.activeUsers ?? 0} />
      </div>
    </div>
  );
}
```

## Type Safety Benefits

```typescript
// ✅ Full autocomplete and type checking
const { data } = trpc.case.list.useQuery();
//     ^? data: Case[] | undefined
//         ^? Case: { id: string, title: string, status: CaseStatus, ... }

// ✅ TypeScript catches errors at compile time
const { data } = trpc.case.list.useQuery();
data?.forEach(c => {
  console.log(c.titl); // ❌ Error: Property 'titl' does not exist
  console.log(c.title); // ✅ OK
});

// ✅ Input parameters are typed
trpc.case.getById.useQuery({ id: 123 }); // ❌ Error: Type 'number' is not assignable to 'string'
trpc.case.getById.useQuery({ id: '123' }); // ✅ OK
```

## Common Patterns

### Dependent Queries

```typescript
/**
 * Query that depends on another query's result
 */
export function CaseComments({ caseId }: { caseId: string }) {
  // First query: get case details
  const { data: caseItem } = trpc.case.getById.useQuery({ id: caseId });
  
  // Second query: get comments (only runs after case is loaded)
  const { data: comments, isLoading } = trpc.comment.list.useQuery(
    { caseId },
    {
      enabled: !!caseItem, // Only fetch comments if case exists
    }
  );
  
  if (isLoading) return <div>Loading comments...</div>;
  
  return (
    <div>
      {comments?.map(comment => (
        <div key={comment.id}>{comment.content}</div>
      ))}
    </div>
  );
}
```

### Conditional Queries

```typescript
/**
 * Query that only runs based on UI state
 */
export function SearchResults() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: results, isFetching } = trpc.case.search.useQuery(
    { query: searchTerm },
    {
      enabled: searchTerm.length >= 3, // Only search with 3+ characters
    }
  );
  
  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search cases..."
      />
      {isFetching && <div>Searching...</div>}
      {results && <ResultsList results={results} />}
    </div>
  );
}
```

## Performance Tips

1. **Use proper loading states**: Differentiate between `isLoading` (first load) and `isFetching` (background refetch)
2. **Configure staleTime**: Set appropriate `staleTime` to reduce unnecessary refetches
3. **Enable queries conditionally**: Use `enabled` option to prevent queries from running when data isn't needed
4. **Use query keys wisely**: tRPC auto-generates keys, but understand they include all parameters
5. **Avoid unnecessary re-renders**: Destructure only the query properties you need

## Testing Example

See [test-example.test.tsx](./test-example.test.tsx) for how to test components using these patterns.
