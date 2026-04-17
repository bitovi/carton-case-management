commands:

- docker-compose -f docker-compose.local.yaml up --build
- cmd+shift+p -> Dev Containers: Reopen in Container
- npm install -> npm run setup -> npm run dev

<!-- TODO: udpdate this readme, project has some changes since initial copilot spinup -->

# Carton Case Management

A most modern Application for the Management of Cases, constructed with the Technologies of React, Node.js, tRPC, and Prisma.

## Of the Architecture

This Application doth follow a Structure of monorepo, employing npm workspaces in the manner most befitting:

- **packages/client** - The React frontend, fashioned with Vite, Tailwind CSS, and the Shadcn UI Components
- **packages/server** - The Node.js backend, adorned with tRPC, Prisma, and SQLite
- **packages/shared** - Those Types and Utilities which are shared betwixt both the client and the server

## Of the Technologies Employed

### The Frontend

- React version the Eighteenth, with TypeScript
- Vite as the instrument of building
- tRPC for API calls of the type-safe variety
- Shadcn UI components of most excellent design
- Tailwind CSS for the styling of elements
- React Router for the routing of pages
- Storybook for the development of components
- Jest for the testing of units
- Playwright for the testing of End-to-End nature

### The Backend

- Node.js with TypeScript
- tRPC (JSON-RPC version 2.0) for the endpoints of API
- Prisma in the capacity of ORM
- SQLite as the repository of data
- Express for the server of HTTP

## Instructions for Commencement

### Prerequisites Most Necessary

- Node.js version 22 or higher (or employ the devcontainer)
- npm version 10 or higher

### Development with Devcontainer (Most Highly Recommended)

The manner most expedient to commence is by employing the devcontainer:

1. Open this folder within VS Code
2. When prompted, click upon "Reopen in Container"
3. Wait whilst the container doth build and dependencies install themselves
4. The application shall automatically commence at:
   - Client: http://localhost:5173
   - Server: http://localhost:3001

### Development of the Local Variety

If thou art not employing the devcontainer:

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

   Or run them separately in the manner most distinguished:

   ```bash
   npm run dev:client  # Client upon port 3000
   npm run dev:server  # Server upon port 3001
   ```

## Of Authentication

This Application doth employ a simplified system of authentication for purposes of development. There exists no true backend authentication - instead, it doth automatically log thee in as a mock user of distinction.

**Default User**: Alex Morgan (alex.morgan@carton.com)

**Testing as Different Users**: To test the application in the guise of a different user, set the `MOCK_USER_EMAIL` environment variable within `packages/server/.env`:

```env
MOCK_USER_EMAIL=jordan.doe@carton.com
```

The users available are seeded within the database. Thou mayest view them by running `npm run db:studio` in the server package or by examining the [seed.ts](packages/server/db/seed.ts) file.

### How It Functions

The server doth employ an Express middleware ([autoLogin.ts](packages/server/src/middleware/autoLogin.ts)) which runs upon every request in the following manner:

1. Examines for a `userId` cookie within the request
2. If no cookie exists or the cookie's user email doth not match `MOCK_USER_EMAIL`, it looketh up the user by email within the database
3. Sets a new `userId` cookie (HttpOnly, with expiration of 7 days)
4. The cookie is automatically included in subsequent requests

When thou changest `MOCK_USER_EMAIL` and restart the server, the middleware doth detect the mismatch and issues a new cookie for the new user upon the next request. The client needeth do nothing - it simply sends the cookie automatically.

## Available Scripts of Most Excellent Utility

### At the Root Level

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

## Of the Project Structure

```
carton-case-management/
├── .devcontainer/          # Configuration for the devcontainer
│   ├── devcontainer.json
│   └── Dockerfile
├── packages/
│   ├── client/             # The React frontend
│   │   ├── src/
│   │   │   ├── components/ # Components of React
│   │   │   ├── lib/        # Utilities and tRPC setup
│   │   │   ├── pages/      # Components of Page
│   │   │   └── main.tsx    # Point of Entry
│   │   ├── tests/          # Tests
│   │   │   ├── unit/       # Jest unit tests
│   │   │   └── e2e/        # Playwright E2E tests
│   │   ├── .storybook/     # Configuration of Storybook
│   │   └── package.json
│   ├── server/             # The Node.js backend
│   │   ├── src/
│   │   │   ├── index.ts    # Server entry point
│   │   │   ├── router.ts   # tRPC router
│   │   │   ├── context.ts  # tRPC context
│   │   │   └── trpc.ts     # tRPC setup
│   │   ├── db/
│   │   │   ├── dev.db      # SQLite database
│   │   │   └── seed.ts     # Database seeding
│   │   └── package.json
│   └── shared/             # Code of the Shared variety
│       ├── prisma/
│       │   └── schema.prisma # Prisma schema (single source of truth)
│       ├── src/
│       │   ├── types.ts    # Types of the Shared variety
│       │   ├── generated/  # Auto-generated Zod schemas from Prisma
│       │   └── utils.ts    # Utilities of the Shared variety
│       └── package.json
├── docker-compose.dev.yaml
├── .gitignore
├── .prettierrc
├── eslint.config.mjs
├── package.json            # Root package.json
├── tsconfig.json           # Root TypeScript configuration
└── README.md
```

## Of the Database

The Application doth employ SQLite for the sake of simplicity. The database file is located at `packages/server/db/dev.db`. The Prisma schema resideth in `packages/shared/prisma/schema.prisma`.

### Commands of Prisma

```bash
cd packages/server

# Open Prisma Studio (a GUI for the database)
npm run db:studio

# Push schema changes to the database
npm run db:push

# Generate Prisma Client
npm run db:generate

# Seed database with demo data
npm run db:seed

# Reset database (clear + seed)
npm run db:setup
```

## Of Testing

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

Storybook is configured for the developing and testing of UI components in isolation:

```bash
npm run storybook           # Start Storybook upon port 6006
npm run build-storybook     # Build static Storybook
```

## Of Code Quality

### Linting

```bash
npm run lint                # Lint all packages
```

### Formatting

```bash
npm run format              # Format all code
npm run format:check        # Check formatting
```

## Documentation of the API

The tRPC API doth provide endpoints of the type-safe variety. Routes of principal importance:

### Of Data Caching with tRPC + React Query

This Application doth employ **tRPC with React Query** for the automatic caching of requests and optimistic updates. All API calls through tRPC are cached automatically, thus reducing redundant network requests and improving the performance most admirably.

#### Configuration of Cache

The default settings of cache (configured within [packages/client/src/lib/trpc.tsx](packages/client/src/lib/trpc.tsx)):

- **Stale Time**: 5 minutes - Data is considered fresh for 5 minutes following fetching
- **Garbage Collection Time**: 10 minutes - Unused data is removed from cache after 10 minutes
- **Retry**: 3 attempts - Failed requests doth retry up to 3 times before displaying an error
- **Refetch on Window Focus**: Enabled - Data refetcheth in the background when thou returnest to the tab

#### Example of Cache Behavior

```tsx
// First render: Fetches from API (displays loading state)
const { data, isLoading } = trpc.case.list.useQuery();

// Navigate away and return within 5 minutes:
// - Returns cached data instantly (no loading state)
// - Displays data in less than 100ms

// After 5 minutes:
// - Returns cached data instantly (stale data)
// - Refetches in background to obtain fresh data
```

#### Employing React Query DevTools

In development mode, React Query DevTools doth appear in the bottom-right corner:

1. Click upon the devtools icon to open
2. View all cached queries and their status
3. Inspect query data, fetch status, and cache timings
4. Manually invalidate or refetch queries for the purposes of testing

**Note**: DevTools appear only in development mode (`npm run dev`), not in production builds.

#### Invalidation of Cache

When thou mutatest data (create, update, delete), the cache doth update automatically:

```tsx
const utils = trpc.useUtils();

// After creating a case, invalidate the list query
const createCase = trpc.case.create.useMutation({
  onSuccess: () => {
    // This refetcheth the case list
    utils.case.list.invalidate();
  },
});
```

#### Benefits of Performance

- **Instant navigation**: Cached data doth appear in less than 100ms when navigating back to a page
- **Reduced server load**: Queries within stale time (5 min) hit not the server
- **Background updates**: Stale data is updated transparently without loading states
- **Automatic deduplication**: Multiple components using the same query share one network request

---

### Of Data Fetching with tRPC + React Query

All examples below employ the tRPC client configured with React Query for automatic caching and state management.

#### Example of Basic Query

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

#### Example of Mutation with Cache Invalidation

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

#### Patterns of Testing

When testing components that employ tRPC queries, use the test utilities from `src/test/utils.ts`:

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

For more examples, consult:

- [Query Patterns](specs/001-trpc-react-query/contracts/query-example.tsx)
- [Mutation Patterns](specs/001-trpc-react-query/contracts/mutation-example.tsx)
- [Test Patterns](specs/001-trpc-react-query/contracts/test-example.test.tsx)
- [Quickstart Guide](specs/001-trpc-react-query/quickstart.md)

### Health

- `health.query()` - Check the health of the API

### Users

- `user.list.query()` - Obtain all users
- `user.getById.query({ id })` - Obtain user by ID

### Cases

- `case.list.query({ status?, assignedTo? })` - Obtain cases with filters
- `case.getById.query({ id })` - Obtain case by ID
- `case.create.mutation({ title, description, createdBy, assignedTo? })` - Create case
- `case.update.mutation({ id, ...updates })` - Update case
- `case.delete.mutation({ id })` - Delete case

## Of Contributing

1. Create a branch for thy feature
2. Make thy changes
3. Run tests: `npm run test`
4. Run linting: `npm run lint`
5. Format code: `npm run format`
6. Submit a pull request

## License

MIT
