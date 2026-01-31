# Data Model: Comment Voting System

**Date**: 2025-01-23  
**Feature**: Comment Voting System  
**Branch**: `001-comment-voting`

## Overview

This document defines the data model for the comment voting feature, including the new CommentVote entity, relationships with existing entities, validation rules, and state transitions.

---

## Entity Definitions

### New Entity: CommentVote

**Purpose**: Represents a single user's vote (like or dislike) on a comment.

**Prisma Schema**:

```prisma
model CommentVote {
  id        String   @id @default(uuid())
  commentId String
  userId    String
  voteType  VoteType
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  comment Comment @relation(fields: [commentId], references: [id], onDelete: Cascade)
  user    User    @relation(fields: [userId], references: [id])

  @@unique([commentId, userId])
  @@index([commentId])
  @@index([userId])
}
```

**Fields**:

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `id` | String (UUID) | Yes | Unique identifier for the vote | Auto-generated UUID |
| `commentId` | String (UUID) | Yes | References the comment being voted on | Must reference existing Comment |
| `userId` | String (UUID) | Yes | References the user who cast the vote | Must reference existing User |
| `voteType` | VoteType (enum) | Yes | Type of vote: LIKE or DISLIKE | Must be 'LIKE' or 'DISLIKE' |
| `createdAt` | DateTime | Yes | When the vote was first created | Auto-set on creation |
| `updatedAt` | DateTime | Yes | When the vote was last modified | Auto-updated on changes |

**Constraints**:
- `@@unique([commentId, userId])`: Ensures one vote per user per comment (critical for data integrity)
- `@@index([commentId])`: Optimizes queries for "all votes on a comment"
- `@@index([userId])`: Optimizes queries for "all votes by a user"

**Relationships**:
- `comment`: Many-to-One with Comment (one vote belongs to one comment)
- `user`: Many-to-One with User (one vote belongs to one user)

**Cascade Behavior**:
- `onDelete: Cascade` on comment relation: When a comment is deleted, all its votes are automatically deleted
- No cascade on user relation: If a user is deleted, votes remain but `userId` becomes orphaned (maintains vote count accuracy)

---

### New Enum: VoteType

**Prisma Schema**:

```prisma
enum VoteType {
  LIKE
  DISLIKE
}
```

**Values**:
- `LIKE`: Represents a positive vote (thumbs up)
- `DISLIKE`: Represents a negative vote (thumbs down)

**Zod Schema** (auto-generated):

```typescript
import { z } from 'zod';

export const VoteTypeSchema = z.enum(['LIKE', 'DISLIKE']);
export type VoteType = z.infer<typeof VoteTypeSchema>;
```

---

### Modified Entity: Comment

**Changes**: Add relationship to CommentVote

**Updated Schema**:

```prisma
model Comment {
  id        String   @id @default(uuid())
  content   String
  caseId    String
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  case   Case @relation(fields: [caseId], references: [id], onDelete: Cascade)
  author User @relation(fields: [authorId], references: [id])
  votes  CommentVote[]  // NEW: One-to-many relationship

  @@index([caseId])
  @@index([authorId])
}
```

**New Field**:
- `votes`: Array of CommentVote entities (one comment can have many votes)

---

### Modified Entity: User

**Changes**: Add relationship to CommentVote

**Updated Schema**:

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  createdCases  Case[]    @relation("CreatedBy")
  updatedCases  Case[]    @relation("UpdatedBy")
  assignedCases Case[]    @relation("AssignedTo")
  comments      Comment[]
  commentVotes  CommentVote[]  // NEW: Track user's votes

}
```

**New Field**:
- `commentVotes`: Array of CommentVote entities (one user can cast many votes)

---

## Entity Relationships

### Relationship Diagram

```
User (1) ─────< (Many) CommentVote (Many) >───── (1) Comment
  │                                                      │
  │                                                      │
  └─────────< (Many) Comment (owned as author)          │
                         │                               │
                         └───────< (Many) CommentVote ───┘

Legend:
  (1) ───< (Many) : One-to-Many relationship
  CommentVote is the join entity tracking votes
```

### Relationship Details

1. **User → CommentVote**
   - Type: One-to-Many
   - User can cast multiple votes across different comments
   - Foreign Key: `CommentVote.userId` → `User.id`
   - Cascade: Vote remains if user deleted (nullable FK not enabled by default)

2. **Comment → CommentVote**
   - Type: One-to-Many
   - Comment can receive multiple votes from different users
   - Foreign Key: `CommentVote.commentId` → `Comment.id`
   - Cascade: `onDelete: Cascade` (votes deleted with comment)

3. **User → Comment** (existing)
   - Type: One-to-Many (as author)
   - User can author multiple comments
   - Foreign Key: `Comment.authorId` → `User.id`

---

## Validation Rules

### Field-Level Validation

**CommentVote**:
- `commentId`: Must be a valid UUID referencing an existing Comment
- `userId`: Must be a valid UUID referencing an existing User
- `voteType`: Must be exactly 'LIKE' or 'DISLIKE' (enforced by enum)

**Zod Schemas** (for API layer):

```typescript
// Input validation for creating/updating a vote
export const voteInputSchema = z.object({
  commentId: z.string().uuid(),
  voteType: z.enum(['LIKE', 'DISLIKE']),
});

// Input validation for removing a vote
export const removeVoteInputSchema = z.object({
  commentId: z.string().uuid(),
});

// Output schema for vote data
export const commentVoteSchema = z.object({
  id: z.string().uuid(),
  commentId: z.string().uuid(),
  userId: z.string().uuid(),
  voteType: z.enum(['LIKE', 'DISLIKE']),
  createdAt: z.date(),
  updatedAt: z.date(),
});
```

### Business Rules

1. **One Vote Per User Per Comment**
   - Enforced by: `@@unique([commentId, userId])` constraint
   - Behavior: Attempting to create a duplicate vote will fail at database level
   - Implementation: Use `upsert` to handle both create and update

2. **Vote Type Mutability**
   - Users can change their vote from LIKE to DISLIKE or vice versa
   - Implementation: Update the `voteType` field on the existing CommentVote record

3. **Vote Removal**
   - Users can remove their vote entirely
   - Implementation: Delete the CommentVote record

4. **Comment Access Control**
   - Users can only vote on comments in cases they have access to
   - Enforced by: Application-level check (verify user can access the case)

5. **Authentication Required**
   - All vote operations require authenticated user
   - Enforced by: tRPC middleware (`ctx.userId` must be present)

---

## State Transitions

### Vote Lifecycle States

A user's vote on a specific comment can be in one of three states:

1. **No Vote**: User has never voted or has removed their vote
2. **LIKE**: User has cast a positive vote
3. **DISLIKE**: User has cast a negative vote

### State Transition Diagram

```
                    ┌─────────────┐
                    │   No Vote   │
                    └──────┬──────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
      Click LIKE      Click DISLIKE    (initial state)
           │               │
           ▼               ▼
    ┌──────────┐    ┌──────────┐
    │   LIKE   │    │ DISLIKE  │
    └────┬─────┘    └─────┬────┘
         │                │
         │   Click LIKE   │
         │   again        │
         │                │
         └────────┬───────┘
                  │
                  ▼
            ┌──────────┐
            │ No Vote  │
            └──────────┘

Transitions:
  No Vote → LIKE: Create CommentVote(voteType=LIKE)
  No Vote → DISLIKE: Create CommentVote(voteType=DISLIKE)
  LIKE → No Vote: Delete CommentVote
  DISLIKE → No Vote: Delete CommentVote
  LIKE → DISLIKE: Update CommentVote.voteType = DISLIKE
  DISLIKE → LIKE: Update CommentVote.voteType = LIKE
```

### Transition Operations

| Current State | User Action | New State | Database Operation |
|---------------|-------------|-----------|-------------------|
| No Vote | Click LIKE | LIKE | `INSERT CommentVote(voteType=LIKE)` |
| No Vote | Click DISLIKE | DISLIKE | `INSERT CommentVote(voteType=DISLIKE)` |
| LIKE | Click LIKE again | No Vote | `DELETE CommentVote` |
| DISLIKE | Click DISLIKE again | No Vote | `DELETE CommentVote` |
| LIKE | Click DISLIKE | DISLIKE | `UPDATE CommentVote SET voteType=DISLIKE` |
| DISLIKE | Click LIKE | LIKE | `UPDATE CommentVote SET voteType=LIKE` |

### Implementation Logic

```typescript
// Pseudo-code for vote state transitions
async function handleVoteClick(commentId: string, clickedType: 'LIKE' | 'DISLIKE') {
  const currentVote = await findVote(commentId, currentUserId);
  
  if (!currentVote) {
    // No Vote → LIKE/DISLIKE
    await createVote(commentId, currentUserId, clickedType);
  } else if (currentVote.voteType === clickedType) {
    // LIKE → No Vote (clicked same button again)
    await deleteVote(currentVote.id);
  } else {
    // LIKE → DISLIKE or DISLIKE → LIKE (clicked opposite button)
    await updateVote(currentVote.id, clickedType);
  }
}
```

---

## Data Aggregation

### Vote Count Calculation

**Strategy**: Compute vote counts on-the-fly using Prisma aggregation.

**Query Pattern**:

```typescript
// Get vote counts for a comment
const voteCounts = await prisma.commentVote.groupBy({
  by: ['voteType'],
  where: { commentId: commentId },
  _count: { voteType: true },
});

// Transform to object
const counts = {
  likes: voteCounts.find(v => v.voteType === 'LIKE')?._count.voteType || 0,
  dislikes: voteCounts.find(v => v.voteType === 'DISLIKE')?._count.voteType || 0,
};
```

**Alternative (include all votes)**:

```typescript
// Get all votes with the comment
const comment = await prisma.comment.findUnique({
  where: { id: commentId },
  include: { votes: true },
});

// Client-side aggregation
const likes = comment.votes.filter(v => v.voteType === 'LIKE').length;
const dislikes = comment.votes.filter(v => v.voteType === 'DISLIKE').length;
```

**Performance**: Suitable for <500 votes per comment. If counts grow larger, consider denormalized count fields (see research.md).

---

## Migration Strategy

### Database Migration

**Migration File**: Will be auto-generated by Prisma

```sql
-- CreateEnum
CREATE TYPE "VoteType" AS ENUM ('LIKE', 'DISLIKE');

-- CreateTable
CREATE TABLE "CommentVote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "commentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "voteType" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CommentVote_commentId_fkey" FOREIGN KEY ("commentId") 
        REFERENCES "Comment" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CommentVote_userId_fkey" FOREIGN KEY ("userId") 
        REFERENCES "User" ("id") ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "CommentVote_commentId_userId_key" 
    ON "CommentVote"("commentId", "userId");

-- CreateIndex
CREATE INDEX "CommentVote_commentId_idx" ON "CommentVote"("commentId");

-- CreateIndex
CREATE INDEX "CommentVote_userId_idx" ON "CommentVote"("userId");
```

**Steps**:
1. Run `npm run db:generate --workspace=packages/shared` to generate Prisma client and Zod schemas
2. Run `npx prisma migrate dev --name add-comment-voting` from server package
3. Migration will be applied to development database
4. Zod schemas auto-generated in `packages/shared/src/generated/`

**Rollback Plan**:
- Drop CommentVote table
- Remove VoteType enum
- Revert Comment and User model changes

---

## Seed Data

**Purpose**: Provide sample votes for testing and development

**Seed Script Addition** (`packages/server/db/seed.ts`):

```typescript
// After creating comments, add sample votes
const sampleVotes = [
  // User 1 likes comment 1
  { commentId: comment1.id, userId: user1.id, voteType: 'LIKE' },
  // User 2 likes comment 1
  { commentId: comment1.id, userId: user2.id, voteType: 'LIKE' },
  // User 3 dislikes comment 1
  { commentId: comment1.id, userId: user3.id, voteType: 'DISLIKE' },
  // User 1 likes comment 2
  { commentId: comment2.id, userId: user1.id, voteType: 'LIKE' },
];

for (const vote of sampleVotes) {
  await prisma.commentVote.create({ data: vote });
}

console.log('✅ Seeded comment votes');
```

---

## Data Integrity Constraints

### Enforced at Database Level

1. **Unique Vote**: `@@unique([commentId, userId])` prevents duplicate votes
2. **Foreign Key**: `commentId` must reference existing Comment
3. **Foreign Key**: `userId` must reference existing User
4. **Enum Constraint**: `voteType` must be 'LIKE' or 'DISLIKE'
5. **Cascade Delete**: Votes deleted when comment is deleted

### Enforced at Application Level

1. **Authentication**: User must be logged in to vote
2. **Authorization**: User must have access to the case containing the comment
3. **Idempotency**: Vote operations are idempotent (safe to retry)

---

## Performance Considerations

### Index Strategy

1. **Primary Index**: `id` (default, for direct lookups)
2. **Composite Unique Index**: `(commentId, userId)` (enforces constraint + fast lookups)
3. **Single-Column Index**: `commentId` (fast "all votes for comment" queries)
4. **Single-Column Index**: `userId` (fast "all votes by user" queries)

### Query Optimization

**Fast Queries**:
- ✅ Find vote by user and comment: `WHERE commentId = ? AND userId = ?` (uses composite index)
- ✅ Get all votes for comment: `WHERE commentId = ?` (uses commentId index)
- ✅ Count votes for comment: `COUNT(*) WHERE commentId = ?` (uses index)

**Slower Queries** (acceptable for now):
- ⚠️ Get all votes by user across all comments: `WHERE userId = ?` (uses userId index, but returns potentially large dataset)

### Scalability Thresholds

- **Comfortable**: <100 votes per comment, <1000 votes per user
- **Warning**: 100-500 votes per comment (monitor query performance)
- **Action Required**: >500 votes per comment (consider denormalized counts)

---

## Testing Data Requirements

### Unit Test Data

```typescript
// Minimal data for testing vote logic
const testData = {
  user: { id: 'user-1', email: 'test@example.com', name: 'Test User' },
  comment: { id: 'comment-1', content: 'Test comment', caseId: 'case-1', authorId: 'user-1' },
  vote: { id: 'vote-1', commentId: 'comment-1', userId: 'user-1', voteType: 'LIKE' },
};
```

### Integration Test Data

```typescript
// Multiple users and votes for testing concurrency
const integrationData = {
  users: [
    { id: 'user-1', /* ... */ },
    { id: 'user-2', /* ... */ },
    { id: 'user-3', /* ... */ },
  ],
  comments: [
    { id: 'comment-1', /* ... */ },
  ],
  votes: [
    { commentId: 'comment-1', userId: 'user-1', voteType: 'LIKE' },
    { commentId: 'comment-1', userId: 'user-2', voteType: 'LIKE' },
    { commentId: 'comment-1', userId: 'user-3', voteType: 'DISLIKE' },
  ],
};
```

### E2E Test Data

Uses seed data from database; no special test data needed.

---

## Edge Cases

### Handled by Data Model

1. **User deleted**: Votes remain (userId becomes orphaned, counts accurate)
2. **Comment deleted**: Votes cascade deleted automatically
3. **Duplicate vote attempt**: Rejected by unique constraint
4. **Invalid vote type**: Rejected by enum constraint
5. **Concurrent updates**: Last write wins (upsert behavior)

### Requires Application Logic

1. **Rapid clicking**: Debounce or queue mutations
2. **Network retry**: Idempotent operations safe to retry
3. **Stale UI state**: Optimistic updates with server reconciliation

---

## Summary

**New Entities**: 1 (CommentVote)  
**New Enums**: 1 (VoteType)  
**Modified Entities**: 2 (Comment, User)  
**Indexes**: 3 (composite unique + 2 single-column)  
**Foreign Keys**: 2 (commentId, userId)  
**Cascade Rules**: 1 (delete votes with comment)

**Key Principles**:
- ✅ One vote per user per comment (enforced by unique constraint)
- ✅ Type-safe enums (VoteType)
- ✅ Automatic cascade on comment deletion
- ✅ Optimized indexes for common queries
- ✅ Vote counts computed on-the-fly (accurate, no drift)

**Next Steps**: Implement API contracts (see contracts/vote-api.yaml)
