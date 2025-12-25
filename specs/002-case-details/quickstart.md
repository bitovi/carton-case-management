# Quickstart Guide: Case Details View

**Date**: December 24, 2025  
**Feature**: Case Details View  
**Branch**: `002-case-details`

## Overview

This guide provides a quick reference for implementing the case details view feature, including setup steps, key implementation patterns, and verification steps.

---

## Prerequisites

- Node.js 24 (use `nvm use` to switch to project version)
- All dependencies installed (`npm install` at root)
- Development environment running

---

## Setup Steps

### 1. Update Prisma Schema

**File**: `packages/server/prisma/schema.prisma`

Add Comment model and update Case model:

```prisma
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

// Update Case model - add these fields/relations:
model Case {
  // ... existing fields
  caseType     String
  customerName String
  comments     Comment[] @relation("CaseComments")

  @@index([createdAt])
  @@index([status])
}

// Update User model - add this relation:
model User {
  // ... existing fields
  comments Comment[] @relation("CommentAuthor")
}
```

### 2. Run Migration

```bash
cd packages/server
npx prisma migrate dev --name add-comments-and-case-fields
```

This will:

- Create migration file
- Apply migration to database
- Regenerate Prisma Client types

### 3. Update Shared Types

**File**: `packages/shared/src/types.ts`

Add new types and update existing:

```typescript
export interface Comment {
  id: string;
  content: string;
  caseId: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommentWithAuthor extends Comment {
  author: User;
}

export interface CaseWithComments extends Case {
  comments: CommentWithAuthor[];
  assignee?: User;
  creator: User;
}

// Update Case interface
export interface Case {
  // ... existing fields
  caseType: string;
  customerName: string;
}

// Add validation schemas
export const createCommentSchema = z.object({
  caseId: z.string().uuid(),
  content: z.string().min(1).max(5000),
});

export const getCaseByIdSchema = z.object({
  id: z.string().uuid(),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type GetCaseByIdInput = z.infer<typeof getCaseByIdSchema>;
```

### 4. Update Seed Data

**File**: `packages/server/prisma/seed.ts`

Add seed data for testing:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create users
  const alex = await prisma.user.create({
    data: {
      name: 'Alex Morgan',
      email: 'alex.morgan@example.com',
      password: 'hashed_password', // In production, use bcrypt
    },
  });

  const jordan = await prisma.user.create({
    data: {
      name: 'Jordan Lee',
      email: 'jordan.lee@example.com',
      password: 'hashed_password',
    },
  });

  // Create cases
  const case1 = await prisma.case.create({
    data: {
      title: '#CAS-242314-2124',
      caseType: 'Insurance Claim Dispute',
      description: 'Sarah Johnson is a single mother of two children seeking housing assistance...',
      customerName: 'Sarah Johnson',
      status: 'OPEN',
      createdBy: jordan.id,
      assignedTo: alex.id,
      createdAt: new Date('2025-10-24'),
    },
  });

  // Add more cases...

  // Create comments
  await prisma.comment.create({
    data: {
      content: 'Sarah Johnson is a single mother of two children seeking housing assistance...',
      caseId: case1.id,
      authorId: alex.id,
      createdAt: new Date('2025-11-29T11:55:00Z'),
    },
  });

  // Add more comments...
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

Run seed:

```bash
npm run db:seed --workspace=packages/server
```

### 5. Implement tRPC Router

**File**: `packages/server/src/router.ts`

Add case procedures:

```typescript
import { z } from 'zod';
import { publicProcedure, router } from './trpc';
import { createCommentSchema, getCaseByIdSchema } from '@carton/shared';
import { TRPCError } from '@trpc/server';

export const appRouter = router({
  // ... existing routes

  cases: router({
    list: publicProcedure.query(async ({ ctx }) => {
      const cases = await ctx.prisma.case.findMany({
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
      return { cases, total: cases.length };
    }),

    getById: publicProcedure.input(getCaseByIdSchema).query(async ({ input, ctx }) => {
      const caseData = await ctx.prisma.case.findUnique({
        where: { id: input.id },
        include: {
          creator: { select: { id: true, name: true, email: true } },
          assignee: { select: { id: true, name: true, email: true } },
          comments: {
            include: {
              author: { select: { id: true, name: true, email: true } },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      if (!caseData) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Case not found: ${input.id}`,
        });
      }

      return caseData;
    }),

    addComment: publicProcedure.input(createCommentSchema).mutation(async ({ input, ctx }) => {
      // MVP: Use first user (no auth yet)
      const author = await ctx.prisma.user.findFirst();
      if (!author) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

      const comment = await ctx.prisma.comment.create({
        data: {
          content: input.content,
          caseId: input.caseId,
          authorId: author.id,
        },
        include: {
          author: { select: { id: true, name: true, email: true } },
        },
      });

      // Update case timestamp
      await ctx.prisma.case.update({
        where: { id: input.caseId },
        data: { updatedAt: new Date() },
      });

      return comment;
    }),
  }),
});

export type AppRouter = typeof appRouter;
```

### 6. Create React Components

**Component Structure**:

```
packages/client/src/components/case-details/
├── CaseDetailsPage.tsx (page container)
├── CaseSidebar.tsx (sidebar with case list)
├── CaseDetailsView.tsx (main content area)
├── CaseHeader.tsx (case type + ID)
├── CaseDescription.tsx (description section)
├── CommentsList.tsx (comments list)
├── CommentItem.tsx (single comment)
├── AddCommentForm.tsx (comment input)
└── EssentialDetailsPanel.tsx (metadata panel)
```

**Key Pattern - tRPC Query Hook**:

```typescript
// In CaseDetailsPage.tsx
import { trpc } from '@/lib/trpc';

export function CaseDetailsPage() {
  const [selectedCaseId, setSelectedCaseId] = useState<string>();

  const casesQuery = trpc.cases.list.useQuery();
  const caseDetailsQuery = trpc.cases.getById.useQuery(
    { id: selectedCaseId! },
    { enabled: !!selectedCaseId }
  );

  return (
    <div className="flex">
      <CaseSidebar
        cases={casesQuery.data?.cases ?? []}
        selectedId={selectedCaseId}
        onSelectCase={setSelectedCaseId}
      />
      {caseDetailsQuery.data && (
        <CaseDetailsView case={caseDetailsQuery.data} />
      )}
    </div>
  );
}
```

**Key Pattern - Mutation Hook**:

```typescript
// In AddCommentForm.tsx
import { trpc } from '@/lib/trpc';

export function AddCommentForm({ caseId }: { caseId: string }) {
  const utils = trpc.useUtils();
  const addComment = trpc.cases.addComment.useMutation({
    onSuccess: () => {
      utils.cases.getById.invalidate({ id: caseId });
      utils.cases.list.invalidate();
    },
  });

  const handleSubmit = (content: string) => {
    addComment.mutate({ caseId, content });
  };

  return <form onSubmit={...}>...</form>;
}
```

### 7. Create Storybook Stories

Each component needs a `.stories.tsx` file:

```typescript
// CaseHeader.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { CaseHeader } from './CaseHeader';

const meta: Meta<typeof CaseHeader> = {
  title: 'CaseDetails/CaseHeader',
  component: CaseHeader,
};

export default meta;
type Story = StoryObj<typeof CaseHeader>;

export const Default: Story = {
  args: {
    caseType: 'Insurance Claim Dispute',
    caseId: '#CAS-242314-2124',
  },
};
```

---

## Running the Application

### Development Mode

```bash
# Terminal 1 - Server
npm run dev:server

# Terminal 2 - Client
npm run dev:client

# Terminal 3 - Storybook (optional)
npm run storybook
```

### Access Points

- **Client**: http://localhost:5173
- **Server**: http://localhost:3000
- **Storybook**: http://localhost:6006

---

## Testing

### Unit Tests (Vitest)

```bash
# Run all tests
npm test

# Run specific package
npm run test:server
npm run test:client

# Watch mode
npm run test:watch
```

### Integration Tests

**File**: `packages/server/src/router.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { appRouter } from './router';
import { prisma } from './context';

describe('cases router', () => {
  it('lists all cases', async () => {
    const caller = appRouter.createCaller({ prisma });
    const result = await caller.cases.list();
    expect(result.cases).toHaveLength(5);
  });

  it('gets case by ID with comments', async () => {
    const caller = appRouter.createCaller({ prisma });
    const { cases } = await caller.cases.list();
    const result = await caller.cases.getById({ id: cases[0].id });
    expect(result.comments).toBeDefined();
  });
});
```

### E2E Tests (Playwright)

**File**: `tests/e2e/case-details.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test('displays case details and allows adding comment', async ({ page }) => {
  await page.goto('/');

  // Verify case list loads
  await expect(page.getByText('Insurance Claim Dispute')).toBeVisible();

  // Click on a case
  await page.getByText('#CAS-242314-2124').click();

  // Verify case details display
  await expect(page.getByText('Sarah Johnson')).toBeVisible();

  // Add a comment
  await page.fill('[placeholder="Add a comment..."]', 'Test comment');
  await page.click('button:has-text("Submit")');

  // Verify comment appears
  await expect(page.getByText('Test comment')).toBeVisible();
});
```

Run E2E tests:

```bash
npm run test:e2e
```

---

## Verification Checklist

After implementation, verify:

- [ ] Prisma migration applied successfully
- [ ] Seed data created (5 cases, 2 users, 15+ comments)
- [ ] Server starts without errors
- [ ] Client starts without errors
- [ ] Case list displays in sidebar
- [ ] Clicking a case shows details
- [ ] Case header, description, comments visible
- [ ] Essential details panel shows metadata
- [ ] Comment form accepts input
- [ ] New comments appear after submission
- [ ] All Storybook stories render
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] E2E test passes
- [ ] TypeScript compiles with no errors
- [ ] ESLint passes with no errors

---

## Common Issues & Solutions

### Issue: Prisma types not updating

**Solution**: Regenerate Prisma client

```bash
cd packages/server
npx prisma generate
```

### Issue: tRPC types not inferring

**Solution**: Restart TypeScript server in VS Code

- Cmd+Shift+P → "TypeScript: Restart TS Server"

### Issue: Comments not displaying

**Solution**: Check createdAt ordering in query

```typescript
comments: {
  orderBy: { createdAt: 'asc' }, // Oldest first
}
```

### Issue: Seed data not showing

**Solution**: Re-run seed script

```bash
npm run db:seed --workspace=packages/server
```

---

## Next Steps

After completing this feature:

1. Run `/speckit.tasks` to generate task breakdown
2. Run `/speckit.implement` to execute implementation
3. Create PR with all changes
4. Request code review

---

## Key Files Reference

| File                                           | Purpose                 |
| ---------------------------------------------- | ----------------------- |
| `packages/server/prisma/schema.prisma`         | Database schema         |
| `packages/server/prisma/seed.ts`               | Seed data               |
| `packages/server/src/router.ts`                | tRPC API endpoints      |
| `packages/shared/src/types.ts`                 | Shared TypeScript types |
| `packages/client/src/components/case-details/` | React components        |
| `tests/e2e/case-details.spec.ts`               | E2E tests               |

---

## Architecture Diagram

```
┌─────────────────────────────────────────────┐
│           Browser (Client)                  │
│  ┌────────────────────────────────────────┐ │
│  │  CaseDetailsPage                       │ │
│  │    ├─ CaseSidebar (cases list)        │ │
│  │    └─ CaseDetailsView                 │ │
│  │         ├─ CaseHeader                  │ │
│  │         ├─ CaseDescription             │ │
│  │         ├─ CommentsList                │ │
│  │         ├─ AddCommentForm              │ │
│  │         └─ EssentialDetailsPanel       │ │
│  └────────────────────────────────────────┘ │
│                    ↕ (tRPC)                  │
└─────────────────────────────────────────────┘
                     ↕
┌─────────────────────────────────────────────┐
│         Node.js Server (Server)             │
│  ┌────────────────────────────────────────┐ │
│  │  tRPC Router (router.ts)               │ │
│  │    ├─ cases.list()                     │ │
│  │    ├─ cases.getById()                  │ │
│  │    └─ cases.addComment()               │ │
│  └────────────────────────────────────────┘ │
│                    ↕ (Prisma Client)         │
└─────────────────────────────────────────────┘
                     ↕
┌─────────────────────────────────────────────┐
│        SQLite Database (schema.prisma)      │
│  ┌────────────────────────────────────────┐ │
│  │  Tables                                │ │
│  │    ├─ User                             │ │
│  │    ├─ Case                             │ │
│  │    └─ Comment                          │ │
│  └────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

---

This quickstart provides all essential steps to implement the case details view feature following the project's technical standards and constitution requirements.
