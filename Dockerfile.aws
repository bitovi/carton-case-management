FROM node:24-bookworm

ENV NODE_ENV=development
ENV DATABASE_URL=file:./db/dev.db

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
COPY packages/ ./packages/
#COPY packages/shared/* ./packages/shared/
#COPY packages/shared/prisma/* ./packages/shared/prisma/
#COPY packages/client/* ./packages/client/

RUN npm run setup

EXPOSE 5173 3001

CMD sh -c "npm run dev"
