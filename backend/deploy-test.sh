SERVER=ahn@ahn.uber.space
PATH_ON_SERVER=/home/ahn/Betriebsradar/test
SERVICE_NAME=betriebsradar-backend-test

## Deployment script for test environment
## This wipes the test database and replaces it with the seed data, so use with caution!


echo "🚀 Starting deployment for test environment to $SERVER..."
# copy files to server
rsync -avrz --exclude 'node_modules' --exclude '.git' --exclude 'dist' --exclude 'build' --exclude 'keystone.db' ./ $SERVER:$PATH_ON_SERVER > /dev/null 2>&1 && echo "✓ Files synced"

# install dependencies and build on server
ssh -q $SERVER <<EOF
  set -e
  cd $PATH_ON_SERVER
  npm install > /dev/null 2>&1 && echo "✓ Dependencies installed"
  systemctl --user stop ${SERVICE_NAME} && echo "✓ Service stopped"
  npx keystone prisma db push --force-reset > /dev/null 2>&1 && echo "✓ Database reset"
  npm run seed_data > /dev/null 2>&1 && echo "✓ Database seeded"
  systemctl --user start ${SERVICE_NAME} && echo "✓ Service started"
  echo ""
  echo "✨ Deployment complete!"
EOF


