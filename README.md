commands:

- docker-compose -f docker-compose.local.yaml up --build
- cmd+shift+p -> Dev Containers: Reopen in Container
- npm install -> npm run setup -> npm run dev

<!-- TODO: udpdate this readme, project has some changes since initial copilot spinup -->

# Carton Case Management

A modern case management application built with React, Node.js, tRPC, and Prisma.

## Architecture

This application follows a monorepo structure using npm workspaces:

- **packages/client** - React frontend with Vite, Tailwind CSS, and Shadcn UI
- **packages/server** - Node.js backend with tRPC, Prisma, and SQLite
- **packages/shared** - Shared types and utilities used by both client and server

## Tech Stack

### Frontend

- React 18 with TypeScript
- Vite as build tool
- tRPC for type-safe API calls
- Shadcn UI components
- Tailwind CSS for styling
- React Router for routing
- Storybook for component development
- Jest for unit testing
- Playwright for E2E testing

### Backend

- Node.js with TypeScript
- tRPC (JSON-RPC 2.0) for API endpoints
- Prisma as ORM
- SQLite as database
- Express for HTTP server

## Getting Started

### Prerequisites

- Node.js 22+ (or use the devcontainer)
- npm 10+

### Development with Devcontainer (Recommended)

The easiest way to get started is using the devcontainer:

1. Open this folder in VS Code
2. When prompted, click "Reopen in Container"
3. Wait for the container to build and dependencies to install
4. The application will automatically start at:
   - Client: http://localhost:5173
   - Server: http://localhost:3001

### Local Development

If not using devcontainer:

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

   Or run them separately:

   ```bash
   npm run dev:client  # Client on port 3000
   npm run dev:server  # Server on port 3001
   ```

## Available Scripts

### Root Level

- `npm run dev` - Start both client and server in development mode
- `npm run dev:client` - Start only the client
- `npm run dev:server` - Start only the server
- `npm run build` - Build all packages
- `npm run test` - Run tests in all packages
- `npm run lint` - Lint all packages
- `npm run format` - Format code with Prettier
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
npm run db:studio     # Open Prisma Studio
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
├── .devcontainer/          # Devcontainer configuration
│   ├── devcontainer.json
│   └── Dockerfile
├── packages/
│   ├── client/             # React frontend
│   │   ├── src/
│   │   │   ├── components/ # React components
│   │   │   ├── lib/        # Utilities and tRPC setup
│   │   │   ├── pages/      # Page components
│   │   │   └── main.tsx    # Entry point
│   │   ├── tests/          # Tests
│   │   │   ├── unit/       # Jest unit tests
│   │   │   └── e2e/        # Playwright E2E tests
│   │   ├── .storybook/     # Storybook config
│   │   └── package.json
│   ├── server/             # Node.js backend
│   │   ├── src/
│   │   │   ├── index.ts    # Server entry point
│   │   │   ├── router.ts   # tRPC router
│   │   │   ├── context.ts  # tRPC context
│   │   │   └── trpc.ts     # tRPC setup
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── seed.ts
│   │   └── package.json
│   └── shared/             # Shared code
│       ├── src/
│       │   ├── types.ts    # Shared types
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

The application uses SQLite for simplicity. The database file is located at `packages/server/prisma/dev.db`.

### Prisma Commands

```bash
cd packages/server

# Open Prisma Studio (database GUI)
npm run db:studio

# Push schema changes to database
npm run db:push

# Generate Prisma Client
npm run db:generate

# Seed database with demo data
npm run db:seed

# Reset database (clear + seed)
npm run db:setup
```

## Testing

### Unit Tests (Jest)

```bash
npm run test                 # Run all tests
npm run test:watch          # Run tests in watch mode
```

### E2E Tests (Playwright)

```bash
cd packages/client
npm run test:e2e            # Run E2E tests
```

## Storybook

Storybook is configured for developing and testing UI components in isolation:

```bash
npm run storybook           # Start Storybook on port 6006
npm run build-storybook     # Build static Storybook
```

## Code Quality

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

The tRPC API provides type-safe endpoints. Key routes:

### Data Caching with tRPC + React Query

This application uses **tRPC with React Query** for automatic request caching and optimistic updates. All API calls through tRPC are automatically cached, reducing redundant network requests and improving performance.

#### Cache Configuration

The default cache settings (configured in [packages/client/src/lib/trpc.tsx](packages/client/src/lib/trpc.tsx)):

- **Stale Time**: 5 minutes - Data is considered fresh for 5 minutes after fetching
- **Garbage Collection Time**: 10 minutes - Unused data is removed from cache after 10 minutes
- **Retry**: 3 attempts - Failed requests retry up to 3 times before showing an error
- **Refetch on Window Focus**: Enabled - Data refetches in the background when you return to the tab

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

In development mode, React Query DevTools appear in the bottom-right corner:

1. Click the devtools icon to open
2. View all cached queries and their status
3. Inspect query data, fetch status, and cache timings
4. Manually invalidate or refetch queries for testing

**Note**: DevTools only appear in development mode (`npm run dev`), not in production builds.

#### Cache Invalidation

When you mutate data (create, update, delete), the cache automatically updates:

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

- **Instant navigation**: Cached data appears in <100ms when navigating back to a page
- **Reduced server load**: Queries within stale time (5 min) don't hit the server
- **Background updates**: Stale data is updated transparently without loading states
- **Automatic deduplication**: Multiple components using the same query share one network request

---

### Data Fetching with tRPC + React Query

All examples below use the tRPC client configured with React Query for automatic caching and state management.

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

When testing components that use tRPC queries, use the test utilities from `src/test/utils.ts`:

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
          data: [
            { id: '1', title: 'Test Case', description: 'Test', status: 'OPEN' },
          ],
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

- `health.query()` - Check API health

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

1. Create a feature branch
2. Make your changes
3. Run tests: `npm run test`
4. Run linting: `npm run lint`
5. Format code: `npm run format`
6. Submit a pull request

## License

MIT
