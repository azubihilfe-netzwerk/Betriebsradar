import { execFileSync } from 'child_process';
import path from 'path';
import { print } from 'graphql';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { getContext } from '@keystone-6/core/context';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import * as PrismaModule from '../generated/prisma/client';
import baseConfig from '../keystone';
import { resetDatabase } from '@keystone-6/core/testing/sqlite'

let nextId = 0;
/** Returns a short, per-process-unique suffix so parallel test data doesn't collide. */
function uniqueSuffix(): string {
  return `${Date.now()}-${nextId++}`;
}

const dbName = `test-${process.env.VITEST_WORKER_ID ?? 1}.db`;
const dbUrl = `file:./${dbName}`;
const backendDir = path.join(__dirname, '..');
// Override the db URL so tests use an isolated database per Jest worker
const config = {
  ...baseConfig,
  db: {
    ...baseConfig.db,
    prismaClientOptions: () => ({ adapter: new PrismaBetterSqlite3({ url: dbUrl }) }),
  },
};

export const context = getContext(config, PrismaModule);

/** Wipes the test database, leaving it empty. */
export async function resetDb(): Promise<void> {
  await resetDatabase({"filename" : dbName}, "migrations");
 
}

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
      size: '_10to30',
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
