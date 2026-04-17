# The Chronicles of Carton: A Wizard's Guide for the Unwary Developer

*"A hobbit may easily spend all morning deciding on the proper teatime, but when adventure calls, one must know how to wield the ancient commands!"* - Gandalf the Grey

## The Incantations of Power

My dear hobbit, before you begin your quest, you must first speak these words of power:

```bash
docker-compose -f docker-compose.local.yaml up --build
```

Or, if you prefer the devcontainer path (as any sensible hobbit would):
- Press `cmd+shift+p` (or `ctrl+shift+p` for those dwelling in Windows-land)
- Summon forth: "Dev Containers: Reopen in Container"
- Marvel as the magic happens!

Alternatively, for those brave souls who venture forth without containers:
```bash
npm install
npm run setup
npm run dev
```

## What Manner of Application Is This?

A case management system of great power and sophistication! Built with the finest tools of the age: React, Node.js, tRPC, and Prisma. Consider it your palantír for managing the affairs of your realm.

## The Three Realms of the Monorepo

Much like the divisions of Middle-earth itself, this application is organized into three great packages, each with its own purpose:

- **packages/client** - The Shire of your frontend! Where React dwells with Vite, Tailwind CSS, and Shadcn UI
- **packages/server** - Isengard! No wait, the good kind of tower. Your Node.js backend fortress with tRPC, Prisma, and SQLite
- **packages/shared** - Rivendell, where the wise Elves keep knowledge to be shared between both realms

## The Arsenal of Ancient Technologies

### The Client Realm (What the User Sees)

- React 18 with TypeScript (your Andúril, reforged and mighty!)
- Vite as build tool (faster than the Nazgûl on wings!)
- tRPC for type-safe API calls (no messages lost to ravens here!)
- Shadcn UI components (as beautiful as the doors of Durin)
- Tailwind CSS for styling (customizable as Galadriel's gifts)
- React Router for routing (many paths through Mirkwood)
- Storybook for component development (the tales before the great tale)
- Jest for unit testing (testing one's mettle before battle)
- Playwright for E2E testing (ensuring the whole quest succeeds!)

### The Server Realm (The Hidden Machinery)

- Node.js with TypeScript (the old magic, reborn with types!)
- tRPC (JSON-RPC 2.0) for API endpoints (swift communication, like the beacons of Gondor)
- Prisma as ORM (your librarian in Minas Tirith)
- SQLite as database (a small chest, but it holds much!)
- Express for HTTP server (the roads must go ever on)

## Beginning Your Quest

### What You Must Bring (Prerequisites)

Before you leave the comfort of Bag End, ensure you have:

- Node.js 22+ (or trust in the devcontainer to provide it)
- npm 10+ (your faithful companion)

### The Path of Least Danger (Devcontainer - MOST RECOMMENDED)

*"Even the smallest person can change the course of the future... but it helps if they don't have to configure their own environment!"*

The safest road for any hobbit:

1. Open this folder in VS Code (your trusty map-reader)
2. When the mystical prompt appears, click "Reopen in Container"
3. Take second breakfast whilst the container builds
4. The application shall awaken at these portals:
   - Client: http://localhost:5173 (your window to the Shire)
   - Server: http://localhost:3001 (the tower that serves all)

### The Perilous Road (Local Development Without Containers)

*"One does not simply develop locally... but if you must:"*

**Step the First - Gather Your Dependencies**
```bash
npm install
```
*Wait whilst npm fetches what you need from the repositories of Númenor*

**Step the Second - Prepare Your Environment**
```bash
cp .env.example .env
```
*Copy the ancient scrolls to create your own configuration*

**Step the Third - Awaken the Database**
```bash
npm run setup
```
*The database stirs from its slumber, tables arise!*

**Step the Fourth - Begin Your Watch**
```bash
npm run dev
```
*Both client and server shall rise together!*

Or, if you prefer to command them separately:
```bash
npm run dev:client  # The frontend awakens (port 3000)
npm run dev:server  # The backend stands ready (port 3001)
```

## The Matter of Identity (Authentication)

*"I am Gandalf, and Gandalf means... well, that's not important right now. What IS important is knowing who YOU are!"*

Fear not, dear hobbit! This application uses a simplified authentication system for your journey. There is no fearsome Guardian of the Gate demanding passwords - instead, you are automatically recognized!

**Your Default Identity**: Alex Morgan (alex.morgan@carton.com) - a respectable name!

**Shapeshifting for Testing**: Should you wish to walk in another's shoes (perhaps to test permissions), simply inscribe this in your `packages/server/.env`:

```env
MOCK_USER_EMAIL=jordan.doe@carton.com
```

The fellowship of available users dwells within the database. Summon them forth by running `npm run db:studio`, or consult the ancient records at [seed.ts](packages/server/db/seed.ts).

### The Magic Behind the Curtain

*"A wizard's staff has a knob on the end... and this middleware has authentication!"*

The server employs a mystical Express middleware ([autoLogin.ts](packages/server/src/middleware/autoLogin.ts)) that performs these enchantments upon every request:

1. Seeks a `userId` cookie in your satchel (the request)
2. If no cookie is found, or if the cookie's email differs from `MOCK_USER_EMAIL`, it consults the great books (database) to find the proper user
3. Bestows upon you a new `userId` cookie (HttpOnly, lasting 7 days - longer than most hobbit adventures!)
4. Your browser, like a faithful friend, automatically carries this cookie forth on all subsequent journeys

When you alter `MOCK_USER_EMAIL` and restart the server, the middleware detects this change of heart and issues a fresh cookie at the next request. The client need not trouble itself - the cookie travels automatically, like the west wind!

## The Spells and Incantations (Available Scripts)

### The Words of Power at the Root

From the highest tower (the root directory), you may speak these commands:

- `npm run dev` - *"Awaken both client and server!"* (development mode)
- `npm run dev:client` - *"Client arise!"* (start only the frontend)
- `npm run dev:server` - *"Server, to arms!"* (start only the backend)
- `npm run build` - *"Forge all packages into their final form!"*
- `npm run test` - *"Test the mettle of all packages!"*
- `npm run lint` - *"Examine all code for imperfections!"*
- `npm run format` - *"Make all code beautiful with Prettier!"*
- `npm run setup` - *"Gather dependencies and prepare the database!"*
- `npm run storybook` - *"Open the book of component tales!"*

### Incantations Within the Client Realm

First, journey there: `cd packages/client`

Then speak these words:
```bash
npm run dev           # Summon the Vite development server
npm run build         # Prepare for the great production deployment
npm run test          # Jest shall test your components
npm run test:e2e      # Playwright shall test the whole quest
npm run storybook     # Open the storybook of components
```

### Commands for the Server Domain

First, enter the tower: `cd packages/server`

Then command:
```bash
npm run dev           # Start server with hot reload (it watches, always watching)
npm run build         # Compile TypeScript into JavaScript
npm run start         # Begin production server (no turning back!)
npm run db:studio     # Open Prisma Studio (peer into the database itself!)
npm run db:push       # Push your schema into the database
npm run db:seed       # Fill the database with test data (like planting pipeweed)
```

### The Shared Realm's Wisdom

Enter the library: `cd packages/shared`

And invoke:
```bash
npm run test          # Test the shared utilities
npm run lint          # Lint the common code
```

## The Map of the Realm (Project Structure)

*"All we have to decide is what to do with the files that are given to us."*

Behold, the layout of your kingdom:

```
carton-case-management/     [The Shire - home of all things]
├── .devcontainer/          [The magic portal to containerized lands]
│   ├── devcontainer.json   [Configuration scroll]
│   └── Dockerfile          [The blueprint of the realm]
├── packages/               [The Three Kingdoms]
│   ├── client/             [The Shire's Green Dragon Inn - where users gather]
│   │   ├── src/
│   │   │   ├── components/ [The craftsmen's workshops]
│   │   │   ├── lib/        [The toolshed and tRPC messenger ravens]
│   │   │   ├── pages/      [The great halls]
│   │   │   └── main.tsx    [Where the tale begins]
│   │   ├── tests/          [The proving grounds]
│   │   │   ├── unit/       [Jest's arena for small battles]
│   │   │   └── e2e/        [Playwright's field for epic quests]
│   │   ├── .storybook/     [The library of component lore]
│   │   └── package.json    [The client's charter]
│   ├── server/             [Minas Tirith - the tower of governance]
│   │   ├── src/
│   │   │   ├── index.ts    [The throne room]
│   │   │   ├── router.ts   [The council's message routes]
│   │   │   ├── context.ts  [The ambient wisdom]
│   │   │   └── trpc.ts     [The communication protocols]
│   │   ├── db/
│   │   │   ├── dev.db      [The vault - your SQLite treasure chest]
│   │   │   └── seed.ts     [The gardener's script]
│   │   └── package.json    [The server's charter]
│   └── shared/             [Rivendell - knowledge for all]
│       ├── prisma/
│       │   └── schema.prisma [The master scroll of truth]
│       ├── src/
│       │   ├── types.ts    [Common tongue definitions]
│       │   ├── generated/  [Magic schemas from Prisma's forge]
│       │   └── utils.ts    [Tools for all realms]
│       └── package.json    [The shared charter]
├── docker-compose.dev.yaml [The orchestrator of containers]
├── .gitignore              [Paths the version control dare not tread]
├── .prettierrc             [The scribe's style guide]
├── eslint.config.mjs       [The code quality guardian]
├── package.json            [The root charter - rules above all]
├── tsconfig.json           [TypeScript's constitution]
└── README.md               [You are here, dear hobbit!]
```

## The Great Library (Database)

*"In a hole in the ground there lived... a database. A SQLite database!"*

The application uses SQLite for its simplicity and self-containment - much like a hobbit's pantry, everything you need in one place! The database file dwells at `packages/server/db/dev.db`. The grand schema, the blueprint of all data, resides in `packages/shared/prisma/schema.prisma`.

### Prisma's Incantations

First, enter the server tower: `cd packages/server`

Then command the database with these powers:

```bash
# Behold the data with Prisma Studio!
npm run db:studio

# Push your schema changes into the living database
npm run db:push

# Generate the Prisma Client (the librarian who knows all)
npm run db:generate

# Plant the seeds of demo data
npm run db:seed

# Wipe clean and replant (use with caution, brave hobbit!)
npm run db:setup
```

## The Trials and Tests

*"The Quest stands upon the edge of a knife. Test wisely, or all code shall fall into ruin!"*

### Unit Tests (Jest's Proving Ground)

```bash
npm run test                 # Test all packages at once!
npm run test:watch          # Keep watch, testing as you code
```

### E2E Tests (Playwright's Grand Quest)

```bash
cd packages/client
npm run test:e2e            # Run the full quest from beginning to end
npm run test:e2e:watch      # Watch mode for the patient developer
```

## Storybook (The Tales of Components)

*"There are many stories that will never be told, but your components should ALL have stories!"*

Storybook allows you to develop and behold UI components in their isolated glory:

```bash
npm run storybook           # Open the book of tales (port 6006)
npm run build-storybook     # Compile the stories for preservation
```

## Code Quality (The High Standards of Elven Craftsmanship)

### Linting (The Eye of ESLint Sees All)

```bash
npm run lint                # Examine all code for flaws
```

### Formatting (Making Code Beautiful)

```bash
npm run format              # Let Prettier work its magic
npm run format:check        # Merely check, do not change
```

## The Ancient Paths of Communication (API Documentation)

*"I am looking for someone to share in an adventure... via type-safe API endpoints!"*

The tRPC API provides the magical bridges between client and server, all type-safe and trustworthy!

### The Art of Memory (Data Caching with tRPC + React Query)

This application possesses a wondrous memory! Using **tRPC with React Query**, it remembers what it has fetched before, reducing wasteful journeys to the server and improving swiftness of response.

#### The Rules of Remembrance (Cache Configuration)

These ancient laws are inscribed at [packages/client/src/lib/trpc.tsx](packages/client/src/lib/trpc.tsx):

- **Stale Time**: 5 minutes - Data remains "fresh" like lembas bread for 5 minutes
- **Garbage Collection Time**: 10 minutes - Old, unused memories fade after 10 minutes
- **Retry**: 3 attempts - If the raven fails to deliver, we send two more before declaring defeat
- **Refetch on Window Focus**: Enabled - When you return from your wanderings (switching tabs), fresh data is fetched quietly

#### How Memory Serves You (Cache Behavior Example)

```tsx
// First viewing: Fetches from the distant server (loading spinner appears)
const { data, isLoading } = trpc.case.list.useQuery();

// Leave and return within 5 minutes:
// - Cached data appears instantly (no loading state!)
// - Displays in less than 100ms (faster than Shadowfax!)

// Return after 5 minutes have passed:
// - Shows you the stale data immediately (better than nothing!)
// - Quietly fetches fresh data in the background
```

#### The All-Seeing Eye (React Query DevTools)

*"I can see quite far from up here!"* - and so can you, with the DevTools!

In development mode, mystical DevTools appear in the bottom-right corner:

1. Click the devtools icon (like opening a palantír, but less dangerous)
2. Behold all cached queries and their states
3. Inspect query data, fetch status, and cache timings
4. Manually invalidate or refetch queries for your experiments

**Heed This Warning**: DevTools appear only in development mode (`npm run dev`), never in production - for in production, there can be no debugging mirrors!

#### The Purging of Old Knowledge (Cache Invalidation)

When you change the world (create, update, delete), you must tell the cache its knowledge is outdated:

```tsx
const utils = trpc.useUtils();

// After creating a case, declare the old list invalid!
const createCase = trpc.case.create.useMutation({
  onSuccess: () => {
    // The case list refreshes itself, as if by magic
    utils.case.list.invalidate();
  },
});
```

#### The Gifts of Good Memory (Performance Benefits)

*"Even the smallest cache can change the course of the user experience."*

- **Instant navigation**: Cached data materializes in <100ms - faster than you can say "Mellon!"
- **Reduced server load**: Queries within 5 minutes of freshness need not trouble the server
- **Background updates**: Stale data refreshes silently, like the Grey Wanderer arriving unbidden
- **Automatic deduplication**: Multiple components seeking the same knowledge share one messenger raven

---

### The Practices of Data Summoning (Data Fetching with tRPC + React Query)

*"A wizard is never late, nor is he early. He fetches data precisely when he means to!"*

All the examples that follow demonstrate the tRPC client, working in harmony with React Query for automatic caching and state management.

#### The Simple Summoning (Basic Query Example)

Behold, the fundamental pattern for requesting knowledge:

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

#### The Refined Request (Query with Parameters)

When you seek specific knowledge, provide the proper parameters:

```tsx
function CaseListByStatus({ status }: { status: string }) {
  const { data } = trpc.case.list.useQuery(
    { status },  // The filter you seek
    {
      // Customize the query's behavior!
      staleTime: 1000 * 60, // Fresh for but 1 minute
      enabled: !!status, // Only quest if status is provided
    }
  );

  return <div>{/* ... */}</div>;
}
```

#### The Act of Creation (Mutation Example with Cache Invalidation)

*"There is only one Lord of the Cache, only one who can invalidate it..."*

When you create something new, you must inform the cache:

```tsx
function CreateCaseForm() {
  const utils = trpc.useUtils();

  const createCase = trpc.case.create.useMutation({
    onSuccess: () => {
      // Inform the cache: "The list you knew is now outdated!"
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

#### The Hopeful Assumption (Optimistic Updates)

*"There is always hope, even before the server confirms!"*

Update the UI immediately, then handle reality when the server responds:

```tsx
function UpdateCaseStatus({ caseId }: { caseId: string }) {
  const utils = trpc.useUtils();

  const updateStatus = trpc.case.update.useMutation({
    onMutate: async (newData) => {
      // Halt any incoming knowledge
      await utils.case.getById.cancel({ id: caseId });

      // Remember the old world, in case we must return to it
      const previousCase = utils.case.getById.getData({ id: caseId });

      // Update optimistically - hope for the best!
      utils.case.getById.setData({ id: caseId }, (old) =>
        old ? { ...old, status: newData.status } : old
      );

      return { previousCase };
    },
    onError: (err, newData, context) => {
      // Our hope was in vain! Restore the old world
      utils.case.getById.setData({ id: caseId }, context?.previousCase);
    },
    onSettled: () => {
      // Whether success or failure, fetch the truth
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

#### The Testing Rituals (Testing Patterns)

*"Many that test deserve production, and some that production deserves testing. Do not be too eager to deploy untested code!"*

When testing components that commune with tRPC, use the sacred utilities from `src/test/utils.ts`:

```tsx
import { renderWithTrpc } from '../test/utils';
import { server } from '../vitest.setup';
import { http, HttpResponse } from 'msw';

test('displays cases from API', async () => {
  // Create a false vision (mock the API response)
  server.use(
    http.post('http://localhost:3000/trpc/case.list', () => {
      return HttpResponse.json({
        result: {
          data: [{ id: '1', title: 'Test Case', description: 'Test', status: 'OPEN' }],
        },
      });
    })
  );

  // Summon the component within the testing realm
  const { getByText } = renderWithTrpc(<CaseList />);

  // Wait patiently for the data to arrive
  await waitFor(() => {
    expect(getByText('Test Case')).toBeInTheDocument();
  });
});
```

**For Further Study**, consult these ancient texts:
- [Query Patterns](specs/001-trpc-react-query/contracts/query-example.tsx)
- [Mutation Patterns](specs/001-trpc-react-query/contracts/mutation-example.tsx)
- [Test Patterns](specs/001-trpc-react-query/contracts/test-example.test.tsx)
- [Quickstart Guide](specs/001-trpc-react-query/quickstart.md)

### The Routes of Power (API Endpoints)

#### Health Check
- `health.query()` - *"Is the server alive? Let us see!"*

#### Users (The Fellowship)
- `user.list.query()` - Summon the list of all users
- `user.getById.query({ id })` - Find one user by their ID

#### Cases (The Quests Themselves)
- `case.list.query({ status?, assignedTo? })` - List cases, with optional filters
- `case.getById.query({ id })` - Retrieve a single case by ID
- `case.create.mutation({ title, description, createdBy, assignedTo? })` - Begin a new case
- `case.update.mutation({ id, ...updates })` - Modify an existing case
- `case.delete.mutation({ id })` - Send a case into the void

## Contributing to the Quest

*"It is not our part to master all the code of the world, but to do what is in us for the succour of those projects wherein we are placed."*

To join this fellowship of contributors:

1. **Create a feature branch** (name it well, like Andúril!)
2. **Make your changes** (with care and wisdom)
3. **Run tests**: `npm run test` (prove your code's worth!)
4. **Run linting**: `npm run lint` (let the code be examined)
5. **Format code**: `npm run format` (make it beautiful)
6. **Submit a pull request** (present your work to the council)

## License

MIT

---

*"All we have to decide is what to do with the code that is given to us. Go forth, dear hobbit, and may your deployments be ever successful!"*

— Gandalf the Grey (and occasionally Gandalf the White, after successful production deploys)
