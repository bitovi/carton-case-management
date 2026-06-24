#!/bin/sh
# Runs e2e tests in whatever environment is available.
# - If Node.js is installed: runs tests directly
# - If only Docker is available: runs tests inside the running app container

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Set DATABASE_URL if not already set.
# Uses the same path Docker creates (file:./prisma/dev.db relative to schema dir).
if [ -z "$DATABASE_URL" ]; then
  SCHEMA_DIR="$PROJECT_ROOT/packages/shared/prisma"
  export DATABASE_URL="file:$SCHEMA_DIR/prisma/dev.db"
fi

UI_FLAG=""
if [ "$1" = "--ui" ]; then
  UI_FLAG="--ui-host=0.0.0.0 --ui-port=8080"
fi

run_local() {
  if [ ! -f ./node_modules/.bin/playwright ]; then
    echo "Installing dependencies..."
    npm install
  fi
  echo "Setting up database..."
  npm run db:setup
  playwright install chromium
  if [ -n "$UI_FLAG" ]; then
    playwright test --ui
  else
    playwright test
  fi
}

run_docker() {
  COMPOSE_FILE="docker-compose.local.yaml"
  if [ ! "$(docker compose -f $COMPOSE_FILE ps -q app 2>/dev/null)" ]; then
    echo "Docker container is not running. Start it first with: docker compose -f $COMPOSE_FILE up -d"
    exit 1
  fi
  docker compose -f $COMPOSE_FILE exec app sh -c "playwright install chromium && playwright test $UI_FLAG"
  if [ -n "$UI_FLAG" ]; then
    echo ""
    echo "Playwright UI is running at http://localhost:8080"
  fi
}

if command -v node >/dev/null 2>&1; then
  run_local
elif command -v docker >/dev/null 2>&1; then
  run_docker
else
  echo "Error: Neither Node.js nor Docker found. Please install one of them to run e2e tests."
  exit 1
fi
