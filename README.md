commands:

- docker-compose -f docker-compose.local.yaml up --build
- cmd+shift+p -> Dev Containers: Reopen in Container
- npm install -> npm run setup -> npm run dev

# Carton Case Management

Ahoy, matey. This be a modern case-management vessel built with React, Node.js, tRPC, and Prisma.

## Architecture

This ship sails as a monorepo using npm workspaces:

- **packages/client** - React front deck with Vite, Tailwind CSS, and Shadcn UI
- **packages/server** - Node.js engine room with tRPC, Prisma, and SQLite
- **packages/shared** - Shared charts, types, and utilities fer both sides o the ship

## Tech Stack

### Frontend

- React 18 with TypeScript
- Vite as build rigging
- tRPC fer type-safe API calls
- Shadcn UI components
- Tailwind CSS fer styling
- React Router fer navigation seas
- Storybook fer component work
- Jest fer unit tests
- Playwright fer E2E tests

### Backend

- Node.js with TypeScript
- tRPC (JSON-RPC 2.0) fer API routes
- Prisma as ORM
- SQLite as database cargo hold
- Express fer HTTP server duties

## Getting Started

### Prerequisites

- Node.js 22+ (or sail with the devcontainer)
- npm 10+

### Development with Devcontainer (Recommended)

The easiest voyage be using the devcontainer:

1. Open this folder in VS Code
2. When prompted, click "Reopen in Container"
3. Wait fer the container to build and dependencies to install
4. The app hoists its sails at:
   - Client: http://localhost:5173
   - Server: http://localhost:3001

### Local Development

If ye be not using devcontainer:

1. **Install dependencies**

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

4. **Start development servers**

   ```bash
   npm run dev
   ```

   Or run each deck separately:

   ```bash
   npm run dev:client  # Client on port 3000
   npm run dev:server  # Server on port 3001
   ```

## Authentication

This project uses a simple mock login fer development waters. There be no true backend auth here; it auto-logs ye in as a mock sailor.

**Default User**: Alex Morgan (alex.morgan@carton.com)

**Testing as Different Users**: To test as another crew member, set the `MOCK_USER_EMAIL` env var in `packages/server/.env`:

```env
MOCK_USER_EMAIL=jordan.doe@carton.com
```

Crew records be seeded in the database. View them with `npm run db:studio` in server package, or inspect [seed.ts](packages/server/db/seed.ts).

### How It Works

The server runs an Express middleware ([autoLogin.ts](packages/server/src/middleware/autoLogin.ts)) on every request:

1. Checks fer a `userId` cookie in the request
2. If no cookie exists, or email mismatch with `MOCK_USER_EMAIL`, it looks up the sailor by email in the database
3. Sets a fresh `userId` cookie (HttpOnly, 7-day expiry)
4. Cookie sails along on all future requests

When ye change `MOCK_USER_EMAIL` and restart server, middleware spots the mismatch and issues a new cookie on next request. The client need do nothin extra.

## Available Scripts

### Root Level

- `npm run dev` - Start both client and server in development mode
- `npm run dev:client` - Start only client
- `npm run dev:server` - Start only server
- `npm run build` - Build all packages
- `npm run test` - Run tests in all packages
- `npm run lint` - Lint all packages
- `npm run format` - Format with Prettier
- `npm run setup` - Install dependencies and setup database
- `npm run storybook` - Start Storybook

### Client Package

```bash
cd packages/client
npm run dev           # Start Vite dev server
npm run build         # Build fer production
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

## Project Structure

```text
carton-case-management/
├── .devcontainer/          # Devcontainer config
│   ├── devcontainer.json
│   └── Dockerfile
├── packages/
│   ├── client/             # React frontend
│   ├── server/             # Node.js backend
│   └── shared/             # Shared code
├── docker-compose.dev.yaml
├── .gitignore
├── .prettierrc
├── eslint.config.mjs
├── package.json            # Root package manifest
├── tsconfig.json           # Root TS config
└── README.md
```

## Database

This vessel uses SQLite fer simplicity. Database file be at `packages/server/db/dev.db`. Prisma schema be at `packages/shared/prisma/schema.prisma`.

### Prisma Commands

```bash
cd packages/server

# Open Prisma Studio (database GUI)
npm run db:studio

# Push schema changes to database
npm run db:push

# Generate Prisma Client
npm run db:generate

# Seed database with demo data
npm run db:seed

# Reset database (clear + seed)
npm run db:setup
```

## Testing

### Unit Tests (Jest)

```bash
npm run test                 # Run all tests
npm run test:watch          # Run tests in watch mode
```

### E2E Tests (Playwright)

```bash
cd packages/client
npm run test:e2e            # Run E2E tests
npm run test:e2e:watch      # Run E2E tests in watch mode
```

## Storybook

Storybook be configured fer building and testing UI components in isolation:

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
npm run format:check        # Check formatting only
```

## API Documentation

The tRPC API provides type-safe routes. Key calls be listed below.

### Health

- `health.query()` - Check API health

### Users

- `user.list.query()` - Get all users
- `user.getById.query({ id })` - Get user by ID

### Cases

- `case.list.query({ status?, assignedTo? })` - List cases with filters
- `case.getById.query({ id })` - Get case by ID
- `case.create.mutation({ title, description, createdBy, assignedTo? })` - Create case
- `case.update.mutation({ id, ...updates })` - Update case
- `case.delete.mutation({ id })` - Delete case

## Contributing

1. Create a feature branch
2. Make yer changes
3. Run tests: `npm run test`
4. Run linting: `npm run lint`
5. Format code: `npm run format`
6. Open a pull request

## License

MIT
