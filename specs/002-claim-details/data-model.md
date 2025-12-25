# Data Model: Claim Details Component

**Feature**: Claim Details Component  
**Branch**: `002-claim-details`  
**Date**: December 24, 2025

## Overview

This document defines the data model for the Claim Details Component, including Prisma schema changes, entity relationships, and type definitions. All changes maintain backward compatibility with existing data structures.

---

## Entity Definitions

### Claim (Case Model Extensions)

The `Case` model is extended to support the claim details view requirements.

**Attributes**:

- `id` (String, UUID): Unique identifier
- `title` (String): Claim title (e.g., "Insurance Claim Dispute")
- `caseNumber` (String, unique): Human-readable case number (e.g., "#CAS-242314-2124")
- `description` (String): Detailed case description
- `status` (ClaimStatus enum): Current claim status
- `customerName` (String): Name of the customer associated with the claim
- `createdBy` (String, FK): User ID of claim creator
- `assignedTo` (String?, FK): User ID of assigned agent (optional)
- `createdAt` (DateTime): Timestamp of claim creation
- `updatedAt` (DateTime): Timestamp of last update

**Relationships**:

- `creator` → User (many-to-one)
- `assignee` → User (many-to-one, optional)
- `comments` → Comment[] (one-to-many)

**Validation Rules**:

- `caseNumber` must be unique across all claims
- `title` is required (non-empty)
- `description` is required (non-empty)
- `customerName` is required (non-empty)
- `createdBy` must reference existing User
- `assignedTo` must reference existing User or be null

---

### Comment

New model to track comments on claims.

**Attributes**:

- `id` (String, UUID): Unique identifier
- `content` (String): Comment text content
- `authorId` (String, FK): User ID of comment author
- `caseId` (String, FK): Case ID this comment belongs to
- `createdAt` (DateTime): Timestamp of comment creation
- `updatedAt` (DateTime): Timestamp of last edit

**Relationships**:

- `author` → User (many-to-one)
- `case` → Case (many-to-one)

**Validation Rules**:

- `content` is required (non-empty)
- `content` max length: 5000 characters
- `authorId` must reference existing User
- `caseId` must reference existing Case
- Cascade delete: When Case is deleted, all comments are deleted

---

### ClaimStatus (Enum)

Enumeration of possible claim statuses.

**Values**:

- `TO_DO`: Claim is pending action (default)
- `IN_PROGRESS`: Claim is actively being worked on
- `COMPLETED`: Claim has been resolved
- `CLOSED`: Claim is closed and archived

**UI Mapping** (implementation detail, documented for reference):

- `TO_DO`: Gray badge (bg-gray-200, text-gray-950)
- `IN_PROGRESS`: Blue badge (bg-blue-100, text-blue-600)
- `COMPLETED`: Green badge (bg-green-100, text-green-600)
- `CLOSED`: Gray badge (bg-gray-300, text-gray-700)

---

### User (Existing, No Changes)

Referenced by both Case and Comment for authorship and assignment.

**Relevant Attributes**:

- `id` (String, UUID): Unique identifier
- `name` (String): User's display name
- `email` (String): User's email address

**Note**: User model already exists and requires no modifications.

---

## Prisma Schema Changes

### Updated schema.prisma

```prisma
// packages/server/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

enum ClaimStatus {
  TO_DO
  IN_PROGRESS
  COMPLETED
  CLOSED
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  createdCases  Case[]    @relation("CreatedBy")
  assignedCases Case[]    @relation("AssignedTo")
  comments      Comment[]
}

model Case {
  id           String      @id @default(uuid())
  title        String
  caseNumber   String      @unique
  description  String
  status       ClaimStatus @default(TO_DO)
  customerName String
  createdBy    String
  assignedTo   String?
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt

  creator  User      @relation("CreatedBy", fields: [createdBy], references: [id])
  assignee User?     @relation("AssignedTo", fields: [assignedTo], references: [id])
  comments Comment[]

  @@index([createdAt])
  @@index([status])
}

model Comment {
  id        String   @id @default(uuid())
  content   String
  authorId  String
  caseId    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  author User @relation(fields: [authorId], references: [id])
  case   Case @relation(fields: [caseId], references: [id], onDelete: Cascade)

  @@index([caseId])
  @@index([createdAt])
}
```

**Changes Summary**:

1. Added `ClaimStatus` enum
2. Extended `Case` model with `caseNumber`, `customerName`, updated `status` to enum
3. Added new `Comment` model
4. Updated `User` relations to include `comments`
5. Added indexes for query optimization

---

## Shared Type Definitions

### TypeScript Types (packages/shared/src/types.ts)

```typescript
// Derive from Prisma generated types
import { ClaimStatus as PrismaClaimStatus } from '@prisma/client';

// Re-export Prisma enums
export { ClaimStatus } from '@prisma/client';

// Base types matching Prisma models
export interface Claim {
  id: string;
  title: string;
  caseNumber: string;
  description: string;
  status: PrismaClaimStatus;
  customerName: string;
  assignedTo: string | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  caseId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Extended types for UI needs
export interface CommentWithAuthor extends Comment {
  author: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ClaimWithDetails extends Claim {
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
  comments: CommentWithAuthor[];
}

// List view type (sidebar)
export interface ClaimListItem {
  id: string;
  title: string;
  caseNumber: string;
  status: PrismaClaimStatus;
}
```

---

## Seed Data Structure

### Sample Data Requirements

**Users** (5 users):

1. Alex Morgan (case worker, creates/comments on cases)
2. Sarah Johnson (customer, appears in customerName)
3. John Doe (case worker, assigned to some cases)
4. Jane Smith (case worker, assigned to some cases)
5. Bob Wilson (case worker, comments on cases)

**Cases** (5 cases matching Figma):

1. Insurance Claim Dispute (#CAS-242314-2124) - TO_DO
2. Policy Coverage Inquiry (#CAS-242315-2125) - IN_PROGRESS
3. Premium Adjustment Request (#CAS-242316-2126) - COMPLETED
4. Claim Status Update (#CAS-242317-2127) - TO_DO
5. Fraud Investigation (#CAS-242318-2128) - IN_PROGRESS

**Comments** (2-3 per case):

- Each case should have at least 2 comments
- Comments should have realistic timestamps (spread over time)
- Different authors for variety

### Seed Implementation

```typescript
// packages/server/prisma/seed.ts
import { PrismaClient, ClaimStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data (development only)
  console.log('Clearing existing data...');
  await prisma.comment.deleteMany();
  await prisma.case.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  console.log('Creating users...');
  const alex = await prisma.user.create({
    data: {
      email: 'alex.morgan@example.com',
      name: 'Alex Morgan',
      password: 'hashed_password_1', // In real app, hash passwords
    },
  });

  const john = await prisma.user.create({
    data: {
      email: 'john.doe@example.com',
      name: 'John Doe',
      password: 'hashed_password_2',
    },
  });

  const jane = await prisma.user.create({
    data: {
      email: 'jane.smith@example.com',
      name: 'Jane Smith',
      password: 'hashed_password_3',
    },
  });

  const bob = await prisma.user.create({
    data: {
      email: 'bob.wilson@example.com',
      name: 'Bob Wilson',
      password: 'hashed_password_4',
    },
  });

  // Create cases
  console.log('Creating cases...');
  const case1 = await prisma.case.create({
    data: {
      title: 'Insurance Claim Dispute',
      caseNumber: 'CAS-242314-2124',
      description:
        'Sarah Johnson is a single mother of two children seeking housing assistance after losing her apartment due to job loss. She currently has temporary housing but needs permanent housing within 60 days. Her income is below the threshold for the Housing First program.',
      status: ClaimStatus.TO_DO,
      customerName: 'Sarah Johnson',
      createdBy: alex.id,
      assignedTo: alex.id,
      createdAt: new Date('2025-10-24T10:00:00Z'),
      updatedAt: new Date('2025-12-12T15:30:00Z'),
    },
  });

  const case2 = await prisma.case.create({
    data: {
      title: 'Policy Coverage Inquiry',
      caseNumber: 'CAS-242315-2125',
      description: 'Customer inquiring about coverage limits for recent home damage claim.',
      status: ClaimStatus.IN_PROGRESS,
      customerName: 'Michael Brown',
      createdBy: john.id,
      assignedTo: jane.id,
    },
  });

  const case3 = await prisma.case.create({
    data: {
      title: 'Premium Adjustment Request',
      caseNumber: 'CAS-242316-2126',
      description: 'Request to review and adjust premium based on improved credit score.',
      status: ClaimStatus.COMPLETED,
      customerName: 'Emily Davis',
      createdBy: jane.id,
      assignedTo: john.id,
    },
  });

  const case4 = await prisma.case.create({
    data: {
      title: 'Claim Status Update',
      caseNumber: 'CAS-242317-2127',
      description: 'Customer requesting status update on pending auto claim.',
      status: ClaimStatus.TO_DO,
      customerName: 'David Wilson',
      createdBy: alex.id,
      assignedTo: null,
    },
  });

  const case5 = await prisma.case.create({
    data: {
      title: 'Fraud Investigation',
      caseNumber: 'CAS-242318-2128',
      description: 'Suspicious activity detected on policy, requires investigation.',
      status: ClaimStatus.IN_PROGRESS,
      customerName: 'Lisa Anderson',
      createdBy: bob.id,
      assignedTo: alex.id,
    },
  });

  // Create comments
  console.log('Creating comments...');

  // Comments for case 1
  await prisma.comment.create({
    data: {
      content:
        'Sarah Johnson is a single mother of two children seeking housing assistance after losing her apartment due to job loss. She currently has temporary housing but needs permanent housing within 60 days. Her income is below the threshold for the Housing First program.',
      authorId: alex.id,
      caseId: case1.id,
      createdAt: new Date('2025-11-29T11:55:00Z'),
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Verified income documentation. Customer qualifies for assistance program.',
      authorId: bob.id,
      caseId: case1.id,
      createdAt: new Date('2025-12-01T14:20:00Z'),
    },
  });

  // Comments for case 2
  await prisma.comment.create({
    data: {
      content: 'Reviewed policy documents. Coverage limit is $50,000 for home damage.',
      authorId: jane.id,
      caseId: case2.id,
      createdAt: new Date('2025-12-10T09:30:00Z'),
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Customer notified of coverage limits. Requested additional documentation.',
      authorId: john.id,
      caseId: case2.id,
      createdAt: new Date('2025-12-15T16:45:00Z'),
    },
  });

  // Comments for case 3
  await prisma.comment.create({
    data: {
      content: 'Credit score verified. Premium adjustment approved.',
      authorId: john.id,
      caseId: case3.id,
      createdAt: new Date('2025-12-05T10:00:00Z'),
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Customer notified of new premium rate effective next billing cycle.',
      authorId: jane.id,
      caseId: case3.id,
      createdAt: new Date('2025-12-08T13:20:00Z'),
    },
  });

  // Comments for case 4
  await prisma.comment.create({
    data: {
      content: 'Claim is pending review by underwriting team.',
      authorId: alex.id,
      caseId: case4.id,
    },
  });

  // Comments for case 5
  await prisma.comment.create({
    data: {
      content: 'Investigation initiated. Reviewing claim history and documentation.',
      authorId: alex.id,
      caseId: case5.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Found inconsistencies in submitted documents. Escalating to fraud team.',
      authorId: bob.id,
      caseId: case5.id,
    },
  });

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

---

## Database Migration Strategy

**Development Environment**:

1. Delete existing database: `rm packages/server/prisma/dev.db`
2. Apply schema: `npx prisma migrate dev --name add-comments-and-claims`
3. Seed database: `npx prisma db seed`

**Note**: Per user requirements, we overwrite the initial database in dev mode rather than managing migrations incrementally.

---

## Query Patterns

### Fetch Claim with All Details

```typescript
const claim = await prisma.case.findUnique({
  where: { id: claimId },
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
```

### Fetch Claims List (Sidebar)

```typescript
const claims = await prisma.case.findMany({
  select: {
    id: true,
    title: true,
    caseNumber: true,
    status: true,
  },
  orderBy: { updatedAt: 'desc' },
  take: 20, // Limit for sidebar
});
```

### Create Comment

```typescript
const comment = await prisma.comment.create({
  data: {
    content: commentContent,
    authorId: currentUserId,
    caseId: claimId,
  },
  include: {
    author: {
      select: { id: true, name: true, email: true },
    },
  },
});
```

---

## Type Safety Flow

```
Prisma Schema (schema.prisma)
        ↓
Prisma Generate (@prisma/client)
        ↓
Shared Types (packages/shared/src/types.ts)
        ↓
tRPC Procedures (packages/server/src/router.ts)
        ↓
tRPC Client (packages/client/src/lib/trpc.tsx)
        ↓
React Components (packages/client/src/components/)
```

All types are derived from Prisma schema, ensuring end-to-end type safety.

---

**Data Model Status**: ✅ COMPLETE  
**Next**: Phase 1 Continued - API Contracts
