import path from 'path';
import { print } from 'graphql';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { getContext } from '@keystone-6/core/context';
import { resetDatabase } from '@keystone-6/core/testing';
import * as PrismaModule from '.prisma/client';
import baseConfig from '../keystone';
import { createSampleData as seed, SampleData } from '../seed_data';

const dbUrl = `file:./test-${process.env.JEST_WORKER_ID ?? 1}.db`;
const prismaSchemaPath = path.join(__dirname, '..', 'schema.prisma');
// Override the db URL so tests use an isolated database per Jest worker
const config = { ...baseConfig, db: { ...baseConfig.db, url: dbUrl } };

export const context = getContext(config, PrismaModule);

/** Wipes the test database and re-runs the seed script against it. */
export async function resetAndSeed(): Promise<SampleData> {
  await resetDatabase(dbUrl, prismaSchemaPath);
  // seed() accepts a context so it writes to the same test database
  return (await seed(context.sudo()));
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
