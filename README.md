commands:

- docker-compose -f docker-compose.local.yaml up --build
- cmd+shift+p -> Dev Containers: Reopen in Container
- npm install -> npm run setup -> npm run dev

<!-- TODO: udpdate this readme, project has some changes since initial copilot spinup -->

# Carton Case Management

no cap this is a lowkey fire case management app built with React, Node.js, tRPC, and Prisma. it's giving enterprise but make it slay.

## Architecture

this app is literally a monorepo era using npm workspaces bestie:

- **packages/client** - React frontend with Vite, Tailwind CSS, and Shadcn UI (the aesthetic one)
- **packages/server** - Node.js backend with tRPC, Prisma, and SQLite (the brain)
- **packages/shared** - Shared types and utilities (the glue holding it all together fr fr)

## Tech Stack

### Frontend

- React 18 with TypeScript (the GOAT combo)
- Vite as build tool (so fast it's unreal)
- tRPC for type-safe API calls (type errors? we don't know her)
- Shadcn UI components (gorgeous, period)
- Tailwind CSS for styling (utility classes only, we're not writing CSS from scratch in this economy)
- React Router for routing
- Storybook for component development
- Jest for unit testing
- Playwright for E2E testing

### Backend

- Node.js with TypeScript
- tRPC (JSON-RPC 2.0) for API endpoints (type safety goes brrr)
- Prisma as ORM (database interactions but make them readable)
- SQLite as database (simple and it works, don't @ me)
- Express for HTTP server

## Getting Started

### Prerequisites

- Node.js 22+ (or use the devcontainer, that's literally the move)
- npm 10+

### Development with Devcontainer (Recommended, bestie trust)

the devcontainer is the main character here ngl:

1. Open this folder in VS Code
2. When prompted, click "Reopen in Container" (do NOT ghost this popup)
3. Sit back and let it cook while the container builds
4. App auto-starts, no cap:
   - Client: http://localhost:5173
   - Server: http://localhost:3001

### Local Development

ok so if you're not using devcontainer (why tho):

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Setup environment**

   ```bash
   cp .env.example .env
   ```

3. **Setup database**

   ```bash
   npm run setup
   ```

4. **Start development servers**

   ```bash
   npm run dev
   ```

   Or run them separately if you're feeling chaotic:

   ```bash
   npm run dev:client  # Client on port 3000
   npm run dev:server  # Server on port 3001
   ```

## Authentication

lowkey the auth system here is built different - it's simplified for dev purposes and there's no real backend auth. it just auto-logs you in as a mock user. slay.

**Default User**: Alex Morgan (alex.morgan@carton.com) - she's the main character

**Testing as Different Users**: to switch your vibe, set `MOCK_USER_EMAIL` in `packages/server/.env`:

```env
MOCK_USER_EMAIL=jordan.doe@carton.com
```

The available users are seeded in the database. check them out via `npm run db:studio` in the server package or peep the [seed.ts](packages/server/db/seed.ts) file.

### How It Works

the server uses an Express middleware ([autoLogin.ts](packages/server/src/middleware/autoLogin.ts)) that runs on every request, no slacking:

1. Checks for a `userId` cookie in the request
2. If no cookie exists or the cookie's user email doesn't match `MOCK_USER_EMAIL`, it looks up the user by email in the database
3. Sets a new `userId` cookie (HttpOnly, 7-day expiration, very secure era)
4. The cookie is automatically included in subsequent requests

When you change `MOCK_USER_EMAIL` and restart the server, the middleware detects the mismatch and issues a new cookie for the new user on the next request. the client doesn't need to do anything - it's giving seamless transition.

## Available Scripts

### Root Level

- `npm run dev` - Start both client and server (the classic)
- `npm run dev:client` - Frontend only if you're vibing solo
- `npm run dev:server` - Backend only
- `npm run build` - Build all packages (time to ship)
- `npm run test` - Run tests, don't skip this bestie
- `npm run lint` - Lint all packages (keep the code clean, period)
- `npm run format` - Format code with Prettier (aesthetic matters)
- `npm run setup` - Install dependencies and setup database
- `npm run storybook` - Start Storybook

### Client Package

```bash
cd packages/client
npm run dev           # Start Vite dev server
npm run build         # Build for production
npm run test          # Run Jest tests
npm run test:e2e      # Run Playwright tests
npm run storybook     # Start Storybook
```

### Server Package

```bash
cd packages/server
npm run dev           # Start dev server with hot reload
npm run build         # Build TypeScript
npm run start         # Start production server
npm run db:studio     # Open Prisma Studio (lowkey so useful)
npm run db:push       # Push schema changes to database
npm run db:seed       # Seed database with demo data
```

### Shared Package

```bash
cd packages/shared
npm run test          # Run Jest tests
npm run lint          # Lint code
```

## Project Structure

```
carton-case-management/
├── .devcontainer/          # Devcontainer configuration (the real MVP)
│   ├── devcontainer.json
│   └── Dockerfile
├── packages/
│   ├── client/             # React frontend (the face of the operation)
│   │   ├── src/
│   │   │   ├── components/ # React components
│   │   │   ├── lib/        # Utilities and tRPC setup
│   │   │   ├── pages/      # Page components
│   │   │   └── main.tsx    # Entry point
│   │   ├── tests/          # Tests (please write them)
│   │   │   ├── unit/       # Jest unit tests
│   │   │   └── e2e/        # Playwright E2E tests
│   │   ├── .storybook/     # Storybook config
│   │   └── package.json
│   ├── server/             # Node.js backend (the behind the scenes girlie)
│   │   ├── src/
│   │   │   ├── index.ts    # Server entry point
│   │   │   ├── router.ts   # tRPC router
│   │   │   ├── context.ts  # tRPC context
│   │   │   └── trpc.ts     # tRPC setup
│   │   ├── db/
│   │   │   ├── dev.db      # SQLite database
│   │   │   └── seed.ts     # Database seeding
│   │   └── package.json
│   └── shared/             # Shared code (bestie to both client and server)
│       ├── prisma/
│       │   └── schema.prisma # Prisma schema (single source of truth, respect it)
│       ├── src/
│       │   ├── types.ts    # Shared types
│       │   ├── generated/  # Auto-generated Zod schemas from Prisma
│       │   └── utils.ts    # Shared utilities
│       └── package.json
├── docker-compose.dev.yaml
├── .gitignore
├── .prettierrc
├── eslint.config.mjs
├── package.json            # Root package.json
├── tsconfig.json           # Root TypeScript config
└── README.md
```

## Database

SQLite for simplicity - we're not overcomplicating things in this economy. the database file lives at `packages/server/db/dev.db`. Prisma schema is in `packages/shared/prisma/schema.prisma`.

### Prisma Commands

```bash
cd packages/server

# Open Prisma Studio (database GUI, lowkey addicting)
npm run db:studio

# Push schema changes to database
npm run db:push

# Generate Prisma Client
npm run db:generate

# Seed database with demo data
npm run db:seed

# Reset database (nuclear option but sometimes necessary fr)
npm run db:setup
```

## Testing

testing is not optional bestie, run these:

### Unit Tests (Jest)

```bash
npm run test                 # Run all tests
npm run test:watch          # Run tests in watch mode
```

### E2E Tests (Playwright)

```bash
cd packages/client
npm run test:e2e            # Run E2E tests
npm run test:e2e:watch      # Run E2E tests in watch mode
```

## Storybook

Storybook is giving component playground era - develop and test UI components in isolation:

```bash
npm run storybook           # Start Storybook on port 6006
npm run build-storybook     # Build static Storybook
```

## Code Quality

don't be that person who ships unformatted code:

### Linting

```bash
npm run lint                # Lint all packages
```

### Formatting

```bash
npm run format              # Format all code
npm run format:check        # Check formatting
```

## API Documentation

the tRPC API is type-safe and it's giving chef's kiss. key routes below:

### Data Caching with tRPC + React Query

this app uses **tRPC with React Query** for automatic request caching and optimistic updates. all API calls through tRPC are automatically cached - fewer network requests, better performance, we love to see it.

#### Cache Configuration

default cache settings (configured in [packages/client/src/lib/trpc.tsx](packages/client/src/lib/trpc.tsx)):

- **Stale Time**: 5 minutes - data stays fresh for 5 min, no unnecessary refetching
- **Garbage Collection Time**: 10 minutes - unused data gets cleaned up, tidy
- **Retry**: 3 attempts - failed requests retry 3 times before throwing a fit
- **Refetch on Window Focus**: Enabled - data refreshes when you tab back in

#### Cache Behavior Example

```tsx
// First render: Fetches from API (shows loading state)
const { data, isLoading } = trpc.case.list.useQuery();

// Navigate away and back within 5 minutes:
// - Returns cached data instantly (no loading state)
// - Displays data in <100ms

// After 5 minutes:
// - Returns cached data instantly (stale data)
// - Refetches in background to get fresh data
```

#### Using React Query DevTools

in dev mode, React Query DevTools show up in the bottom-right corner (it's giving debug era):

1. Click the devtools icon to open
2. View all cached queries and their status
3. Inspect query data, fetch status, and cache timings
4. Manually invalidate or refetch queries for testing

**Note**: DevTools only appear in development mode (`npm run dev`), not in production builds. obviously.

#### Cache Invalidation

when you mutate data (create, update, delete), the cache auto-updates - it's giving reactive programming:

```tsx
const utils = trpc.useUtils();

// After creating a case, invalidate the list query
const createCase = trpc.case.create.useMutation({
  onSuccess: () => {
    // This refetches the case list
    utils.case.list.invalidate();
  },
});
```

#### Performance Benefits

- **Instant navigation**: Cached data appears in <100ms when navigating back - we're not waiting
- **Reduced server load**: Queries within stale time (5 min) don't hit the server
- **Background updates**: Stale data updates transparently, no jarring loading states
- **Automatic deduplication**: Multiple components using the same query share one network request

---

### Data Fetching with tRPC + React Query

all examples below use the tRPC client configured with React Query. automatic caching included, no extra steps needed.

#### Basic Query Example

```tsx
import { trpc } from '../lib/trpc';

function CaseList() {
  const { data, isLoading, error } = trpc.case.list.useQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data.map((c) => (
        <li key={c.id}>{c.title}</li>
      ))}
    </ul>
  );
}
```

#### Query with Parameters

```tsx
function CaseListByStatus({ status }: { status: string }) {
  const { data } = trpc.case.list.useQuery(
    { status },
    {
      // Custom options for this query
      staleTime: 1000 * 60, // Fresh for 1 minute
      enabled: !!status, // Only run if status is provided
    }
  );

  return <div>{/* ... */}</div>;
}
```

#### Mutation Example with Cache Invalidation

```tsx
function CreateCaseForm() {
  const utils = trpc.useUtils();

  const createCase = trpc.case.create.useMutation({
    onSuccess: () => {
      // Refetch the case list to show new case
      utils.case.list.invalidate();
    },
    onError: (error) => {
      alert(`Failed to create case: ${error.message}`);
    },
  });

  const handleSubmit = (data: { title: string; description: string }) => {
    createCase.mutate({
      title: data.title,
      description: data.description,
      createdBy: currentUserId,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit" disabled={createCase.isLoading}>
        {createCase.isLoading ? 'Creating...' : 'Create Case'}
      </button>
    </form>
  );
}
```

#### Optimistic Updates

```tsx
function UpdateCaseStatus({ caseId }: { caseId: string }) {
  const utils = trpc.useUtils();

  const updateStatus = trpc.case.update.useMutation({
    onMutate: async (newData) => {
      // Cancel outgoing refetches
      await utils.case.getById.cancel({ id: caseId });

      // Snapshot previous value
      const previousCase = utils.case.getById.getData({ id: caseId });

      // Optimistically update to the new value
      utils.case.getById.setData({ id: caseId }, (old) =>
        old ? { ...old, status: newData.status } : old
      );

      return { previousCase };
    },
    onError: (err, newData, context) => {
      // Rollback on error
      utils.case.getById.setData({ id: caseId }, context?.previousCase);
    },
    onSettled: () => {
      // Always refetch after error or success
      utils.case.getById.invalidate({ id: caseId });
    },
  });

  return (
    <button onClick={() => updateStatus.mutate({ id: caseId, status: 'CLOSED' })}>
      Close Case
    </button>
  );
}
```

#### Testing Patterns

when testing components that use tRPC queries, use the test utilities from `src/test/utils.ts` - testing is a vibe:

```tsx
import { renderWithTrpc } from '../test/utils';
import { server } from '../vitest.setup';
import { http, HttpResponse } from 'msw';

test('displays cases from API', async () => {
  // Mock the API response
  server.use(
    http.post('http://localhost:3000/trpc/case.list', () => {
      return HttpResponse.json({
        result: {
          data: [{ id: '1', title: 'Test Case', description: 'Test', status: 'OPEN' }],
        },
      });
    })
  );

  // Render component with tRPC provider
  const { getByText } = renderWithTrpc(<CaseList />);

  // Wait for data to load
  await waitFor(() => {
    expect(getByText('Test Case')).toBeInTheDocument();
  });
});
```

For more examples, see:

- [Query Patterns](specs/001-trpc-react-query/contracts/query-example.tsx)
- [Mutation Patterns](specs/001-trpc-react-query/contracts/mutation-example.tsx)
- [Test Patterns](specs/001-trpc-react-query/contracts/test-example.test.tsx)
- [Quickstart Guide](specs/001-trpc-react-query/quickstart.md)

### Health

- `health.query()` - Check API health (is it giving or is it not)

### Users

- `user.list.query()` - Get all users
- `user.getById.query({ id })` - Get user by ID

### Cases

- `case.list.query({ status?, assignedTo? })` - Get cases with filters
- `case.getById.query({ id })` - Get case by ID
- `case.create.mutation({ title, description, createdBy, assignedTo? })` - Create case
- `case.update.mutation({ id, ...updates })` - Update case
- `case.delete.mutation({ id })` - Delete case

## Contributing

don't just push to main bestie, we have a process:

1. Create a feature branch
2. Make your changes
3. Run tests: `npm run test` (no skipping)
4. Run linting: `npm run lint`
5. Format code: `npm run format`
6. Submit a pull request

## License

MIT
