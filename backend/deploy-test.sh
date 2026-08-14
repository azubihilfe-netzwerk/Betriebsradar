#!/usr/bin/env bash
set -e

SERVER=ahn@ahn.uber.space
PATH_ON_SERVER=/home/ahn/Betriebsradar/test
SERVICE_NAME=betriebsradar-backend-test

## Deployment script for test environment
## By default this wipes the test database and replaces it with the seed data, so use with caution!
## Options:
##   --skip-build   skip the local "npm run build" step and sync the existing .keystone build output
##   --skip-reset   skip "npx prisma migrate reset" on the server (keeps existing data)

SKIP_BUILD=false
SKIP_RESET=false
for arg in "$@"; do
  case "$arg" in
    --skip-build) SKIP_BUILD=true ;;
    --skip-reset) SKIP_RESET=true ;;
    *) echo "Unknown option: $arg" && exit 1 ;;
  esac
done

# files and directories needed to run the KeystoneJS server on the remote host
FILES_TO_SYNC=(
  .keystone
  keystone.ts
  auth.ts
  schema.ts
  mailer.ts
  geocoder.ts
  codegen.ts
  seed_data.ts
  sample_companies.json
  schema.prisma
  schema.graphql
  prisma.config.ts
  migrations
  package.json
  package-lock.json
  tsconfig.json
  tests
)

echo "🚀 Starting deployment for test environment to $SERVER:$PATH_ON_SERVER..."

if [ "$SKIP_BUILD" = true ]; then
  echo "⏭  Skipping KeystoneJS build"
else
  npm run build 
fi

# copy files to server
rsync -avrz --relative --exclude 'tests/gql' "${FILES_TO_SYNC[@]}" $SERVER:$PATH_ON_SERVER > /dev/null 2>&1 && echo "✓ Files synced"

RESET_CMD="npx prisma migrate reset --force"
if [ "$SKIP_RESET" = true ]; then
  RESET_CMD="true"
fi

# install dependencies and build on server
ssh -q $SERVER <<EOF
  set -e
  cd $PATH_ON_SERVER
  npm install > /dev/null 2>&1 && echo "✓ Dependencies installed"
  systemctl --user stop ${SERVICE_NAME} && echo "✓ Service stopped"
  $RESET_CMD
  npm run codegen && echo "Codegen completed"
  npm run seed_data && echo "✓ Database seeded"
  systemctl --user start ${SERVICE_NAME} && echo "✓ Service started"
  echo ""
  echo "✨ Deployment complete!"
EOF
