---
name: database
description: "Manage the carton-case-management database. Use when asked to: reset the database, seed data, reseed, push schema changes, generate Prisma client, regenerate types, open Prisma Studio, browse database data, or apply migrations. All database operations for this project."
argument-hint: "What do you want to do? (e.g. reset the database, seed data, push schema, open Prisma Studio)"
---

# Database Management

All commands run from the project root. The Prisma schema lives at `packages/shared/prisma/schema.prisma`.

## Full Reset (push schema + seed)

```
npm run db:setup
```

Use this to get a clean database with fresh test data. Confirm output shows seeding completed successfully.

## Push Schema Changes

After modifying `packages/shared/prisma/schema.prisma`:

```
npm run db:generate && npm run db:push
```

`db:generate` regenerates the Prisma Client and Zod types. `db:push` syncs the schema to the database.

## Seed Data Only

```
npm run db:seed
```

Runs `packages/server/db/seed.ts` to populate the database with test data. Use when the schema is already correct but you need fresh data.

## Generate Prisma Client Only

```
npm run db:generate
```

Use after schema changes to regenerate the client and Zod types before running the app.

## Browse Data (Prisma Studio)

```
npm run db:studio
```

Opens Prisma Studio in the browser for visual data inspection and editing.

## Environment

- Database file: `packages/server/db/dev.db` (SQLite)
- Connection string: `DATABASE_URL` in the root `.env` file
