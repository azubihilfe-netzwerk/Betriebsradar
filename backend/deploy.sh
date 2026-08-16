#!/usr/bin/env bash
set -e

## Deployment script for test/live environments
## By default this wipes the target database and replaces it with the seed data, so use with caution!
## Usage: ./deploy.sh <test|live> [options]
## Options:
##   --skip-build   skip the local "npm run build" step and sync the existing .keystone build output
##   --reset        drop data, rebuild schema, insert new sample data (dev only)

ENV="$1"
shift || true

case "$ENV" in
  test)
    SERVER=ahn@ahn.uber.space
    PATH_ON_SERVER=/home/ahn/Betriebsradar/test
    SERVICE_NAME=betriebsradar-backend-test
    ;;
  live)
    SERVER=ahn@ahn.uber.space
    PATH_ON_SERVER=/home/ahn/Betriebsradar/live
    SERVICE_NAME=betriebsradar-backend
    ;;
  *)
    echo "Usage: $0 <test|live> [--skip-build] [--reset]"
    exit 1
    ;;
esac

SKIP_BUILD=false
RESET=false
for arg in "$@"; do
  case "$arg" in
    --skip-build) SKIP_BUILD=true ;;
    --reset) RESET=true ;;
    *) echo "Unknown option: $arg" && exit 1 ;;
  esac
done

if [ "$RESET" = true ] && [ "$ENV" != "test" ]; then
  echo "❌ --reset is only allowed for test deployments"
  exit 1
fi

# files and directories needed to run the KeystoneJS server on the remote host
FILES_TO_SYNC=(
  .keystone
  keystone.ts
  auth.ts
  schema.ts
  mailer.ts
  geocoder.ts
  codegen.ts
  schema.prisma
  schema.graphql
  prisma.config.ts
  migrations
  package.json
  package-lock.json
  tsconfig.json
)

# sample/seed data must never end up on the live server
if [ "$ENV" = "dev" ]; then
  FILES_TO_SYNC+=(seed/seed_data.ts seed/sample_companies.json)
fi

echo "🚀 Starting deployment for $ENV environment to $SERVER:$PATH_ON_SERVER..."

if [ "$SKIP_BUILD" = true ]; then
  echo "⏭  Skipping KeystoneJS build"
else
  npx keystone build
fi

# copy files to server
rsync -avrz --relative --exclude 'tests/gql' "${FILES_TO_SYNC[@]}" $SERVER:$PATH_ON_SERVER > /dev/null 2>&1 && echo "✓ Files synced"

PRISMA_CMD="npx prisma migrate deploy"
if [ "$RESET" = true ]; then
  PRISMA_CMD="npx prisma migrate reset --force  && npm run seed_data && echo ✓ Database seeded"
fi

# install dependencies and build on server
ssh -q $SERVER <<EOF
  set -e
  cd $PATH_ON_SERVER
  npm install > /dev/null 2>&1 && echo "✓ Dependencies installed"
  systemctl --user stop ${SERVICE_NAME} && echo "✓ Service stopped"
  $PRISMA_CMD
  systemctl --user start ${SERVICE_NAME} && echo "✓ Service started"
  echo ""
  echo "✨ Deployment complete!"
EOF
