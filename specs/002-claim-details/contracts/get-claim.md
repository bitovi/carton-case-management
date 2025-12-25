# API Contract: getClaim

**Procedure Type**: Query  
**Access**: Public (will be protected in production)  
**Purpose**: Fetch detailed information about a specific claim including all related data

---

## Input Schema

```typescript
// Zod Schema
const getClaimInput = z.object({
  id: z.string().uuid('Invalid claim ID format'),
});

// TypeScript Type
type GetClaimInput = {
  id: string; // UUID format
};
```

**Validation Rules**:

- `id` is required
- `id` must be a valid UUID format
- Returns validation error if format is invalid

---

## Output Schema

```typescript
// TypeScript Type (matches ClaimWithDetails from shared types)
type GetClaimOutput = {
  id: string;
  title: string;
  caseNumber: string;
  description: string;
  status: 'TO_DO' | 'IN_PROGRESS' | 'COMPLETED' | 'CLOSED';
  customerName: string;
  assignedTo: string | null;
  createdBy: string;
  createdAt: Date; // ISO string over wire
  updatedAt: Date; // ISO string over wire
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
    authorId: string;
    caseId: string;
    createdAt: Date; // ISO string over wire
    updatedAt: Date; // ISO string over wire
    author: {
      id: string;
      name: string;
      email: string;
    };
  }>;
};
```

---

## Behavior

### Success Case (200)

**Request**:

```typescript
trpc.getClaim.useQuery({ id: '123e4567-e89b-12d3-a456-426614174000' });
```

**Response**:

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Insurance Claim Dispute",
  "caseNumber": "CAS-242314-2124",
  "description": "Sarah Johnson is a single mother...",
  "status": "TO_DO",
  "customerName": "Sarah Johnson",
  "assignedTo": "789e4567-e89b-12d3-a456-426614174000",
  "createdBy": "456e4567-e89b-12d3-a456-426614174000",
  "createdAt": "2025-10-24T10:00:00.000Z",
  "updatedAt": "2025-12-12T15:30:00.000Z",
  "creator": {
    "id": "456e4567-e89b-12d3-a456-426614174000",
    "name": "Alex Morgan",
    "email": "alex.morgan@example.com"
  },
  "assignee": {
    "id": "789e4567-e89b-12d3-a456-426614174000",
    "name": "John Doe",
    "email": "john.doe@example.com"
  },
  "comments": [
    {
      "id": "abc12345-e89b-12d3-a456-426614174000",
      "content": "Verified income documentation...",
      "authorId": "456e4567-e89b-12d3-a456-426614174000",
      "caseId": "123e4567-e89b-12d3-a456-426614174000",
      "createdAt": "2025-11-29T11:55:00.000Z",
      "updatedAt": "2025-11-29T11:55:00.000Z",
      "author": {
        "id": "456e4567-e89b-12d3-a456-426614174000",
        "name": "Alex Morgan",
        "email": "alex.morgan@example.com"
      }
    }
  ]
}
```

### Error Cases

#### NOT_FOUND (404)

**Scenario**: Claim ID does not exist

**Request**:

```typescript
trpc.getClaim.useQuery({ id: 'nonexistent-uuid' });
```

**Response**:

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Claim not found"
  }
}
```

#### BAD_REQUEST (400)

**Scenario**: Invalid UUID format

**Request**:

```typescript
trpc.getClaim.useQuery({ id: 'invalid-id' });
```

**Response**:

```json
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "Invalid claim ID format"
  }
}
```

#### INTERNAL_SERVER_ERROR (500)

**Scenario**: Database connection failure or unexpected error

**Response**:

```json
{
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "An unexpected error occurred"
  }
}
```

---

## Implementation Reference

```typescript
// packages/server/src/router.ts
import { z } from 'zod';
import { publicProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server';

export const appRouter = router({
  getClaim: publicProcedure
    .input(
      z.object({
        id: z.string().uuid('Invalid claim ID format'),
      })
    )
    .query(async ({ ctx, input }) => {
      const claim = await ctx.prisma.case.findUnique({
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
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (!claim) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Claim not found',
        });
      }

      return claim;
    }),
});
```

---

## Client Usage

```typescript
// packages/client/src/pages/ClaimDetailsPage.tsx
import { trpc } from '../lib/trpc';

function ClaimDetailsPage({ id }: { id: string }) {
  const { data, error, isLoading } = trpc.getClaim.useQuery(
    { id },
    {
      // React Query options
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 3,
    }
  );

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error.message} />;
  if (!data) return <NotFound />;

  return <ClaimDetails claim={data} />;
}
```

---

## Testing

### Integration Test

```typescript
// packages/server/src/router.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { createContext } from './context';
import { appRouter } from './router';

describe('getClaim', () => {
  let ctx: Awaited<ReturnType<typeof createContext>>;
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeEach(async () => {
    ctx = await createContext();
    caller = appRouter.createCaller(ctx);
  });

  it('should return claim with all details', async () => {
    // Arrange: Create test claim
    const testClaim = await ctx.prisma.case.create({
      data: {
        title: 'Test Claim',
        caseNumber: 'CAS-TEST-001',
        description: 'Test description',
        customerName: 'Test Customer',
        createdBy: 'test-user-id',
      },
    });

    // Act
    const result = await caller.getClaim({ id: testClaim.id });

    // Assert
    expect(result).toBeDefined();
    expect(result.id).toBe(testClaim.id);
    expect(result.title).toBe('Test Claim');
    expect(result.creator).toBeDefined();
    expect(result.comments).toBeInstanceOf(Array);
  });

  it('should throw NOT_FOUND for non-existent claim', async () => {
    // Act & Assert
    await expect(caller.getClaim({ id: '00000000-0000-0000-0000-000000000000' })).rejects.toThrow(
      'Claim not found'
    );
  });

  it('should throw BAD_REQUEST for invalid UUID', async () => {
    // Act & Assert
    await expect(caller.getClaim({ id: 'invalid-id' })).rejects.toThrow('Invalid claim ID format');
  });
});
```

---

## Performance Considerations

**Query Optimization**:

- Uses `include` to fetch related data in single query (no N+1 problem)
- Selects only necessary user fields (id, name, email)
- Comments ordered by `createdAt DESC` at database level

**Expected Response Time**:

- <100ms for claims with <10 comments
- <300ms for claims with 50 comments
- Database indexes on `case.id` (primary key) ensure fast lookups

**Caching Strategy**:

- Client-side: React Query caches for 5 minutes
- Server-side: No caching initially (can add Redis later if needed)

---

**Contract Status**: ✅ COMPLETE  
**Version**: 1.0.0  
**Last Updated**: December 24, 2025
