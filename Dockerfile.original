FROM node:24-alpine AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY packages/shared/package*.json ./packages/shared/
COPY packages/server/package*.json ./packages/server/
COPY packages/client/package*.json ./packages/client/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client and build all packages
RUN npx prisma generate --schema=packages/shared/prisma/schema.prisma && npm run build

# Production image
FROM node:24-alpine
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY packages/server/package*.json ./packages/server/
COPY packages/shared/package*.json ./packages/shared/

# Install production dependencies only
RUN npm ci --workspace=packages/server --workspace=packages/shared --omit=dev

# Copy built artifacts and source files for tsx
COPY --from=builder /app/packages/server/dist ./packages/server/dist
COPY --from=builder /app/packages/server/src ./packages/server/src
COPY --from=builder /app/packages/server/db ./packages/server/db
COPY --from=builder /app/packages/shared/src ./packages/shared/src
COPY --from=builder /app/packages/shared/prisma ./packages/shared/prisma
COPY --from=builder /app/packages/client/dist ./packages/client/dist

# Copy Prisma client generated during build (with all generators)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy static client build to be served
COPY --from=builder /app/packages/client/dist /app/public

ENV NODE_ENV=production
EXPOSE 5173 3001 6006 9323

# Setup database at startup, seed it, then start the server
CMD sh -c "cd /app && npx prisma db push --schema=packages/shared/prisma/schema.prisma --skip-generate && cd /app/packages/server && npx tsx db/seed.ts && npm run start:prod"