---
name: setup-project
description: "Setup and start the carton-case-management dev environment. Use when asked to: set up the project, install dependencies, start the app, start the dev environment, run the server, start the client, start locally, get the project running, or start Storybook. Covers first-time setup, running dev servers in separate terminals, and Docker."
argument-hint: "What do you want to do? (e.g. start the app, set up from scratch, start Storybook)"
---

# Project Setup

## First-Time Setup

Run this once after cloning, or to fully reset the environment:

```
npm run setup
```

This installs all dependencies, pushes the Prisma schema, and seeds the database.

## Starting the Dev Environment

Start the server and client in **separate async terminal sessions** so output from each is independently visible.

### Step 1 — Kill any existing dev processes

Always do this before starting the servers to ensure no stale instances are left running:

```
npm run kill-servers
```

### Step 2 — Start the backend server (async terminal)
```
npm run dev:server
```
Wait for output confirming the server is listening on port 3001. Verify with `http://localhost:3001/health`.

### Step 3 — Start the frontend client (async terminal)
```
npm run dev:client
```
Wait for Vite to report ready on `http://localhost:5173`.

Do NOT use `npm run dev` — it runs both in one process with combined output, making it impossible to confirm each is ready independently.

## Storybook

```
npm run storybook
```

Starts the Storybook dev server for component documentation and visual testing.

## Docker (Alternative)

```
npm run docker:up     # build and start containerized dev environment
npm run docker:dev    # attach to a running container
npm run docker:down   # stop and remove containers
```
