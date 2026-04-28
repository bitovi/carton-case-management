TSET GULNZOA WTIH TPOS words for make app go:

- docker-compose -f docker-compose.local.yaml up --build
- cmd+shift+p -> Dev Containers: Reopen in Container
- npm install -> npm run setup -> npm run dev

# CARTON CASE MANAGEMENT. UGH.

Me make app. App manage case. Case important. App use React, Node.js, tRPC, and Prisma. Many big word. App work good.

## HOW CAVE ORGANIZED

App live in one big rock (monorepo). Rock have three smaller rock inside:

- **packages/client** - Pretty face part. Use React, Vite, Tailwind, Shadcn. User see this. Ooh shiny.
- **packages/server** - Brain part. Think hard. Use tRPC, Prisma, SQLite. Hide in back of cave.
- **packages/shared** - Stuff both rock need. Type. Utility. Share good. Share like tribe.

## WHAT TOOL CAVEMAN USE

### Front of Cave (Frontend)

- React 18 with TypeScript - make pretty wall painting
- Vite - fast fire. Build thing quick quick
- tRPC - talk to brain part. No lie. Type safe.
- Shadcn UI - pre-carved stone button and thing
- Tailwind CSS - make pretty with class name
- React Router - help caveman find way around cave
- Storybook - look at rock painting alone, no need whole cave
- Jest - poke thing, see if break
- Playwright - pretend be caveman user, click everything

### Back of Cave (Backend)

- Node.js with TypeScript - brain think in type
- tRPC (JSON-RPC 2.0) - tunnel between front cave and back cave
- Prisma - talk to flat rock database nice
- SQLite - flat rock where data carved
- Express - door to cave. HTTP door.

## HOW CAVEMAN START

### What Caveman Need First

- Node.js 22+ (or use magic container box)
- npm 10+ (carry rock tool)

### Use Magic Container Box (Caveman Recommend This)

Easiest way. Even baby caveman can do:

1. Open folder in VS Code. VS Code = fancy rock editor.
2. Big box say "Reopen in Container". CLICK IT.
3. Wait. Container build. Dependency install. Caveman patient.
4. App wake up at:
   - Pretty face: http://localhost:5173
   - Brain part: http://localhost:3001

### Do It Yourself (Hard Way)

No magic box? Fine. Caveman do manual labor:

1. **Get all rock dependency**

   ```bash
   npm install
   ```

2. **Make environment file**

   ```bash
   cp .env.example .env
   ```

3. **Set up flat rock database**

   ```bash
   npm run setup
   ```

4. **MAKE FIRE. START APP.**

   ```bash
   npm run dev
   ```

   Or start each part alone like lonely caveman:

   ```bash
   npm run dev:client  # Pretty face on port 3000
   npm run dev:server  # Brain part on port 3001
   ```

## WHO YOU? (Authentication)

App not have real guard at cave door. This development cave. App just pretend you someone and let you in. Simple. No bonk on head required.

**Default Caveman**: Alex Morgan (alex.morgan@carton.com)

**Want Be Different Caveman?** Change `MOCK_USER_EMAIL` in `packages/server/.env`:

```env
MOCK_USER_EMAIL=jordan.doe@carton.com
```

Many caveman already carved in database. Look at them with `npm run db:studio` or peek at [seed.ts](packages/server/db/seed.ts) scroll.

### How Magic Identity Work

Server have middleware guard ([autoLogin.ts](packages/server/src/middleware/autoLogin.ts)). Guard check every caveman who walk in:

1. Guard look for `userId` cookie in caveman pocket
2. No cookie? Cookie smell wrong? Guard look up caveman by email in flat rock database
3. Guard give new cookie. Cookie last 7 sun cycles. HttpOnly so no steal.
4. Caveman carry cookie everywhere now. Automatic.

When you change `MOCK_USER_EMAIL` and restart brain part, guard sniff cookie, say "this not right caveman", make new cookie for new caveman. Pretty face part no need do anything. Cookie just go. Magic.

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
│   │   ├── db/
│   │   │   ├── dev.db      # SQLite database
│   │   │   └── seed.ts     # Database seeding
│   │   └── package.json
│   └── shared/             # Shared code
│       ├── prisma/
│       │   └── schema.prisma # Prisma schema (single source of truth)
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

The application uses SQLite for simplicity. The database file is located at `packages/server/db/dev.db`. The Prisma schema is in `packages/shared/prisma/schema.prisma`.

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
npm run test:e2e:watch      # Run E2E tests in watch mode
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
