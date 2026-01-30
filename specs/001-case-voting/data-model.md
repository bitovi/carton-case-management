# Data Model: Like and Dislike Buttons

**Feature**: 001-case-voting  
**Date**: 2025-01-30  
**Status**: Complete

## Overview

This document defines the data model for the voting feature, including database schema changes, relationships, and validation rules extracted from the feature specification and research findings.

## Entity Definitions

### New Entity: CaseVote

Represents a single user's vote on a case. Each user can have at most one active vote per case.

**Fields**:

| Field | Type | Required | Default | Constraints | Description |
|-------|------|----------|---------|-------------|-------------|
| id | String (UUID) | Yes | uuid() | Primary Key | Unique identifier for the vote |
| userId | String | Yes | - | Foreign Key → User.id | User who cast the vote |
| caseId | String | Yes | - | Foreign Key → Case.id | Case being voted on |
| voteType | VoteType | Yes | - | Enum: LIKE, DISLIKE | Type of vote |
| createdAt | DateTime | Yes | now() | - | When vote was created |
| updatedAt | DateTime | Yes | updatedAt() | Auto-update | When vote was last changed |

**Unique Constraints**:
- `@@unique([userId, caseId], name: "user_case_vote")` - Ensures one vote per user per case

**Indexes**:
- `@@index([caseId])` - Optimize queries for votes by case
- `@@index([userId])` - Optimize queries for votes by user

**Relationships**:
- `user: User` - Many-to-one (many votes belong to one user)
- `case: Case` - Many-to-one (many votes belong to one case)

**Cascade Behavior**:
- ON DELETE CASCADE when Case is deleted (votes are deleted)
- No cascade when User is deleted (preserve vote integrity or handle separately)

---

### New Enum: VoteType

Represents the type of vote a user can cast.

**Values**:
- `LIKE` - Positive vote
- `DISLIKE` - Negative vote

**Validation**:
- Only these two values allowed
- Auto-generated Zod schema ensures type safety

---

### Modified Entity: Case

Extended to include vote relationships for aggregation and queries.

**New Relationships**:
- `votes: CaseVote[]` - One-to-many (one case has many votes)

**No Direct Fields Added**: Vote counts are calculated via aggregation, not stored as denormalized counters.

**Query Examples**:
```typescript
// Get case with all votes
const caseWithVotes = await prisma.case.findUnique({
  where: { id: caseId },
  include: {
    votes: true
  }
});

// Get case with vote counts
const caseWithCounts = await prisma.case.findUnique({
  where: { id: caseId },
  include: {
    _count: {
      select: {
        votes: {
          where: { voteType: 'LIKE' }
        }
      }
    }
  }
});
```

---

### Modified Entity: User

Extended to include vote relationships for user-specific queries.

**New Relationships**:
- `votes: CaseVote[]` - One-to-many (one user has many votes)

**Query Examples**:
```typescript
// Get all votes by user
const userVotes = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    votes: {
      include: {
        case: {
          select: { title: true }
        }
      }
    }
  }
});
```

---

## Prisma Schema Changes

### Complete Schema Addition

```prisma
// Add to packages/shared/prisma/schema.prisma

enum VoteType {
  LIKE
  DISLIKE
}

model CaseVote {
  id        String   @id @default(uuid())
  userId    String
  caseId    String
  voteType  VoteType
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user User @relation(fields: [userId], references: [id])
  case Case @relation(fields: [caseId], references: [id], onDelete: Cascade)

  @@unique([userId, caseId], name: "user_case_vote")
  @@index([caseId])
  @@index([userId])
}

// Modify existing User model - ADD this relation
model User {
  // ... existing fields ...
  votes CaseVote[] // ADD this line
}

// Modify existing Case model - ADD this relation
model Case {
  // ... existing fields ...
  votes CaseVote[] // ADD this line
}
```

---

## Validation Rules

### From Requirements

Based on functional requirements from spec.md:

**FR-005**: System MUST prevent a user from having both a like and a dislike on the same case simultaneously
- **Implementation**: Unique constraint `@@unique([userId, caseId])` ensures only one vote record exists
- **Enforcement**: Upsert operation updates existing vote when changing from LIKE to DISLIKE or vice versa

**FR-008**: System MUST record which specific user cast each like or dislike
- **Implementation**: `userId` foreign key required, not nullable
- **Enforcement**: Prisma schema `userId String` without optional modifier

**FR-012**: System MUST persist votes so they remain after page refreshes or user sessions
- **Implementation**: Database storage via Prisma
- **Enforcement**: No session-based or in-memory storage used

**FR-013**: System MUST handle concurrent voting from multiple users without losing or duplicating votes
- **Implementation**: Unique constraint + atomic upsert/delete operations
- **Enforcement**: Database-level constraint prevents duplicates even under race conditions

### Input Validation

**Vote Creation/Update**:
```typescript
// Auto-generated Zod schema from Prisma
const voteInputSchema = z.object({
  caseId: z.string().uuid(),
  voteType: z.enum(['LIKE', 'DISLIKE'])
});
```

**Business Logic Validation**:
- User must be authenticated (`ctx.userId` required)
- Case must exist (foreign key constraint)
- Vote type must be LIKE or DISLIKE (enum constraint)

---

## State Transitions

### Vote Lifecycle

```
[No Vote] → (click LIKE) → [LIKE]
[LIKE] → (click LIKE) → [No Vote]  (removal)
[LIKE] → (click DISLIKE) → [DISLIKE]  (change)
[DISLIKE] → (click DISLIKE) → [No Vote]  (removal)
[DISLIKE] → (click LIKE) → [LIKE]  (change)
[No Vote] → (click DISLIKE) → [DISLIKE]
```

**State Storage**:
- **No Vote**: No record in CaseVote table
- **LIKE**: Record with voteType = 'LIKE'
- **DISLIKE**: Record with voteType = 'DISLIKE'

**Transition Operations**:
- **Create**: `INSERT` new CaseVote record
- **Change**: `UPDATE` existing record's voteType
- **Remove**: `DELETE` existing record
- **Upsert**: `INSERT OR UPDATE` (used for create/change in single operation)

---

## Data Integrity

### Referential Integrity

**Foreign Keys**:
- `CaseVote.userId → User.id` - Ensures vote belongs to valid user
- `CaseVote.caseId → Case.id` - Ensures vote belongs to valid case

**Cascade Behavior**:
```prisma
case Case @relation(fields: [caseId], references: [id], onDelete: Cascade)
```
- When Case is deleted, all associated votes are automatically deleted
- Prevents orphaned vote records

**User Deletion**: Not cascaded by default. Consider options:
- Option A: Prevent user deletion if they have votes
- Option B: Cascade delete votes (anonymize voting history)
- **Recommendation**: Handle in application logic based on business requirements

### Unique Constraints

**user_case_vote constraint**:
```sql
UNIQUE (userId, caseId)
```

**Purpose**: 
- Prevents duplicate votes from same user on same case
- Ensures atomic upsert operations work correctly
- Database-level enforcement (not application-level)

**Error Handling**: 
- SQLite error code: SQLITE_CONSTRAINT (19)
- Prisma error: `P2002` (Unique constraint violation)
- Application should use upsert to avoid this error

---

## Performance Considerations

### Indexing Strategy

**caseId index**: 
- Query pattern: Get all votes for a case (vote aggregation)
- Cardinality: High (many votes per case)
- Impact: Faster vote count queries in case details

**userId index**:
- Query pattern: Get all votes by a user (user voting history)
- Cardinality: High (many votes per user)
- Impact: Faster user profile queries

**Composite unique index (userId, caseId)**:
- Query pattern: Find specific user's vote on a case
- Cardinality: Very high (one record per user-case pair)
- Impact: Fastest lookup for "has user voted?" queries

### Query Optimization

**For Case List View** (multiple cases, need counts):
```typescript
// Batch query with groupBy
const voteCounts = await prisma.caseVote.groupBy({
  by: ['caseId', 'voteType'],
  _count: true,
  where: { caseId: { in: caseIds } }
});
```

**For Case Detail View** (single case, need user vote + counts):
```typescript
// Single query with include
const caseData = await prisma.case.findUnique({
  where: { id: caseId },
  include: {
    votes: {
      select: { voteType: true, userId: true }
    }
  }
});
```

**Expected Scale**:
- Cases: ~1,000-10,000
- Users: ~100-1,000
- Votes per case: ~10-500
- Total votes: ~10,000-5,000,000

SQLite can handle this scale with proper indexing.

---

## Migration Plan

### Database Migration Steps

1. **Create enum**: Add `VoteType` enum to schema
2. **Create table**: Add `CaseVote` model with constraints
3. **Add relations**: Update `User` and `Case` models
4. **Generate Prisma Client**: Run `npm run db:generate`
5. **Push schema**: Run `npm run db:push` (SQLite doesn't use migrations)
6. **Generate Zod schemas**: Auto-generated by `zod-prisma-types`

### Rollback Strategy

If rollback needed:
1. Revert schema.prisma to previous version
2. Run `npm run db:push` to update database
3. Run `npm run db:generate` to regenerate client

**Data Loss**: All vote data will be lost on rollback. Consider:
- Exporting vote data before rollback
- Soft launch with limited users to minimize risk

### Seed Data

Add sample votes to `packages/server/db/seed.ts`:
```typescript
// After seeding users and cases
await prisma.caseVote.createMany({
  data: [
    { userId: user1.id, caseId: case1.id, voteType: 'LIKE' },
    { userId: user2.id, caseId: case1.id, voteType: 'LIKE' },
    { userId: user3.id, caseId: case1.id, voteType: 'DISLIKE' },
    { userId: user1.id, caseId: case2.id, voteType: 'DISLIKE' },
  ]
});
```

---

## Summary

**New Entities**: 1 (CaseVote)  
**New Enums**: 1 (VoteType)  
**Modified Entities**: 2 (User, Case - relations only)  
**Unique Constraints**: 1 (user_case_vote)  
**Indexes**: 2 (caseId, userId) + 1 unique composite  
**Foreign Keys**: 2 (userId, caseId)  
**Cascade Deletes**: 1 (Case deletion cascades to CaseVote)

**Data Integrity**: Ensured through database constraints, foreign keys, and unique constraints  
**Performance**: Optimized with strategic indexing for common query patterns  
**Validation**: Handled by Prisma schema + auto-generated Zod schemas  
**Migration**: Simple push-based migration for SQLite  

This data model satisfies all functional requirements while maintaining data integrity and performance at expected scale.
