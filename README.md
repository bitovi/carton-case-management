hello

UGH. COMMANDS FIRST. ME SHOW:

- docker-compose -f docker-compose.local.yaml up --build
- cmd+shift+p -> Dev Containers: Reopen in Container
- npm install -> npm run setup -> npm run dev

# CARTON CASE MANAGE THING

UGH. ME BUILD BIG APP. APP FOR MANAGE CASE. USE REACT. USE NODE. USE tRPC. USE PRISMA. APP GOOD. APP STRONG LIKE MAMMOTH.

## HOW APP MADE (ARCH-I-TECK-TURE)

APP LIVE IN ONE BIG CAVE. CAVE CALLED MONOREPO. CAVE HAVE THREE ROOMS:

- **packages/client** - PRETTY FRONT CAVE. HUMAN SEE THIS. REACT LIVE HERE WITH VITE AND TAILWIND AND SHADCN
- **packages/server** - DARK BACK CAVE. BRAIN LIVE HERE. NODE DO WORK WITH tRPC AND PRISMA AND SQLITE
- **packages/shared** - MIDDLE CAVE. BOTH CAVE SHARE STUFF HERE. TYPES. UTILS. IMPORTANT ROCKS.

## TOOLS ME USE (TECH STACK)

### FRONT CAVE TOOLS

- React 18 WITH TYPESCRIPT. REACT GOOD.
- Vite. BUILD FAST. VITE MEAN FAST IN FRENCH TONGUE.
- tRPC. TYPE SAFE. NO MISTAKE. UGH.
- Shadcn UI. PRETTY ROCKS FOR SCREEN.
- Tailwind CSS. MAKE THING LOOK NICE WITHOUT CRY.
- React Router. GO FROM CAVE TO CAVE.
- Storybook. SHOW COMPONENT. LIKE CAVE PAINTING.
- Jest. TEST IF THING WORK. IMPORTANT.
- Playwright. TEST WHOLE APP. VERY IMPORTANT.

### BACK CAVE TOOLS

- Node.js WITH TYPESCRIPT. DO WORK.
- tRPC (JSON-RPC 2.0). TALK BETWEEN CAVES.
- Prisma. TALK TO ROCK (DATABASE).
- SQLite. SMALL ROCK. HOLD DATA.
- Express. HTTP CAVE DOOR.

## HOW START APP

### NEED FIRST

- Node.js 22+ (OR USE DEVCONTAINER. DEVCONTAINER EASIER. UGH.)
- npm 10+

### START WITH DEVCONTAINER (BEST WAY. ME RECOMMEND.)

DEVCONTAINER EASIEST. EVEN SMALL BRAIN CAN DO:

1. OPEN FOLDER IN VS CODE
2. VS CODE ASK "REOPEN IN CONTAINER?" - CLICK YES. OBVIOUSLY.
3. WAIT. CONTAINER BUILD. DEPENDENCY INSTALL. UGH. PATIENCE.
4. APP START BY SELF:
   - Client: http://localhost:5173
   - Server: http://localhost:3001

### START WITHOUT DEVCONTAINER (HARD WAY)

IF NOT USE DEVCONTAINER, DO THIS:

1. **PUT IN DEPENDENCY**

   ```bash
   npm install
   ```

2. **PREPARE ENVIRONMENT**

   ```bash
   cp .env.example .env
   ```

3. **PREPARE ROCK (DATABASE)**

   ```bash
   npm run setup
   ```

4. **START APP GO NOW**

   ```bash
   npm run dev
   ```

   OR START SEPARATELY LIKE TWO DIFFERENT MAMMOTH:

   ```bash
   npm run dev:client  # FRONT CAVE ON PORT 3000
   npm run dev:server  # BACK CAVE ON PORT 3001
   ```

## WHO YOU ARE (AUTHENTICATION)

APP USE SIMPLE LOGIN THING FOR DEVELOPMENT. NO REAL LOGIN. APP PRETEND YOU ARE MOCK USER. EASY.

**DEFAULT HUMAN**: Alex Morgan (alex.morgan@carton.com). ALEX GOOD HUMAN.

**WANT BE DIFFERENT HUMAN?**: SET `MOCK_USER_EMAIL` IN `packages/server/.env`:

```env
MOCK_USER_EMAIL=jordan.doe@carton.com
```

SEE ALL HUMAN BY RUN `npm run db:studio` OR LOOK AT [seed.ts](packages/server/db/seed.ts) FILE.

### HOW MAGIC WORK

SERVER USE MIDDLEWARE ([autoLogin.ts](packages/server/src/middleware/autoLogin.ts)). MIDDLEWARE RUN ON EVERY REQUEST. UGH:

1. LOOK FOR `userId` COOKIE IN REQUEST
2. IF NO COOKIE OR COOKIE NOT MATCH `MOCK_USER_EMAIL`, FIND HUMAN IN ROCK (DATABASE)
3. PUT NEW `userId` COOKIE (HTTPONLY, LAST 7 DAYS)
4. COOKIE GO WITH ALL FUTURE REQUESTS. AUTOMATIC. NO THINK NEEDED.

CHANGE `MOCK_USER_EMAIL` AND RESTART SERVER. MIDDLEWARE NOTICE. GIVE NEW COOKIE NEXT REQUEST. CLIENT DO NOTHING. CLIENT LAZY. COOKIE DO WORK.

## COMMANDS ME CAN USE

### BIG ROOT CAVE COMMANDS

- `npm run dev` - START BOTH CAVES AT SAME TIME
- `npm run dev:client` - START ONLY FRONT CAVE
- `npm run dev:server` - START ONLY BACK CAVE
- `npm run build` - BUILD ALL PACKAGE
- `npm run test` - TEST ALL PACKAGE
- `npm run lint` - CHECK CODE. LINT FIND BAD SMELL.
- `npm run format` - MAKE CODE PRETTY WITH PRETTIER
- `npm run setup` - INSTALL DEPENDENCY AND SETUP ROCK
- `npm run storybook` - START STORYBOOK CAVE PAINTING

### FRONT CAVE COMMANDS

```bash
cd packages/client
npm run dev           # START VITE DEV SERVER
npm run build         # BUILD FOR PRODUCTION. SERIOUS BUSINESS.
npm run test          # RUN JEST TEST
npm run test:e2e      # RUN PLAYWRIGHT TEST
npm run storybook     # START STORYBOOK
```

### BACK CAVE COMMANDS

```bash
cd packages/server
npm run dev           # START DEV SERVER WITH HOT RELOAD. HOT GOOD.
npm run build         # BUILD TYPESCRIPT
npm run start         # START PRODUCTION SERVER
npm run db:studio     # OPEN PRISMA STUDIO. SEE ROCK DATA.
npm run db:push       # PUSH SCHEMA CHANGE TO ROCK
npm run db:seed       # PLANT SEED DATA IN ROCK
```

### MIDDLE CAVE COMMANDS

```bash
cd packages/shared
npm run test          # RUN JEST TEST
npm run lint          # LINT CODE
```

## WHERE THING LIVE (PROJECT STRUCTURE)

```
carton-case-management/
├── .devcontainer/          # CONTAINER CAVE CONFIG
│   ├── devcontainer.json
│   └── Dockerfile
├── packages/
│   ├── client/             # FRONT CAVE (REACT)
│   │   ├── src/
│   │   │   ├── components/ # REACT COMPONENT
│   │   │   ├── lib/        # UTIL AND tRPC SETUP
│   │   │   ├── pages/      # PAGE COMPONENT
│   │   │   └── main.tsx    # START HERE
│   │   ├── tests/          # TEST LIVE HERE
│   │   │   ├── unit/       # JEST UNIT TEST
│   │   │   └── e2e/        # PLAYWRIGHT BIG TEST
│   │   ├── .storybook/     # STORYBOOK CONFIG
│   │   └── package.json
│   ├── server/             # BACK CAVE (NODE)
│   │   ├── src/
│   │   │   ├── index.ts    # SERVER START HERE
│   │   │   ├── router.ts   # tRPC ROUTER
│   │   │   ├── context.ts  # tRPC CONTEXT
│   │   │   └── trpc.ts     # tRPC SETUP
│   │   ├── db/
│   │   │   ├── dev.db      # SQLITE ROCK
│   │   │   └── seed.ts     # PLANT DATA IN ROCK
│   │   └── package.json
│   └── shared/             # MIDDLE CAVE (SHARED STUFF)
│       ├── prisma/
│       │   └── schema.prisma # PRISMA SCHEMA. IMPORTANT ROCK MAP.
│       ├── src/
│       │   ├── types.ts    # SHARED TYPE
│       │   ├── generated/  # AUTO-MADE ZOD SCHEMA FROM PRISMA
│       │   └── utils.ts    # SHARED UTIL
│       └── package.json
├── docker-compose.dev.yaml
├── .gitignore
├── .prettierrc
├── eslint.config.mjs
├── package.json            # ROOT PACKAGE
├── tsconfig.json           # TYPESCRIPT CONFIG
└── README.md
```

## THE ROCK (DATABASE)

APP USE SQLITE. SQLITE SMALL ROCK. SIMPLE. GOOD FOR DEVELOPMENT. ROCK LIVE AT `packages/server/db/dev.db`. ROCK MAP LIVE AT `packages/shared/prisma/schema.prisma`.

### ROCK COMMANDS (PRISMA)

```bash
cd packages/server

# OPEN PRISMA STUDIO. SEE WHAT INSIDE ROCK.
npm run db:studio

# PUSH SCHEMA CHANGE TO ROCK
npm run db:push

# MAKE PRISMA CLIENT
npm run db:generate

# PLANT SEED DATA IN ROCK
npm run db:seed

# RESET ROCK. CLEAR AND RESEED. CAREFUL.
npm run db:setup
```

## TESTING (MAKE SURE APP NOT BREAK)

### SMALL TEST (JEST)

```bash
npm run test                 # RUN ALL TEST
npm run test:watch          # WATCH AND RUN TEST
```

### BIG TEST (PLAYWRIGHT)

```bash
cd packages/client
npm run test:e2e            # RUN E2E TEST
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
