commands:

- docker-compose -f docker-compose.local.yaml up --build
- cmd+shift+p -> Dev Containers: Reopen in Container
- npm install -> npm run setup -> npm run dev

<!-- TODO: udpdate this readme, project has some changes since initial copilot spinup -->

# Carton Case Management

Whoa, dude! Like, this is a totally rad Case Management app, man! Built with some real boss tech like React, Node.js, tRPC, and Prisma. It's a real gas, daddy-o!

## The Gnarly Setup

So like, this groovy app is all monorepo-style, man. We're ridin' the npm workspaces wave, and it's totally righteous:

- **packages/client** - That's the frontend, dude! React with Vite, Tailwind CSS, and these boss Shadcn UI components
- **packages/server** - The backend scene, man! Got your Node.js, tRPC, Prisma, and SQLite all cruisin' together
- **packages/shared** - The cool cats that hang with both sides, you dig? Types and utilities, baby!

## The Bitchin' Tech Stack

### Frontend Gear

- React 18, man! With TypeScript for keepin' it solid
- Vite for buildin' stuff real quick-like
- tRPC for those type-safe API calls, daddy-o
- Shadcn UI components that are totally boss
- Tailwind CSS for stylin' things all smooth
- React Router for cruisin' between pages
- Storybook for cookin' up components
- Jest for testin' the small stuff
- Playwright for those far-out end-to-end tests

### Backend Scene

- Node.js with TypeScript, real neat-o
- tRPC (JSON-RPC 2.0) for them API endpoints, dude
- Prisma as the ORM cat
- SQLite for storin' all the data
- Express for servin' up that HTTP, man

## Catchin' Your First Wave

### What You Need, Daddy-o

- Node.js 22 or higher (or just cruise with the devcontainer, man)
- npm 10 or higher

### Devcontainer Style (Real Boss Move)

Like, the easiest way to get stoked is with the devcontainer, dude:

1. Pop this folder open in VS Code
2. When it asks ya, click "Reopen in Container"
3. Hang loose while the container builds and gets all the dependencies, man
4. The app fires up automatically at:
   - Client: http://localhost:5173
   - Server: http://localhost:3001

### Local Development (If You Wanna Go Solo)

If you're not diggin' the devcontainer scene:

1. **Get your dependencies, man**

   ```bash
   npm install
   ```

2. **Set up your pad**

   ```bash
   cp .env.example .env
   ```

3. **Get that database groovin'**

   ```bash
   npm run setup
   ```

4. **Fire up the servers**

   ```bash
   npm run dev
   ```

   Or run 'em separate-like if you're into that scene:

   ```bash
   npm run dev:client  # Client ridin' on port 3000
   npm run dev:server  # Server cruisin' on port 3001
   ```

## The Authentication Scene

So like, this app's got a super chill authentication setup for development, man. There's no heavy backend auth trip - it just logs you in automatically as a mock user. Real smooth, dude!

**Default Cat**: Alex Morgan (alex.morgan@carton.com)

**Testin' as Different Cats**: Wanna surf as a different user, daddy-o? Just set the `MOCK_USER_EMAIL` environment variable in `packages/server/.env`:

```env
MOCK_USER_EMAIL=jordan.doe@carton.com
```

All the groovy users are seeded in the database, man. Check 'em out by runnin' `npm run db:studio` in the server package or peekin' at the [seed.ts](packages/server/db/seed.ts) file.

### How This Gnarly Thing Works

The server's got this boss Express middleware ([autoLogin.ts](packages/server/src/middleware/autoLogin.ts)) that runs on every request, dig it:

1. Checks for a `userId` cookie in the request
2. If there ain't no cookie or the email don't match `MOCK_USER_EMAIL`, it looks up the user by email in the database
3. Drops a new `userId` cookie (HttpOnly, hangs around for 7 days)
4. The cookie automatically rides along on the next requests

When you change `MOCK_USER_EMAIL` and restart the server, the middleware catches the switch and dishes out a new cookie for the new user on the next request. The client? Man, it don't gotta do nothin' - just sends the cookie automatically. Real smooth sailin'!

## Righteous Scripts You Can Run

### From the Top, Man

- `npm run dev` - Fire up both client and server in dev mode
- `npm run dev:client` - Just the client, dude
- `npm run dev:server` - Just the server, daddy-o
- `npm run build` - Build all the packages
- `npm run test` - Run tests in all packages
- `npm run lint` - Lint all the code
- `npm run format` - Format code with Prettier, real neat-like
- `npm run setup` - Get dependencies and setup database
- `npm run storybook` - Fire up Storybook

### Client Package Scene

```bash
cd packages/client
npm run dev           # Start Vite dev server, man
npm run build         # Build for production
npm run test          # Run Jest tests
npm run test:e2e      # Run Playwright tests
npm run storybook     # Start Storybook
```

### Server Package Groove

```bash
cd packages/server
npm run dev           # Start dev server with hot reload, dude
npm run build         # Build TypeScript
npm run start         # Start production server
npm run db:studio     # Open Prisma Studio
npm run db:push       # Push schema changes to database
npm run db:seed       # Seed database with demo data
```

### Shared Package Vibes

```bash
cd packages/shared
npm run test          # Run Jest tests
npm run lint          # Lint code
```

## How This Groovy Thing Is Laid Out

```
carton-case-management/
├── .devcontainer/          # Devcontainer setup, dude
│   ├── devcontainer.json
│   └── Dockerfile
├── packages/
│   ├── client/             # The React frontend scene
│   │   ├── src/
│   │   │   ├── components/ # React components, man
│   │   │   ├── lib/        # Utilities and tRPC setup
│   │   │   ├── pages/      # Page components
│   │   │   └── main.tsx    # Where it all kicks off
│   │   ├── tests/          # Tests
│   │   │   ├── unit/       # Jest unit tests
│   │   │   └── e2e/        # Playwright E2E tests
│   │   ├── .storybook/     # Storybook config
│   │   └── package.json
│   ├── server/             # The Node.js backend pad
│   │   ├── src/
│   │   │   ├── index.ts    # Server entry point
│   │   │   ├── router.ts   # tRPC router
│   │   │   ├── context.ts  # tRPC context
│   │   │   └── trpc.ts     # tRPC setup
│   │   ├── db/
│   │   │   ├── dev.db      # SQLite database
│   │   │   └── seed.ts     # Database seeding
│   │   └── package.json
│   └── shared/             # Shared code, baby
│       ├── prisma/
│       │   └── schema.prisma # Prisma schema (the boss)
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

## The Database Scene

Like, this app uses SQLite to keep things real simple, man. The database file is hangin' out at `packages/server/db/dev.db`. The Prisma schema is chillin' in `packages/shared/prisma/schema.prisma`.

### Prisma Commands (Real Boss Moves)

```bash
cd packages/server

# Open Prisma Studio (a far-out GUI for the database)
npm run db:studio

# Push schema changes to the database, dude
npm run db:push

# Generate Prisma Client
npm run db:generate

# Seed database with demo data
npm run db:seed

# Reset database (wipe it clean + seed)
npm run db:setup
```

## Testing the Waters

### Unit Tests (Jest Style)

```bash
npm run test                 # Run all tests, daddy-o
npm run test:watch          # Run tests in watch mode
```

### E2E Tests (Playwright Vibes)

```bash
cd packages/client
npm run test:e2e            # Run E2E tests
npm run test:e2e:watch      # Run E2E tests in watch mode
```

## Storybook Scene

Storybook's all set up for cookin' up and testin' UI components all by themselves, man:

```bash
npm run storybook           # Fire up Storybook on port 6006
npm run build-storybook     # Build static Storybook
```

## Keepin' It Clean

### Linting, Dude

```bash
npm run lint                # Lint all the packages
```

### Formatting, Man

```bash
npm run format              # Format all the code
npm run format:check        # Check that formatting
```

## The API Lowdown

The tRPC API's got all these type-safe endpoints, man. Here's the groovy routes you dig:

### Data Caching with tRPC + React Query (Real Far Out Stuff)

So like, this app uses **tRPC with React Query** for automatic caching and optimistic updates, daddy-o. All API calls through tRPC get cached automatically, which cuts down on network requests and makes things super smooth. Real boss performance, man!

#### Cache Setup

The default cache vibes (configured in [packages/client/src/lib/trpc.tsx](packages/client/src/lib/trpc.tsx)):

- **Stale Time**: 5 minutes - Data stays fresh for 5 minutes after fetching, dude
- **Garbage Collection Time**: 10 minutes - Unused data gets tossed after 10 minutes
- **Retry**: 3 attempts - Failed requests retry up to 3 times before showin' an error
- **Refetch on Window Focus**: Enabled - Data refetches in the background when you cruise back to the tab

#### How the Cache Rides

```tsx
// First render: Fetches from API (shows loading state)
const { data, isLoading } = trpc.case.list.useQuery();

// Navigate away and come back within 5 minutes:
// - Returns cached data instantly (no loading state)
// - Shows data in less than 100ms

// After 5 minutes:
// - Returns cached data instantly (stale data)
// - Refetches in background to get fresh data
```

#### Using React Query DevTools

In dev mode, React Query DevTools pop up in the bottom-right corner, man:

1. Click on the devtools icon to open it up
2. Check out all cached queries and their status
3. Inspect query data, fetch status, and cache timings
4. Manually invalidate or refetch queries for testin'

**Note**: DevTools only show up in dev mode (`npm run dev`), not in production builds, daddy-o.

#### Bustin' the Cache

When you mutate data (create, update, delete), the cache updates automatically, dude:

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

#### Performance Perks (Real Bitchin')

- **Instant navigation**: Cached data shows up in less than 100ms when cruisin' back to a page
- **Reduced server load**: Queries within stale time (5 min) don't hit the server
- **Background updates**: Stale data updates transparently without loading states
- **Automatic deduplication**: Multiple components using the same query share one network request

---

### Fetchin' Data with tRPC + React Query

All these groovy examples use the tRPC client configured with React Query for automatic caching and state management, man.

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

#### Query with Parameters (Real Neat)

```tsx
function CaseListByStatus({ status }: { status: string }) {
  const { data } = trpc.case.list.useQuery(
    { status },
    {
      // Custom options for this query, dude
      staleTime: 1000 * 60, // Fresh for 1 minute
      enabled: !!status, // Only run if status is provided
    }
  );

  return <div>{/* ... */}</div>;
}
```

#### Mutation with Cache Invalidation

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

#### Optimistic Updates (Super Smooth, Dude)

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

#### Testing Patterns (Real Boss)

When testin' components that use tRPC queries, use the test utilities from `src/test/utils.ts`:

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

For more groovy examples, check out:

- [Query Patterns](specs/001-trpc-react-query/contracts/query-example.tsx)
- [Mutation Patterns](specs/001-trpc-react-query/contracts/mutation-example.tsx)
- [Test Patterns](specs/001-trpc-react-query/contracts/test-example.test.tsx)
- [Quickstart Guide](specs/001-trpc-react-query/quickstart.md)

### Health

- `health.query()` - Check if the API's groovin'

### Users

- `user.list.query()` - Get all the users
- `user.getById.query({ id })` - Get a user by ID

### Cases

- `case.list.query({ status?, assignedTo? })` - Get cases with filters
- `case.getById.query({ id })` - Get a case by ID
- `case.create.mutation({ title, description, createdBy, assignedTo? })` - Create a case
- `case.update.mutation({ id, ...updates })` - Update a case
- `case.delete.mutation({ id })` - Delete a case

## Hangin' Ten with Us (Contributing)

1. Create a branch for your feature, daddy-o
2. Make your changes
3. Run the tests: `npm run test`
4. Run the linting: `npm run lint`
5. Format the code: `npm run format`
6. Drop us a pull request, man

## License

MIT
