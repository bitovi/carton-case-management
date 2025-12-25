# Data Model: Case Details View

**Date**: December 24, 2025  
**Feature**: Case Details View  
**Branch**: `002-case-details`

## Overview

This document defines the data models, relationships, and validation rules for the case details view feature. All models are implemented in Prisma schema as the single source of truth.

## Entity Definitions

### Comment (NEW)

**Purpose**: Represents a comment/note added to a case by a user

**Attributes**:
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | Primary Key, UUID | Unique identifier |
| content | String | Required, min 1 char | Comment text content |
| caseId | String | Required, Foreign Key | Reference to parent Case |
| authorId | String | Required, Foreign Key | Reference to User who wrote comment |
| createdAt | DateTime | Auto-generated | When comment was created |
| updatedAt | DateTime | Auto-updated | When comment was last modified |

**Relationships**:

- Belongs to one Case (many-to-one)
- Belongs to one User as author (many-to-one)
- Cascade delete when parent Case is deleted

**Validation Rules**:

- Content must not be empty (enforced by Zod schema)
- Content max length 5000 characters
- CaseId must reference existing Case
- AuthorId must reference existing User

**Indexes**:

- `caseId` (for efficient comment queries per case)
- `createdAt` (for chronological ordering)

---

### Case (MODIFIED)

**Purpose**: Represents a case management record

**New Attributes** (additions to existing model):
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| caseType | String | Required | Type of case (e.g., "Insurance Claim Dispute") |
| customerName | String | Required | Name of customer associated with case |

**New Relationships**:

- Has many Comments (one-to-many, cascade delete)

**Existing Attributes** (no changes):

- id, title, description, status, createdBy, assignedTo, createdAt, updatedAt

**Validation Rules**:

- CaseType must be one of predefined types (Zod enum)
- CustomerName required, min 2 chars, max 200 chars

---

### User (MODIFIED)

**Purpose**: Represents a case worker or system user

**New Relationships**:

- Has many Comments as author (one-to-many)

**Existing Attributes** (no changes):

- id, email, name, password, createdAt, updatedAt
- Existing relationships: createdCases, assignedCases

---

## Prisma Schema Changes

### Complete Schema Definition

```prisma
// generator and datasource remain unchanged

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  createdCases  Case[]    @relation("CreatedBy")
  assignedCases Case[]    @relation("AssignedTo")
  comments      Comment[] @relation("CommentAuthor")
}

model Case {
  id           String   @id @default(uuid())
  title        String
  description  String
  status       String   @default("OPEN")
  caseType     String
  customerName String
  createdBy    String
  assignedTo   String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  creator  User      @relation("CreatedBy", fields: [createdBy], references: [id])
  assignee User?     @relation("AssignedTo", fields: [assignedTo], references: [id])
  comments Comment[] @relation("CaseComments")

  @@index([createdAt])
  @@index([status])
}

model Comment {
  id        String   @id @default(uuid())
  content   String
  caseId    String
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  case   Case @relation("CaseComments", fields: [caseId], references: [id], onDelete: Cascade)
  author User @relation("CommentAuthor", fields: [authorId], references: [id])

  @@index([caseId])
  @@index([createdAt])
}
```

### Migration Strategy

1. Create migration: `npm run db:migrate --workspace=packages/server -- --name add-comments-and-case-fields`
2. Run migration: Auto-applied in development
3. Update seed script with new fields
4. Re-seed database: `npm run db:seed --workspace=packages/server`

---

## Shared Type Definitions

### TypeScript Interfaces (packages/shared/src/types.ts)

```typescript
// Existing types updated
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Case {
  id: string;
  title: string;
  description: string;
  status: CaseStatus;
  caseType: string;
  customerName: string;
  assignedTo?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// New interface
export interface Comment {
  id: string;
  content: string;
  caseId: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Extended case with relationships
export interface CaseWithComments extends Case {
  comments: CommentWithAuthor[];
  assignee?: User;
  creator: User;
}

export interface CommentWithAuthor extends Comment {
  author: User;
}

export enum CaseStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  PENDING = 'PENDING',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum CaseType {
  INSURANCE_CLAIM_DISPUTE = 'Insurance Claim Dispute',
  POLICY_COVERAGE_INQUIRY = 'Policy Coverage Inquiry',
  PREMIUM_ADJUSTMENT = 'Premium Adjustment Request',
  CLAIM_STATUS_UPDATE = 'Claim Status Update',
  FRAUD_INVESTIGATION = 'Fraud Investigation',
}
```

---

## Zod Validation Schemas

### Input Validation (packages/shared/src/types.ts)

```typescript
import { z } from 'zod';

export const createCommentSchema = z.object({
  caseId: z.string().uuid('Invalid case ID'),
  content: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(5000, 'Comment too long (max 5000 characters)'),
});

export const getCaseByIdSchema = z.object({
  id: z.string().uuid('Invalid case ID'),
});

export const listCasesSchema = z
  .object({
    status: z.nativeEnum(CaseStatus).optional(),
    limit: z.number().min(1).max(100).default(50),
    offset: z.number().min(0).default(0),
  })
  .optional();

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type GetCaseByIdInput = z.infer<typeof getCaseByIdSchema>;
export type ListCasesInput = z.infer<typeof listCasesSchema>;
```

---

## State Transitions

### Comment Lifecycle

1. **Created**: User submits comment form → Validation → Database insert
2. **Persisted**: Comment saved with timestamp and author
3. **Retrieved**: Loaded with case details, ordered by createdAt ASC
4. **Deleted**: Only when parent Case is deleted (cascade)

### Case Updates

- Adding comment updates Case.updatedAt timestamp
- No status changes in this feature (future enhancement)

---

## Data Constraints & Business Rules

### Comment Rules

1. Comments are immutable after creation (no editing in MVP)
2. Comments cannot be orphaned (must belong to valid Case)
3. Comments must have valid author (User)
4. Comments display in chronological order (oldest first)
5. Empty or whitespace-only comments rejected

### Case Rules

1. Case must have caseType from predefined enum
2. Case must have customerName
3. Case can have 0 to unlimited comments
4. Case updatedAt reflects last activity (including new comments)

### User Rules

1. Users can comment on any case (no permission check in MVP)
2. User name displayed with each comment

---

## Seed Data Specification

### Required Seed Data

**2 Users**:

1. Alex Morgan (assigned case worker)
2. Jordan Lee (creator/secondary worker)

**5 Cases** (matching Figma design):

1. Insurance Claim Dispute - Sarah Johnson housing case
2. Policy Coverage Inquiry - Medical coverage questions
3. Premium Adjustment Request - Rate review
4. Claim Status Update - Status inquiry
5. Fraud Investigation - Suspicious activity

**15-20 Comments**:

- 3-5 comments per case
- Mix of authors (Alex, Jordan)
- Timestamps spread over last 7 days
- Realistic case worker language

---

## Summary

- **New Model**: Comment (id, content, caseId, authorId, timestamps)
- **Modified Model**: Case (added caseType, customerName, comments relation)
- **Modified Model**: User (added comments relation)
- **Validation**: Zod schemas for all API inputs
- **Migration**: Single migration adds Comment table and Case columns
- **Seed Data**: 2 users, 5 cases, 15-20 comments

All data models follow Prisma best practices, support required queries, and maintain referential integrity through foreign keys and cascade rules.
