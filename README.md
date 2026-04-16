commands:

- docker-compose -f docker-compose.local.yaml up --build
- cmd+shift+p -> Dev Containers: Reopen in Container
- npm install -> npm run setup -> npm run dev

# CARTON — NAZG-MAHTIE
### *Ash nazg durbatulûk* — One App to Rule the Cases

LISTEN UP, SNAGA. This is the war-machine. You break it, Uglúk finds you.

---

## STRUCTURE OF THE WAR CAMP

Three battalions. Don't mix them up or the Warchief skins you:

- **packages/client** — *THE FRONT LINE*: React smashes the screen. Vite, Tailwind, Shadcn do the dirty work.
- **packages/server** — *THE WAR TENT*: Node.js, tRPC, Prisma, SQLite. Hidden. Don't poke it.
- **packages/shared** — *THE SUPPLY CHAIN*: Types and lore. Both sides eat from this pile.

---

## WEAPONS

### FRONT LINE WEAPONS

- React 18, written in TypeScript runes
- Vite — fast as a warg
- tRPC — so types don't lie (types always lie, tRPC stops that)
- Shadcn UI — pretty shields, don't ask why
- Tailwind CSS — wrap everything in ugly string-names
- React Router — for wandering snaga who get lost
- Storybook — look at components without breaking things
- Jest — stab the code, see if it bleeds
- Playwright — spy on the whole battlefield end-to-end

### WAR TENT WEAPONS

- Node.js, TypeScript runes
- tRPC (JSON-RPC 2.0) — the messenger between realms
- Prisma — the Orc who talks to the database so you don't have to
- SQLite — small rock, holds a lot
- Express — stands at the gate, lets requests through

---

## HOW TO START THE SIEGE

### YOU NEED THESE FIRST

- Node.js 22+ (or crawl into the devcontainer like a cave-troll)
- npm 10+

### DEVCONTAINER (EASIEST, EVEN FOR YOU)

1. Open folder in VS Code
2. Click "Reopen in Container" when VS Code whines at you
3. Wait. Don't touch anything. GO SIT DOWN.
4. When it wakes up, find it at:
   - Client: http://localhost:5173
   - Server: http://localhost:3001

### LOCAL SIEGE (IF YOU HATE CONTAINERS)

1. **Get the weapons**

   ```bash
   npm install
   ```

2. **Set up the camp**

   ```bash
   cp .env.example .env
   ```

3. **Dig the foundation**

   ```bash
   npm run setup
   ```

4. **CHARGE**

   ```bash
   npm run dev
   ```

   Or split the army:

   ```bash
   npm run dev:client  # Front line, port 3000
   npm run dev:server  # War tent, port 3001
   ```

---

## THE GATE — AUTHENTICATION

*No real guards. We painted a troll on the door.* The app logs you in automatically as a fake user. Don't get comfortable.

**Default Snaga**: Alex Morgan (alex.morgan@carton.com)

**Want to be someone else?** Set `MOCK_USER_EMAIL` in `packages/server/.env` and become another wretched soul:

```env
MOCK_USER_EMAIL=jordan.doe@carton.com
```

Users live in the database. Spy on them with `npm run db:studio` or grovel at the [seed.ts](packages/server/db/seed.ts) scroll.

### HOW THE TRICK WORKS

The [autoLogin.ts](packages/server/src/middleware/autoLogin.ts) middleware runs on every request like a paranoid gate-guard:

1. Sniffs for a `userId` cookie
2. If cookie's gone or smells wrong, goes and finds the user by email
3. Stamps a new `userId` cookie — HttpOnly, 7 days before it rots
4. Cookie rides along on every request after that

Change `MOCK_USER_EMAIL`, restart the server, and the guard issues a new stamp. The client does nothing — it just carries the cookie like a dumb messenger.

---

## BATTLE COMMANDS

### FROM THE WAR CHIEF'S TENT (Root)

- `npm run dev` — Wake both armies
- `npm run dev:client` — Wake only the front line
- `npm run dev:server` — Wake only the war tent
- `npm run build` — Forge everything
- `npm run test` — Set the bloodhounds loose on all packages
- `npm run lint` — Make the scrolls presentable
- `npm run format` — Tidy up or face consequences
- `npm run setup` — First-time setup, read the instructions snaga
- `npm run storybook` — Open the armoury display

### FRONT LINE ORDERS

```bash
cd packages/client
npm run dev           # Wake Vite
npm run build         # Forge for battle
npm run test          # Jest hunts bugs
npm run test:e2e      # Playwright watches everything
npm run storybook     # Open the display cases
```

### WAR TENT ORDERS

```bash
cd packages/server
npm run dev           # Wake with hot reload, like a phoenix but angrier
npm run build         # Translate TypeScript runes
npm run start         # Deploy to the front
npm run db:studio     # Open Prisma Studio (the stone-eye)
npm run db:push       # Hammer schema into the database
npm run db:seed       # Feed the database
```

### SUPPLY CHAIN ORDERS

```bash
cd packages/shared
npm run test          # Bloodhounds
npm run lint          # Scrolls
```

---

## MAP OF THE CAMP

```
carton-case-management/
├── .devcontainer/          # The cave entrance
│   ├── devcontainer.json
│   └── Dockerfile
├── packages/
│   ├── client/             # Front line (React)
│   │   ├── src/
│   │   │   ├── components/ # Weapons rack
│   │   │   ├── lib/        # Supply crates (tRPC setup)
│   │   │   ├── pages/      # Battlefields
│   │   │   └── main.tsx    # The war-horn
│   │   ├── tests/
│   │   │   ├── unit/       # Jest stabs
│   │   │   └── e2e/        # Playwright eyes
│   │   ├── .storybook/     # Armoury display
│   │   └── package.json
│   ├── server/             # War tent (Node.js)
│   │   ├── src/
│   │   │   ├── index.ts    # Camp entrance
│   │   │   ├── router.ts   # Road network
│   │   │   ├── context.ts  # The Knowing
│   │   │   └── trpc.ts     # The bridge
│   │   ├── db/
│   │   │   ├── dev.db      # The stone-book
│   │   │   └── seed.ts     # The feeding-scroll
│   │   └── package.json
│   └── shared/             # Supply chain
│       ├── prisma/
│       │   └── schema.prisma # THE ONE SCHEMA (touch it and die)
│       ├── src/
│       │   ├── types.ts    # The runes
│       │   ├── generated/  # Auto-forged Zod from Prisma
│       │   └── utils.ts    # Little tricks
│       └── package.json
├── docker-compose.dev.yaml
├── .gitignore
├── .prettierrc
├── eslint.config.mjs
├── package.json            # The war-chief's manifest
├── tsconfig.json           # TypeScript oath
└── README.md               # THIS CURSED DOCUMENT
```

---

## THE STONE-BOOK — Database

SQLite. Small. Doesn't complain. Lives at `packages/server/db/dev.db`. Schema is carved in `packages/shared/prisma/schema.prisma`. *Touch the schema without thinking and the whole army collapses.*

### PRISMA COMMANDS

```bash
cd packages/server

# Open Prisma Studio — the stone-eye that sees all data
npm run db:studio

# Hammer schema changes into stone
npm run db:push

# Summon the Prisma Client from the forge
npm run db:generate

# Feed the database with demo flesh
npm run db:seed

# Burn it all and start over
npm run db:setup
```

---

## SENDING THE BLOODHOUNDS — Testing

### UNIT BLOODHOUNDS (Jest)

```bash
npm run test                 # Loose them all
npm run test:watch           # Keep them running forever
```

### FULL BATTLEFIELD EYES (Playwright)

```bash
cd packages/client
npm run test:e2e             # Watch everything
npm run test:e2e:watch       # Watch. Everything. Always.
```

---

## THE ARMOURY DISPLAY — Storybook

Look at components without breaking things. Rare luxury:

```bash
npm run storybook           # Open on port 6006
npm run build-storybook     # Seal it in stone
```

---

## SCROLL QUALITY

### LINTING

```bash
npm run lint                # Make scrolls worthy of the Warchief
```

### FORMATTING

```bash
npm run format              # Clean them up
npm run format:check        # Check if they're clean
```

---

## THE MESSENGER NETWORK — API

tRPC. Type-safe. No excuses for bad data. Get it wrong and Jest finds you.

### DATA HOARD — Caching with tRPC + React Query

The hoard remembers. Automatic caching means the server rests between raids.

#### HOARD SETTINGS

Configured in [packages/client/src/lib/trpc.tsx](packages/client/src/lib/trpc.tsx):

- **Stale Time**: 5 minutes — *Fresh meat lasts this long*
- **Garbage Collection Time**: 10 minutes — *Then it gets thrown to the wargs*
- **Retry**: 3 attempts — *Three tries before we give up on a messenger*
- **Refetch on Window Focus**: Enabled — *Guard snaps to attention when you return*

#### HOW THE HOARD WORKS

```tsx
// First raid: Goes to the server (loading state)
const { data, isLoading } = trpc.case.list.useQuery();

// Come back within 5 minutes:
// - Hoard gives data instantly, no loading
// - Under 100ms — fast as a thrown axe

// After 5 minutes:
// - Still gives hoard data instantly
// - Sends a scout to fetch fresh data in the background
```

#### WATCHING THE HOARD

React Query DevTools sit in the bottom-right corner in dev mode. Click to see what's cached, what's stale, what's dead. Not in production — too much to explain to the enemy.

#### CLEARING THE HOARD

When you mutate data, the hoard purges itself:

```tsx
const utils = trpc.useUtils();

const createCase = trpc.case.create.useMutation({
  onSuccess: () => {
    utils.case.list.invalidate(); // Burn the old list, fetch fresh
  },
});
```

#### WHY BOTHER

- **Fast navigation**: Hoard data under 100ms — no waiting
- **Server rests**: No pointless raids within stale time
- **Background raids**: Fresh data arrives without interrupting the user
- **No duplicate raids**: Multiple components share one request

---

### MESSENGER ROUTES

#### ALL EXAMPLES USE TRPC + REACT QUERY. DON'T FORGET.

#### BASIC QUERY

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

#### QUERY WITH FILTERS

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

#### MUTATION WITH HOARD PURGE

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

#### OPTIMISTIC STRIKES

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

#### TESTING IN THE PIT

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

More examples in these scrolls (read them or suffer):

- [Query Patterns](specs/001-trpc-react-query/contracts/query-example.tsx)
- [Mutation Patterns](specs/001-trpc-react-query/contracts/mutation-example.tsx)
- [Test Patterns](specs/001-trpc-react-query/contracts/test-example.test.tsx)
- [Quickstart Guide](specs/001-trpc-react-query/quickstart.md)

---

### MESSENGER ROUTES (THE SHORT LIST)

#### HEALTH

- `health.query()` — Is anything alive in there?

#### SOLDIERS

- `user.list.query()` — Show all soldiers
- `user.getById.query({ id })` — Find one by mark

#### CASES

- `case.list.query({ status?, assignedTo? })` — Show cases, filtered if you're picky
- `case.getById.query({ id })` — One case by ID
- `case.create.mutation({ title, description, createdBy, assignedTo? })` — Make a new case
- `case.update.mutation({ id, ...updates })` — Change a case
- `case.delete.mutation({ id })` — Destroy a case

---

## JOINING THE HORDE — Contributing

1. Carve a feature branch
2. Make your changes
3. Run the bloodhounds: `npm run test`
4. Check the scrolls: `npm run lint`
5. Tidy up: `npm run format`
6. Send the pull request — Uglúk will review it

---

## THE OATH — License

MIT. Take it. Use it. Don't blame us when it breaks.
