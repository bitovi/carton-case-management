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

# Build all packages
RUN npm run build

# Production image
FROM node:24-alpine
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY packages/server/package*.json ./packages/server/
COPY packages/shared/package*.json ./packages/shared/

# Install production dependencies only
RUN npm ci --workspace=packages/server --workspace=packages/shared --omit=dev

# Copy built artifacts
COPY --from=builder /app/packages/server/dist ./packages/server/dist
COPY --from=builder /app/packages/server/prisma ./packages/server/prisma
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/packages/client/dist ./packages/client/dist

# Copy static client build to be served
COPY --from=builder /app/packages/client/dist /app/public

ENV NODE_ENV=production
EXPOSE 5173 3001 6006 9323

WORKDIR /app/packages/server

# Setup database at startup, then start the server
CMD sh -c "npm run db:push && npm run db:seed && npm run start"
