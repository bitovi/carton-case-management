README FOR CAVEMAN

Rock app make case work.

BIG PICTURE

- This project use many rocks.
- Frontend rock: React + Vite + Tailwind + Shadcn UI.
- Backend rock: Node + tRPC + Prisma + SQLite.
- Shared rock: common types and helpers.

START FAST

If you want make it run:

- `docker-compose -f docker-compose.local.yaml up --build`
- Open in VS Code dev container: cmd+shift+p -> Dev Containers: Reopen in Container
- `npm install`
- `npm run setup`
- `npm run dev`

WHAT IT IS

Carton Case Management is app for people to manage cases. It is not fancy, but it works. It uses client side and server side together.

HOW TO RUN

If you are in rockshell and not using container:

1. `npm install`
2. `cp .env.example .env`
3. `npm run setup`
4. `npm run dev`

If you want just one part:

- `npm run dev:client` - run client only
- `npm run dev:server` - run server only

TECH ROCKS

Frontend:
- React 18
- TypeScript
- Vite
- tRPC
- Tailwind CSS
- Storybook
- Jest
- Playwright

Backend:
- Node.js
- TypeScript
- tRPC
- Prisma
- SQLite
- Express

AUTH STORY

This app uses mock login. No real fire. Server pretends user is logged in.

Default mock user: Alex Morgan

Change user by setting `MOCK_USER_EMAIL` in `packages/server/.env`.

Run `npm run db:studio` to see seeded users or open `packages/server/db/seed.ts`.

COMMANDS

Top-level:
- `npm run dev` - start client + server
- `npm run dev:client` - client only
- `npm run dev:server` - server only
- `npm run build` - build everything
- `npm run test` - run tests
- `npm run lint` - lint code
- `npm run format` - format code
- `npm run setup` - install deps and setup DB
- `npm run storybook` - open Storybook

Client package:

```bash
cd packages/client
npm run dev
npm run build
npm run test
npm run test:e2e
npm run storybook
```

Server package:

```bash
cd packages/server
npm run dev
npm run build
npm run start
npm run db:studio
npm run db:push
npm run db:seed
```

Shared package:

```bash
cd packages/shared
npm run test
npm run lint
```

PROJECT LAYOUT

- packages/client - frontend
- packages/server - backend
- packages/shared - shared things

That is all. Caveman README done.
