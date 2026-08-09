import { config } from '@keystone-6/core'
import { mergeSchemas } from '@graphql-tools/schema'
import type { KeystoneContext } from '@keystone-6/core/types'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { lists } from './schema'
import { withAuth, session } from './auth'
import 'dotenv/config';

const dbUrl = process.env.DATABASE_URL ?? 'file:./keystone.db';

export default withAuth(
  config({
    db: {
      provider: 'sqlite',
      prismaClientOptions: () => ({
        adapter: new PrismaBetterSqlite3({ url: dbUrl }),
      }),
      idField: { kind: 'autoincrement' },
    },
    lists,
    session,
    server: {
      port: Number(process.env.PORT) || 3010,
      cors: {
        origin: ['https://azubihilfe-netzwerk.github.io', 'http://localhost:3000', 'https://betriebsradar.org'],
        credentials: true,
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
      },
    },
    graphql: {
      extendGraphqlSchema: (schema) =>
        mergeSchemas({
          schemas: [schema],
          typeDefs: `
            type Mutation {
              verifyReviewEmail(accessKey: String!): Boolean
            }
          `,
          resolvers: {
            Mutation: {
              verifyReviewEmail: async (
                _root: unknown,
                { accessKey }: { accessKey: string },
                context: KeystoneContext
              ) => {
                const review = await context.sudo().query.Review.findOne({
                  where: { accessKey },
                  query: 'id',
                });
                if (!review) return false;
                await context.sudo().query.Review.updateOne({
                  where: { id: review.id },
                  data: { emailVerified: true },
                  query: 'id',
                });
                return true;
              },
            },
          },
        })
    },
  },
  )
)
