SERVER=ahn@ahn.uber.space
PATH_ON_SERVER=/home/ahn/www/html/

## Deployment script for test environment
## This wipes the test database and replaces it with the seed data, so use with caution!


echo "🚀 Starting frontend deployment for environment to $SERVER:$PATH_ON_SERVER..."

echo "Building React app..."
npm run build > /dev/null 2>&1 && echo "✓ React build complete"

# copy files to server
rsync -avrz ./build/ $SERVER:$PATH_ON_SERVER  && echo "✓ Files synced"


