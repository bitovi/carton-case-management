# Carton Case Management

A case management application for handling carton/logistics cases.

## Running the Application

- **Frontend**: Runs on port **5173** (Vite dev server)
- **Backend API**: Runs on port **3001**

When opening the browser or taking screenshots, use `http://localhost:5173` for the frontend application.

## Project Structure

- `packages/web` - Frontend (React/Vite)
- `packages/server` - Backend (Node.js)
- `packages/shared` - Shared types and utilities with Prisma schema

## Database

- SQLite database: `packages/shared/prisma/packages/server/db/dev.db`
- Database MCP configured in `.mcp.json` for querying via Claude Code
