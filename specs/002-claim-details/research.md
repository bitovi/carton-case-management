# Research & Technical Decisions: Claim Details Component

**Feature**: Claim Details Component  
**Branch**: `002-claim-details`  
**Date**: December 24, 2025

## Overview

This document captures the technical research and design decisions made during Phase 0 planning for the Claim Details Component feature. All decisions are documented with rationale and alternatives considered.

---

## 1. Comment Model Design

### Decision: Separate Comment Model (Prisma Relation)

**Rationale**:

- Comments are first-class entities that can grow independently
- Enables efficient querying and pagination in the future
- Maintains referential integrity with foreign keys
- Supports rich comment metadata (author, timestamps)
- Follows Prisma best practices for one-to-many relationships

**Alternatives Considered**:

- **Embedded JSON in Case model**: Rejected because:
  - Loses type safety
  - Makes querying individual comments difficult
  - No referential integrity to authors
  - Violates normalization principles
- **Separate Comments table without relations**: Rejected because:
  - Loses Prisma's automatic type generation
  - Manual joins required
  - Doesn't leverage ORM benefits

**Implementation**:

```prisma
model Comment {
  id        String   @id @default(uuid())
  content   String
  authorId  String
  caseId    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  author User @relation(fields: [authorId], references: [id])
  case   Case @relation(fields: [caseId], references: [id], onDelete: Cascade)
}
```

---

## 2. Status Management

### Decision: TypeScript Enum + Prisma Enum

**Rationale**:

- Type-safe status values throughout the application
- Database-level constraint prevents invalid statuses
- Easy to extend with new statuses
- Prisma generates TypeScript enum automatically
- Centralized status definitions

**Alternatives Considered**:

- **String literals only**: Rejected because:
  - No database-level validation
  - Prone to typos
  - Harder to refactor
- **Separate Status model**: Rejected because:
  - Over-engineering for a simple enum
  - Adds unnecessary join complexity
  - Status is an attribute, not an entity
- **Configuration-driven mapping**: Rejected for now because:
  - Premature optimization
  - Can be added later if status logic becomes complex
  - Simple enum satisfies current requirements

**Implementation**:

```prisma
enum ClaimStatus {
  TO_DO
  IN_PROGRESS
  COMPLETED
  CLOSED
}

model Case {
  status ClaimStatus @default(TO_DO)
}
```

```typescript
// UI mapping (can be configuration later)
const STATUS_STYLES = {
  TO_DO: { bg: 'gray-200', text: 'gray-950' },
  IN_PROGRESS: { bg: 'blue-100', text: 'blue-600' },
  COMPLETED: { bg: 'green-100', text: 'green-600' },
  CLOSED: { bg: 'gray-300', text: 'gray-700' },
};
```

---

## 3. Date Formatting Strategy

### Decision: Client-Side Formatting with Intl API

**Rationale**:

- Server sends ISO strings (timezone-agnostic)
- Client formats in user's local timezone
- Intl API is built-in, no dependencies
- Consistent with React best practices
- Easy to test in isolation

**Alternatives Considered**:

- **Server-side formatting**: Rejected because:
  - Loses timezone information
  - Couples presentation logic to API
  - Harder to internationalize later
- **date-fns library**: Rejected because:
  - Adds dependency (24kb min+gzip)
  - Intl API covers our needs
  - Native solution preferred when sufficient

**Implementation**:

```typescript
// packages/client/src/lib/utils/date.ts
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

export function formatTimestamp(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const dateStr = formatDate(d);
  const timeStr = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(d);
  return `${dateStr} at ${timeStr}`;
}
```

---

## 4. Comment Ordering & Pagination

### Decision: Load All Comments (No Pagination Initially)

**Rationale**:

- Spec states claims have <50 comments expected
- 50 comments = ~10-20KB of data (acceptable)
- Simpler implementation for MVP
- Better UX for viewing full conversation
- Can add pagination later if needed

**Alternatives Considered**:

- **Cursor-based pagination**: Rejected for MVP because:
  - Adds complexity unnecessarily
  - tRPC cursor setup overhead
  - No performance issue with <50 comments
- **Offset-based pagination**: Rejected because:
  - Same complexity concerns
  - Worse performance than cursor for future scaling

**Implementation**:

```typescript
// Initial approach: Load all comments
getClaim: publicProcedure
  .input(z.object({ id: z.string().uuid() }))
  .query(async ({ ctx, input }) => {
    return ctx.prisma.case.findUnique({
      where: { id: input.id },
      include: {
        comments: {
          include: { author: true },
          orderBy: { createdAt: 'desc' },
        },
        assignee: true,
        creator: true,
      },
    });
  });
```

**Migration Path**: If pagination needed later:

1. Add `limit` and `cursor` to input schema
2. Update query to use `take` and `skip`
3. Return `nextCursor` in response
4. Update UI to use infinite scroll

---

## 5. Real-time Updates Strategy

### Decision: Manual Refresh Only (No Real-time for MVP)

**Rationale**:

- Out of scope per feature spec
- Polling adds unnecessary complexity
- WebSockets/subscriptions are overkill
- tRPC's query invalidation handles optimistic updates
- Can add later if user feedback demands it

**Alternatives Considered**:

- **Polling**: Rejected because:
  - Battery drain on mobile
  - Unnecessary server load
  - Poor UX for rare updates
- **tRPC subscriptions**: Rejected because:
  - Requires WebSocket infrastructure
  - Significant complexity increase
  - Not requested in requirements

**Future Enhancement**: If real-time needed:

- Use tRPC subscriptions with Server-Sent Events (SSE)
- Subscribe to case updates when viewing details
- Invalidate cache on external updates

---

## 6. Avatar Generation Pattern

### Decision: Client-Side CSS-Based Initials

**Rationale**:

- No external dependencies
- Instant rendering (no network requests)
- Consistent with existing patterns in codebase
- Easy to test
- Accessible (text content for screen readers)

**Alternatives Considered**:

- **Placeholder image service (UI Avatars, DiceBear)**: Rejected because:
  - External dependency
  - Network latency
  - Privacy concerns (sends names to third party)
  - Not necessary for simple initials
- **SVG generation**: Rejected because:
  - Over-engineering
  - CSS solution is simpler
  - No advantage for static initials

**Implementation**:

```typescript
// packages/client/src/lib/utils/avatar.ts
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Usage in component
<div className="avatar">
  {getInitials(author.name)}
</div>
```

**Color Generation**: Use consistent hash-based colors:

```typescript
export function getAvatarColor(name: string): string {
  const colors = ['bg-blue-100', 'bg-green-100', 'bg-purple-100', 'bg-pink-100'];
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}
```

---

## 7. Error Handling Patterns

### Decision: Error Boundaries + Inline Error States

**Rationale**:

- Graceful degradation at component level
- tRPC provides structured error responses
- React Query handles loading/error states
- Error boundaries catch unexpected failures
- Consistent with existing app patterns

**Implementation Strategy**:

```typescript
// Component-level error handling
function ClaimDetailsPage({ id }: Props) {
  const { data, error, isLoading } = trpc.getClaim.useQuery({ id });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!data) return <NotFound />;

  return <ClaimDetails claim={data} />;
}

// Error boundary for unexpected errors
<ErrorBoundary fallback={<ErrorPage />}>
  <ClaimDetailsPage />
</ErrorBoundary>
```

**Error Types**:

- **Network errors**: Retry button with exponential backoff
- **Not found (404)**: User-friendly "Claim not found" message
- **Authorization (403)**: Redirect to login or access denied page
- **Server errors (500)**: Generic error message with support contact

---

## 8. Sidebar Navigation State

### Decision: URL-Based Routing with React Router

**Rationale**:

- URL is source of truth for current claim
- Shareable links
- Browser back/forward works
- Integrates with existing routing setup
- React Query caches by URL parameter

**Alternatives Considered**:

- **Component state only**: Rejected because:
  - Not shareable
  - Breaks browser navigation
  - Loses state on refresh
- **Query params (`?claimId=xxx`)**: Rejected because:
  - Less semantic than route params
  - Longer URLs
  - Not RESTful

**Implementation**:

```typescript
// Route definition
<Route path="/claims/:id" element={<ClaimDetailsPage />} />

// Navigation
function ClaimSidebar({ claims }: Props) {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <>
      {claims.map(claim => (
        <button
          key={claim.id}
          className={id === claim.id ? 'selected' : ''}
          onClick={() => navigate(`/claims/${claim.id}`)}
        >
          {claim.title}
        </button>
      ))}
    </>
  );
}
```

---

## Best Practices Research

### tRPC Patterns

**Query Composition**:

- Use `include` in Prisma queries to fetch related data
- Avoid N+1 queries by including relations
- Use `select` when only specific fields needed

**Error Handling**:

```typescript
import { TRPCError } from '@trpc/server';

throw new TRPCError({
  code: 'NOT_FOUND',
  message: 'Claim not found',
});
```

**Input Validation**:

- Always use Zod schemas for input validation
- Share schemas between client and server via `shared` package
- Validate at API boundary, trust after validation

### Prisma Best Practices

**Seeding Strategy**:

```typescript
// packages/server/prisma/seed.ts
async function main() {
  // Clear existing data (dev only)
  await prisma.comment.deleteMany();
  await prisma.case.deleteMany();
  await prisma.user.deleteMany();

  // Create users first (dependencies)
  const users = await Promise.all([...]);

  // Create cases with relations
  const cases = await Promise.all([...]);

  // Create comments
  await Promise.all([...]);
}
```

**Transaction Handling**:

- Use transactions for multi-step operations
- Comment creation doesn't need transaction (single operation)
- Future enhancement: use transactions for complex workflows

### React Query Patterns

**Cache Invalidation**:

```typescript
const utils = trpc.useContext();

const addComment = trpc.addComment.useMutation({
  onSuccess: () => {
    // Invalidate claim query to refresh comments
    utils.getClaim.invalidate({ id: claimId });
  },
});
```

**Optimistic Updates**:

```typescript
const addComment = trpc.addComment.useMutation({
  onMutate: async (newComment) => {
    // Cancel outgoing refetches
    await utils.getClaim.cancel({ id: claimId });

    // Snapshot current value
    const previous = utils.getClaim.getData({ id: claimId });

    // Optimistically update
    utils.getClaim.setData({ id: claimId }, (old) => ({
      ...old,
      comments: [...old.comments, newComment],
    }));

    return { previous };
  },
  onError: (err, variables, context) => {
    // Rollback on error
    utils.getClaim.setData({ id: claimId }, context.previous);
  },
});
```

### Storybook Patterns

**MSW Integration for API Mocking**:

```typescript
// .storybook/preview.tsx
import { initialize, mswLoader } from 'msw-storybook-addon';
initialize();

export const loaders = [mswLoader];
```

**Component Stories with Mock Data**:

```typescript
export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        rest.get('/api/trpc/getClaim', (req, res, ctx) => {
          return res(ctx.json(mockClaimData));
        }),
      ],
    },
  },
};
```

---

## Technology Choices Summary

| Area                | Choice                        | Rationale                                       |
| ------------------- | ----------------------------- | ----------------------------------------------- |
| **Data Model**      | Prisma separate Comment model | Type safety, scalability, referential integrity |
| **Status**          | TypeScript + Prisma enum      | Type safety, database constraints               |
| **Date Formatting** | Client-side Intl API          | Timezone awareness, no dependencies             |
| **Pagination**      | None (load all)               | <50 comments, simpler MVP                       |
| **Real-time**       | None                          | Out of scope, can add later                     |
| **Avatars**         | CSS-based initials            | No dependencies, instant rendering              |
| **Error Handling**  | Boundaries + inline           | Graceful degradation                            |
| **Navigation**      | URL-based routing             | Shareable, browser integration                  |

---

## Open Questions & Future Enhancements

### Resolved

- ✅ Comment structure
- ✅ Status management
- ✅ Date formatting
- ✅ Pagination strategy
- ✅ Avatar generation

### Future Considerations

- **Search/Filter Comments**: If comments exceed 50, add search
- **Rich Text Comments**: If users need formatting, add markdown support
- **Comment Reactions**: If collaboration needs emojis/reactions
- **Real-time Updates**: If multi-user editing becomes common
- **Audit Trail**: If compliance requires detailed change history

---

**Research Status**: ✅ COMPLETE  
**Next Phase**: Phase 1 - Data Model & Contracts
