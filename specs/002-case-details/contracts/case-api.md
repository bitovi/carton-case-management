# tRPC API Contracts: Case Details View

**Date**: December 24, 2025  
**Feature**: Case Details View  
**Branch**: `002-case-details`

## Overview

This document defines the tRPC API contracts for case details functionality. All endpoints are type-safe procedures with Zod validation.

---

## API Router: `cases`

Base namespace: `cases.*`

---

### Query: `cases.list`

**Purpose**: Retrieve a list of all cases for the sidebar

**Type**: Query (idempotent, cacheable)

**Input Schema**:

```typescript
z.object({
  status: z.nativeEnum(CaseStatus).optional(),
  limit: z.number().min(1).max(100).default(50),
  offset: z.number().min(0).default(0),
}).optional();
```

**Input Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| status | CaseStatus | No | undefined | Filter by case status |
| limit | number | No | 50 | Max cases to return |
| offset | number | No | 0 | Pagination offset |

**Response Type**:

```typescript
{
  cases: Array<{
    id: string;
    title: string;
    caseType: string;
    status: CaseStatus;
    customerName: string;
    updatedAt: Date;
  }>;
  total: number;
}
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| cases | Array | List of case summary objects |
| cases[].id | string | Case UUID |
| cases[].title | string | Case ID display (e.g., "#CAS-242314-2124") |
| cases[].caseType | string | Case type name |
| cases[].status | CaseStatus | Current status |
| cases[].customerName | string | Customer associated with case |
| cases[].updatedAt | Date | Last update timestamp |
| total | number | Total count (for pagination) |

**Errors**:

- `BAD_REQUEST` (400): Invalid status enum value
- `INTERNAL_SERVER_ERROR` (500): Database error

**Example Usage**:

```typescript
// Client
const { data } = trpc.cases.list.useQuery({ limit: 10 });

// Server implementation
list: publicProcedure
  .input(listCasesSchema)
  .query(async ({ input }) => {
    const cases = await prisma.case.findMany({
      where: input?.status ? { status: input.status } : undefined,
      take: input?.limit ?? 50,
      skip: input?.offset ?? 0,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        caseType: true,
        status: true,
        customerName: true,
        updatedAt: true,
      },
    });
    const total = await prisma.case.count({
      where: input?.status ? { status: input.status } : undefined,
    });
    return { cases, total };
  }),
```

---

### Query: `cases.getById`

**Purpose**: Retrieve full case details including comments and relationships

**Type**: Query (idempotent, cacheable)

**Input Schema**:

```typescript
z.object({
  id: z.string().uuid('Invalid case ID'),
});
```

**Input Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string (UUID) | Yes | Case identifier |

**Response Type**:

```typescript
{
  id: string;
  title: string;
  description: string;
  status: CaseStatus;
  caseType: string;
  customerName: string;
  createdBy: string;
  assignedTo: string | null;
  createdAt: Date;
  updatedAt: Date;
  creator: {
    id: string;
    name: string;
    email: string;
  };
  assignee: {
    id: string;
    name: string;
    email: string;
  } | null;
  comments: Array<{
    id: string;
    content: string;
    createdAt: Date;
    author: {
      id: string;
      name: string;
      email: string;
    };
  }>;
}
```

**Response Fields**: See CaseWithComments interface in data-model.md

**Errors**:

- `BAD_REQUEST` (400): Invalid UUID format
- `NOT_FOUND` (404): Case with given ID not found
- `INTERNAL_SERVER_ERROR` (500): Database error

**Example Usage**:

```typescript
// Client
const { data } = trpc.cases.getById.useQuery({ id: 'case-uuid' });

// Server implementation
getById: publicProcedure
  .input(getCaseByIdSchema)
  .query(async ({ input }) => {
    const caseData = await prisma.case.findUnique({
      where: { id: input.id },
      include: {
        creator: {
          select: { id: true, name: true, email: true },
        },
        assignee: {
          select: { id: true, name: true, email: true },
        },
        comments: {
          include: {
            author: {
              select: { id: true, name: true, email: true },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!caseData) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Case with id ${input.id} not found`,
      });
    }

    return caseData;
  }),
```

---

### Mutation: `cases.addComment`

**Purpose**: Add a new comment to a case

**Type**: Mutation (creates resource, not idempotent)

**Input Schema**:

```typescript
z.object({
  caseId: z.string().uuid('Invalid case ID'),
  content: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(5000, 'Comment too long (max 5000 characters)'),
});
```

**Input Parameters**:
| Parameter | Type | Required | Constraints | Description |
|-----------|------|----------|-------------|-------------|
| caseId | string (UUID) | Yes | Valid UUID | Target case ID |
| content | string | Yes | 1-5000 chars | Comment text content |

**Context Requirements**:
| Field | Type | Description |
|-------|------|-------------|
| userId | string | Authenticated user ID (from session/JWT) |

**Response Type**:

```typescript
{
  id: string;
  content: string;
  caseId: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    name: string;
    email: string;
  }
}
```

**Response Fields**: See CommentWithAuthor interface in data-model.md

**Side Effects**:

1. Creates new Comment record in database
2. Updates Case.updatedAt timestamp
3. Invalidates `cases.getById` cache for affected case
4. Invalidates `cases.list` cache (updatedAt changed)

**Errors**:

- `BAD_REQUEST` (400): Invalid input (empty content, invalid UUID)
- `NOT_FOUND` (404): Case with given ID not found
- `UNAUTHORIZED` (401): No authenticated user in context
- `INTERNAL_SERVER_ERROR` (500): Database error

**Example Usage**:

```typescript
// Client
const mutation = trpc.cases.addComment.useMutation({
  onSuccess: () => {
    utils.cases.getById.invalidate({ id: caseId });
    utils.cases.list.invalidate();
  },
});

mutation.mutate({
  caseId: 'case-uuid',
  content: 'This is a comment',
});

// Server implementation
addComment: publicProcedure
  .input(createCommentSchema)
  .mutation(async ({ input, ctx }) => {
    // In MVP, use first user as author (no auth yet)
    const author = await prisma.user.findFirst();
    if (!author) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'No users found in database',
      });
    }

    // Verify case exists
    const caseExists = await prisma.case.findUnique({
      where: { id: input.caseId },
    });

    if (!caseExists) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Case with id ${input.caseId} not found`,
      });
    }

    // Create comment and update case timestamp
    const comment = await prisma.comment.create({
      data: {
        content: input.content,
        caseId: input.caseId,
        authorId: author.id,
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    // Update case timestamp
    await prisma.case.update({
      where: { id: input.caseId },
      data: { updatedAt: new Date() },
    });

    return comment;
  }),
```

---

## Error Handling

### Standard Error Response

All tRPC errors follow this structure:

```typescript
{
  error: {
    code: 'BAD_REQUEST' | 'NOT_FOUND' | 'UNAUTHORIZED' | 'INTERNAL_SERVER_ERROR';
    message: string;
    data?: {
      zodError?: ZodError; // For validation errors
    };
  };
}
```

### Error Codes

| Code                  | HTTP Status | Usage                                |
| --------------------- | ----------- | ------------------------------------ |
| BAD_REQUEST           | 400         | Invalid input, validation failure    |
| UNAUTHORIZED          | 401         | Missing or invalid authentication    |
| NOT_FOUND             | 404         | Resource doesn't exist               |
| INTERNAL_SERVER_ERROR | 500         | Database errors, unexpected failures |

---

## Cache Invalidation Strategy

### Query Cache Keys

```typescript
// React Query cache keys (automatic via tRPC)
['cases', 'list', { input: { status?, limit, offset } }]
['cases', 'getById', { input: { id: 'uuid' } }]
```

### Invalidation Rules

**After `cases.addComment` mutation**:

```typescript
utils.cases.getById.invalidate({ id: caseId }); // Specific case
utils.cases.list.invalidate(); // List (updatedAt changed)
```

**Automatic Refetch**:

- List refetches when window regains focus (default React Query behavior)
- Case details refetch when navigating back to same case

**Cache TTL**:

- `cases.list`: 1 minute stale time
- `cases.getById`: 30 seconds stale time
- Mutations: No caching

---

## Authentication & Authorization

### MVP Approach (Phase 1)

- **Authentication**: Not implemented, use first user in database
- **Authorization**: All users can view all cases, add comments to any case

### Future Enhancement (Post-MVP)

- JWT-based authentication
- Role-based access control (case worker, admin, viewer)
- Case assignment restrictions

---

## Rate Limiting

### MVP Approach

- No rate limiting implemented

### Future Enhancement

- 100 requests per minute per user
- Separate limits for queries vs mutations

---

## Testing Contracts

### Integration Test Requirements

**Test File**: `packages/server/src/router.test.ts`

**Required Tests**:

```typescript
describe('cases router', () => {
  describe('cases.list', () => {
    it('returns all cases when no filter provided');
    it('filters by status when provided');
    it('respects limit and offset for pagination');
    it('orders by updatedAt descending');
  });

  describe('cases.getById', () => {
    it('returns case with all relationships');
    it('includes comments ordered by createdAt ascending');
    it('throws NOT_FOUND for invalid case ID');
    it('throws BAD_REQUEST for malformed UUID');
  });

  describe('cases.addComment', () => {
    it('creates comment and returns with author');
    it('updates case updatedAt timestamp');
    it('throws BAD_REQUEST for empty content');
    it('throws BAD_REQUEST for content exceeding 5000 chars');
    it('throws NOT_FOUND for invalid case ID');
  });
});
```

---

## Summary

- **3 Procedures**: list (query), getById (query), addComment (mutation)
- **Type Safety**: Full TypeScript inference from Prisma → tRPC → React Query
- **Validation**: Zod schemas on all inputs
- **Error Handling**: Standard tRPC error codes with descriptive messages
- **Caching**: React Query automatic caching with invalidation on mutations
- **Testing**: Integration tests for all procedures

All contracts follow tRPC best practices and maintain end-to-end type safety as required by the project constitution.
