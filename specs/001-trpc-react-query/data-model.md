# Data Model: tRPC React Query Integration

**Feature**: Improved API State Management  
**Date**: 2025-12-24  
**Related**: [research.md](research.md)

## Overview

This document defines the structural patterns and component relationships for tRPC + React Query integration. Since this is an enhancement to existing infrastructure rather than new data entities, this focuses on the **test infrastructure** and **documentation structure** rather than database models.

## Test Infrastructure Entities

### TestQueryClient

**Purpose**: Isolated QueryClient instance for testing  
**Location**: `packages/client/src/test/utils.ts` (to be created)

**Structure**:

```typescript
interface TestQueryClientConfig {
  defaultOptions?: QueryClientConfig['defaultOptions'];
}

function createTestQueryClient(config?: TestQueryClientConfig): QueryClient;
```

**Behavior**:

- Disables retries (faster test execution)
- No persistence between tests
- Isolated cache per test
- Custom error handling can be configured

**Usage Pattern**:

```typescript
const queryClient = createTestQueryClient({
  defaultOptions: {
    queries: { retry: false, cacheTime: 0 },
    mutations: { retry: false },
  },
});
```

---

### TrpcTestWrapper

**Purpose**: React component wrapper for testing tRPC hooks  
**Location**: `packages/client/src/test/utils.ts` (to be created)

**Structure**:

```typescript
interface TrpcTestWrapperProps {
  children: React.ReactNode;
  mockResponses?: MockTrpcResponses;
}

function createTrpcWrapper(options?: TrpcWrapperOptions): React.FC;
```

**Relationships**:

- Contains TestQueryClient instance
- Provides trpc.Provider context
- Provides QueryClientProvider context
- Optionally integrates with MSW for response mocking

**Usage Pattern**:

```typescript
render(<HomePage />, {
  wrapper: createTrpcWrapper({
    mockResponses: {
      'case.list': [{ id: '1', title: 'Test' }]
    }
  })
});
```

---

### MockTrpcLink

**Purpose**: tRPC link that returns mocked data in tests  
**Location**: `packages/client/src/test/mockTrpcLink.ts` (to be created)

**Structure**:

```typescript
interface MockResponse {
  [procedurePath: string]: any | Error;
}

function createMockTrpcLink(responses: MockResponse): TRPCLink;
```

**Behavior**:

- Intercepts tRPC calls before network
- Returns predefined responses synchronously
- Can simulate errors
- No actual HTTP requests made

**Usage Pattern**:

```typescript
const mockLink = createMockTrpcLink({
  'case.list': [{ id: '1', title: 'Mocked Case' }],
  'case.create': new Error('Network error'),
});

const trpcClient = trpc.createClient({ links: [mockLink] });
```

---

## Documentation Structure Entities

### QuickstartGuide

**Purpose**: Developer onboarding document  
**Location**: `specs/001-trpc-react-query/quickstart.md`

**Content Sections**:

1. **Prerequisites**: Knowledge requirements, installed packages
2. **Basic Query**: Fetching data with useQuery
3. **Basic Mutation**: Creating/updating data with useMutation
4. **Cache Invalidation**: Refreshing data after mutations
5. **Testing Patterns**: How to test components using tRPC hooks
6. **Debugging**: Using React Query DevTools

**Target Audience**: Developers new to project or React Query

---

### ExampleContracts

**Purpose**: Concrete code examples showing tRPC + React Query patterns  
**Location**: `specs/001-trpc-react-query/contracts/`

**Files**:

- `query-example.tsx`: Complete query component example
- `mutation-example.tsx`: Complete mutation component example
- `test-example.test.tsx`: Complete test file example
- `cache-invalidation.md`: Patterns for cache management

**Format**: Fully functional, copy-pasteable code with explanatory comments

---

## Component Interaction Patterns

### Query Flow

```
User Component
  ↓ calls
trpc.procedure.useQuery()
  ↓ uses
QueryClient (manages cache)
  ↓ checks cache
  ↓ if stale/missing
TrpcClient (network layer)
  ↓ HTTP request
tRPC Server Router
  ↓ returns data
QueryClient (updates cache)
  ↓ triggers re-render
User Component (shows data)
```

### Mutation Flow

```
User Action (button click)
  ↓ triggers
trpc.procedure.useMutation()
  ↓ calls mutate()
TrpcClient (network request)
  ↓ HTTP request
tRPC Server Router
  ↓ performs action
  ↓ returns result
onSuccess callback
  ↓ invalidates cache
QueryClient.invalidateQueries()
  ↓ refetches
Related queries update
  ↓ triggers re-render
UI reflects changes
```

### Test Flow

```
Test Setup
  ↓ creates
TestQueryClient (isolated cache)
  ↓ creates
MockTrpcLink (predefined responses)
  ↓ creates
TrpcTestWrapper
  ↓ wraps
Component Under Test
  ↓ renders
Component calls trpc.*.useQuery()
  ↓ intercepts
MockTrpcLink returns mock data
  ↓ updates
TestQueryClient cache
  ↓ renders
Component with mocked data
  ↓ assertions
Test verifies behavior
```

## State Management Patterns

### Query State

**States**: `idle` → `loading` → `success` | `error`

**Properties Available**:

- `data`: Query result (undefined while loading)
- `isLoading`: Boolean, true during first fetch
- `isFetching`: Boolean, true during any fetch (including refetch)
- `error`: Error object if query failed
- `isError`: Boolean, true if query failed
- `isSuccess`: Boolean, true if query succeeded

**Lifecycle**:

1. Component mounts → query starts → `isLoading: true`
2. Data arrives → cache updated → `isSuccess: true, data: [...]`
3. Component unmounts → query stays in cache
4. Component remounts → data from cache → `isFetching: true` (background refetch)
5. Fresh data arrives → cache updated silently

### Mutation State

**States**: `idle` → `loading` → `success` | `error` → `idle`

**Properties Available**:

- `mutate()`: Function to trigger mutation
- `mutateAsync()`: Promise-based mutation trigger
- `isLoading`: Boolean, true while mutation in progress
- `isSuccess`: Boolean, true after successful mutation
- `isError`: Boolean, true if mutation failed
- `reset()`: Function to reset mutation state

**Lifecycle**:

1. User action → `mutate({ data })` → `isLoading: true`
2. Server responds → `isSuccess: true`
3. `onSuccess` callback → invalidate related queries
4. Related queries refetch → UI updates
5. Reset on next mutation or manual `reset()`

## Cache Configuration

### Default Settings

```typescript
{
  staleTime: 0,              // Data immediately considered stale
  cacheTime: 5 * 60 * 1000, // Keep unused data for 5 minutes
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
  refetchOnMount: true,
  retry: 3,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
}
```

### Per-Query Overrides

Queries can override defaults when business logic requires:

```typescript
// Example: User profile cached for 5 minutes
trpc.user.profile.useQuery(undefined, {
  staleTime: 5 * 60 * 1000,
  cacheTime: 10 * 60 * 1000,
});

// Example: Real-time dashboard data
trpc.dashboard.stats.useQuery(undefined, {
  refetchInterval: 5000, // Refetch every 5 seconds
  staleTime: 0,
});

// Example: Static reference data
trpc.reference.countries.useQuery(undefined, {
  staleTime: Infinity, // Never auto-refetch
  cacheTime: Infinity, // Keep forever
});
```

## Validation Rules

### Type Safety Requirements

1. **No `any` types**: All query/mutation data must be typed from tRPC router
2. **No type assertions**: Rely on tRPC's automatic type inference
3. **Null checks**: Always check `data` for undefined before accessing properties
4. **Error typing**: Use typed error objects from tRPC

### Testing Requirements

1. **Isolated cache**: Each test must have its own QueryClient
2. **No shared state**: Tests must not depend on execution order
3. **Async handling**: Use `waitFor` for async query updates
4. **Cleanup**: Query cache cleared between tests

### Documentation Requirements

1. **Working examples**: All code snippets must be valid, tested code
2. **Type annotations**: Show full TypeScript types in examples
3. **Error handling**: Examples must show error state handling
4. **Loading states**: Examples must show loading state handling

## Migration Path

Since this is enhancing existing infrastructure:

1. **Phase 1**: Create test utilities (non-breaking)
2. **Phase 2**: Update existing tests one file at a time (gradual)
3. **Phase 3**: Add documentation with examples from updated tests (safe)
4. **Phase 4**: Add DevTools (non-breaking, development-only)

**No breaking changes required** - all enhancements are additive.

## Relationships to Existing Models

This feature doesn't introduce new data models but enhances how existing Prisma models are accessed:

- **Case** model (from Prisma) → accessed via `trpc.case.*` queries
- **User** model (from Prisma) → accessed via `trpc.user.*` queries
- **All models** → benefit from automatic caching, loading states, and error handling

The data models themselves remain in `packages/server/prisma/schema.prisma` as the single source of truth per constitution.
