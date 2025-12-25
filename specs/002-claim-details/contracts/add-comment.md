# API Contract: addComment

**Procedure Type**: Mutation  
**Access**: Protected (requires authentication)  
**Purpose**: Add a new comment to an existing claim

---

## Input Schema

```typescript
// Zod Schema
const addCommentInput = z.object({
  caseId: z.string().uuid('Invalid case ID format'),
  content: z.string().min(1, 'Comment cannot be empty').max(5000, 'Comment too long'),
});

// TypeScript Type
type AddCommentInput = {
  caseId: string; // UUID format
  content: string; // 1-5000 characters
};
```

**Validation Rules**:

- `caseId` is required and must be valid UUID format
- `content` is required and cannot be empty string
- `content` must not exceed 5000 characters
- Author ID comes from authenticated user context (not in input)

---

## Output Schema

```typescript
// TypeScript Type (matches CommentWithAuthor from shared types)
type AddCommentOutput = {
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
};
```

---

## Behavior

### Success Case (200)

**Request**:

```typescript
const addComment = trpc.addComment.useMutation();

addComment.mutate({
  caseId: '123e4567-e89b-12d3-a456-426614174000',
  content: 'This is a new comment on the claim.',
});
```

**Response**:

```json
{
  "id": "def12345-e89b-12d3-a456-426614174000",
  "content": "This is a new comment on the claim.",
  "authorId": "456e4567-e89b-12d3-a456-426614174000",
  "caseId": "123e4567-e89b-12d3-a456-426614174000",
  "createdAt": "2025-12-24T18:30:00.000Z",
  "updatedAt": "2025-12-24T18:30:00.000Z",
  "author": {
    "id": "456e4567-e89b-12d3-a456-426614174000",
    "name": "Alex Morgan",
    "email": "alex.morgan@example.com"
  }
}
```

**Side Effects**:

- Creates new `Comment` record in database
- Updates `Case.updatedAt` timestamp (via Prisma cascade)
- Invalidates `getClaim` cache on client

### Error Cases

#### BAD_REQUEST (400)

**Scenario 1**: Empty content

**Request**:

```typescript
addComment.mutate({
  caseId: '123e4567-e89b-12d3-a456-426614174000',
  content: '',
});
```

**Response**:

```json
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "Comment cannot be empty"
  }
}
```

**Scenario 2**: Content too long

**Request**:

```typescript
addComment.mutate({
  caseId: '123e4567-e89b-12d3-a456-426614174000',
  content: 'A'.repeat(5001), // 5001 characters
});
```

**Response**:

```json
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "Comment too long"
  }
}
```

**Scenario 3**: Invalid case ID format

**Request**:

```typescript
addComment.mutate({
  caseId: 'invalid-id',
  content: 'Valid comment content',
});
```

**Response**:

```json
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "Invalid case ID format"
  }
}
```

#### NOT_FOUND (404)

**Scenario**: Case does not exist

**Request**:

```typescript
addComment.mutate({
  caseId: '00000000-0000-0000-0000-000000000000',
  content: 'Comment on non-existent case',
});
```

**Response**:

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Case not found"
  }
}
```

#### UNAUTHORIZED (401)

**Scenario**: User not authenticated

**Response**:

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

---

## Implementation Reference

```typescript
// packages/server/src/router.ts
export const appRouter = router({
  addComment: protectedProcedure // Requires authentication
    .input(
      z.object({
        caseId: z.string().uuid('Invalid case ID format'),
        content: z.string().min(1, 'Comment cannot be empty').max(5000, 'Comment too long'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify case exists
      const caseExists = await ctx.prisma.case.findUnique({
        where: { id: input.caseId },
        select: { id: true },
      });

      if (!caseExists) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Case not found',
        });
      }

      // Create comment
      const comment = await ctx.prisma.comment.create({
        data: {
          content: input.content,
          authorId: ctx.user.id, // From auth context
          caseId: input.caseId,
        },
        include: {
          author: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      return comment;
    }),
});
```

---

## Client Usage

```typescript
// packages/client/src/components/claim/CommentInput.tsx
import { trpc } from '../../lib/trpc';

function CommentInput({ caseId }: { caseId: string }) {
  const [content, setContent] = useState('');
  const utils = trpc.useContext();

  const addComment = trpc.addComment.useMutation({
    onSuccess: () => {
      // Clear input
      setContent('');

      // Invalidate getClaim query to refresh comments
      utils.getClaim.invalidate({ id: caseId });
    },
    onError: (error) => {
      // Show error toast
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) return;

    addComment.mutate({ caseId, content: content.trim() });
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a comment..."
        maxLength={5000}
        disabled={addComment.isLoading}
      />
      <button type="submit" disabled={!content.trim() || addComment.isLoading}>
        {addComment.isLoading ? 'Adding...' : 'Add Comment'}
      </button>
    </form>
  );
}
```

---

## Optimistic Update Pattern (Advanced)

```typescript
// Optimistic UI update for instant feedback
const addComment = trpc.addComment.useMutation({
  onMutate: async (newComment) => {
    // Cancel outgoing refetches
    await utils.getClaim.cancel({ id: caseId });

    // Snapshot current value
    const previousClaim = utils.getClaim.getData({ id: caseId });

    // Optimistically update
    if (previousClaim) {
      utils.getClaim.setData(
        { id: caseId },
        {
          ...previousClaim,
          comments: [
            {
              id: 'temp-id', // Temporary ID
              content: newComment.content,
              authorId: currentUser.id,
              caseId: newComment.caseId,
              createdAt: new Date(),
              updatedAt: new Date(),
              author: currentUser,
            },
            ...previousClaim.comments,
          ],
        }
      );
    }

    return { previousClaim };
  },
  onError: (err, variables, context) => {
    // Rollback on error
    if (context?.previousClaim) {
      utils.getClaim.setData({ id: caseId }, context.previousClaim);
    }
    toast.error(err.message);
  },
  onSuccess: () => {
    // Refetch to get real data from server
    utils.getClaim.invalidate({ id: caseId });
    setContent('');
  },
});
```

---

## Testing

### Integration Test

```typescript
// packages/server/src/router.test.ts
describe('addComment', () => {
  let testCase: any;
  let testUser: any;

  beforeEach(async () => {
    // Create test user
    testUser = await ctx.prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashed',
      },
    });

    // Create test case
    testCase = await ctx.prisma.case.create({
      data: {
        title: 'Test Case',
        caseNumber: 'CAS-TEST',
        description: 'Test',
        customerName: 'Test Customer',
        createdBy: testUser.id,
      },
    });

    // Set auth context
    ctx.user = testUser;
  });

  it('should add comment successfully', async () => {
    // Act
    const result = await caller.addComment({
      caseId: testCase.id,
      content: 'Test comment',
    });

    // Assert
    expect(result).toBeDefined();
    expect(result.content).toBe('Test comment');
    expect(result.authorId).toBe(testUser.id);
    expect(result.caseId).toBe(testCase.id);
    expect(result.author.name).toBe('Test User');

    // Verify in database
    const dbComment = await ctx.prisma.comment.findUnique({
      where: { id: result.id },
    });
    expect(dbComment).toBeDefined();
  });

  it('should reject empty content', async () => {
    // Act & Assert
    await expect(
      caller.addComment({
        caseId: testCase.id,
        content: '',
      })
    ).rejects.toThrow('Comment cannot be empty');
  });

  it('should reject content exceeding max length', async () => {
    // Act & Assert
    await expect(
      caller.addComment({
        caseId: testCase.id,
        content: 'A'.repeat(5001),
      })
    ).rejects.toThrow('Comment too long');
  });

  it('should throw NOT_FOUND for non-existent case', async () => {
    // Act & Assert
    await expect(
      caller.addComment({
        caseId: '00000000-0000-0000-0000-000000000000',
        content: 'Test comment',
      })
    ).rejects.toThrow('Case not found');
  });

  it('should require authentication', async () => {
    // Arrange: Remove user from context
    ctx.user = null;

    // Act & Assert
    await expect(
      caller.addComment({
        caseId: testCase.id,
        content: 'Test comment',
      })
    ).rejects.toThrow('Authentication required');
  });
});
```

---

## Performance Considerations

**Transaction Handling**:

- Single database operation (comment creation)
- No explicit transaction needed
- Prisma handles constraint validation

**Expected Response Time**:

- <100ms for successful comment creation
- Includes author data fetch via `include`

**Concurrency**:

- Multiple users can comment simultaneously
- Comments ordered by `createdAt` (no race condition)
- Optimistic updates prevent UI lag

**Rate Limiting** (Future Enhancement):

- Consider rate limiting to prevent spam
- E.g., max 10 comments per minute per user

---

## Security Considerations

**Input Sanitization**:

- Content is stored as-is (no HTML parsing)
- XSS prevention handled by React (automatic escaping)
- Consider adding profanity filter in future

**Authorization**:

- Only authenticated users can comment
- Future: Check if user has access to the case
- Future: Implement role-based permissions

**Audit Trail**:

- `createdAt` and `updatedAt` automatically tracked
- Author information preserved via foreign key
- Future: Track edit history if comment editing added

---

**Contract Status**: ✅ COMPLETE  
**Version**: 1.0.0  
**Last Updated**: December 24, 2025
