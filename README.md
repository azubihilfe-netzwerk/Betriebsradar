# Betriebsradar



## How to start the backend locally?

Install:

```
cd backend
npm install
```

Start the database container.

```
docker compose up -d
```

run backend in dev mode:
```
npm run dev
```

Create sample data (The script is idempotent, you can run it at any time to create some data. 
```
npm run seed_data
```

Access the keystone admin UI under [http://localhost:3010](http://localhost:3010), login as admin@example.com (PW: `test1234`). The user is created by the `seed_data` script.

### Graphql Server

You can use the graph ql playground to explore the backend Api: [http://localhost:3010/api/graphql](http://localhost:3010/api/graphql)


## Scheam Migrations

1. Start backend with database locally (you may need to reset the db with `npx prisma migrate reset`)
2. Make changes to `schema.ts`
3. Generate a new `schema.prisma`: `npx keystone build --no-ui`
4. Create migration script: `npx prisma migrate dev --name added_some_field`
5. Commit migration script

On the server:

Run: `npx prisma migrate deploy`

## Configuration

Config variables and secrets live in a `.env` in the backend.
The actual config file lives elsewhere on the server and the `.env` is a link. 