FROM node:24-bookworm

ENV NODE_ENV=development
# Relative to the Prisma schema dir (packages/shared/prisma/) -> packages/server/db/dev.db
ENV DATABASE_URL=file:../../server/db/dev.db

# Install system dependencies and Playwright dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    python3 \
    make \
    g++ \
    pkg-config \
    # Playwright dependencies for Chromium
    libnss3 \
    libnspr4 \
    libdbus-1-3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libpango-1.0-0 \
    libcairo2 \
    libasound2 \
    libatspi2.0-0 \
    # Additional Playwright system dependencies
    fonts-ipafont-gothic \
    fonts-freefont-ttf \
    fonts-liberation \
    fonts-noto-color-emoji \
    fonts-tlwg-loma-otf \
    fonts-unifont \
    fonts-wqy-zenhei \
    libelf1 \
    libfontenc1 \
    libgl1 \
    libgl1-mesa-dri \
    libglapi-mesa \
    libglvnd0 \
    libglx-mesa0 \
    libglx0 \
    libice6 \
    libllvm15 \
    libpciaccess0 \
    libsensors-config \
    libsensors5 \
    libsm6 \
    libunwind8 \
    libx11-xcb1 \
    libxaw7 \
    libxcb-dri2-0 \
    libxcb-dri3-0 \
    libxcb-glx0 \
    libxcb-present0 \
    libxcb-randr0 \
    libxcb-sync1 \
    libxcb-xfixes0 \
    libxfont2 \
    libxkbfile1 \
    libxmu6 \
    libxshmfence1 \
    libxt6 \
    libxxf86vm1 \
    libz3-4 \
    x11-xkb-utils \
    xfonts-encodings \
    xfonts-scalable \
    xfonts-utils \
    xserver-common \
    xvfb \
    # Additional GTK/X11 dependencies for Playwright
    libxcursor1 \
    libgtk-3-0 \
    libpangocairo-1.0-0 \
    libcairo-gobject2 \
    libgdk-pixbuf2.0-0 \
    vim \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workspaces/carton-case-management

COPY *.json ./
COPY .env.example ./
COPY scripts/ ./scripts/
COPY packages/ ./packages/

RUN npm run setup

# Build the client into packages/client/dist. packages/server/src/index.ts serves that directory
# when NODE_ENV=production, which is what docker-compose.yaml sets - without this step it publishes
# only port 3001 and every request to `/` 404s because the directory does not exist.
# NODE_ENV stays `development` in this image on purpose: `npm run setup` above needs the dev
# dependencies (vite, tsc) that npm would skip under `production`, and the ECS task definition
# relies on Vite serving port 5173 (see the CMD note below).
RUN npm run build

EXPOSE 5173 3001

# Runs both processes: Vite on 5173 and the API on 3001.
# Do not narrow this to the server alone - infra/ecs.tf:94 points the ALB target group at
# container port 5173 and infra/alb.tf:36 health-checks it, so the deployed app is served by Vite,
# which proxies /trpc to localhost:3001 (see packages/client/vite.config.ts). Serving everything
# from Express instead would be the better production setup, but it needs the target group and
# health check moved to 3001 in the same change.
CMD sh -c "npm run dev"
