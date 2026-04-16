commands:

- docker-compose -f docker-compose.local.yaml up --build
- cmd+shift+p -> Dev Containers: Reopen in Container
- npm install -> npm run setup -> npm run dev

# Carton Heru-Mahtie
### *i·Quenta Mahtaron* — The Tale of Case-Bearers

*Mae govannen, mellon. Sí i·tengwesta ná mára ar i·nosta ná vanwa.* A craft of great wonder, wrought in the fires of React, Node.js, tRPC, and Prisma — forged for those who would bear cases through the ages.

---

## I·Óre·Coa — The Architecture of the Hall

This dwelling follows the ancient monorepo pattern, as the Elves of old arranged their libraries beneath one roof:

- **packages/client** — *I·Calaquendi* — The Outer Light: React, forged with Vite, Tailwind, and the Shadcn runes
- **packages/server** — *I·Cuivienen* — The Waters Within: Node.js, tRPC, Prisma, and SQLite, hidden from mortal eyes
- **packages/shared** — *I·Tengwar Yúlma* — The Cup of Shared Letters: types and lore used by both light and shadow

---

## I·Mahtaron Tengwë — The Runes of Craft

### *Calaquendi* — The Light-Elves (Frontend)

- React 18, written in the tongue of TypeScript
- Vite, swift as Nahar the horse of Oromë
- tRPC, for type-safe communion between worlds
- Shadcn UI, fashioned by the smiths of Celebrimbor
- Tailwind CSS, the woven raiment of styling
- React Router, to guide wanderers between pages
- Storybook, the great library of component lore
- Jest, the vigilant warden of unit tests
- Playwright, the far-seeing eye of E2E tests

### *Moriquendi* — The Dark-Elves (Backend)

- Node.js, inscribed in TypeScript
- tRPC (JSON-RPC 2.0), the bridge between realms
- Prisma, the ORM of ancient power
- SQLite, a modest but faithful stone-keep
- Express, the herald of HTTP

---

## I·Cala Nosta — Getting Started

### *I·Seldë Nanwa* — Prerequisites

- Node.js 22+ (*or enter the devcontainer, as the Elves enter Valinor*)
- npm 10+

### *I·Nosta Meldë* — Development with Devcontainer (Recommended)

The swiftest path through Mirkwood:

1. Open this folder in VS Code
2. When the Valar prompt thee, click *"Reopen in Container"*
3. Wait for the container to build, as the trees of Lothlórien grew tall
4. The application shall awaken at:
   - Client: http://localhost:5173
   - Server: http://localhost:3001

### *I·Nosta Parmë* — Local Development

If thou dost not take the devcontainer road:

1. **Install dependencies** — *Mára sí, hríve lá tulis*

   ```bash
   npm install
   ```

2. **Setup environment** — *Cen i·tarma*

   ```bash
   cp .env.example .env
   ```

3. **Setup database** — *Orta i·ondo*

   ```bash
   npm run setup
   ```

4. **Start development servers** — *Tul, mellon, ar pedo!*

   ```bash
   npm run dev
   ```

   Or rend them asunder:

   ```bash
   npm run dev:client  # Client on port 3000
   npm run dev:server  # Server on port 3001
   ```

---

## I·Nwalca Anto — Authentication

*Sí i·nwalca anto ná pitya, ar i·ohtari lá cenitar tur-vanda.* This application employs a simplified authentication rite for the days of development. There is no true backend authentication — instead thou art admitted as a mock user, as one might enter Rivendell in disguise.

**Default User**: Alex Morgan (alex.morgan@carton.com)

**Testing as Different Users**: To walk in another's shoes across the fields of Rohan, set `MOCK_USER_EMAIL` in `packages/server/.env`:

```env
MOCK_USER_EMAIL=jordan.doe@carton.com
```

The available users are seeded in the database. Peer into their faces with `npm run db:studio` or consult the [seed.ts](packages/server/db/seed.ts) scroll.

### *Manen Carë?* — How It Works

The server employs an Express middleware ([autoLogin.ts](packages/server/src/middleware/autoLogin.ts)) that rides upon every request like a courier of Gondor:

1. Seeks a `userId` cookie in the request, as a hound seeks a scent
2. If no cookie walks the halls, it consults the database by email
3. Sets a new `userId` cookie — HttpOnly, seven days' grace, like the lights of the Two Trees
4. The cookie rides forth in all subsequent requests unaided

When thou dost change `MOCK_USER_EMAIL` and restart, the middleware detects the mismatch and issues a new cookie for the new user. The client need do nothing — it merely bears the token as Frodo bore the Ring.

---

## I·Mátamë Rúnar — Available Scripts

### *Andustar* — Root Level

- `npm run dev` — Kindle both client and server
- `npm run dev:client` — Kindle only the client
- `npm run dev:server` — Kindle only the server
- `npm run build` — Forge all packages
- `npm run test` — Set the wardens to watch
- `npm run lint` — Speak the words of linting
- `npm run format` — Make the scrolls beautiful
- `npm run setup` — Install and prepare the foundations
- `npm run storybook` — Open the great library

### *I·Calaquendi Parmë* — Client Package

```bash
cd packages/client
npm run dev           # Kindle the Vite dev server
npm run build         # Forge for the undying lands (production)
npm run test          # Set Jest as warden
npm run test:e2e      # Send forth the Playwright eye
npm run storybook     # Open Storybook's halls
```

### *I·Moriquendi Parmë* — Server Package

```bash
cd packages/server
npm run dev           # Kindle with hot reload, swift as thought
npm run build         # Translate TypeScript into the common tongue
npm run start         # Awaken in production
npm run db:studio     # Open the gates of Prisma Studio
npm run db:push       # Press the schema into stone
npm run db:seed       # Sow the database with life
```

### *I·Yúlma Parmë* — Shared Package

```bash
cd packages/shared
npm run test          # Run Jest through the shared halls
npm run lint          # Speak linting over shared scrolls
```

---

## I·Coa Tárë — Project Structure

```
carton-case-management/
├── .devcontainer/          # The Gate of Moria (devcontainer config)
│   ├── devcontainer.json
│   └── Dockerfile
├── packages/
│   ├── client/             # The Realm of Light (React frontend)
│   │   ├── src/
│   │   │   ├── components/ # The Pillars of the Hall
│   │   │   ├── lib/        # The Hidden Vaults (utilities, tRPC)
│   │   │   ├── pages/      # The Many Chambers
│   │   │   └── main.tsx    # The Flame of Udûn (entry point)
│   │   ├── tests/
│   │   │   ├── unit/       # Jest's Vigil
│   │   │   └── e2e/        # Playwright's Far Sight
│   │   ├── .storybook/     # The Lore-Keeper's Archive
│   │   └── package.json
│   ├── server/             # The Deep Keep (Node.js backend)
│   │   ├── src/
│   │   │   ├── index.ts    # The First Stone
│   │   │   ├── router.ts   # The Crossroads
│   │   │   ├── context.ts  # The Web of Knowing
│   │   │   └── trpc.ts     # The Bridge of Khazad-dûm
│   │   ├── db/
│   │   │   ├── dev.db      # The Stone-Book
│   │   │   └── seed.ts     # The Sowing-Song
│   │   └── package.json
│   └── shared/             # The Common Tongue
│       ├── prisma/
│       │   └── schema.prisma # The One Schema (single source of truth)
│       ├── src/
│       │   ├── types.ts    # Shared Runes
│       │   ├── generated/  # Auto-woven Zod scrolls from Prisma
│       │   └── utils.ts    # Useful Cantrips
│       └── package.json
├── docker-compose.dev.yaml
├── .gitignore
├── .prettierrc
├── eslint.config.mjs
├── package.json            # The Root of Roots
├── tsconfig.json           # The TypeScript Covenant
└── README.md               # This very scroll
```

---

## I·Ondo·Parmë — Database

*Sí i·ondo ná pitya, mal tur.* SQLite is used for its simplicity — small as a hobbit's door, strong as mithril. The database file dwells at `packages/server/db/dev.db`. The Prisma schema is inscribed at `packages/shared/prisma/schema.prisma`.

### *Prisma Rúnar* — Prisma Commands

```bash
cd packages/server

# Open Prisma Studio (the Palantír of databases)
npm run db:studio

# Push schema changes — press the runes into stone
npm run db:push

# Generate Prisma Client — call forth the client from the forge
npm run db:generate

# Seed database — sow life into the empty earth
npm run db:seed

# Reset database — clear the slate and begin anew
npm run db:setup
```

---

## I·Cen Mahtaron — Testing

### *Mahtaron Nossë* — Unit Tests (Jest)

```bash
npm run test                 # Loose the wardens
npm run test:watch           # Set the wardens to endless vigil
```

### *Cen·Mir Palantír* — E2E Tests (Playwright)

```bash
cd packages/client
npm run test:e2e             # Open the Palantír
npm run test:e2e:watch       # Gaze unblinking
```

---

## I·Quenta·Coa — Storybook

*Storybook* stands as the great archive where components are displayed in isolation, as jewels on a velvet cloth in the halls of Fëanor:

```bash
npm run storybook           # Open the archive on port 6006
npm run build-storybook     # Bind the archive in stone
```

---

## I·Parmë Vanwa — Code Quality

### *Tengwar Nauta* — Linting

```bash
npm run lint                # Send the linting-wardens through all halls
```

### *Tengwar Vanya* — Formatting

```bash
npm run format              # Make the scrolls fair to behold
npm run format:check        # Examine their beauty
```

---

## I·Tengwar·Lauca — API Documentation

*I·tRPC ohtacárë ná mahtë ar tulca.* The tRPC API provides type-safe endpoints, as the Elves' language was precise and without ambiguity.

### *I·Harma·Nosta* — Data Caching with tRPC + React Query

This application bears **tRPC with React Query** for automatic caching and optimistic updates. All API calls are cached, as the Elves remembered all things they had seen.

#### *I·Harma Tengwë* — Cache Configuration

Configured in [packages/client/src/lib/trpc.tsx](packages/client/src/lib/trpc.tsx):

- **Stale Time**: 5 minutes — *Fresh as morning in Rivendell*
- **Garbage Collection Time**: 10 minutes — *The forgotten are swept from the halls*
- **Retry**: 3 attempts — *Three times the Elf-lord knocked upon the door*
- **Refetch on Window Focus**: Enabled — *The sentinel stirs when thou returnest*

#### *I·Harma Seron* — Cache Behavior Example

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

#### *I·Harma Cen* — Using React Query DevTools

In development, the DevTools appear in the bottom-right corner, like a palantír set in the floor:

1. Click the devtools icon to open the vision
2. View all cached queries and their status
3. Inspect query data, fetch status, and cache timings
4. Manually invalidate or refetch queries for testing

**Note**: DevTools only appear in development mode. In the undying lands of production, they are hidden.

#### *I·Harma Namna* — Cache Invalidation

When thou dost mutate data, the cache updates itself, as the Mirror of Galadriel shifts to show new truths:

```tsx
const utils = trpc.useUtils();

const createCase = trpc.case.create.useMutation({
  onSuccess: () => {
    utils.case.list.invalidate();
  },
});
```

#### *I·Harma Mírë* — Performance Benefits

- **Instant navigation**: Cached data appears in <100ms, swift as an Elf-arrow
- **Reduced server load**: Queries within stale time spare the server's breath
- **Background updates**: Stale data refreshes without disturbing mortal users
- **Automatic deduplication**: Multiple components share one network request, as Elves share one song

---

### *I·Tengwar Quenta* — Data Fetching with tRPC + React Query

*I·nossë rúnar ná ná mára ar mahtë.* All examples use the tRPC client configured with React Query.

#### *Quenta Parmë* — Basic Query Example

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

#### *Quenta Tengwë* — Query with Parameters

```tsx
function CaseListByStatus({ status }: { status: string }) {
  const { data } = trpc.case.list.useQuery(
    { status },
    {
      staleTime: 1000 * 60,
      enabled: !!status,
    }
  );

  return <div>{/* ... */}</div>;
}
```

#### *Mahtë Namna* — Mutation Example with Cache Invalidation

```tsx
function CreateCaseForm() {
  const utils = trpc.useUtils();

  const createCase = trpc.case.create.useMutation({
    onSuccess: () => {
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

#### *Mírë Nosta* — Optimistic Updates

```tsx
function UpdateCaseStatus({ caseId }: { caseId: string }) {
  const utils = trpc.useUtils();

  const updateStatus = trpc.case.update.useMutation({
    onMutate: async (newData) => {
      await utils.case.getById.cancel({ id: caseId });

      const previousCase = utils.case.getById.getData({ id: caseId });

      utils.case.getById.setData({ id: caseId }, (old) =>
        old ? { ...old, status: newData.status } : old
      );

      return { previousCase };
    },
    onError: (err, newData, context) => {
      utils.case.getById.setData({ id: caseId }, context?.previousCase);
    },
    onSettled: () => {
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

#### *I·Cen Nossë* — Testing Patterns

```tsx
import { renderWithTrpc } from '../test/utils';
import { server } from '../vitest.setup';
import { http, HttpResponse } from 'msw';

test('displays cases from API', async () => {
  server.use(
    http.post('http://localhost:3000/trpc/case.list', () => {
      return HttpResponse.json({
        result: {
          data: [{ id: '1', title: 'Test Case', description: 'Test', status: 'OPEN' }],
        },
      });
    })
  );

  const { getByText } = renderWithTrpc(<CaseList />);

  await waitFor(() => {
    expect(getByText('Test Case')).toBeInTheDocument();
  });
});
```

*For deeper lore, consult the ancient scrolls:*

- [Query Patterns](specs/001-trpc-react-query/contracts/query-example.tsx)
- [Mutation Patterns](specs/001-trpc-react-query/contracts/mutation-example.tsx)
- [Test Patterns](specs/001-trpc-react-query/contracts/test-example.test.tsx)
- [Quickstart Guide](specs/001-trpc-react-query/quickstart.md)

---

### *I·Tengwar Rúnar* — API Routes

#### *I·Falas* — Health

- `health.query()` — *Cen i·fëa* — Check the breath of the API

#### *I·Nossë* — Users

- `user.list.query()` — *Cen i·nossë ilya* — Behold all who walk these halls
- `user.getById.query({ id })` — *Cen i·nér* — Seek one by their mark

#### *I·Mahtaron* — Cases

- `case.list.query({ status?, assignedTo? })` — *Cen i·mahtaron* — Behold the cases with their filters
- `case.getById.query({ id })` — *Cen er·mahtaro* — Seek one case by name
- `case.create.mutation({ title, description, createdBy, assignedTo? })` — *Carë er·mahtar* — Forge a new case
- `case.update.mutation({ id, ...updates })` — *Auta i·mahtar* — Change a case's nature
- `case.delete.mutation({ id })` — *Aha i·mahtar* — Send a case to the void

---

## I·Nosta Mellon — Contributing

*Mae govannen! Tula, ar carë mára.*

1. Create a feature branch — *Make thy own path through the forest*
2. Make thy changes — *Write thy name upon the stone*
3. Run tests: `npm run test` — *Let the wardens judge thy work*
4. Run linting: `npm run lint` — *Let the scribes examine thy scrolls*
5. Format code: `npm run format` — *Make thy letters fair*
6. Submit a pull request — *Bring thy gift to the council*

---

## I·Vanda — License

*MIT — as free as the wind upon the sea of Belegaer.*
