# Carton Case Management

Hwaet. This writ describeth Carton Case Management, a craft of case governance wrought with React, Node.js, tRPC, and Prisma.

## The Shape of the Work

This realm is a monorepo, parted into three great houses:

- **packages/client**: The front hall, built with React, Vite, Tailwind CSS, and Shadcn UI.
- **packages/server**: The back keep, built with Node.js, tRPC, Prisma, and SQLite.
- **packages/shared**: The common treasury of types and utilities shared by all.

## Engines and Tools

### Front Hall

- React 18 with TypeScript
- Vite as the builder
- tRPC for type-safe speech 'twixt client and server
- Shadcn UI components
- Tailwind CSS for raiment and form
- React Router for pathfinding
- Storybook for shaping components
- Jest for unit proving
- Playwright for end-to-end trials

### Back Keep

- Node.js with TypeScript
- tRPC (JSON-RPC 2.0) for API ways
- Prisma as ORM
- SQLite as storehouse
- Express as the web steward

## First Steps

### Fore-Needs

- Node.js 22+ (or the devcontainer)
- npm 10+

### Devcontainer Path (Most Favored)

The swiftest road is the devcontainer:

1. Open this folder in VS Code.
2. When bidden, choose **Reopen in Container**.
3. Abide while the container is forged and dependencies are fetched.
4. The app should rise thus:
   - Client: http://localhost:5173
   - Server: http://localhost:3001

### Local Path

If thou usest not the devcontainer:

1. **Install dependencies**

```bash
npm install
```

2. **Set up env**

```bash
cp .env.example .env
```

3. **Set up database**

```bash
npm run setup
```

4. **Start dev servers**

```bash
npm run dev
```

Or each apart:

```bash
npm run dev:client  # Client on port 3000
npm run dev:server  # Server on port 3001
```

## Authentication (Mocked for Development)

This craft useth a simple mock auth flow for development. No true backend auth is bound herein. Instead, a mock user is auto-signed.

**Default User**: Alex Morgan (alex.morgan@carton.com)

To prove as another user, set `MOCK_USER_EMAIL` in `packages/server/.env`:

```env
MOCK_USER_EMAIL=jordan.doe@carton.com
```

Available users be seeded in the database. Thou mayst view them with `npm run db:studio` in the server package, or behold `packages/server/db/seed.ts`.

### How It Wends

The server useth Express middleware (`packages/server/src/middleware/autoLogin.ts`) on each request:

1. It seeketh a `userId` cookie.
2. If none is found, or if the bound user mismatcheth `MOCK_USER_EMAIL`, it seeketh the user by email in the database.
3. It setteth a fresh `userId` cookie (HttpOnly, 7-day span).
4. The cookie rideth with later requests of its own accord.

When `MOCK_USER_EMAIL` is changed and the server rebeginneth, middleware marketh the mismatch and issueth a new cookie on the next request.

## Commands at Hand

### Root

- `npm run dev`: Start client and server in dev mode.
- `npm run dev:client`: Start only client.
- `npm run dev:server`: Start only server.
- `npm run build`: Build all packages.
- `npm run test`: Run tests in all packages.
- `npm run lint`: Lint all packages.
- `npm run format`: Format with Prettier.
- `npm run setup`: Install deps and shape database.
- `npm run storybook`: Start Storybook.

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
npm run db:push       # Push schema changes
npm run db:seed       # Seed demo data
```

### Shared Package

```bash
cd packages/shared
npm run test          # Run Jest tests
npm run lint          # Lint code
```

## Realm Layout

```text
carton-case-management/
├── .devcontainer/
│   ├── devcontainer.json
│   └── Dockerfile
├── packages/
│   ├── client/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── lib/
│   │   │   ├── pages/
│   │   │   └── main.tsx
│   │   └── package.json
│   ├── server/
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── router.ts
│   │   │   ├── context.ts
│   │   │   └── trpc.ts
│   │   ├── db/
│   │   │   ├── dev.db
│   │   │   └── seed.ts
│   │   └── package.json
│   └── shared/
│       ├── prisma/
│       │   └── schema.prisma
│       ├── src/
│       └── package.json
├── docker-compose.dev.yaml
├── eslint.config.mjs
├── package.json
├── tsconfig.json
└── README.md
```

## Database Lore

SQLite is used for plainness and speed. The database file dwelleth at `packages/server/db/dev.db`. The Prisma schema standeth at `packages/shared/prisma/schema.prisma`.

### Prisma Commands

```bash
cd packages/server

# Open Prisma Studio (database GUI)
npm run db:studio

# Push schema changes
npm run db:push

# Generate Prisma Client
npm run db:generate

# Seed demo data
npm run db:seed

# Reset database (clear + seed)
npm run db:setup
```

## Testing

### Unit Trials (Jest)

```bash
npm run test                # Run all tests
npm run test:watch          # Run in watch mode
```

### End-to-End Trials (Playwright)

```bash
cd packages/client
npm run test:e2e            # Run E2E tests
npm run test:e2e:watch      # Run E2E tests in watch mode
```

## Storybook

Storybook is readied for crafting and proving UI components in sundry isolation:

```bash
npm run storybook           # Start Storybook on port 6006
npm run build-storybook     # Build static Storybook
```

## Troubles and Remedies

### Port Already Taken

If a port be in use, cease the warring process or alter the configured port.

### Database Misbehaving

```bash
cd packages/server
npm run db:setup
```

### Fresh Beginning

```bash
rm -rf node_modules packages/*/node_modules
npm install
npm run setup
```

## Contribution Word

1. Make a branch from `main`.
2. Work thy change.
3. Run lint and tests.
4. Open thy pull request with clear witness of what changed.

## License

This project abideth under the MIT License, unless another writ herein declareth otherwise.
