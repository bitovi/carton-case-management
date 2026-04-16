# Carton Case Management (Caveman Edition)

Big app help tribe track cases.
App made with React, Node, tRPC, Prisma.
Monorepo. Many small caves (packages) work together.

## Fast Start (No Think Too Much)

Use these commands:

- `docker-compose -f docker-compose.local.yaml up --build`
- `cmd+shift+p` -> `Dev Containers: Reopen in Container`
- `npm install` -> `npm run setup` -> `npm run dev`

## Cave Map (Architecture)

- `packages/client` : front cave (React UI)
- `packages/server` : back cave (API, DB talk)
- `packages/shared` : shared bones (types, utils)

## Tools Tribe Use (Tech Stack)

### Front Cave

- React 18 + TypeScript
- Vite
- tRPC
- Shadcn UI
- Tailwind CSS
- React Router
- Storybook
- Jest
- Playwright

### Back Cave

- Node.js + TypeScript
- tRPC (JSON-RPC 2.0)
- Prisma ORM
- SQLite
- Express

## Need Before Start

- Node.js 22+ (or devcontainer)
- npm 10+

## Devcontainer Way (Best Way)

1. Open folder in VS Code
2. Click "Reopen in Container"
3. Wait while container build and install
4. App wake up:
   - Client: http://localhost:5173
   - Server: http://localhost:3001

## Local Way (No Container)

1. Install things

```bash
npm install
```

2. Make env file

```bash
cp .env.example .env
```

3. Prepare database

```bash
npm run setup
```

4. Start app

```bash
npm run dev
```

Or run split:

```bash
npm run dev:client
npm run dev:server
```

## Login Magic (Mock Auth)

No real auth for now. App auto-login mock user.

Default human:
- Alex Morgan (`alex.morgan@carton.com`)

Test different human:
- Set `MOCK_USER_EMAIL` in `packages/server/.env`

```env
MOCK_USER_EMAIL=jordan.doe@carton.com
```

See seeded users:
- run `npm run db:studio`
- or inspect `packages/server/db/seed.ts`

### How Login Magic Work

Server middleware `packages/server/src/middleware/autoLogin.ts` do this every request:

1. Look for `userId` cookie
2. If missing or wrong email, find user by `MOCK_USER_EMAIL`
3. Set new `userId` cookie (HttpOnly, 7 days)
4. Browser keep sending cookie next requests

Change `MOCK_USER_EMAIL` + restart server -> middleware fix cookie on next request.

## Big Command List

### Root Commands

- `npm run dev` : run client + server
- `npm run dev:client` : run only client
- `npm run dev:server` : run only server
- `npm run build` : build all
- `npm run test` : test all
- `npm run lint` : lint all
- `npm run format` : format all
- `npm run setup` : install + DB setup
- `npm run storybook` : start storybook

### Client Cave

```bash
cd packages/client
npm run dev
npm run build
npm run test
npm run test:e2e
npm run storybook
```

### Server Cave

```bash
cd packages/server
npm run dev
npm run build
npm run start
npm run db:studio
npm run db:push
npm run db:seed
```

### Shared Cave

```bash
cd packages/shared
npm run test
npm run lint
```

## Project Bones (Structure)

```text
carton-case-management/
|- .devcontainer/
|- packages/
|  |- client/
|  |- server/
|  |- shared/
|- docker-compose.dev.yaml
|- package.json
`- README.md
```

## Database Stuff

SQLite DB file live at `packages/server/db/dev.db`.
Prisma schema live at `packages/shared/prisma/schema.prisma`.

Prisma commands:

```bash
cd packages/server
npm run db:studio
npm run db:push
npm run db:generate
npm run db:seed
npm run db:setup
```

## Testing

Unit tests:

```bash
npm run test
npm run test:watch
```

E2E tests:

```bash
cd packages/client
npm run test:e2e
npm run test:e2e:watch
```

## Storybook

```bash
npm run storybook
npm run build-storybook
```

## Code Clean

Lint:

```bash
npm run lint
```

Format:

```bash
npm run format
npm run format:check
```

## API Talk (tRPC)

### Cache (tRPC + React Query)

Cache default in `packages/client/src/lib/trpc.tsx`:

- Stale time: 5 min
- GC time: 10 min
- Retry: 3
- Refetch on window focus: yes

Good thing happen:

- Go back to page fast: cached data show quick
- Less server hits during stale window
- Background refresh when stale
- Same query in many components = one network request

### Query Example

```tsx
const { data, isLoading, error } = trpc.case.list.useQuery();
```

### Query With Params

```tsx
const { data } = trpc.case.list.useQuery(
  { status },
  {
    staleTime: 1000 * 60,
    enabled: !!status,
  }
);
```

### Mutation + Cache Invalidate

```tsx
const utils = trpc.useUtils();

const createCase = trpc.case.create.useMutation({
  onSuccess: () => {
    utils.case.list.invalidate();
  },
});
```

### Optimistic Update Pattern

```tsx
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
  onError: (_err, _newData, context) => {
    utils.case.getById.setData({ id: caseId }, context?.previousCase);
  },
  onSettled: () => {
    utils.case.getById.invalidate({ id: caseId });
  },
});
```

### Testing Components With tRPC

Use helper in `src/test/utils.ts`.
For more examples, see:

- `specs/001-trpc-react-query/contracts/query-example.tsx`
- `specs/001-trpc-react-query/contracts/mutation-example.tsx`
- `specs/001-trpc-react-query/contracts/test-example.test.tsx`
- `specs/001-trpc-react-query/quickstart.md`

## API Routes (Important)

- `health.query()` : check API health
- `user.list.query()` : list users
- `user.getById.query({ id })` : get one user
- `case.list.query({ status?, assignedTo? })` : list cases
- `case.getById.query({ id })` : get one case
- `case.create.mutation({ title, description, createdBy, assignedTo? })` : make case
- `case.update.mutation({ id, ...updates })` : change case
- `case.delete.mutation({ id })` : remove case

## Contribute Like Strong Caveman

1. Make feature branch
2. Change code
3. Run `npm run test`
4. Run `npm run lint`
5. Run `npm run format`
6. Open pull request

## License

MIT
