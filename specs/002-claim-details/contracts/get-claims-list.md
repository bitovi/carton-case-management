# API Contract: getClaimsList

**Procedure Type**: Query  
**Access**: Public (will be protected in production)  
**Purpose**: Fetch a list of claims for sidebar navigation

---

## Input Schema

```typescript
// Zod Schema
const getClaimsListInput = z
  .object({
    limit: z.number().int().positive().max(100).optional().default(20),
  })
  .optional();

// TypeScript Type
type GetClaimsListInput = {
  limit?: number; // Default: 20, Max: 100
};
```

**Validation Rules**:

- `limit` is optional (defaults to 20)
- `limit` must be a positive integer
- `limit` cannot exceed 100
- Input object itself is optional (can call with no arguments)

---

## Output Schema

```typescript
// TypeScript Type
type GetClaimsListOutput = Array<{
  id: string;
  title: string;
  caseNumber: string;
  status: 'TO_DO' | 'IN_PROGRESS' | 'COMPLETED' | 'CLOSED';
}>;
```

**Note**: Returns minimal data for efficient sidebar rendering. Full details fetched separately via `getClaim`.

---

## Behavior

### Success Case (200)

**Request**:

```typescript
// With limit
trpc.getClaimsList.useQuery({ limit: 10 });

// Without arguments (uses default)
trpc.getClaimsList.useQuery();
```

**Response**:

```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Insurance Claim Dispute",
    "caseNumber": "CAS-242314-2124",
    "status": "TO_DO"
  },
  {
    "id": "234e4567-e89b-12d3-a456-426614174000",
    "title": "Policy Coverage Inquiry",
    "caseNumber": "CAS-242315-2125",
    "status": "IN_PROGRESS"
  },
  {
    "id": "345e4567-e89b-12d3-a456-426614174000",
    "title": "Premium Adjustment Request",
    "caseNumber": "CAS-242316-2126",
    "status": "COMPLETED"
  }
]
```

### Empty List

**Scenario**: No claims exist in database

**Response**:

```json
[]
```

### Error Cases

#### BAD_REQUEST (400)

**Scenario**: Invalid limit value

**Request**:

```typescript
trpc.getClaimsList.useQuery({ limit: -5 });
```

**Response**:

```json
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "Limit must be a positive integer"
  }
}
```

**Scenario**: Limit exceeds maximum

**Request**:

```typescript
trpc.getClaimsList.useQuery({ limit: 150 });
```

**Response**:

```json
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "Limit cannot exceed 100"
  }
}
```

---

## Implementation Reference

```typescript
// packages/server/src/router.ts
export const appRouter = router({
  getClaimsList: publicProcedure
    .input(
      z
        .object({
          limit: z.number().int().positive().max(100).optional().default(20),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const limit = input?.limit ?? 20;

      const claims = await ctx.prisma.case.findMany({
        select: {
          id: true,
          title: true,
          caseNumber: true,
          status: true,
        },
        orderBy: { updatedAt: 'desc' },
        take: limit,
      });

      return claims;
    }),
});
```

---

## Client Usage

```typescript
// packages/client/src/components/claim/ClaimSidebar.tsx
import { trpc } from '../../lib/trpc';

function ClaimSidebar() {
  const { data: claims, error, isLoading } = trpc.getClaimsList.useQuery(
    { limit: 20 },
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
    }
  );

  if (isLoading) return <SidebarSkeleton />;
  if (error) return <SidebarError />;
  if (!claims || claims.length === 0) return <EmptySidebar />;

  return (
    <div className="sidebar">
      {claims.map(claim => (
        <ClaimListItem key={claim.id} claim={claim} />
      ))}
    </div>
  );
}
```

---

## Testing

### Integration Test

```typescript
// packages/server/src/router.test.ts
describe('getClaimsList', () => {
  it('should return list of claims', async () => {
    // Arrange: Create test claims
    await ctx.prisma.case.createMany({
      data: [
        {
          title: 'Claim 1',
          caseNumber: 'CAS-TEST-001',
          description: 'Test 1',
          customerName: 'Customer 1',
          createdBy: 'user-id',
        },
        {
          title: 'Claim 2',
          caseNumber: 'CAS-TEST-002',
          description: 'Test 2',
          customerName: 'Customer 2',
          createdBy: 'user-id',
        },
      ],
    });

    // Act
    const result = await caller.getClaimsList();

    // Assert
    expect(result).toHaveLength(2);
    expect(result[0]).toHaveProperty('id');
    expect(result[0]).toHaveProperty('title');
    expect(result[0]).toHaveProperty('caseNumber');
    expect(result[0]).toHaveProperty('status');
    expect(result[0]).not.toHaveProperty('description'); // Should not include full details
  });

  it('should respect limit parameter', async () => {
    // Arrange: Create 30 test claims
    const claims = Array.from({ length: 30 }, (_, i) => ({
      title: `Claim ${i + 1}`,
      caseNumber: `CAS-TEST-${String(i + 1).padStart(3, '0')}`,
      description: `Test ${i + 1}`,
      customerName: `Customer ${i + 1}`,
      createdBy: 'user-id',
    }));
    await ctx.prisma.case.createMany({ data: claims });

    // Act
    const result = await caller.getClaimsList({ limit: 10 });

    // Assert
    expect(result).toHaveLength(10);
  });

  it('should return empty array when no claims exist', async () => {
    // Act
    const result = await caller.getClaimsList();

    // Assert
    expect(result).toEqual([]);
  });

  it('should order by updatedAt descending', async () => {
    // Arrange: Create claims with different update times
    const claim1 = await ctx.prisma.case.create({
      data: {
        title: 'Old Claim',
        caseNumber: 'CAS-OLD',
        description: 'Old',
        customerName: 'Customer',
        createdBy: 'user-id',
        updatedAt: new Date('2025-01-01'),
      },
    });

    const claim2 = await ctx.prisma.case.create({
      data: {
        title: 'New Claim',
        caseNumber: 'CAS-NEW',
        description: 'New',
        customerName: 'Customer',
        createdBy: 'user-id',
        updatedAt: new Date('2025-12-01'),
      },
    });

    // Act
    const result = await caller.getClaimsList();

    // Assert
    expect(result[0].id).toBe(claim2.id); // Newer claim first
    expect(result[1].id).toBe(claim1.id);
  });
});
```

---

## Performance Considerations

**Query Optimization**:

- Only selects necessary fields (id, title, caseNumber, status)
- No expensive joins or includes
- Ordered by indexed field (`updatedAt`)
- Limited to prevent large result sets

**Expected Response Time**:

- <50ms for any limit up to 100
- Database index on `updatedAt` ensures efficient sorting

**Caching Strategy**:

- Client-side: React Query caches for 2 minutes
- Lower stale time than `getClaim` because list changes more frequently

---

**Contract Status**: ✅ COMPLETE  
**Version**: 1.0.0  
**Last Updated**: December 24, 2025
