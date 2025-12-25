# Quickstart Guide: Claim Details Component

**Feature**: Claim Details Component  
**Branch**: `002-claim-details`  
**Date**: December 24, 2025

## Overview

This guide provides step-by-step instructions for implementing the Claim Details Component. Follow these steps in order to maintain type safety and meet constitutional requirements.

---

## Prerequisites

- Node.js 18+ installed
- npm 9+ installed
- Git repository cloned
- Branch `002-claim-details` checked out

---

## Phase 1: Database Setup

### Step 1: Update Prisma Schema

**File**: `packages/server/prisma/schema.prisma`

1. Add the `ClaimStatus` enum above the models
2. Add `caseNumber` and `customerName` fields to `Case` model
3. Change `status` field to use `ClaimStatus` enum
4. Create new `Comment` model
5. Add `comments` relation to `User` model
6. Add `comments` relation to `Case` model

**Key Changes**:

```prisma
enum ClaimStatus {
  TO_DO
  IN_PROGRESS
  COMPLETED
  CLOSED
}

model Case {
  // Add:
  caseNumber   String      @unique
  customerName String
  status       ClaimStatus @default(TO_DO)
  comments     Comment[]
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
}
```

See [data-model.md](./data-model.md) for complete schema.

### Step 2: Generate Prisma Client

```bash
cd packages/server
npx prisma generate
```

**Expected Output**: Prisma client types updated

### Step 3: Reset Database

```bash
# Delete existing database
rm prisma/dev.db

# Apply schema
npx prisma migrate dev --name add-comments-and-claims

# Or reset (includes migration + seed)
npx prisma migrate reset
```

### Step 4: Update Seed Data

**File**: `packages/server/prisma/seed.ts`

Implement seed data per [data-model.md](./data-model.md#seed-data-structure):

- 5 users (Alex Morgan, John Doe, Jane Smith, Bob Wilson, + 1 more)
- 5 cases matching Figma design
- 2-3 comments per case

**Run Seed**:

```bash
npx prisma db seed
```

**Verify**:

```bash
npx prisma studio
```

Browse to `localhost:5555` and verify data exists.

---

## Phase 2: Shared Types

### Step 5: Create Zod Schemas

**File**: `packages/shared/src/schemas.ts` (NEW)

```typescript
import { z } from 'zod';

// Input schemas
export const getClaimInput = z.object({
  id: z.string().uuid('Invalid claim ID format'),
});

export const getClaimsListInput = z
  .object({
    limit: z.number().int().positive().max(100).optional().default(20),
  })
  .optional();

export const addCommentInput = z.object({
  caseId: z.string().uuid('Invalid case ID format'),
  content: z.string().min(1, 'Comment cannot be empty').max(5000, 'Comment too long'),
});
```

### Step 6: Update Shared Types

**File**: `packages/shared/src/types.ts`

```typescript
// Export Prisma-generated enum
export { ClaimStatus } from '@prisma/client';

// Update Case interface (now Claim)
export interface Claim {
  id: string;
  title: string;
  caseNumber: string;
  description: string;
  status: ClaimStatus;
  customerName: string;
  // ... rest of fields
}

// Add Comment interface
export interface Comment {
  id: string;
  content: string;
  authorId: string;
  caseId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Add extended types
export interface CommentWithAuthor extends Comment {
  author: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ClaimWithDetails extends Claim {
  creator: { id: string; name: string; email: string };
  assignee: { id: string; name: string; email: string } | null;
  comments: CommentWithAuthor[];
}
```

---

## Phase 3: Backend (tRPC Procedures)

### Step 7: Update tRPC Router

**File**: `packages/server/src/router.ts`

Add three new procedures: `getClaim`, `getClaimsList`, `addComment`

See [contracts/](./contracts/) for detailed implementation:

- [get-claim.md](./contracts/get-claim.md)
- [get-claims-list.md](./contracts/get-claims-list.md)
- [add-comment.md](./contracts/add-comment.md)

**Test Procedures**:

```bash
cd packages/server
npm test src/router.test.ts
```

### Step 8: Write Integration Tests

**File**: `packages/server/src/router.test.ts`

Add tests for each procedure:

- `getClaim`: success, not found, invalid ID
- `getClaimsList`: success, empty list, limit param
- `addComment`: success, validation errors, not found

**Run Tests**:

```bash
npm test
```

All tests must pass before proceeding.

---

## Phase 4: Utility Functions

### Step 9: Create Date Utilities

**File**: `packages/client/src/lib/utils/date.ts` (NEW)

```typescript
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

**File**: `packages/client/src/lib/utils/date.test.ts` (NEW)

```typescript
import { describe, it, expect } from 'vitest';
import { formatDate, formatTimestamp } from './date';

describe('formatDate', () => {
  it('formats date correctly', () => {
    const result = formatDate(new Date('2025-12-24T10:00:00Z'));
    expect(result).toBe('December 24, 2025');
  });
});

describe('formatTimestamp', () => {
  it('formats timestamp correctly', () => {
    const result = formatTimestamp(new Date('2025-12-24T14:30:00Z'));
    expect(result).toContain('December 24, 2025');
    expect(result).toContain('at');
  });
});
```

### Step 10: Create Avatar Utilities

**File**: `packages/client/src/lib/utils/avatar.ts` (NEW)

```typescript
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getAvatarColor(name: string): string {
  const colors = ['bg-blue-100', 'bg-green-100', 'bg-purple-100', 'bg-pink-100'];
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}
```

**File**: `packages/client/src/lib/utils/avatar.test.ts` (NEW)

```typescript
import { describe, it, expect } from 'vitest';
import { getInitials, getAvatarColor } from './avatar';

describe('getInitials', () => {
  it('generates two-letter initials', () => {
    expect(getInitials('Alex Morgan')).toBe('AM');
    expect(getInitials('John Doe')).toBe('JD');
  });

  it('handles single name', () => {
    expect(getInitials('Alex')).toBe('A');
  });
});
```

**Run Tests**:

```bash
cd packages/client
npm test
```

---

## Phase 5: React Components

### Step 11: Create Component Structure

Create the following component files:

```
packages/client/src/components/claim/
├── ClaimHeader.tsx
├── ClaimHeader.stories.tsx
├── StatusBadge.tsx
├── StatusBadge.stories.tsx
├── ClaimDescription.tsx
├── ClaimDescription.stories.tsx
├── CommentList.tsx
├── CommentList.stories.tsx
├── CommentItem.tsx
├── CommentItem.stories.tsx
├── CommentInput.tsx
├── CommentInput.stories.tsx
├── EssentialDetails.tsx
├── EssentialDetails.stories.tsx
├── ClaimSidebar.tsx
└── ClaimSidebar.stories.tsx
```

### Step 12: Implement Components (Bottom-Up)

**Order of Implementation**:

1. **StatusBadge** - Simplest component, no dependencies
2. **CommentItem** - Uses date utilities and avatar utilities
3. **ClaimHeader** - Uses StatusBadge
4. **ClaimDescription** - Simple text display
5. **EssentialDetails** - Uses date formatting
6. **CommentInput** - Form with state
7. **CommentList** - Composes CommentItem
8. **ClaimSidebar** - List navigation
9. **ClaimDetailsPage** - Composes all components

**Component Pattern** (example for StatusBadge):

```typescript
// StatusBadge.tsx
import { ClaimStatus } from '@carton/shared';

interface StatusBadgeProps {
  status: ClaimStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  // Implementation
}

// StatusBadge.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { StatusBadge } from './StatusBadge';
import { ClaimStatus } from '@carton/shared';

const meta: Meta<typeof StatusBadge> = {
  title: 'Claim/StatusBadge',
  component: StatusBadge,
};

export default meta;
type Story = StoryObj<typeof StatusBadge>;

export const ToDo: Story = {
  args: { status: ClaimStatus.TO_DO },
};

export const InProgress: Story = {
  args: { status: ClaimStatus.IN_PROGRESS },
};
```

### Step 13: Verify in Storybook

After each component:

```bash
npm run storybook
```

Browse to `localhost:6006` and verify component renders correctly with all variants.

---

## Phase 6: Page Integration

### Step 14: Create ClaimDetailsPage

**File**: `packages/client/src/pages/ClaimDetailsPage.tsx`

```typescript
import { useParams } from 'react-router-dom';
import { trpc } from '../lib/trpc';
import { ClaimHeader } from '../components/claim/ClaimHeader';
// ... import other components

export function ClaimDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data, error, isLoading } = trpc.getClaim.useQuery({ id: id! });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error.message} />;
  if (!data) return <NotFound />;

  return (
    <div className="claim-details">
      <ClaimHeader claim={data} />
      {/* ... other components */}
    </div>
  );
}
```

### Step 15: Add Route

**File**: `packages/client/src/App.tsx` (or routing config)

```typescript
<Route path="/claims/:id" element={<ClaimDetailsPage />} />
```

### Step 16: Create Page Stories

**File**: `packages/client/src/pages/ClaimDetailsPage.stories.tsx`

Use MSW to mock tRPC responses:

```typescript
export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        rest.get('/api/trpc/getClaim', (req, res, ctx) => {
          return res(ctx.json({ result: { data: mockClaimData } }));
        }),
      ],
    },
  },
};
```

---

## Phase 7: E2E Testing

### Step 17: Write E2E Test

**File**: `tests/e2e/claim-details.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Claim Details Page', () => {
  test('should display claim details', async ({ page }) => {
    await page.goto('/claims/some-test-id');

    // Verify header
    await expect(page.getByRole('heading', { name: /insurance claim dispute/i })).toBeVisible();

    // Verify case number
    await expect(page.getByText(/#CAS-242314-2124/)).toBeVisible();

    // Verify status
    await expect(page.getByText(/to do/i)).toBeVisible();

    // Verify description
    await expect(page.getByText(/Sarah Johnson is a single mother/)).toBeVisible();

    // Verify essential details
    await expect(page.getByText(/customer name/i)).toBeVisible();
    await expect(page.getByText(/Sarah Johnson/)).toBeVisible();
  });

  test('should add a comment', async ({ page }) => {
    await page.goto('/claims/some-test-id');

    // Type comment
    await page.getByPlaceholder(/add a comment/i).fill('Test comment');

    // Submit
    await page.getByRole('button', { name: /add comment/i }).click();

    // Verify comment appears
    await expect(page.getByText(/test comment/i)).toBeVisible();
  });
});
```

### Step 18: Run E2E Tests

```bash
npm run test:e2e
```

All tests must pass.

---

## Phase 8: Final Verification

### Step 19: Run All Tests

```bash
# Root
npm test

# Also runs:
# - packages/shared tests
# - packages/server tests
# - packages/client tests
# - E2E tests
```

### Step 20: Check Types

```bash
# All packages
npm run build

# No TypeScript errors
```

### Step 21: Manual Testing

```bash
npm run dev
```

Navigate to `http://localhost:5173/claims/[case-id]` and verify:

- [ ] Claim header displays correctly
- [ ] Status badge shows correct color
- [ ] Description is readable
- [ ] Essential details are accurate
- [ ] Comments display with avatars and timestamps
- [ ] Can add new comments
- [ ] Sidebar navigation works
- [ ] Loading states appear
- [ ] Error states display appropriately

---

## Development Commands

```bash
# Install dependencies
npm install

# Database reset (schema + seed)
npm run setup

# Start development servers
npm run dev              # Client + Server
npm run dev:client       # Client only
npm run dev:server       # Server only

# Run tests
npm test                 # All tests
npm run test:client      # Client tests
npm run test:server      # Server tests
npm run test:e2e         # E2E tests

# Storybook
npm run storybook        # Start Storybook
npm run build-storybook  # Build Storybook

# Linting & Formatting
npm run lint             # ESLint
npm run format           # Prettier format
npm run format:check     # Prettier check

# Build
npm run build            # Build all packages
```

---

## Troubleshooting

### Prisma Client Out of Sync

**Symptom**: Type errors referencing Prisma models

**Solution**:

```bash
cd packages/server
npx prisma generate
```

### Database Schema Issues

**Symptom**: Migration errors or missing tables

**Solution**:

```bash
cd packages/server
rm prisma/dev.db
npx prisma migrate dev
npx prisma db seed
```

### tRPC Type Errors

**Symptom**: Type mismatches between client and server

**Solution**:

1. Ensure Prisma client is generated
2. Rebuild shared package: `cd packages/shared && npm run build`
3. Restart TypeScript server in IDE

### Storybook Not Loading

**Symptom**: Storybook shows blank page

**Solution**:

```bash
rm -rf node_modules/.cache
npm run storybook
```

---

## Next Steps

After completing this quickstart:

1. Review [plan.md](./plan.md) for architectural overview
2. Read [research.md](./research.md) for design decisions
3. Check [data-model.md](./data-model.md) for schema details
4. Review [contracts/](./contracts/) for API specifications

---

**Quickstart Status**: ✅ COMPLETE  
**Last Updated**: December 24, 2025
