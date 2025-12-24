# Research: tRPC React Query Integration

**Feature**: Improved API State Management  
**Date**: 2025-12-24  
**Status**: Complete

## Executive Summary

The codebase **already has tRPC + React Query fully integrated** with packages installed and working. This research documents the current implementation, identifies gaps in testing/documentation, and provides best practices for completing the feature requirements.

## Current Implementation Analysis

### ✅ What's Already Working

1. **Package Installation** (FR-001)
   - `@tanstack/react-query` v5.62.14 ✅
   - `@trpc/react-query` v11.0.0 ✅
   - Both installed in packages/client/package.json

2. **tRPC Client Configuration** (FR-002)
   - File: `packages/client/src/lib/trpc.tsx`
   - Uses `createTRPCReact<AppRouter>()` with React Query integration
   - QueryClient properly instantiated with React Query v5 patterns
   - QueryClientProvider wraps application correctly

3. **Query Hooks Usage** (FR-003, FR-004)
   - Example in `packages/client/src/pages/HomePage.tsx`
   - Uses `trpc.case.list.useQuery()` for queries
   - Full TypeScript type inference working
   - Loading states (`isLoading`), error states, and data properly typed

4. **Provider Setup** (FR-005)
   - `TrpcProvider` component wraps app in `packages/client/src/main.tsx`
   - Proper provider hierarchy: trpc.Provider → QueryClientProvider

### 📝 Gaps Identified

1. **Test Best Practices** (FR-007, FR-009)
   - **Gap**: Current mocking pattern has TODO comment indicating it's not ideal
   - **Issue**: Tests mock `trpc` object directly rather than using proper React Query testing utilities
   - **Impact**: Tests don't verify actual query behavior, cache interactions, or React Query features
   - **Solution Needed**: Use `@testing-library/react` with proper QueryClient wrapper for tests

2. **Documentation** (FR-008)
   - **Gap**: README mentions tRPC but doesn't show React Query usage patterns
   - **Missing**: Examples of useQuery, useMutation, cache invalidation
   - **Missing**: Explanation of how caching works and when data refetches
   - **Solution Needed**: Add "tRPC + React Query" section to README with 3+ examples

3. **DevTools** (FR-009)
   - **Gap**: React Query DevTools not installed or configured
   - **Package**: `@tanstack/react-query-devtools` not in devDependencies
   - **Solution Needed**: Install and conditionally render in development

4. **Mutation Examples** (FR-004, FR-006)
   - **Gap**: No mutation examples in codebase yet
   - **Impact**: Documentation can't show mutation patterns without examples
   - **Note**: Not blocking - can document pattern without requiring implementation

## Research Findings

### Decision 1: Testing Pattern for React Query Hooks

**Decision**: Use Testing Library with custom wrapper providing QueryClient  
**Rationale**: This is the official recommended approach from both React Query and tRPC docs  
**Alternatives Considered**:

- ❌ Mock tRPC object directly (current approach) - doesn't test actual query behavior
- ❌ Mock fetch/network layer - too low-level, misses React Query logic
- ✅ Wrap components in test QueryClient - tests real behavior in isolation

**Implementation Pattern**:

```typescript
// Test utilities file
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } }
  });
}

export function createWrapper() {
  const queryClient = createTestQueryClient();
  const trpcClient = trpc.createClient({ links: [/* mock link */] });

  return ({ children }) => (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}

// In tests
const { result } = renderHook(() => trpc.case.list.useQuery(), {
  wrapper: createWrapper(),
});
```

### Decision 2: Documentation Structure

**Decision**: Add new section "Data Fetching with tRPC + React Query" to README  
**Rationale**: Developers need clear examples at point of onboarding  
**Alternatives Considered**:

- ❌ Separate doc file - developers won't find it
- ❌ Only in code comments - not visible during setup
- ✅ README section with links to deeper docs - discoverable and comprehensive

**Content Requirements**:

1. **Example 1**: Basic query (fetching a list)
2. **Example 2**: Mutation (creating/updating data)
3. **Example 3**: Cache invalidation after mutation
4. Links to official tRPC and React Query docs
5. Testing patterns reference

### Decision 3: React Query DevTools Integration

**Decision**: Install `@tanstack/react-query-devtools` and render in dev mode only  
**Rationale**: Standard practice, invaluable for debugging cache behavior  
**Alternatives Considered**:

- ❌ Skip DevTools - loses debugging capability
- ❌ Always render - unnecessary bundle size in production
- ✅ Conditional dev-only render - best of both worlds

**Implementation Pattern**:

```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export function TrpcProvider({ children }) {
  // ... existing setup ...
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
```

### Decision 4: Cache Configuration

**Decision**: Keep default React Query cache settings initially  
**Rationale**: Defaults are sensible (5min stale time, garbage collection after 5min)  
**Alternatives Considered**:

- ❌ Aggressive caching (30min+) - risks stale data issues
- ❌ No caching (0s stale time) - defeats purpose of React Query
- ✅ Use defaults, document how to override per-query - flexible and safe

**Current Configuration** (in packages/client/src/lib/trpc.tsx):

```typescript
const [queryClient] = useState(() => new QueryClient());
// Uses React Query v5 defaults:
// - staleTime: 0 (immediately stale, but cached)
// - cacheTime: 5 minutes
// - refetchOnWindowFocus: true
// - refetchOnReconnect: true
```

**Documentation Note**: Explain that queries can override defaults:

```typescript
trpc.case.list.useQuery(undefined, {
  staleTime: 60000, // Fresh for 1 minute
  refetchInterval: 30000, // Auto-refetch every 30s
});
```

## Best Practices Research

### tRPC + React Query Integration Patterns

**Query Pattern**:

```typescript
// ✅ Good - destructure what you need
const { data, isLoading, error } = trpc.case.list.useQuery();

// ❌ Avoid - accessing result.data makes code verbose
const result = trpc.case.list.useQuery();
return result.data?.map(...);
```

**Mutation Pattern**:

```typescript
const utils = trpc.useUtils();
const createCase = trpc.case.create.useMutation({
  onSuccess: () => {
    // Invalidate and refetch
    utils.case.list.invalidate();
  },
});

// In component
<button onClick={() => createCase.mutate({ title: '...' })}>
  {createCase.isLoading ? 'Creating...' : 'Create Case'}
</button>
```

**Testing Pattern**:

```typescript
// ✅ Good - test with real QueryClient
it('shows loading state', async () => {
  render(<HomePage />, { wrapper: createTrpcWrapper() });
  expect(screen.getByText('Loading')).toBeInTheDocument();
  await waitFor(() => expect(screen.getByText('Case Title')).toBeInTheDocument());
});

// ❌ Avoid - mocking defeats the purpose
vi.mock('@trpc/react-query');
```

### Cache Invalidation Strategies

1. **Optimistic Updates**: Update UI immediately, rollback on error
2. **Pessimistic Updates**: Wait for server response before UI update
3. **Selective Invalidation**: Only invalidate affected queries
4. **Lazy Invalidation**: Mark stale without immediate refetch

**Recommendation**: Start with pessimistic updates + selective invalidation (simplest, safest)

## Technology Choices Summary

| Aspect           | Choice                                | Version | Rationale                                       |
| ---------------- | ------------------------------------- | ------- | ----------------------------------------------- |
| Query Library    | @tanstack/react-query                 | 5.62.14 | Industry standard, excellent TypeScript support |
| tRPC Integration | @trpc/react-query                     | 11.0.0  | Official tRPC integration with React Query      |
| Testing          | Testing Library + QueryClient wrapper | -       | Official recommended pattern                    |
| DevTools         | @tanstack/react-query-devtools        | Latest  | Essential debugging tool                        |
| Mocking          | MSW (Mock Service Worker)             | 2.12.4  | Already in use for Storybook, extends to tests  |

## Open Questions Resolved

**Q1**: Should we upgrade React Query to v6?  
**A**: No - v5 is stable, well-supported, and meets all requirements. Upgrade later if needed.

**Q2**: Do we need custom query keys?  
**A**: No - tRPC generates query keys automatically from router structure.

**Q3**: Should we configure global error handling?  
**A**: Not initially - per-query error handling is more flexible. Can add global handler later.

**Q4**: How to handle authentication errors in queries?  
**A**: Out of scope for this feature. Document pattern but don't implement auth yet.

## Implementation Risks

| Risk                                   | Severity | Mitigation                                                            |
| -------------------------------------- | -------- | --------------------------------------------------------------------- |
| Test refactoring breaks existing tests | Medium   | Update tests incrementally, keep old patterns until new ones proven   |
| DevTools in production bundle          | Low      | Use `import.meta.env.DEV` check, tree-shaking removes from prod build |
| Documentation gets outdated            | Medium   | Add examples that reference actual code files                         |
| Developers unfamiliar with React Query | Low      | Link to official docs, provide working examples in codebase           |

## Next Steps

This research identifies no blockers. All dependencies are installed and working. Proceed to Phase 1 (Design & Contracts) to document:

1. Test utility structure (data-model.md)
2. API patterns and examples (contracts/)
3. Developer quickstart guide (quickstart.md)
