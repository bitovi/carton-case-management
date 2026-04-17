# Carton Management: A Most Noble Application

## The Repository's Structure

- In the chamber 'client' doth dwell the visage of the app, where user doth gaze and click
- In 'server' abideth the mind and heart, where logic doth reside and wisdom doth flow
- In 'shared' are kept the scrolls and common wisdom for all, that all parts may speak as one

## The Array of Technologies

### For the Front
- React, a lively framework
- TypeScript, language of order
- Storybook, for tales of components
- Playwright, for testing by automaton
- Tailwind, for garments of style
- Shadcn, for noble components
- Router, for passage between scenes
- Jest, for trials and proofs
- Vite, for swift compilation
- tRPC, for discourse 'twixt front and back

### For the Back
- Node, the steadfast steward
- TypeScript, language of order
- tRPC, for discourse
- Prisma, keeper of records
- SQLite, the stone of memory
- Express, the messenger

## The Path to Commence

### Prerequisites
- Thou must possess Node, version two and twenty
- Thou must wield npm, version ten

### To Begin Within the Magic Container
1. Open with Visual Studio, as one opens a tome
2. Select the enchanted container
3. Await the completion of all preparations
4. The application shall awaken thus:
   - Client: http://localhost:5173
   - Server: http://localhost:3001

### To Begin Upon Thine Own Machine
1. Install dependencies: `npm install`
2. Prepare the environment: `cp .env.example .env`
3. Initialize the database: `npm run setup`
4. Awaken the application: `npm run dev`
   - Or, for the visage alone: `npm run dev:client`
   - Or, for the mind alone: `npm run dev:server`

## Of Authentication

- Here, authentication is but a shadow, a jest for development
- To don another's guise, set `MOCK_USER_EMAIL` in the server's environment

## Commands for the Scribe

- `npm run dev`: Awaken all
- `npm run dev:client`: Awaken the visage
- `npm run dev:server`: Awaken the mind
- `npm run build`: Prepare for the field
- `npm run test`: Prove thy code
- `npm run lint`: Seek out disorder
- `npm run format`: Restore fair form
- `npm run setup`: Prepare all
- `npm run storybook`: Tell the tale of components

## The Order of Folders

- client: visage and interaction
- server: mind and logic
- shared: wisdom for all

## Of the Database

- SQLite, the stone of memory, is used
- The stone is found at `server/db/dev.db`
- The schema, the plan, at `shared/prisma/schema.prisma`

## Of Testing

- Jest: `npm run test` for trials
- Playwright: `npm run test:e2e` for automaton trials

## Of Storybook

- Begin: `npm run storybook`
- Compile: `npm run build-storybook`

## Of Code Quality

- Lint: `npm run lint`
- Format: `npm run format`

## Of the API

- tRPC for all discourse
- Caching, five minutes' worth
- Performance, aided by cache

## For Those Who Would Contribute

1. Create a branch, as one would a new path
2. Make thy changes
3. Prove thy code with tests
4. Seek out disorder with lint
5. Restore fair form with format
6. Submit thy work for review

## License

MIT, as decreed
