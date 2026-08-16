#!/usr/bin/env bash
set -e

## Deployment script for test/live environments
## Usage: ./deploy.sh <test|live>

ENV="$1"

case "$ENV" in
  test)
    SERVER=ahn@ahn.uber.space
    PATH_ON_SERVER=/home/ahn/www/test.betriebsradar.org/
    BACKEND_URL=https://backend-test.betriebsradar.org/api/graphql
    ;;
  live)
    SERVER=ahn@ahn.uber.space
    PATH_ON_SERVER=/home/ahn/www/betriebsradar.org/
    BACKEND_URL=https://backend.betriebsradar.org/api/graphql
    ;;
  *)
    echo "Usage: $0 <test|live>"
    exit 1
    ;;
esac

echo "🚀 Starting frontend deployment for $ENV environment to $SERVER:$PATH_ON_SERVER..."

echo "Building React app..."
REACT_APP_BACKEND_URL=$BACKEND_URL npm run build > /dev/null 2>&1 && echo "✓ React build complete"

# copy files to server
rsync -avrz ./build/ $SERVER:$PATH_ON_SERVER && echo "✓ Files synced"
