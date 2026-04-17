grunt grunt:

- docker-compose -f docker-compose.local.yaml up --build
- cmd+shift+p -> Dev Containers: Reopen in Container
- npm install -> npm run setup -> npm run dev

<!-- OOGA: must update cave painting later, project change since first scratch on wall -->

# 🦴 CARTON CASE MANAGEMENT 🦴

Ugh. This app for manage case things. Me build with React, Node.js, tRPC, and Prisma. Very modern. Much wow. Better than rock.

## How Cave Organized

This big cave have many smaller caves. We call "monorepo" because one repo rule them all. Use npm workspace magic:

- **packages/client** - Pretty face part. React make pretty pictures with Vite fire, Tailwind fur, and Shadcn shiny rocks
- **packages/server** - Brain part live in back cave. Node.js think hard with tRPC, Prisma, and SQLite
- **packages/shared** - Things both caves share. Like communal mammoth leg.

## What Tools We Bonk With

### Front of Cave (Frontend)

- React 18 with TypeScript - smart rock painting
- Vite - fast fire that build things
- tRPC - magic tube that connect caves safely
- Shadcn UI - pretty buttons and things
- Tailwind CSS - make things look not ugly
- React Router - know which cave you in
- Storybook - little cave for test one rock at time
- Jest - poke things see if they break
- Playwright - ghost that click buttons for you

### Back of Cave (Backend)

- Node.js with TypeScript - smart brain rock
- tRPC (JSON-RPC 2.0) - talk between caves without lose message
- Prisma - talk to data rock nicely
- SQLite - flat rock that remember things
- Express - carry messages through cave tunnels

## How Start Fire

### What You Need First

- Node.js 22+ (or use magic container cave)
- npm 10+

### Use Magic Container Cave (Me Recommend)

Easiest way. Even baby caveman can do:

1. Open cave folder in VS Code
2. When sky spirit ask, click "Reopen in Container"
3. Wait. Container cave build itself. Go hunt mammoth while wait.
4. App wake up at:
   - Pretty face: http://localhost:5173
   - Brain cave: http://localhost:3001

### Build Fire Yourself (Local)

If you no want container cave:

1. **Get all rocks and sticks**

   ```bash
   npm install
   ```

2. **Set up cave environment**

   ```bash
   cp .env.example .env
   ```

3. **Prepare data rock**

   ```bash
   npm run setup
   ```

4. **LIGHT FIRE**

   ```bash
   npm run dev
   ```

   Or light fires one at time like careful caveman:

   ```bash
   npm run dev:client  # Pretty face fire on port 3000
   npm run dev:server  # Brain fire on port 3001
   ```

## Who You Be? (Authentication)

This cave have simple "who you" system. No real guard at cave entrance - just pretend you somebody. Good for when developing.

**Default Cave Person**: Alex Morgan (alex.morgan@carton.com)

**Want Be Different Cave Person?**: Bonk this into `packages/server/.env`:

```env
MOCK_USER_EMAIL=jordan.doe@carton.com
```

All cave people planted in data rock. Look at them with `npm run db:studio` or peek at [seed.ts](packages/server/db/seed.ts) cave painting.

### How Magic Work

Server use Express angry-doorman ([autoLogin.ts](packages/server/src/middleware/autoLogin.ts)) that check everyone who walk in:

1. Sniff for `userId` cookie crumb on visitor
2. If no cookie crumb or crumb smell wrong, find cave person by email in data rock
3. Stick new cookie crumb on visitor (secret cookie, last 7 sunrises)
4. Cookie crumb follow visitor everywhere after that

When you change `MOCK_USER_EMAIL` and restart brain cave, doorman smell different and give new cookie crumb. Pretty face no need know - cookie just work. Magic.

## Magic Words You Can Grunt

### From Big Cave (Root Level)

- `npm run dev` - Wake up BOTH pretty face and brain cave
- `npm run dev:client` - Wake up only pretty face
- `npm run dev:server` - Wake up only brain cave
- `npm run build` - Make all caves strong for battle
- `npm run test` - Poke everything see what break
- `npm run lint` - Check if cave paintings neat
- `npm run format` - Make cave paintings neat with Prettier stick
- `npm run setup` - Get all rocks and prepare data rock
- `npm run storybook` - Open little story cave

### Pretty Face Cave

```bash
cd packages/client
npm run dev           # Light pretty face fire
npm run build         # Build strong wall
npm run test          # Poke with Jest stick
npm run test:e2e      # Send ghost to click buttons
npm run storybook     # Open little story cave
```

### Brain Cave

```bash
cd packages/server
npm run dev           # Light brain fire (reload when change)
npm run build         # Carve TypeScript into stone
npm run start         # Start for real battle
npm run db:studio     # Open shiny data rock viewer
npm run db:push       # Push new shape onto data rock
npm run db:seed       # Plant fake data seeds
```

### Shared Cave

```bash
cd packages/shared
npm run test          # Poke shared things
npm run lint          # Check shared paintings
```

## Cave Map

```
carton-case-management/
├── .devcontainer/          # Magic container cave setup
│   ├── devcontainer.json
│   └── Dockerfile
├── packages/
│   ├── client/             # Pretty face cave
│   │   ├── src/
│   │   │   ├── components/ # Pretty rock pieces
│   │   │   ├── lib/        # Tool rocks and tRPC tube
│   │   │   ├── pages/      # Big cave wall paintings
│   │   │   └── main.tsx    # Cave entrance
│   │   ├── tests/          # Poking sticks
│   │   │   ├── unit/       # Small poke (Jest)
│   │   │   └── e2e/        # Big poke (Playwright ghost)
│   │   ├── .storybook/     # Story cave setup
│   │   └── package.json
│   ├── server/             # Brain cave
│   │   ├── src/
│   │   │   ├── index.ts    # Brain cave entrance
│   │   │   ├── router.ts   # Which tunnel go where
│   │   │   ├── context.ts  # Brain cave context
│   │   │   └── trpc.ts     # Magic tube setup
│   │   ├── db/
│   │   │   ├── dev.db      # Flat remember rock
│   │   │   └── seed.ts     # Plant fake things
│   │   └── package.json
│   └── shared/             # Communal cave
│       ├── prisma/
│       │   └── schema.prisma # Shape of data rock (ONE TRUTH)
│       ├── src/
│       │   ├── types.ts    # What shape things are
│       │   ├── generated/  # Robot-carved Zod shapes from Prisma
│       │   └── utils.ts    # Shared pointy sticks
│       └── package.json
├── docker-compose.dev.yaml
├── .gitignore
├── .prettierrc
├── eslint.config.mjs
├── package.json            # Big cave package.json
├── tsconfig.json           # Big cave TypeScript rules
└── README.md
```

## Data Rock (Database)

We use SQLite because simple good. Data rock live at `packages/server/db/dev.db`. Shape of data rock carved in `packages/shared/prisma/schema.prisma`.

### Prisma Bonk Commands

```bash
cd packages/server

# Open shiny data rock viewer (GUI thing)
npm run db:studio

# Push new shape onto data rock
npm run db:push

# Make Prisma spirit understand new shape
npm run db:generate

# Plant fake data seeds in rock
npm run db:seed

# SMASH data rock and replant (careful!!)
npm run db:setup
```

## Poking Things (Testing)

### Small Pokes (Jest)

```bash
npm run test                 # Poke all things
npm run test:watch          # Keep poking when things change
```

### Big Pokes (Playwright)

```bash
cd packages/client
npm run test:e2e            # Send ghost to poke big
npm run test:e2e:watch      # Ghost keep poking
```

## Story Cave (Storybook)

Story cave good for look at one pretty rock at time without whole cave:

```bash
npm run storybook           # Open story cave on port 6006
npm run build-storybook     # Carve story cave into portable stone
```

## Make Cave Painting Neat

### Check Painting (Linting)

```bash
npm run lint                # Spirit check all paintings
```

### Make Painting Pretty (Formatting)

```bash
npm run format              # Make all paintings neat
npm run format:check        # Just look, no touch
```

## Talking Tubes Documentation (API)

tRPC make magic talking tubes that know what shape data is. Important tubes below:

### Remember-Rock Magic (Data Caching with tRPC + React Query)

This cave use **tRPC with React Query** so brain not have to think same thought twice. All messages through tubes get remembered in magic remember-rock. Less running back to brain cave. More fast.

#### Remember-Rock Settings

Default remember settings (carved in [packages/client/src/lib/trpc.tsx](packages/client/src/lib/trpc.tsx)):

- **Fresh Time**: 5 sunrises-minutes - Data still good for 5 minutes after fetch
- **Garbage Time**: 10 minutes - Nobody use? Throw in tar pit after 10 minutes
- **Try Again**: 3 bonks - If fail, bonk 3 more times before give up
- **Look Back at Cave**: Yes - When you come back to tab, go check if data still good

#### How Remember-Rock Work

```tsx
// First time: Go all way to brain cave (show "loading..." on wall)
const { data, isLoading } = trpc.case.list.useQuery();

// Come back within 5 minutes:
// - Remember-rock give answer FAST (no loading cave painting)
// - Data appear in less than 100 heartbeats

// After 5 minutes:
// - Remember-rock give old answer (still fast!)
// - Send runner to brain cave get fresh data quietly
```

#### Shiny Dev Rocks (React Query DevTools)

When in practice mode, shiny debug rocks appear in bottom-right of cave:

1. Bonk the shiny icon to open
2. See all remembered things and if they fresh or stale
3. Poke at data, see when fetched, how long cached
4. Manually throw away remembered things for testing

**Note**: Shiny rocks only appear in practice mode (`npm run dev`), not in real battle.

#### Throw Away Old Memory (Cache Invalidation)

When you change data (make new, update, destroy), remember-rock know to forget old stuff:

```tsx
const utils = trpc.useUtils();

// After make new case, tell remember-rock to forget old list
const createCase = trpc.case.create.useMutation({
  onSuccess: () => {
    // This make remember-rock go get fresh list
    utils.case.list.invalidate();
  },
});
```

#### Why Remember-Rock Good

- **Instant cave navigation**: Remembered data appear in less than 100 heartbeats when go back
- **Brain cave rest more**: Fresh data no need go to brain cave again
- **Quiet update**: Old data get refreshed without annoying loading cave painting
- **One runner only**: Many cave paintings want same data? Only send ONE runner

---

### Get Data From Brain Cave (Data Fetching with tRPC + React Query)

All cave painting examples below use tRPC tube connected to React Query remember-rock.

#### Simple Ask Example

```tsx
import { trpc } from '../lib/trpc';

function CaseList() {
  const { data, isLoading, error } = trpc.case.list.useQuery();

  if (isLoading) return <div>Me looking...</div>;
  if (error) return <div>OOF: {error.message}</div>;

  return (
    <ul>
      {data.map((c) => (
        <li key={c.id}>{c.title}</li>
      ))}
    </ul>
  );
}
```

#### Ask With Specific Grunt (Query with Parameters)

```tsx
function CaseListByStatus({ status }: { status: string }) {
  const { data } = trpc.case.list.useQuery(
    { status },
    {
      // Special rules for this ask
      staleTime: 1000 * 60, // Fresh for 1 minute only
      enabled: !!status, // Only ask if status grunt provided
    }
  );

  return <div>{/* ... */}</div>;
}
```

#### Change Things Example (Mutation with Cache Invalidation)

```tsx
function CreateCaseForm() {
  const utils = trpc.useUtils();

  const createCase = trpc.case.create.useMutation({
    onSuccess: () => {
      // Tell remember-rock old list no good
      utils.case.list.invalidate();
    },
    onError: (error) => {
      alert(`BONK FAIL: ${error.message}`);
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
      {/* cave painting fields */}
      <button type="submit" disabled={createCase.isLoading}>
        {createCase.isLoading ? 'Making...' : 'MAKE CASE'}
      </button>
    </form>
  );
}
```

#### Hope-It-Work Update (Optimistic Updates)

```tsx
function UpdateCaseStatus({ caseId }: { caseId: string }) {
  const utils = trpc.useUtils();

  const updateStatus = trpc.case.update.useMutation({
    onMutate: async (newData) => {
      // Tell runners to stop running
      await utils.case.getById.cancel({ id: caseId });

      // Remember what was before (just in case)
      const previousCase = utils.case.getById.getData({ id: caseId });

      // Pretend it already worked (optimism!)
      utils.case.getById.setData({ id: caseId }, (old) =>
        old ? { ...old, status: newData.status } : old
      );

      return { previousCase };
    },
    onError: (err, newData, context) => {
      // OOF. Put old thing back. Pretend nothing happen.
      utils.case.getById.setData({ id: caseId }, context?.previousCase);
    },
    onSettled: () => {
      // Always go check for real after dust settle
      utils.case.getById.invalidate({ id: caseId });
    },
  });

  return (
    <button onClick={() => updateStatus.mutate({ id: caseId, status: 'CLOSED' })}>
      CLOSE CASE (bonk)
    </button>
  );
}
```

#### Poking Pattern (Testing)

When poke cave paintings that use tRPC tubes, use poke tools from `src/test/utils.ts`:

```tsx
import { renderWithTrpc } from '../test/utils';
import { server } from '../vitest.setup';
import { http, HttpResponse } from 'msw';

test('show cases from brain cave', async () => {
  // Pretend brain cave say this
  server.use(
    http.post('http://localhost:3000/trpc/case.list', () => {
      return HttpResponse.json({
        result: {
          data: [{ id: '1', title: 'Test Case', description: 'Test', status: 'OPEN' }],
        },
      });
    })
  );

  // Put cave painting on wall with tRPC tube
  const { getByText } = renderWithTrpc(<CaseList />);

  // Wait for brain cave answer
  await waitFor(() => {
    expect(getByText('Test Case')).toBeInTheDocument();
  });
});
```

For more cave paintings, see:

- [Ask Patterns](specs/001-trpc-react-query/contracts/query-example.tsx)
- [Change Patterns](specs/001-trpc-react-query/contracts/mutation-example.tsx)
- [Poke Patterns](specs/001-trpc-react-query/contracts/test-example.test.tsx)
- [Quick Start Scroll](specs/001-trpc-react-query/quickstart.md)

### Is Cave Alive? (Health)

- `health.query()` - Grunt at cave, see if grunt back

### Cave People (Users)

- `user.list.query()` - See all cave people
- `user.getById.query({ id })` - Find one cave person by their rock number

### Cases

- `case.list.query({ status?, assignedTo? })` - Get cases, maybe filter by status or who assigned
- `case.getById.query({ id })` - Get one case by rock number
- `case.create.mutation({ title, description, createdBy, assignedTo? })` - Make new case
- `case.update.mutation({ id, ...updates })` - Change case
- `case.delete.mutation({ id })` - SMASH case (gone forever)

## How Help Tribe (Contributing)

1. Make new branch (like side cave)
2. Do your cave painting changes
3. Poke things: `npm run test`
4. Check if neat: `npm run lint`
5. Make pretty: `npm run format`
6. Show tribe elder (submit pull request)

## Cave Law (License)

MIT - Free like wind. Do what you want. Ooga booga.
