commands:

- docker-compose -f docker-compose.local.yaml up --build
- cmd+shift+p -> Dev Containers: Reopen in Container
- npm install -> npm run setup -> npm run dev

# Carton Case... Management

Hello. This is app. Case management app. I build it. It work. React. Node. tRPC. Prisma. Good stuff. Yes.

## The... Structure. How it go together.

Monorepo. npm workspaces. Three pieces. Here:

- **packages/client** - The front. React. You see it. Vite. Tailwind. Shadcn. Pretty.
- **packages/server** - The back. Node. You don't see. tRPC. Prisma. SQLite. It think.
- **packages/shared** - The middle. Types. Utilities. Both sides use. Important.

## Tech Stack. The tools.

### Front part

- React 18. TypeScript. Good.
- Vite. Build fast. Very fast.
- tRPC. Types safe. No mistake.
- Shadcn. Components. Nice look.
- Tailwind. Style. Easy.
- React Router. Go places.
- Storybook. Look at components alone.
- Jest. Test units.
- Playwright. Test... everything. End to end.

### Back part

- Node.js. TypeScript also.
- tRPC. JSON-RPC 2.0. Endpoints.
- Prisma. ORM. Talk to database.
- SQLite. Database. Simple. Good.
- Express. HTTP. Server.

## Start. How to start.

### Need first

- Node.js 22 or more. Or... devcontainer. Devcontainer easier.
- npm 10 or more.

### Devcontainer way. I like this way. Recommended.

Easy way. Use devcontainer:

1. Open folder. VS Code.
2. It ask. Click "Reopen in Container." Yes.
3. Wait. Build. Install. Take moment.
4. App start by itself. Magic almost.
   - Client: http://localhost:5173
   - Server: http://localhost:3001

### Local way. No container.

If no devcontainer:

1. **Install the things**

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

4. **Start servers. Both servers.**

   ```bash
   npm run dev
   ```

   Or separate. One by one:

   ```bash
   npm run dev:client  # Client. Port 3000.
   npm run dev:server  # Server. Port 3001.
   ```

## Login. Auth stuff.

Simple. No real auth. Development only. Log in automatic. Mock user. You are Alex Morgan. Hello Alex.

**Default User**: Alex Morgan (alex.morgan@carton.com)

**Different user**: Want be someone else? Change variable. `MOCK_USER_EMAIL`. In `packages/server/.env`:

```env
MOCK_USER_EMAIL=jordan.doe@carton.com
```

Users in database. Seeded. See them: `npm run db:studio`. Or look [seed.ts](packages/server/db/seed.ts). All there.

### How cookie work

Middleware. Express. [autoLogin.ts](packages/server/src/middleware/autoLogin.ts). Every request it run:

1. Check cookie. `userId` cookie. You have?
2. No cookie? Or wrong email? Look up user. Database.
3. Set new cookie. HttpOnly. Seven days.
4. Cookie go in requests. Automatic. You do nothing.

Change email. Restart server. Middleware notice. New cookie. New user. Easy.

## Scripts. Commands. Run things.

### Root level

- `npm run dev` - Both servers. Client and server. Together.
- `npm run dev:client` - Just client.
- `npm run dev:server` - Just server.
- `npm run build` - Build everything.
- `npm run test` - Test everything.
- `npm run lint` - Lint. Check code.
- `npm run format` - Format. Make pretty.
- `npm run setup` - Install and setup database. First time use this.
- `npm run storybook` - Storybook. Look at components.

### Client package

```bash
cd packages/client
npm run dev           # Dev server. Vite.
npm run build         # Build. Production.
npm run test          # Jest tests.
npm run test:e2e      # Playwright tests. Big tests.
npm run storybook     # Storybook. Components.
```

### Server package

```bash
cd packages/server
npm run dev           # Dev server. Hot reload. Nice.
npm run build         # Build TypeScript.
npm run start         # Start. Production.
npm run db:studio     # Prisma Studio. See database. GUI.
npm run db:push       # Push schema. Database change.
npm run db:seed       # Seed. Put demo data in.
```

### Shared package

```bash
cd packages/shared
npm run test          # Tests.
npm run lint          # Lint.
```

## Project. How it look inside.

```
carton-case-management/
├── .devcontainer/          # Devcontainer config
│   ├── devcontainer.json
│   └── Dockerfile
├── packages/
│   ├── client/             # React. Front.
│   │   ├── src/
│   │   │   ├── components/ # Components. React.
│   │   │   ├── lib/        # Utilities. tRPC setup.
│   │   │   ├── pages/      # Pages. You visit.
│   │   │   └── main.tsx    # Start here.
│   │   ├── tests/          # Tests live here.
│   │   │   ├── unit/       # Jest. Small tests.
│   │   │   └── e2e/        # Playwright. Big tests.
│   │   ├── .storybook/     # Storybook config.
│   │   └── package.json
│   ├── server/             # Node.js. Back.
│   │   ├── src/
│   │   │   ├── index.ts    # Start here. Server.
│   │   │   ├── router.ts   # tRPC router.
│   │   │   ├── context.ts  # tRPC context.
│   │   │   └── trpc.ts     # tRPC setup.
│   │   ├── db/
│   │   │   ├── dev.db      # SQLite. The database file.
│   │   │   └── seed.ts     # Put data in database.
│   │   └── package.json
│   └── shared/             # Shared. Both use.
│       ├── prisma/
│       │   └── schema.prisma # Schema. Very important. Truth lives here.
│       ├── src/
│       │   ├── types.ts    # Types. Shared.
│       │   ├── generated/  # Auto made. Zod schemas. Prisma make them.
│       │   └── utils.ts    # Utilities. Shared.
│       └── package.json
├── docker-compose.dev.yaml
├── .gitignore
├── .prettierrc
├── eslint.config.mjs
├── package.json            # Root. Start here.
├── tsconfig.json           # TypeScript config.
└── README.md
```

## Database

SQLite. Simple. Good enough. File is `packages/server/db/dev.db`. Schema is `packages/shared/prisma/schema.prisma`. Prisma. Important file.

### Prisma. Commands for database.

```bash
cd packages/server

# Open Prisma Studio. See database. GUI. Click around.
npm run db:studio

# Push schema. Changes go to database.
npm run db:push

# Generate client. Prisma make code.
npm run db:generate

# Seed. Demo data. Put in.
npm run db:seed

# Reset. Clear everything. Seed again. Fresh start.
npm run db:setup
```

## Testing. Very important.

### Unit Tests. Jest.

```bash
npm run test                 # All tests. Run.
npm run test:watch          # Watch mode. Keep running. I watch too.
```

### E2E Tests. Playwright. Big ones.

```bash
cd packages/client
npm run test:e2e            # E2E tests. Run.
npm run test:e2e:watch      # Watch mode.
```

## Storybook. Components alone.

Look at components. Isolated. No full app needed:

```bash
npm run storybook           # Start. Port 6006.
npm run build-storybook     # Build static. No server needed then.
```

## Code Quality. Keep clean.

### Lint

```bash
npm run lint                # Lint all. Fix problems.
```

### Format

```bash
npm run format              # Format. Prettier. Make nice.
npm run format:check        # Just check. Don't change.
```

## API. The endpoints. tRPC.

Type-safe. That mean no mistake. Good.

### Cache. tRPC + React Query. Data cache.

App use **tRPC with React Query**. Cache automatic. No repeat requests. Faster. Better.

#### Cache settings

Settings in [packages/client/src/lib/trpc.tsx](packages/client/src/lib/trpc.tsx):

- **Stale Time**: 5 minutes. Fresh for 5 minutes. No refetch.
- **Garbage Collection Time**: 10 minutes. Old unused data go away.
- **Retry**: 3 times. Fail? Try again. Three times.
- **Refetch on window focus**: Yes. Come back to tab? Refetch. Background. Quiet.

#### Cache example. How it work.

```tsx
// First time: Fetch from API. Loading state show.
const { data, isLoading } = trpc.case.list.useQuery();
// Come back within 5 minutes:
// - Cache data. Instant. No loading.
// - Show in less than 100ms. Fast.

// After 5 minutes:
// - Still show cache. But stale.
// - Refetch background. You don't notice.
```

#### React Query DevTools. Debug tool.

Development mode only. Bottom right corner. Little icon:

1. Click icon. Open.
2. See all queries. Status.
3. Inspect data. Fetch status. Cache times.
4. Manual invalidate. Refetch. For testing.

**Note**: Only development. `npm run dev`. Not production. Not there in production.

#### Cache invalidation. After change.

Mutate data? Cache update automatic:

```tsx
const utils = trpc.useUtils();

// Create case. Then invalidate list. Refetch.
const createCase = trpc.case.create.useMutation({
  onSuccess: () => {
    // Case list refetch now.
    utils.case.list.invalidate();
  },
});
```

#### Why cache good. Benefits.

- **Fast navigation**: Less than 100ms. Cached data. Come back to page. Instant.
- **Less server work**: 5 minutes stale time. No server hit.
- **Background update**: Stale data update behind. You don't see loading. Nice.
- **No duplicate requests**: Many components. Same query. One request only. Smart.

---

### Data Fetching. How to fetch. Examples.

All use tRPC client. React Query underneath. Cache automatic.

#### Basic query. Simple.

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

#### Query with parameters. Filter.

```tsx
function CaseListByStatus({ status }: { status: string }) {
  const { data } = trpc.case.list.useQuery(
    { status },
    {
      // Custom options this query only
      staleTime: 1000 * 60, // Fresh 1 minute
      enabled: !!status, // Only run if status exist
    }
  );

  return <div>{/* ... */}</div>;
}
```

#### Mutation. With cache invalidation.

```tsx
function CreateCaseForm() {
  const utils = trpc.useUtils();

  const createCase = trpc.case.create.useMutation({
    onSuccess: () => {
      // Case list. Refetch. Show new case.
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

#### Optimistic updates. Show before server confirm.

```tsx
function UpdateCaseStatus({ caseId }: { caseId: string }) {
  const utils = trpc.useUtils();

  const updateStatus = trpc.case.update.useMutation({
    onMutate: async (newData) => {
      // Cancel outgoing. Stop refetch.
      await utils.case.getById.cancel({ id: caseId });

      // Snapshot old value. Keep it safe.
      const previousCase = utils.case.getById.getData({ id: caseId });

      // Update now. Optimistic. Before server say ok.
      utils.case.getById.setData({ id: caseId }, (old) =>
        old ? { ...old, status: newData.status } : old
      );

      return { previousCase };
    },
    onError: (err, newData, context) => {
      // Error. Rollback. Put old value back.
      utils.case.getById.setData({ id: caseId }, context?.previousCase);
    },
    onSettled: () => {
      // Always refetch. Error or success. Always.
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

#### Testing patterns. How to test tRPC components.

Use test utilities. From `src/test/utils.ts`:

```tsx
import { renderWithTrpc } from '../test/utils';
import { server } from '../vitest.setup';
import { http, HttpResponse } from 'msw';

test('displays cases from API', async () => {
  // Mock API. Fake response.
  server.use(
    http.post('http://localhost:3000/trpc/case.list', () => {
      return HttpResponse.json({
        result: {
          data: [{ id: '1', title: 'Test Case', description: 'Test', status: 'OPEN' }],
        },
      });
    })
  );

  // Render. With tRPC provider.
  const { getByText } = renderWithTrpc(<CaseList />);

  // Wait. Then check.
  await waitFor(() => {
    expect(getByText('Test Case')).toBeInTheDocument();
  });
});
```

More examples here:

- [Query Patterns](specs/001-trpc-react-query/contracts/query-example.tsx)
- [Mutation Patterns](specs/001-trpc-react-query/contracts/mutation-example.tsx)
- [Test Patterns](specs/001-trpc-react-query/contracts/test-example.test.tsx)
- [Quickstart Guide](specs/001-trpc-react-query/quickstart.md)

### Health. Is server alive?

- `health.query()` - Check. Yes alive. Good.

### Users. People.

- `user.list.query()` - All users. Get them.
- `user.getById.query({ id })` - One user. By ID.

### Cases. The main thing.

- `case.list.query({ status?, assignedTo? })` - Get cases. Filter if want.
- `case.getById.query({ id })` - One case. By ID.
- `case.create.mutation({ title, description, createdBy, assignedTo? })` - Make case. New one.
- `case.update.mutation({ id, ...updates })` - Change case.
- `case.delete.mutation({ id })` - Delete case. Gone.

## Contributing. Help welcome.

1. Make branch. Feature branch.
2. Change things.
3. Test: `npm run test`
4. Lint: `npm run lint`
5. Format: `npm run format`
6. Pull request. Submit. We look.

## License

MIT
