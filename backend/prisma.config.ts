import { defineConfig } from 'prisma/config'
const dbUrl = process.env.DATABASE_URL ?? 'file:./keystone.db';

export default defineConfig({
  schema: 'schema.prisma',
  migrations: {
    path: 'migrations',
  },
  datasource: {
    url: dbUrl,
  },
})
