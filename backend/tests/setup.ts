import path from 'path';
import { randomUUID } from 'crypto';
import { print } from 'graphql';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { getContext } from '@keystone-6/core/context';
import { PrismaPg } from '@prisma/adapter-pg';
import { Client, escapeIdentifier } from 'pg';
import * as PrismaModule from '../generated/prisma/client';
import baseConfig from '../keystone';
import { resetDatabase } from '@keystone-6/core/testing/postgresql'

let nextId = 0;
/** Returns a short, per-process-unique suffix so parallel test data doesn't collide. */
function uniqueSuffix(): string {
  return `${Date.now()}-${nextId++}`;
}

// Vitest can interleave multiple test files within the same worker, so a schema keyed only
// on the worker id isn't enough isolation — key it per module instance instead.
const schema = `test_${process.env.VITEST_WORKER_ID ?? 1}_${randomUUID().replace(/-/g, '')}`;
const migrationsDir = path.join(__dirname, '..', 'migrations');
// Override the db URL so tests use an isolated schema per Vitest worker
const config = {
  ...baseConfig,
  db: {
    ...baseConfig.db,
    prismaClientOptions: () => ({
      adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }, { schema }),
    }),
  },
};

export const context = getContext(config, PrismaModule);

/** Wipes the test database, leaving it empty. */
export async function resetDb(): Promise<void> {
  await resetDatabase({ connectionString: process.env.DATABASE_URL, schema }, migrationsDir);
}

// Each test file gets its own schema (see above); drop it once the file's tests are done so
// schemas don't accumulate on the shared local Postgres instance.
afterAll(async () => {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try {
    await client.query(`DROP SCHEMA IF EXISTS ${escapeIdentifier(schema)} CASCADE`);
  } finally {
    await client.end();
  }
});

/** Wipes the test database and re-runs the seed script against it. */
export async function resetAndSeed(): Promise<void> {
  return await resetDb();
}

type Overrides<T> = Partial<T> & Record<string, unknown>;

/** Inserts a single User row, bypassing access control. Returns the created id/email/roles. */
export async function createUser(overrides: Overrides<{ name: string; email: string; password: string; roles: string[] }> = {}) {
  return context.sudo().query.User.createOne({
    data: {
      name: 'Test User',
      email: `user-${uniqueSuffix()}@example.com`,
      password: 'test1234',
      roles: [],
      ...overrides,
    },
    query: 'id name email roles',
  });
}

/** Inserts a single Company row, bypassing access control. Returns the created id/name/verified. */
export async function createCompany(overrides: Overrides<{ name: string; trade: string; address: string; contact: string; size: string; verified: boolean }> = {}) {
  return context.sudo().query.Company.createOne({
    data: {
      name: `Test Company ${uniqueSuffix()}`,
      trade: 'Elektronik',
      address: 'Dürkheimer Str. 27, 76185 Karlsruhe',
      size: 's10to30',
      verified: true,
      ...overrides,
    },
    query: 'id name verified latitude longitude',
  });
}

/** Inserts a single Review row for the given company, bypassing access control. */
export async function createReview(overrides: Overrides<{ companyId: string; name: string; email: string; yearOfHiring: string; position: string; status: string }>) {
  const { companyId, ...rest } = overrides;
  if (!companyId) throw new Error('createReview requires a companyId');
  return context.sudo().query.Review.createOne({
    data: {
      name: 'Test Review',
      email: `review-${uniqueSuffix()}@example.com`,
      company: { connect: { id: companyId } },
      yearOfHiring: '2024',
      position: 'intern',
      ...rest,
    },
    query: 'id status email name emailVerified accessKey',
  });
}

/**
 * Executes a typed GraphQL document against any Keystone context.
 *
 * Pass `context` for an unauthenticated request, or
 * `context.withSession({...})` for an authenticated one.
 */
export async function execute<TData, TVariables>(
  ctx: { graphql: { raw: (args: { query: string; variables?: Record<string, unknown> }) => Promise<unknown> } },
  doc: TypedDocumentNode<TData, TVariables>,
  variables?: TVariables
): Promise<{ data: TData | null; errors?: readonly { message: string; path?: readonly (string | number)[] }[] }> {
  return ctx.graphql.raw({
    query: print(doc),
    variables: variables as Record<string, unknown> | undefined,
  }) as Promise<{ data: TData | null; errors?: readonly { message: string; path?: readonly (string | number)[] }[] }>;
}

/** Returns a context authenticated as the given user. Looks the user up by email. */
export async function contextAs(email: string) {
  const user = await context.sudo().query.User.findOne({
    where: { email },
    query: 'id name createdAt roles',
  });
  if (!user) throw new Error(`No seeded user with email ${email}`);
  return context.withSession({
    itemId: String(user.id),
    data: { id: String(user.id), name: user.name, createdAt: user.createdAt, roles: user.roles },
  });
}
