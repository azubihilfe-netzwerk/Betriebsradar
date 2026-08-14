import { defineConfig } from 'prisma/config'
import { dbUrl} from './keystone'

export default defineConfig({
  schema: 'schema.prisma',
  migrations: {
    path: 'migrations',
  },
  datasource: {
    url: dbUrl,
  },
})
