commands:

- docker-compose -f docker-compose.local.yaml up --build
- cmd+shift+p -> Dev Containers: Reopen in Container
- npm install -> npm run setup -> npm run dev

<!-- TODO: udpdate this readme, project has some changes since initial copilot spinup -->

# CARTON CASE THING

ME BUILD APP. APP MANAGE CASE. USE REACT, NODE, TRPC, PRISMA. APP GOOD.

## HOW APP MADE

APP BIG. HAVE MANY PART:

- **packages/client** - PRETTY PICTURE PART. USE REACT, VITE, TAILWIND, SHADCN
- **packages/server** - BRAIN PART. USE NODE, TRPC, PRISMA, SQLITE
- **packages/shared** - SHARED THING. BOTH PART USE.

## WHAT APP USE

### PRETTY PICTURE PART

- REACT 18. TYPE SAFE. UGH.
- VITE MAKE FAST
- TRPC TALK TO BRAIN
- SHADCN MAKE PRETTY
- TAILWIND MAKE COLOR
- REACT ROUTER MOVE AROUND
- STORYBOOK SHOW COMPONENT
- JEST TEST THING
- PLAYWRIGHT TEST MORE THING

### BRAIN PART

- NODE. TYPESCRIPT. UGH.
- TRPC TALK TO PRETTY PART
- PRISMA TOUCH DATABASE
- SQLITE HOLD DATA
- EXPRESS SERVE THING

## HOW START

### NEED FIRST

- NODE 22 OR BIGGER
- NPM 10 OR BIGGER

### USE BOX (GOOD WAY)

BOX MAKE EASY. ME LIKE BOX.

1. OPEN FOLDER IN VS CODE
2. VS CODE ASK "OPEN IN BOX?" - SAY YES
3. WAIT. BOX BUILD.
4. APP START:
   - PRETTY PART: http://localhost:5173
   - BRAIN PART: http://localhost:3001

### NO BOX (HARD WAY)

IF NO BOX:

1. **PUT THING IN**

   ```bash
   npm install
   ```

2. **SET UP ENV**

   ```bash
   cp .env.example .env
   ```

3. **MAKE DATABASE**

   ```bash
   npm run setup
   ```

4. **START APP**

   ```bash
   npm run dev
   ```

   OR START SEPARATE:

   ```bash
   npm run dev:client  # PRETTY PART ON 3000
   npm run dev:server  # BRAIN PART ON 3001
   ```

## WHO AM I

APP NOT USE REAL LOGIN. APP PRETEND. APP LOG IN AS FAKE PERSON AUTOMATICALLY.

**DEFAULT PERSON**: ALEX MORGAN (alex.morgan@carton.com)

**BE DIFFERENT PERSON**: SET `MOCK_USER_EMAIL` IN `packages/server/.env`:

```env
MOCK_USER_EMAIL=jordan.doe@carton.com
```

PERSON LIVE IN DATABASE. SEE WITH `npm run db:studio` OR LOOK AT [seed.ts](packages/server/db/seed.ts).

### HOW LOGIN WORK

BRAIN PART USE MIDDLEWARE ([autoLogin.ts](packages/server/src/middleware/autoLogin.ts)):

1. LOOK FOR COOKIE
2. NO COOKIE? FIND PERSON BY EMAIL IN DATABASE
3. PUT COOKIE (LIVE 7 DAY)
4. NEXT TIME COOKIE COME AUTOMATICALLY

CHANGE `MOCK_USER_EMAIL`, RESTART BRAIN, NEW PERSON COME. EASY.

## COMMANDS ME USE

### BIG COMMANDS

- `npm run dev` - START ALL THING
- `npm run dev:client` - START PRETTY PART ONLY
- `npm run dev:server` - START BRAIN PART ONLY
- `npm run build` - BUILD ALL
- `npm run test` - TEST ALL
- `npm run lint` - CHECK CODE GOOD
- `npm run format` - MAKE CODE PRETTY
- `npm run setup` - PUT THING IN AND MAKE DATABASE
- `npm run storybook` - START STORYBOOK

### PRETTY PART COMMANDS

```bash
cd packages/client
npm run dev           # START PRETTY
npm run build         # BUILD PRETTY
npm run test          # TEST PRETTY
npm run test:e2e      # TEST MORE PRETTY
npm run storybook     # SHOW COMPONENT
```

### BRAIN PART COMMANDS

```bash
cd packages/server
npm run dev           # START BRAIN
npm run build         # BUILD BRAIN
npm run start         # RUN BRAIN
npm run db:studio     # LOOK AT DATA
npm run db:push       # PUSH SCHEMA
npm run db:seed       # PUT DATA IN
```

### SHARED COMMANDS

```bash
cd packages/shared
npm run test          # TEST SHARED
npm run lint          # CHECK SHARED
```

## HOW APP ORGANIZED

```
carton-case-management/
├── .devcontainer/          # BOX THING
│   ├── devcontainer.json
│   └── Dockerfile
├── packages/
│   ├── client/             # PRETTY PICTURE
│   │   ├── src/
│   │   │   ├── components/ # PIECE OF PRETTY
│   │   │   ├── lib/        # HELPER THING
│   │   │   ├── pages/      # PAGE THING
│   │   │   └── main.tsx    # START HERE
│   │   ├── tests/          # TEST THING
│   │   │   ├── unit/       # SMALL TEST
│   │   │   └── e2e/        # BIG TEST
│   │   ├── .storybook/     # STORY CONFIG
│   │   └── package.json
│   ├── server/             # BRAIN
│   │   ├── src/
│   │   │   ├── index.ts    # BRAIN START
│   │   │   ├── router.ts   # ROAD MAP
│   │   │   ├── context.ts  # CONTEXT THING
│   │   │   └── trpc.ts     # TRPC SETUP
│   │   ├── db/
│   │   │   ├── dev.db      # DATA LIVE HERE
│   │   │   └── seed.ts     # PUT DATA IN
│   │   └── package.json
│   └── shared/             # SHARED THING
│       ├── prisma/
│       │   └── schema.prisma # DATA SHAPE
│       ├── src/
│       │   ├── types.ts    # TYPE THING
│       │   ├── generated/  # AUTO MAKE THING
│       │   └── utils.ts    # HELPER
│       └── package.json
├── docker-compose.dev.yaml
├── .gitignore
├── .prettierrc
├── eslint.config.mjs
├── package.json
├── tsconfig.json
└── README.md
```

## DATABASE

APP USE SQLITE. SIMPLE. DATA LIVE IN `packages/server/db/dev.db`. SHAPE IN `packages/shared/prisma/schema.prisma`.

### DATABASE COMMANDS

```bash
cd packages/server

# LOOK AT DATA WITH PRETTY PICTURE
npm run db:studio

# PUSH SHAPE TO DATABASE
npm run db:push

# MAKE PRISMA CLIENT
npm run db:generate

# PUT DATA IN
npm run db:seed

# WIPE AND START OVER
npm run db:setup
```

## TESTING

### SMALL TEST (JEST)

```bash
npm run test                 # TEST ALL
npm run test:watch          # KEEP TESTING
```

### BIG TEST (PLAYWRIGHT)

```bash
cd packages/client
npm run test:e2e            # BIG TEST
npm run test:e2e:watch      # BIG TEST BUT WATCH
```

## STORYBOOK

STORYBOOK SHOW COMPONENT BY ITSELF. GOOD FOR LOOK:

```bash
npm run storybook           # START ON 6006
npm run build-storybook     # BUILD STORYBOOK
```

## CODE GOOD?

### CHECK CODE

```bash
npm run lint                # CHECK ALL
```

### MAKE PRETTY

```bash
npm run format              # MAKE PRETTY
npm run format:check        # CHECK PRETTY
```

## API THING

TRPC MAKE API SAFE WITH TYPE. IMPORTANT ROAD:

### DATA REMEMBER WITH TRPC + REACT QUERY

APP USE TRPC WITH REACT QUERY. DATA REMEMBER. LESS ASK SERVER. FASTER. GOOD.

#### REMEMBER SETTINGS

DEFAULT REMEMBER (IN [packages/client/src/lib/trpc.tsx](packages/client/src/lib/trpc.tsx)):

- **FRESH TIME**: 5 MINUTE - DATA FRESH FOR 5 MINUTE
- **THROW AWAY TIME**: 10 MINUTE - OLD DATA GONE AFTER 10 MINUTE
- **TRY AGAIN**: 3 TIME - IF FAIL, TRY 3 MORE TIME
- **LOOK AGAIN WHEN COME BACK**: YES - DATA REFRESH WHEN RETURN TO TAB

#### REMEMBER EXAMPLE

```tsx
// FIRST TIME: ASK SERVER (LOADING)
const { data, isLoading } = trpc.case.list.useQuery();

// COME BACK IN 5 MINUTE:
// - DATA COME FAST (NO LOADING)
// - SHOW IN <100ms

// AFTER 5 MINUTE:
// - OLD DATA SHOW FAST
// - ASK SERVER IN BACKGROUND FOR NEW DATA
```

#### USE DEVTOOLS

IN DEV MODE, DEVTOOLS IN BOTTOM RIGHT:

1. CLICK ICON TO OPEN
2. SEE ALL DATA IN MEMORY
3. LOOK AT DATA AND STATUS
4. MANUALLY FORGET DATA FOR TEST

**NOTE**: DEVTOOLS ONLY IN DEV. NOT IN REAL APP.

#### FORGET DATA

WHEN CHANGE DATA, MEMORY UPDATE AUTOMATIC:

```tsx
const utils = trpc.useUtils();

const createCase = trpc.case.create.useMutation({
  onSuccess: () => {
    utils.case.list.invalidate();
  },
});
```

#### FAST THING

- **FAST MOVE**: OLD DATA SHOW IN <100ms
- **LESS SERVER WORK**: NO ASK SERVER IF DATA FRESH (5 MIN)
- **BACKGROUND UPDATE**: OLD DATA UPDATE WITHOUT LOADING
- **NO REPEAT**: MANY COMPONENT SHARE ONE ASK

---

### ASK DATA WITH TRPC + REACT QUERY

ALL EXAMPLE USE TRPC WITH REACT QUERY FOR REMEMBER AND STATE.

#### BASIC ASK EXAMPLE

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

#### ASK WITH FILTER

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

#### CHANGE DATA EXAMPLE

```tsx
function CreateCaseForm() {
  const utils = trpc.useUtils();

  const createCase = trpc.case.create.useMutation({
    onSuccess: () => {
      utils.case.list.invalidate();
    },
    onError: (error) => {
      alert(`BAD THING HAPPEN: ${error.message}`);
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
      {/* FORM THING */}
      <button type="submit" disabled={createCase.isLoading}>
        {createCase.isLoading ? 'MAKING...' : 'MAKE CASE'}
      </button>
    </form>
  );
}
```

#### PRETEND UPDATE BEFORE KNOW

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
      CLOSE CASE
    </button>
  );
}
```

#### TEST EXAMPLE

```tsx
import { renderWithTrpc } from '../test/utils';
import { server } from '../vitest.setup';
import { http, HttpResponse } from 'msw';

test('SHOW CASE FROM SERVER', async () => {
  server.use(
    http.post('http://localhost:3000/trpc/case.list', () => {
      return HttpResponse.json({
        result: {
          data: [{ id: '1', title: 'TEST CASE', description: 'TEST', status: 'OPEN' }],
        },
      });
    })
  );

  const { getByText } = renderWithTrpc(<CaseList />);

  await waitFor(() => {
    expect(getByText('TEST CASE')).toBeInTheDocument();
  });
});
```

FOR MORE EXAMPLE, LOOK:

- [QUERY EXAMPLE](specs/001-trpc-react-query/contracts/query-example.tsx)
- [MUTATION EXAMPLE](specs/001-trpc-react-query/contracts/mutation-example.tsx)
- [TEST EXAMPLE](specs/001-trpc-react-query/contracts/test-example.test.tsx)
- [QUICK START](specs/001-trpc-react-query/quickstart.md)

### HEALTH CHECK

- `health.query()` - APP ALIVE?

### PERSON THING

- `user.list.query()` - GET ALL PERSON
- `user.getById.query({ id })` - GET ONE PERSON

### CASE THING

- `case.list.query({ status?, assignedTo? })` - GET CASE WITH FILTER
- `case.getById.query({ id })` - GET ONE CASE
- `case.create.mutation({ title, description, createdBy, assignedTo? })` - MAKE CASE
- `case.update.mutation({ id, ...updates })` - CHANGE CASE
- `case.delete.mutation({ id })` - KILL CASE

## HELP APP GROW

1. MAKE BRANCH
2. MAKE CHANGE
3. TEST: `npm run test`
4. CHECK: `npm run lint`
5. MAKE PRETTY: `npm run format`
6. GIVE TO OTHERS

## RULES

MIT
